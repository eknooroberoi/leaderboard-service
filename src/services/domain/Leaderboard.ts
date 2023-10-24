import {TopScorersDTO, TopScoresDTO} from "../../models";
import {IQueueRepo} from "../../repository";
import {ILeaderboard} from "./interfaces/ILeaderboard";

class Leaderboard implements ILeaderboard{
    private queueImpl: IQueueRepo;
    constructor(queueImpl: IQueueRepo) {
        this.queueImpl = queueImpl;
        this.queueImpl.startBatchConsumer(async (msg: Buffer | null): Promise<void> => {if (msg!==null){console.log(msg.toString())}})
            .then(() => console.log("Successfully Started Kafka Consumer"))
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