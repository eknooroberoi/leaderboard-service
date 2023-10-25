import KafkaConsumerConfigDTO from "./kafkaConsumerConfigDTO";
import MySQLConfigDTO from "./mySQLConfigDTO";

export default class ConfigDTO{
    private _kafkaConsumerConfig: KafkaConsumerConfigDTO | undefined;
    private _mySQLConfig: MySQLConfigDTO | undefined

    get kafkaConsumerConfig(): KafkaConsumerConfigDTO | undefined{
        return this._kafkaConsumerConfig;
    }

    set kafkaConsumerConfig(value: KafkaConsumerConfigDTO) {
        this._kafkaConsumerConfig = value;
    }

    get mySQLConfig(): MySQLConfigDTO | undefined {
        return this._mySQLConfig;
    }

    set mySQLConfig(value: MySQLConfigDTO | undefined) {
        this._mySQLConfig = value;
    }
}