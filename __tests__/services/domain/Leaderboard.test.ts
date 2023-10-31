import Leaderboard from '../../../src/services/domain/Leaderboard';
import { IDatabaseRepo, IQueueRepo } from '../../../src/repository';
import ICacheRepo from '../../../src/repository/interfaces/ICacheRepo';
import {
    GameDAO,
    LeaderboardDAO,
    MessageDTO,
    TopScorerDTO,
    TopScoresDTO,
    UserDAO,
} from '../../../src/models';

const dateNowStub = jest.fn(() => 1530518207007);
global.Date.now = dateNowStub;

describe('Leaderboard', () => {
    let leaderboard: Leaderboard;
    let queueImpl: jest.Mocked<IQueueRepo>;
    let databaseImpl: jest.Mocked<IDatabaseRepo>;
    let cacheImpl: jest.Mocked<ICacheRepo>;

    const topScores: TopScoresDTO = new TopScoresDTO(
        'gameId',
        'gameName',
        [new TopScorerDTO('userId', 'userName', 100)],
        Date.now()
    );

    beforeEach(() => {
        queueImpl = {
            startBatchConsumer: jest.fn(() => ({
                then: jest.fn(),
            })),
            shutdown: jest.fn(),
        } as any;
        databaseImpl = {
            saveEntity: jest.fn(),
            saveOrUpdateEntity: jest.fn(),
            getGameData: jest.fn(),
            getTopScorersData: jest.fn(),
            shutdown: jest.fn(),
        } as any;
        cacheImpl = {
            get: jest.fn(),
            setAsync: jest.fn(),
        } as any;
        leaderboard = new Leaderboard(queueImpl, databaseImpl, cacheImpl);
    });

    it('should process messages', async () => {
        const message: MessageDTO = new MessageDTO(
            'gameId',
            'gameName',
            'userId',
            'userName',
            100,
            Date.now().toString()
        );
        await leaderboard['processMessages'](message);

        expect(databaseImpl.saveEntity).toHaveBeenCalledWith(
            expect.any(GameDAO)
        );
        expect(databaseImpl.saveEntity).toHaveBeenCalledWith(
            expect.any(UserDAO)
        );
        expect(databaseImpl.saveOrUpdateEntity).toHaveBeenCalledWith(
            expect.any(LeaderboardDAO),
            LeaderboardDAO,
            ['score', 'updated_at'],
            ['game_id', 'user_id']
        );
    });

    it('should get top scores from DB when consistentRead=true', async () => {
        const game: GameDAO = new GameDAO();
        game.id = 'gameId';
        game.name = 'gameName';
        databaseImpl.getGameData.mockResolvedValue(game);
        databaseImpl.getTopScorersData.mockResolvedValue([
            new TopScorerDTO('userId', 'userName', 100),
        ]);

        const result = await leaderboard.getTopScores('gameId', 10, true);

        expect(databaseImpl.getGameData).toHaveBeenCalledWith('gameId');
        expect(databaseImpl.getTopScorersData).toHaveBeenCalledWith(
            'gameId',
            10
        );
        expect(cacheImpl.setAsync).toHaveBeenCalledWith(
            'gameId---10',
            expect.any(TopScoresDTO)
        );
        expect(result).toEqual(topScores);
    });

    it('should get top scores from DB when consistentRead=false and cache value not set', async () => {
        const game: GameDAO = new GameDAO();
        game.id = 'gameId';
        game.name = 'gameName';
        databaseImpl.getGameData.mockResolvedValue(game);
        databaseImpl.getTopScorersData.mockResolvedValue([
            new TopScorerDTO('userId', 'userName', 100),
        ]);
        cacheImpl.get.mockResolvedValue(null);

        const result = await leaderboard.getTopScores('gameId', 10, false);

        expect(cacheImpl.get).toHaveBeenCalledWith('gameId---10');
        expect(databaseImpl.getGameData).toHaveBeenCalledWith('gameId');
        expect(databaseImpl.getTopScorersData).toHaveBeenCalledWith(
            'gameId',
            10
        );
        expect(cacheImpl.setAsync).toHaveBeenCalledWith(
            'gameId---10',
            expect.any(TopScoresDTO)
        );
        expect(result).toEqual(topScores);
    });

    it('should get top scores from cache when consistentRead=false and cache value is set', async () => {
        const game: GameDAO = new GameDAO();
        game.id = 'gameId';
        game.name = 'gameName';
        cacheImpl.get.mockResolvedValue(topScores);

        const result = await leaderboard.getTopScores('gameId', 10, false);

        expect(cacheImpl.get).toHaveBeenCalledWith('gameId---10');
        expect(databaseImpl.getGameData).not.toHaveBeenCalled();
        expect(databaseImpl.getTopScorersData).not.toHaveBeenCalled();
        expect(cacheImpl.setAsync).not.toHaveBeenCalled();
        expect(result).toEqual(topScores);
    });

    it('should shut down', async () => {
        await leaderboard.shutdown();

        expect(queueImpl.shutdown).toHaveBeenCalled();
        expect(databaseImpl.shutdown).toHaveBeenCalled();
    });
});
