import {consts} from "./consts";
import {ConfigDTO, KafkaConsumerConfigDTO, MySQLConfigDTO} from "../models";

const kafkaConsumerConfig: KafkaConsumerConfigDTO = new KafkaConsumerConfigDTO(
    consts.kafkaConsumerConfig.brokers,
    consts.kafkaConsumerConfig.groupId,
    consts.kafkaConsumerConfig.topics
)
    .withBatchAutoResolve(consts.kafkaConsumerConfig.batchAutoResolve)
    .withClientId(consts.kafkaConsumerConfig.clientId)
    .withFromBeginning(consts.kafkaConsumerConfig.fromBeginning);
const mySQLConfig: MySQLConfigDTO = new MySQLConfigDTO(
    consts.mySQLConfig.host,
    consts.mySQLConfig.port,
    consts.mySQLConfig.userName,
    consts.mySQLConfig.password,
    consts.mySQLConfig.database
)

const config: ConfigDTO = new ConfigDTO();
config.kafkaConsumerConfig = kafkaConsumerConfig;
config.mySQLConfig = mySQLConfig;

export default config;