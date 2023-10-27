import {GameDAO, LeaderboardDAO, MessageDTO, TopScorerDAO, TopScoresDTO, UserDAO} from "../../models";
import {IQueueRepo} from "../../repository";
import {ILeaderboard} from "./interfaces/ILeaderboard";
import IDatabaseRepo from "../../repository/interfaces/IDatabaseRepo";

class Leaderboard implements ILeaderboard{
    private queueImpl: IQueueRepo;
    private databaseImpl: IDatabaseRepo;

    constructor(queueImpl: IQueueRepo, databaseImpl: IDatabaseRepo) {
        this.queueImpl = queueImpl;
        this.queueImpl.startBatchConsumer(this.processMessages)
            .then(() => console.log("Successfully Started Kafka Consumer"));
        this.databaseImpl = databaseImpl;
    }
    private processMessages =  async (msg: MessageDTO): Promise<void> => {
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
            ["score", "updated_at"],
            ["game_id", "user_id"]
        );
    }

    async getTopScores(gameId:string, limit:number): Promise<TopScoresDTO | null>{
        console.log(`Fetching Data for gameId: ${gameId}, limit: ${limit}`);
        // Get Game Data
        const gameData: GameDAO | null = await this.databaseImpl.getGameData(gameId);
        if (gameData === null){
            console.log(`Could not get data for game :- ${gameId}`);
            return null;
        }
        // Get Top Scorers for Game
        const topScorers: TopScorerDAO[] | null = await this.databaseImpl.getTopScorersData(gameId, limit);
        if (topScorers === null){
            console.log(`Could not get top ${limit} scorers for ${gameId}`);
            return null
        }
        // Populate Response
        return new TopScoresDTO(
            gameId,
            gameData.name,
            topScorers,
            Date.now(),
        )
    }

    async shutdown(): Promise<void>{
        await this.queueImpl.shutdown();
        await this.databaseImpl.shutdown();
    }
}

export default Leaderboard;