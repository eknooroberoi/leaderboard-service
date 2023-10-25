import {DataSource} from "typeorm";
import {ConfigDTO, GameDAO, LeaderboardDAO, UserDAO} from "../models";
import assert from "assert";
import IDatabaseRepo from "../repository/interfaces/IDatabaseRepo";

export default class MySQLDataSource implements IDatabaseRepo{
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
}