import { ILeaderboardService } from './interfaces/ILeaderboardService';
import { TopScoresDTO } from '../../models';
import { ILeaderboard } from '../domain/interfaces/ILeaderboard';

class LeaderboardService implements ILeaderboardService {
    leaderboardImpl: ILeaderboard;

    constructor(leaderboardImpl: ILeaderboard) {
        this.leaderboardImpl = leaderboardImpl;
    }

    async getTopScores(
        gameId: string,
        limit: number,
        consistentRead: boolean
    ): Promise<TopScoresDTO | null> {
        return this.leaderboardImpl.getTopScores(gameId, limit, consistentRead);
    }

    async shutdown(): Promise<void> {
        await this.leaderboardImpl.shutdown();
    }
}

export default LeaderboardService;
