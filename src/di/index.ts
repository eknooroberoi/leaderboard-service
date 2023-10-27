import {asClass, asValue, AwilixContainer, createContainer, Lifetime, LifetimeType} from "awilix";
import {GetTopScoresControllerPublic, IController} from "../controllers";
import {ILeaderboardService, LeaderboardService, ILeaderboard, LeaderboardImpl} from "../services";
import {DatabaseRepo, IDatabaseRepo, IQueueRepo} from "../repository";
import {KafkaConsumer} from "../driver/kafka";
import config from "../config/config";
import {ConfigDTO, KafkaConsumerConfigDTO} from "../models";
import MySQLDataSource from "../driver/mysql/mysql";
import {ISQLDataSource} from "../driver";
interface ICradle {
    //Utility
    config: ConfigDTO
    kafkaConsumerConfig: KafkaConsumerConfigDTO

    //Drivers
    mySQLDriver: ISQLDataSource

    //Domain
    leaderboardImpl: ILeaderboard

    //Service(s)
    leaderboardService: ILeaderboardService

    //Controller(s)
    getTopScoresControllerPublic: IController

    // Repositories
    queueImpl: IQueueRepo
    databaseImpl: IDatabaseRepo
}

const container: AwilixContainer<ICradle> = createContainer<ICradle>({injectionMode: "CLASSIC"});

container.register({
    //Utility
    config: asValue(config),
    kafkaConsumerConfig: asClass(KafkaConsumerConfigDTO, getScope()),

    //Drivers
    mySQLDriver: asClass(MySQLDataSource, getScope()),

    //Domain
    leaderboardImpl: asClass(LeaderboardImpl, getScope()),

    //Service(s)
    leaderboardService: asClass(LeaderboardService, getScope()),

    //Controller(s)
    getTopScoresControllerPublic: asClass(GetTopScoresControllerPublic, getScope()),

    // Repositories
    queueImpl: asClass(KafkaConsumer, getScope()),
    databaseImpl: asClass(DatabaseRepo, getScope())
});

function getScope(): {lifetime: LifetimeType} {
    return {lifetime: Lifetime.SINGLETON};
}

//Forcefully Start Leaderboard Impl to start consuming from Kafka
container.build(LeaderboardImpl);

export {container};

