import {consts} from "./consts";
import {ConfigDTO, KafkaConsumerConfigDTO} from "../models";

const kafkaConsumerConfig: KafkaConsumerConfigDTO = new KafkaConsumerConfigDTO(
    consts.kafkaConsumerConfig.brokers,
    consts.kafkaConsumerConfig.groupId,
    consts.kafkaConsumerConfig.topics
)
    .withBatchAutoResolve(consts.kafkaConsumerConfig.batchAutoResolve)
    .withClientId(consts.kafkaConsumerConfig.clientId)
    .withFromBeginning(consts.kafkaConsumerConfig.fromBeginning)

const config: ConfigDTO = new ConfigDTO();
config.kafkaConsumerConfig = kafkaConsumerConfig;

export default config;