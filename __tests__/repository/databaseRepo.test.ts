import DatabaseRepo from '../../src/repository/databaseRepo'; // Import your DatabaseRepo class
import { ISQLDataSource } from '../../src/driver';
import { GameDAO } from '../../src/models';
import fn = jest.fn;

// Create a mock for EntityManager
const entityManagerMock = {
    save: jest.fn(),
};

// Create a mock for DataSource
const dataSourceMock = {
    manager: entityManagerMock,
    initialize: jest.fn().mockResolvedValue(true),
    destroy: jest.fn().mockResolvedValue(true),
    getRepository: jest.fn(),
    createQueryBuilder: jest.fn(),
};

// Mock the ISQLDataSource implementation
const mockSQLDataSource: ISQLDataSource = {
    getDBImpl: jest.fn(() => dataSourceMock),
    shutdown: jest.fn(),
};

describe('DatabaseRepo', () => {
    let databaseRepo: DatabaseRepo;

    beforeEach(() => {
        // Initialize DatabaseRepo with the mock SQL data source
        databaseRepo = new DatabaseRepo(mockSQLDataSource);
    });

    it('should save an entity', async () => {
        const entity = new GameDAO(); // Replace with your entity instance
        const saveSpy = jest.spyOn(
            databaseRepo.sqlDatabaseImpl.getDBImpl().manager,
            'save'
        );
        await databaseRepo.saveEntity(entity);
        expect(saveSpy).toHaveBeenCalledWith(entity);
        saveSpy.mockRestore();
    });

    it('should get game data', async () => {
        // Mock the behavior of the getRepository method
        const findOneMock = fn().mockReturnValue({ findOne: fn() });
        databaseRepo.sqlDatabaseImpl.getDBImpl().getRepository = findOneMock;

        const gameId = 'gameId'; // Replace with a valid game ID
        await databaseRepo.getGameData(gameId);
        expect(findOneMock).toHaveBeenCalledWith(GameDAO);
    });

    it('should get top scorers data', async () => {
        const gameId = 'gameId'; // Replace with a valid game ID
        const limit = 10; // Replace with a valid limit

        // Mock the behavior of the getRawMany method and topScorersSchemaValidate
        const getRawManyMock = jest.fn();
        const wrapInPromiseMock = jest.fn();
        wrapInPromiseMock.mockReturnValue([]);
        const topScorersData = [{ userId: '1', userName: 'User', score: 100 }];

        databaseRepo.sqlDatabaseImpl.getDBImpl().getRepository = jest.fn(
            (_) => ({
                createQueryBuilder: jest.fn((_) => ({
                    select: jest.fn((_) => ({
                        innerJoin: jest.fn((_arg1, _arg2, _arg3) => ({
                            where: jest.fn((_) => ({
                                orderBy: jest.fn((_) => ({
                                    addOrderBy: jest.fn((_arg1, _arg2) => ({
                                        limit: jest.fn((_) => ({
                                            getRawMany: getRawManyMock,
                                        })),
                                    })),
                                })),
                            })),
                        })),
                    })),
                })),
            })
        );

        getRawManyMock.mockReturnValue(topScorersData);

        await databaseRepo.getTopScorersData(gameId, limit);
        expect(getRawManyMock).toHaveBeenCalled();
    });

    it('should shut down the database', async () => {
        const shutdownSpy = jest.spyOn(
            databaseRepo.sqlDatabaseImpl,
            'shutdown'
        );
        await databaseRepo.shutdown();
        expect(shutdownSpy).toHaveBeenCalled();
        shutdownSpy.mockRestore();
    });
});
