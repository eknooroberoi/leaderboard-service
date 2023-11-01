import { DataSource } from 'typeorm';
import MySQLDataSource from '../../../src/driver/mysql/mysql';
import IndexGameScoreUpdatedAt from '../../../src/driver/mysql/1698269779298-IndexCreation';
import MySQLConfigDTO from '../../../src/models/DTO/mySQLConfigDTO';
import ConfigDTO from '../../../src/models/DTO/configDTO';

jest.mock('typeorm', () => ({
    DataSource: jest.fn(() => {
        return {
            initialize: jest.fn().mockResolvedValue(true),
            shutdown: jest.fn().mockResolvedValue(true),
            destroy: jest.fn().mockResolvedValue(true),
        };
    }),
}));

jest.mock('../../../src/models', () => ({
    GameDAO: jest.fn(),
    UserDAO: jest.fn(),
    LeaderboardDAO: jest.fn(),
}));

jest.mock('../../../src/utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

describe('MySQLDataSource', () => {
    const mockedMySQLConfig: MySQLConfigDTO = new MySQLConfigDTO(
        'localhost',
        3306,
        'root',
        'password',
        'test'
    );

    const mockedConfig: ConfigDTO = new ConfigDTO();
    mockedConfig.mySQLConfig = mockedMySQLConfig;

    let mySQLDataSource: MySQLDataSource;
    let dataSourceMock: any;

    beforeEach((): void => {
        dataSourceMock = new DataSource({
            type: 'mysql',
            host: mockedConfig.mySQLConfig?.host,
            port: mockedConfig.mySQLConfig?.port,
            username: mockedConfig.mySQLConfig?.userName,
            password: mockedConfig.mySQLConfig?.password,
            database: mockedConfig.mySQLConfig?.database,
            migrations: [IndexGameScoreUpdatedAt],
            migrationsRun: true,
            synchronize: true,
        });
        (DataSource as jest.Mock).mockImplementation(() => dataSourceMock);
    });

    afterEach((): void => {
        jest.clearAllMocks();
    });

    describe('constructor', (): void => {
        it('should create a new DataSource instance with the provided configuration', () => {
            mySQLDataSource = new MySQLDataSource(mockedConfig);
            expect(DataSource).toHaveBeenCalledWith({
                type: 'mysql',
                host: mockedConfig.mySQLConfig?.host,
                port: mockedConfig.mySQLConfig?.port,
                username: mockedConfig.mySQLConfig?.userName,
                password: mockedConfig.mySQLConfig?.password,
                database: mockedConfig.mySQLConfig?.database,
                migrations: [IndexGameScoreUpdatedAt],
                migrationsRun: true,
                synchronize: true,
            });
            expect(mySQLDataSource.getDBImpl()).toBe(dataSourceMock);
        });
    });

    describe('shutdown', () => {
        it('should destroy the DataSource instance', async () => {
            mySQLDataSource = new MySQLDataSource(mockedConfig);
            const destroySpy = jest
                .spyOn(dataSourceMock, 'destroy')
                .mockResolvedValueOnce(null);
            await mySQLDataSource.shutdown();

            expect(destroySpy).toHaveBeenCalled();
        });
    });
});
