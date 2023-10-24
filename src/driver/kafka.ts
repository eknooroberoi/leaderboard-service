import {Kafka, Consumer, EachBatchPayload} from "kafkajs";
import {IQueueRepo} from "../repository";
import {ConfigDTO, KafkaConsumerConfigDTO} from "../models";
import assert from "assert";

export class KafkaConsumer implements IQueueRepo{

    kafkaConsumerClient: Consumer
    kafkaConsumerClientConfig: KafkaConsumerConfigDTO
    constructor(config: ConfigDTO ) {
        assert(config.kafkaConsumerConfig !== undefined);
        const kafkaConsumerConfig: KafkaConsumerConfigDTO = config.kafkaConsumerConfig;
        this.kafkaConsumerClientConfig = kafkaConsumerConfig;
        const kafkaClient: Kafka = new Kafka({
            clientId: kafkaConsumerConfig.clientId,
            brokers: kafkaConsumerConfig.brokers
        });
        this.kafkaConsumerClient = kafkaClient.consumer({
            groupId: kafkaConsumerConfig.groupId,
        });
        this.kafkaConsumerClient.subscribe({
            topics: kafkaConsumerConfig.topics,
            fromBeginning: kafkaConsumerConfig.fromBeginning
        }).then(() => console.log("Successfully subscribed to topics: %s", kafkaConsumerConfig.topics))
    }

    async startBatchConsumer(processFn: (msg: Buffer | null) => Promise<void>): Promise<void> {
        try {
            await this.kafkaConsumerClient.run({
                eachBatchAutoResolve: this.kafkaConsumerClientConfig.batchAutoResolve,
                eachBatch: async (eachBatchPayload: EachBatchPayload) => {
                    for (let msg of eachBatchPayload.batch.messages) {
                        // At-least Once Consumer Ref :- https://kafka.js.org/docs/consuming#example
                        if (!eachBatchPayload.isRunning() || eachBatchPayload.isStale()) break;
                        const msgValue: Buffer | null = msg.value;
                        await processFn(msgValue);
                        eachBatchPayload.resolveOffset(msg.offset);
                        await eachBatchPayload.heartbeat();
                    }
                },
            });
        } catch (error){
            console.log("Error while consuming from Kafka: ", error);
        }
    }

    async shutdown(): Promise<void>{
        await this.kafkaConsumerClient.disconnect();
    }

}