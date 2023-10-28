import {asClass, asValue, AwilixContainer, createContainer, Lifetime, LifetimeType} from "awilix";
import {GetTopScoresControllerPublic, IController} from "../controllers";
import {ILeaderboardService, LeaderboardService, ILeaderboard, LeaderboardImpl} from "../services";
import {DatabaseRepo, IDatabaseRepo, IQueueRepo, QueueRepo} from "../repository";
import {ICache, IQueueConsumer, KafkaConsumer, Memcached} from "../driver";
import config from "../config/config";
import {ConfigDTO} from "../models";
import MySQLDataSource from "../driver/mysql/mysql";
import {ISQLDataSource} from "../driver";
import ICacheRepo from "../repository/interfaces/ICacheRepo";
import CacheRepo from "../repository/cacheRepo";
interface ICradle {
    //Utility
    config: ConfigDTO

    //Drivers
    sqlDriver: ISQLDataSource
    queueConsumerDriver: IQueueConsumer
    cacheDriver: ICache

    //Domain
    leaderboardImpl: ILeaderboard

    //Service(s)
    leaderboardService: ILeaderboardService

    //Controller(s)
    getTopScoresControllerPublic: IController

    // Repositories
    queueImpl: IQueueRepo
    databaseImpl: IDatabaseRepo
    cacheImpl: ICacheRepo
}

const container: AwilixContainer<ICradle> = createContainer<ICradle>({injectionMode: "CLASSIC"});

container.register({
    //Utility
    config: asValue(config),

    //Drivers
    sqlDriver: asClass(MySQLDataSource, getScope()),
    queueConsumerDriver: asClass(KafkaConsumer, getScope()),
    cacheDriver: asClass(Memcached, getScope()),


    //Domain
    leaderboardImpl: asClass(LeaderboardImpl, getScope()),

    //Service(s)
    leaderboardService: asClass(LeaderboardService, getScope()),

    //Controller(s)
    getTopScoresControllerPublic: asClass(GetTopScoresControllerPublic, getScope()),

    // Repositories
    queueImpl: asClass(QueueRepo, getScope()),
    databaseImpl: asClass(DatabaseRepo, getScope()),
    cacheImpl: asClass(CacheRepo, getScope())
});

function getScope(): {lifetime: LifetimeType} {
    return {lifetime: Lifetime.SINGLETON};
}

//Forcefully Start Leaderboard Impl to start consuming from Kafka
container.build(LeaderboardImpl);

export {container};

