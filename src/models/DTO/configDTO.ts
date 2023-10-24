import KafkaConsumerConfigDTO from "./kafkaConsumerConfigDTO";

export default class ConfigDTO{
    private _kafkaConsumerConfig: KafkaConsumerConfigDTO | undefined;

    get kafkaConsumerConfig(): KafkaConsumerConfigDTO | undefined{
        return this._kafkaConsumerConfig;
    }

    set kafkaConsumerConfig(value: KafkaConsumerConfigDTO) {
        this._kafkaConsumerConfig = value;
    }
}