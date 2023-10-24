import {asClass, asValue, AwilixContainer, createContainer, Lifetime, LifetimeType} from "awilix";
import {GetTopScoresControllerPublic} from "../controllers";
import {ILeaderboardService, LeaderboardService, ILeaderboard, LeaderboardImpl} from "../services";
import {IQueueRepo} from "../repository";
import {KafkaConsumer} from "../driver/kafka";
import config from "../config/config";
import {ConfigDTO, KafkaConsumerConfigDTO} from "../models";
interface ICradle {
    //Utility
    config: ConfigDTO
    kafkaConsumerConfig: KafkaConsumerConfigDTO

    //Domain
    leaderboardImpl: ILeaderboard

    //Service(s)
    leaderboardService: ILeaderboardService

    //Controller(s)
    getTopScoresControllerPublic: GetTopScoresControllerPublic

    // Repositories
    queueImpl: IQueueRepo
}

const container: AwilixContainer<ICradle> = createContainer<ICradle>({injectionMode: "CLASSIC"});

container.register({
    //Utility
    config: asValue(config),
    kafkaConsumerConfig: asClass(KafkaConsumerConfigDTO, getScope()),

    //Domain
    leaderboardImpl: asClass(LeaderboardImpl, getScope()),

    //Service(s)
    leaderboardService: asClass(LeaderboardService, getScope()),

    //Controller(s)
    getTopScoresControllerPublic: asClass(GetTopScoresControllerPublic, getScope()),

    // Repositories
    queueImpl: asClass(KafkaConsumer, getScope())
});

function getScope(): {lifetime: LifetimeType} {
    return {lifetime: Lifetime.SINGLETON};
}

//Forcefully Start Leaderboard Impl to start consuming from Kafka
container.build(LeaderboardImpl);

export {container};

