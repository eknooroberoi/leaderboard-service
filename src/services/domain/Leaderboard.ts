import {GameDAO, LeaderboardDAO, MessageDTO, TopScorerDTO, TopScoresDTO, UserDAO} from "../../models";
import {IQueueRepo} from "../../repository";
import {ILeaderboard} from "./interfaces/ILeaderboard";
import IDatabaseRepo from "../../repository/interfaces/IDatabaseRepo";
import {EntityManager} from "typeorm";
import Ajv, {JSONSchemaType, ValidateFunction} from "ajv";

// TODO :- Have single instance of ajv in the application
const ajv: Ajv = new Ajv()  // ajv is used for validating json object schema

class Leaderboard implements ILeaderboard{
    private queueImpl: IQueueRepo;
    private databaseImpl: IDatabaseRepo;

    static topScorersSchema: JSONSchemaType<TopScorerDTO[]> = {
        type: "array",
        items: {
            type: "object",
            properties: {
                userId: { type: "string"},
                userName: {type: "string"},
                score: { type: "integer" },
            },
            required: ['userId', 'userName', 'score'],
            additionalProperties: true
        },
    };
    static topScorersSchemaValidate: ValidateFunction<TopScorerDTO[]> = ajv.compile(Leaderboard.topScorersSchema);

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
        // Insert entry if entry does not exist; else update
        await this.databaseImpl.getDBImpl()
            .createQueryBuilder()
            .insert()
            .into(LeaderboardDAO)
            .values(persistLeaderboard)
            .orUpdate(
                ["score", "updatedAt"],
                ["gameId", "userId"],
            )
            .execute()
        console.log(persistLeaderboard);
    }

    async getTopScores(gameId:string, limit:number): Promise<TopScoresDTO | null>{
        console.log(`Fetching Data for gameId: ${gameId}, limit: ${limit}`);
        // Get Game Data
        const gameData: GameDAO | null = await this.databaseImpl.getDBImpl()
            .getRepository(GameDAO)
            .findOne({where : {
                    id: gameId
                }});
        if (gameData === null){
            console.log(`Could not get data for game :- ${gameId}`);
            return null;
        }
        // Get Top Scorers for Game
        // TODO:- Check if need to pass useIndex() to force index;
        const leaderboardTopScorersData = await this.databaseImpl.getDBImpl().manager
            .getRepository(LeaderboardDAO)
            .createQueryBuilder("leaderboard")
            .select(['leaderboard.score AS score', 'user.id AS userId', 'user.name AS userName'])
            .innerJoin(UserDAO, 'user', 'user.id = leaderboard.userId')
            .where('leaderboard.gameId = :gameId', { gameId })
            .orderBy('leaderboard.score', 'DESC')
            .addOrderBy('leaderboard.updatedAt', 'ASC')
            .limit(5)
            .getRawMany();
        if (!Leaderboard.topScorersSchemaValidate(leaderboardTopScorersData)){
            // TODO:- Implement custom errors and pass to top-level
            console.log("Could not validate scorers data, returning empty response")
            return null;
        }
        // Populate Response
        return new TopScoresDTO(
            gameId,
            gameData.name,
            leaderboardTopScorersData,
            Date.now(),
        )
    }

    async shutdown(): Promise<void>{
        await this.queueImpl.shutdown();
        await this.databaseImpl.shutdown();
    }
}

export default Leaderboard;