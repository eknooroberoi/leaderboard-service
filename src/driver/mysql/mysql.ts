import {DataSource} from "typeorm";
import {ConfigDTO, GameDAO, LeaderboardDAO, UserDAO} from "../../models";
import assert from "assert";
import IndexGameScoreUpdatedAt from "./1698269779298-IndexCreation";
import ISQLDataSource from "../interfaces/ISQLDataSource";

export default class MySQLDataSource implements ISQLDataSource{
    private readonly _ds: DataSource

    constructor(config: ConfigDTO) {
        assert(config.mySQLConfig !== undefined);
        const ds: DataSource = new DataSource({
            type: "mysql",
            host: config.mySQLConfig.host,
            port: config.mySQLConfig.port,
            username: config.mySQLConfig.userName,
            password: config.mySQLConfig.password,
            database: config.mySQLConfig.database,
            entities: [GameDAO, UserDAO, LeaderboardDAO],
            migrations: [IndexGameScoreUpdatedAt],
            migrationsRun: true,
            synchronize: true,
        });
        ds.initialize()
            .then(() => console.log("Data Source has been initialized!"))
            .catch((err) => console.error("Error during Data Source initialization", err));
        this._ds = ds;
    }

    getDBImpl(): DataSource{
        return this._ds;
    }

    async shutdown(): Promise<void> {
        await this._ds.destroy();
    }
}