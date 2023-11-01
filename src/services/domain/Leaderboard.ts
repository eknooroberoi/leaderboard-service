import {
    GameDAO,
    LeaderboardDAO,
    MessageDTO,
    TopScorerDAO,
    TopScoresDTO,
    UserDAO,
} from '../../models';
import { IQueueRepo } from '../../repository';
import { ILeaderboard } from './interfaces/ILeaderboard';
import IDatabaseRepo from '../../repository/interfaces/IDatabaseRepo';
import ICacheRepo from '../../repository/interfaces/ICacheRepo';
import TopScoresDAO from '../../models/DAO/topScoresDAO';
import { wrapInPromise } from '../../utils/helpers';
import logger from '../../utils/logger';

class Leaderboard implements ILeaderboard {
    private queueImpl: IQueueRepo;
    private databaseImpl: IDatabaseRepo;
    private cacheImpl: ICacheRepo;

    constructor(
        queueImpl: IQueueRepo,
        databaseImpl: IDatabaseRepo,
        cacheImpl: ICacheRepo
    ) {
        this.queueImpl = queueImpl;
        this.queueImpl
            .startBatchConsumer(this.processMessages)
            .then(() => logger.info('Successfully Started Kafka Consumer'));
        this.databaseImpl = databaseImpl;
        this.cacheImpl = cacheImpl;
    }

    private processMessages = async (msg: MessageDTO): Promise<void> => {
        const persistGame: GameDAO = new GameDAO();
        persistGame.id = msg.gameId;
        persistGame.name = msg.gameName;
        await this.databaseImpl.saveEntity(persistGame);
        const persistUser: UserDAO = new UserDAO();
        persistUser.id = msg.userId;
        persistUser.name = msg.userName;
        await this.databaseImpl.saveEntity(persistUser);
        const persistLeaderboard: LeaderboardDAO = new LeaderboardDAO();
        persistLeaderboard.gameId = msg.gameId;
        persistLeaderboard.userId = msg.userId;
        persistLeaderboard.score = msg.score;
        persistLeaderboard.updatedAt = msg.tsMs;
        // Insert entry if entry does not exist; else update
        await this.databaseImpl.saveOrUpdateEntity(
            persistLeaderboard,
            LeaderboardDAO,
            ['score', 'updated_at'],
            ['game_id', 'user_id']
        );
    };

    async getTopScores(
        gameId: string,
        limit: number,
        consistentRead: boolean
    ): Promise<TopScoresDTO | null> {
        logger.info(`Fetching Data for gameId: ${gameId}, limit: ${limit}`);
        const cacheKey: string = gameId + '---' + limit.toString();
        if (!consistentRead) {
            //Try getting date from cache
            const cachedVal: TopScoresDAO | null =
                await this.cacheImpl.get(cacheKey);
            if (cachedVal !== undefined && cachedVal !== null) {
                // If found return
                return cachedVal;
            }
        }
        // If data not found in cache or consistentRead set to true, get from DB
        // Get Game Data
        const gameData: GameDAO | null =
            await this.databaseImpl.getGameData(gameId);
        if (gameData === null) {
            logger.info(`Could not get data for game :- ${gameId}`);
            return wrapInPromise(null);
        }
        // Get Top Scorers for Game
        const topScorers: TopScorerDAO[] | null =
            await this.databaseImpl.getTopScorersData(gameId, limit);
        if (topScorers === null) {
            logger.info(`Could not get top ${limit} scorers for ${gameId}`);
            return wrapInPromise(null);
        }
        const res: TopScoresDTO = new TopScoresDTO(
            gameId,
            gameData.name,
            topScorers,
            Date.now()
        );
        // Set/Update value in cache in an async fashion
        this.cacheImpl.setAsync(cacheKey, res);
        // Populate Response
        return res;
    }

    async shutdown(): Promise<void> {
        await this.queueImpl.shutdown();
        await this.databaseImpl.shutdown();
    }
}

export default Leaderboard;
