import KafkaConsumerConfigDTO from './kafkaConsumerConfigDTO';
import MySQLConfigDTO from './mySQLConfigDTO';
import MemcachedConfigDTO from './memcachedConfigDTO';
import LoggerConfigDTO from './loggerConfigDTO';

export default class ConfigDTO {
    private _kafkaConsumerConfig: KafkaConsumerConfigDTO | undefined;
    private _mySQLConfig: MySQLConfigDTO | undefined;
    private _memcachedConfig: MemcachedConfigDTO | undefined;
    private _loggerConfig: LoggerConfigDTO | undefined;

    get kafkaConsumerConfig(): KafkaConsumerConfigDTO | undefined {
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

    get memcachedConfig(): MemcachedConfigDTO | undefined {
        return this._memcachedConfig;
    }

    set memcachedConfig(value: MemcachedConfigDTO | undefined) {
        this._memcachedConfig = value;
    }

    get loggerConfig(): LoggerConfigDTO | undefined {
        return this._loggerConfig;
    }

    set loggerConfig(value: LoggerConfigDTO | undefined) {
        this._loggerConfig = value;
    }
}
