export default interface IQueueConsumer {
    startBatchConsumer(
        processFn: (msg: Buffer | null) => Promise<void>
    ): Promise<void>;
    shutdown(): Promise<void>;
}
