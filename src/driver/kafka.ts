import {Kafka, Consumer, EachBatchPayload} from "kafkajs";
import {IQueueRepo} from "../repository";
import {ConfigDTO, KafkaConsumerConfigDTO, MessageDTO} from "../models";
import assert from "assert";
import Ajv, {JSONSchemaType, ValidateFunction} from "ajv";

const ajv: Ajv = new Ajv()  // ajv is used for validating json object schema

export class KafkaConsumer implements IQueueRepo{
    static msgSchema: JSONSchemaType<MessageDTO> = {
        type: "object",
        properties: {
            gameId: {type: "string"},
            gameName: {type: "string"},
            userId: {type: "string"},
            userName: {type: "string"},
            score: {type: "integer"},
            tsMs: {type: "string"}
        },
        required: ["gameId", "gameName", "userId", "userName", "score"],
        additionalProperties: false,
    }
    static msgSchemaValidate: ValidateFunction<MessageDTO> =  ajv.compile(KafkaConsumer.msgSchema);

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

    async startBatchConsumer(processFn: (msg: MessageDTO) => Promise<void>): Promise<void> {
        try {
            await this.kafkaConsumerClient.run({
                eachBatchAutoResolve: this.kafkaConsumerClientConfig.batchAutoResolve,
                eachBatch: async (eachBatchPayload: EachBatchPayload) => {
                    for (let msg of eachBatchPayload.batch.messages) {
                        // At-least Once Consumer Ref :- https://kafka.js.org/docs/consuming#example
                        if (!eachBatchPayload.isRunning() || eachBatchPayload.isStale()) break;
                        const msgValueBuf: Buffer | null = msg.value;
                        let validMsgSchema: boolean = false;
                        if (msgValueBuf !== null) {
                            try {
                                const msgValueObj = JSON.parse(msgValueBuf.toString());
                                if (KafkaConsumer.msgSchemaValidate(msgValueObj)) {
                                    validMsgSchema = true;
                                    const message: MessageDTO = new MessageDTO(
                                        msgValueObj.gameId,
                                        msgValueObj.gameName,
                                        msgValueObj.userId,
                                        msgValueObj.userName,
                                        msgValueObj.score,
                                        msgValueObj.tsMs,
                                    )
                                    // Note:- we only call `processFn` for valid messages and skip over rest
                                    await processFn(message);
                                }
                            } catch (e){
                                console.log(e);
                            }
                        }
                        if (!validMsgSchema) {
                            console.log(
                                "Invalid Schema for msg: %s at offset: %s in topic: %s",
                                msgValueBuf?.toString(),
                                msg.offset,
                                eachBatchPayload.batch.topic
                            );
                        }
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