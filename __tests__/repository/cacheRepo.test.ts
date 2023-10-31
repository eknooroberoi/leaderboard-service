import CacheRepo from '../../src/repository/cacheRepo';
import { ICache } from '../../src/driver';
import {
    TopScoresDAO,
    TopScorerDAO,
    TopScoresDTO,
    TopScorerDTO,
} from '../../src/models';

describe('CacheRepo', () => {
    let cacheImplMock: jest.Mocked<ICache>;
    let cacheRepo: CacheRepo;

    beforeEach(() => {
        cacheImplMock = {
            get: jest.fn(),
            setAsync: jest.fn(),
        } as jest.Mocked<ICache>;

        cacheRepo = new CacheRepo(cacheImplMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should return null if the value is undefined or null', async () => {
            cacheImplMock.get.mockResolvedValueOnce(null);
            cacheImplMock.get.mockResolvedValueOnce(null);

            const result1: TopScoresDAO | null = await cacheRepo.get('key1');
            const result2: TopScoresDAO | null = await cacheRepo.get('key2');

            expect(result1).toBeNull();
            expect(result2).toBeNull();
        });

        it('should return null if the parsed value does not match the schema', async () => {
            const invalidParsedVal = {
                gameId: 'game1',
                gameName: 'Game 1',
                topScorers: [{ name: 'Player 1', score: 100, id: 'id1' }],
                lastUpdatedAt: 'invalid-date',
            };
            cacheImplMock.get.mockResolvedValueOnce(
                JSON.stringify(invalidParsedVal)
            );

            const result = await cacheRepo.get('key');

            expect(result).toBeNull();
        });

        it('should return a TopScoresDAO object if the parsed value matches the schema', async () => {
            const validParsedVal = {
                gameId: 'game1',
                gameName: 'Game 1',
                topScorers: [
                    { userName: 'Player 1', score: 100, userId: 'id1' },
                ],
                lastUpdatedAt: 1631234567,
            };
            const expectedTopScores = new TopScoresDTO(
                validParsedVal.gameId,
                validParsedVal.gameName,
                validParsedVal.topScorers.map(
                    (ts) => new TopScorerDTO(ts.userId, ts.userName, ts.score)
                ),
                validParsedVal.lastUpdatedAt
            );
            cacheImplMock.get.mockResolvedValueOnce(
                JSON.stringify(validParsedVal)
            );

            const result: TopScoresDAO | null = await cacheRepo.get('key');
            // TODO:- Figure out issues with TopScorerDTO serialization
            expect(result?.gameId).toEqual(expectedTopScores?.gameId);
            expect(result?.gameName).toEqual(expectedTopScores?.gameName);
            expect(result?.lastUpdatedAt).toEqual(
                expectedTopScores?.lastUpdatedAt
            );
        });
    });

    describe('setAsync', () => {
        it('should store the serialized value in the cache', async () => {
            const topScoresDTO = new TopScoresDAO(
                'game1',
                'Game 1',
                [new TopScorerDAO('Id1', 'Player 1', 100)],
                1631234567
            );
            const expectedSerializedVal = JSON.stringify(topScoresDTO.toJSON());

            await cacheRepo.setAsync('key', topScoresDTO);

            expect(cacheImplMock.setAsync).toHaveBeenCalledWith(
                'key',
                expectedSerializedVal,
                undefined
            );
        });
    });
});
