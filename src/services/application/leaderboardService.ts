import {ILeaderboardService} from "./interfaces/ILeaderboardService";
import LeaderboardImpl from "../domain/Leaderboard";
import {TopScoresDTO} from "../../models";
import {ILeaderboard} from "../domain/interfaces/ILeaderboard";

class LeaderboardService implements ILeaderboardService{

    leaderboardImpl: ILeaderboard;

    constructor(leaderboardImpl: LeaderboardImpl) {
        this.leaderboardImpl = leaderboardImpl;
    }

    async getTopScores(gameId:string, limit:number): Promise<TopScoresDTO | null>{
        return this.leaderboardImpl.getTopScores(gameId, limit);
    }

    async shutdown(): Promise<void>{
        await this.leaderboardImpl.shutdown();
    }
}

export default LeaderboardService