import IQueueRepo from "./interfaces/IQueueRepo";
import IQueueConsumer from "../driver/interfaces/IQueueConsumer";
import {MessageDTO} from "../models";
import Ajv, {JSONSchemaType, ValidateFunction} from "ajv";

// TODO:- Implement validation initialisation once in code
const ajv: Ajv = new Ajv()  // ajv is used for validating json object schema

export default class QueueRepo implements IQueueRepo{
    private queueConsumerImpl: IQueueConsumer

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
    static msgSchemaValidate: ValidateFunction<MessageDTO> =  ajv.compile(QueueRepo.msgSchema);

    constructor(queueConsumerDriver: IQueueConsumer) {
        this.queueConsumerImpl = queueConsumerDriver;
    }

    async startBatchConsumer(processFn: (msg: MessageDTO) => Promise<void>): Promise<void>{
        await this.queueConsumerImpl.startBatchConsumer(async (msg: Buffer | null): Promise<void> => {
            //Perform Validation on msg
            let validMsgSchema: boolean = false;
            if (msg !== null) {
                try {
                    const msgValueObj = JSON.parse(msg.toString());
                    if (QueueRepo.msgSchemaValidate(msgValueObj)) {
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
                    // TODO:- Implement custom error for parsing errors
                    console.log(e);
                }
            }
            if (!validMsgSchema) {
                // TODO:- Implement custom error for validation errors
                console.log("Invalid Schema for msg: %s", msg?.toString());
            }
        });
    }

    async shutdown(): Promise<void>{
        await this.queueConsumerImpl.shutdown();
    }
}