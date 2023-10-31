import { ConfigDTO, KafkaConsumerConfigDTO } from '../../models';
import assert from 'assert';
import IQueueConsumer from '../interfaces/IQueueConsumer';
import { Consumer, EachBatchPayload, Kafka } from 'kafkajs';

export default class KafkaConsumer implements IQueueConsumer {
    static newKafkaConsumerClient(config: ConfigDTO): Consumer {
        assert(config.kafkaConsumerConfig !== undefined);
        const kafkaConsumerConfig: KafkaConsumerConfigDTO =
            config.kafkaConsumerConfig;
        const kafkaClient: Kafka = new Kafka({
            clientId: kafkaConsumerConfig.clientId,
            brokers: kafkaConsumerConfig.brokers,
        });
        return kafkaClient.consumer({
            groupId: kafkaConsumerConfig.groupId,
        });
    }

    private readonly _kafkaConsumerClient: Consumer;
    private readonly _kafkaConsumerClientConfig: KafkaConsumerConfigDTO;

    constructor(config: ConfigDTO, kafkaConsumerClient: Consumer) {
        assert(config.kafkaConsumerConfig !== undefined);
        const kafkaConsumerConfig: KafkaConsumerConfigDTO =
            config.kafkaConsumerConfig;
        this._kafkaConsumerClientConfig = kafkaConsumerConfig;
        this._kafkaConsumerClient = kafkaConsumerClient;
        this._kafkaConsumerClient
            .subscribe({
                topics: kafkaConsumerConfig.topics,
                fromBeginning: kafkaConsumerConfig.fromBeginning,
            })
            .then(() =>
                console.log(
                    'Successfully subscribed to topics: %s',
                    kafkaConsumerConfig.topics
                )
            );
    }

    get kafkaConsumerClient(): Consumer {
        return this._kafkaConsumerClient;
    }

    get kafkaConsumerClientConfig(): KafkaConsumerConfigDTO {
        return this._kafkaConsumerClientConfig;
    }

    async startBatchConsumer(
        processFn: (msg: Buffer | null) => Promise<void>
    ): Promise<void> {
        try {
            await this._kafkaConsumerClient.run({
                eachBatchAutoResolve:
                    this._kafkaConsumerClientConfig.batchAutoResolve,
                eachBatch: async (eachBatchPayload: EachBatchPayload) => {
                    for (let msg of eachBatchPayload.batch.messages) {
                        // At-least Once Consumer Ref :- https://kafka.js.org/docs/consuming#example
                        if (
                            !eachBatchPayload.isRunning() ||
                            eachBatchPayload.isStale()
                        )
                            break;
                        const msgValueBuf: Buffer | null = msg.value;
                        await processFn(msgValueBuf);
                        // TODO:- Ensure that we increase offsets only for known errors (validation, parsing)
                        eachBatchPayload.resolveOffset(msg.offset);
                        await eachBatchPayload.heartbeat();
                    }
                },
            });
        } catch (error) {
            console.log('Error while consuming from Kafka: ', error);
        }
    }

    async shutdown(): Promise<void> {
        await this._kafkaConsumerClient.disconnect();
    }
}
