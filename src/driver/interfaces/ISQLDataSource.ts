import {DataSource} from "typeorm";

export default interface ISQLDataSource{
    getDBImpl(): DataSource;
    shutdown(): Promise<void>;
}