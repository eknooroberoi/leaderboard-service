import {GameDAO, LeaderboardDAO, MessageDTO, TopScorersDTO, TopScoresDTO, UserDAO} from "../../models";
import {IQueueRepo} from "../../repository";
import {ILeaderboard} from "./interfaces/ILeaderboard";
import IDatabaseRepo from "../../repository/interfaces/IDatabaseRepo";
import {EntityManager} from "typeorm";

class Leaderboard implements ILeaderboard{
    private queueImpl: IQueueRepo;
    private databaseImpl: IDatabaseRepo

    constructor(queueImpl: IQueueRepo, databaseImpl: IDatabaseRepo) {
        this.queueImpl = queueImpl;
        this.queueImpl.startBatchConsumer(this.processMessages)
            .then(() => console.log("Successfully Started Kafka Consumer"));
        this.databaseImpl = databaseImpl;
    }
    private processMessages =  async (msg: MessageDTO): Promise<void> => {
        const dbManager: EntityManager = this.databaseImpl.getDBImpl().manager
        const persistGame: GameDAO = new GameDAO();
        persistGame.id = msg.gameId;
        persistGame.name = msg.gameName;
        await dbManager.save(persistGame);
        const persistUser: UserDAO = new UserDAO();
        persistUser.id = msg.userId;
        persistUser.name = msg.userName;
        await dbManager.save(persistUser);
        const persistLeaderboard: LeaderboardDAO = new LeaderboardDAO();
        persistLeaderboard.gameId = msg.gameId;
        persistLeaderboard.userId = msg.userId;
        persistLeaderboard.score = msg.score;
        persistLeaderboard.updatedAt = msg.tsMs;
        await dbManager.save(persistLeaderboard);
        console.log(persistLeaderboard);
    }

    async getTopScores(gameId:string, limit:number): Promise<TopScoresDTO>{
        console.log("gameId: %s, limit: %d", gameId, limit);
        return new TopScoresDTO(
            "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
            "car-racing",
            [
                new TopScorersDTO(
                    "14191",
                    "user14191",
                    100
                ),
                new TopScorersDTO(
                    "14613",
                    "user14613",
                    100
                ),
                new TopScorersDTO(
                    "49609",
                    "user49609",
                    80
                ),
                new TopScorersDTO(
                    "14847",
                    "user14847",
                    30
                ),
                new TopScorersDTO(
                    "13307",
                    "user13307",
                    10
                )
            ],
            1697986710000
        );
    }

    async shutdown(): Promise<void>{
        await this.queueImpl.shutdown();
    }
}

export default Leaderboard;