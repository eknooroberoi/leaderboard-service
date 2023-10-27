import {DataSource} from "typeorm";

export default interface IDatabaseRepo{
    getDBImpl(): DataSource;
    shutdown(): Promise<void>;
}