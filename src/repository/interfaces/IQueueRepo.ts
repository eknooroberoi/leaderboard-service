
export default interface IQueueRepo{
    startBatchConsumer(processFn: (msg: Buffer | null) => Promise<void> ): Promise<void>;
    shutdown(): Promise<void>;
}