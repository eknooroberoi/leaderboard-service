import {consts} from "./consts";
import {ConfigDTO, KafkaConsumerConfigDTO, MemcachedConfigDTO, MySQLConfigDTO} from "../models";
import LoggerConfigDTO from "../models/DTO/loggerConfigDTO";

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
const memCachedConfig: MemcachedConfigDTO = new MemcachedConfigDTO(
    consts.memcachedConfig.location,
    consts.memcachedConfig.defaultTTL
)
const loggerConfig:LoggerConfigDTO = new LoggerConfigDTO(
    consts.loggerConfig.logLevel
)

const config: ConfigDTO = new ConfigDTO();
config.kafkaConsumerConfig = kafkaConsumerConfig;
config.mySQLConfig = mySQLConfig;
config.memcachedConfig = memCachedConfig;
config.loggerConfig = loggerConfig;

export default config;