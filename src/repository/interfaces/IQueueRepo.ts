import {MessageDTO} from "../../models";

export default interface IQueueRepo{
    startBatchConsumer(processFn: (msg: MessageDTO) => Promise<void> ): Promise<void>;
    shutdown(): Promise<void>;
}