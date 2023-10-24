import {ILeaderboardService} from "./interfaces/ILeaderboardService";
import LeaderboardImpl from "../domain/Leaderboard";

class LeaderboardService implements ILeaderboardService{

    leaderboardImpl: LeaderboardImpl;

    constructor(leaderboardImpl: LeaderboardImpl) {
        this.leaderboardImpl = leaderboardImpl;
    }

    async getTopScores(gameId:string, limit:number): Promise<any>{
        return this.leaderboardImpl.getTopScores(gameId, limit);
    }

    async shutdown(): Promise<void>{
        await this.leaderboardImpl.shutdown();
    }
}

export default LeaderboardService