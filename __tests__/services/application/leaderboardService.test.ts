import { TopScorerDTO, TopScoresDTO } from '../../../src/models';
import { ILeaderboard, LeaderboardService } from '../../../src/services';

describe('LeaderboardService', () => {
    let leaderboardService: LeaderboardService;
    let leaderboardImpl: ILeaderboard;

    beforeEach(() => {
        leaderboardImpl = {
            getTopScores: jest.fn(),
            shutdown: jest.fn(),
        };
        leaderboardService = new LeaderboardService(leaderboardImpl);
    });

    it('should get top scores', async () => {
        const topScores = new TopScoresDTO(
            'game1',
            'Game 1',
            [
                new TopScorerDTO('Id1', 'Player 1', 100),
                new TopScorerDTO('Id2', 'Player 2', 95),
            ],
            1631234567
        );
        (leaderboardImpl.getTopScores as jest.Mock).mockResolvedValue(
            topScores
        );

        const result = await leaderboardService.getTopScores(
            'gameId',
            10,
            true
        );

        expect(leaderboardImpl.getTopScores).toHaveBeenCalledWith(
            'gameId',
            10,
            true
        );
        expect(result).toBe(topScores);
    });

    it('should shut down', async () => {
        (leaderboardImpl.shutdown as jest.Mock).mockResolvedValue(true);

        await leaderboardService.shutdown();

        expect(leaderboardImpl.shutdown).toHaveBeenCalled();
    });
});
