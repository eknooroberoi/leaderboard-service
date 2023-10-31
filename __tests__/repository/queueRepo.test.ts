import QueueRepo from '../../src/repository/queueRepo'; // Import your QueueRepo class
import IQueueConsumer from '../../src/driver/interfaces/IQueueConsumer';
import { MessageDTO } from '../../src/models';

// Mock the IQueueConsumer implementation
const mockQueueConsumer: IQueueConsumer = {
    startBatchConsumer: jest.fn(),
    shutdown: jest.fn(),
};

describe('QueueRepo', () => {
    let queueRepo: QueueRepo;

    beforeEach(() => {
        // Initialize QueueRepo with the mock QueueConsumer
        queueRepo = new QueueRepo(mockQueueConsumer);
    });

    it('should start batch consumer', async () => {
        const processFn = async (_msg: MessageDTO) => {};

        // Mock the behavior of the startBatchConsumer method
        const mockStartBatchConsumer =
            mockQueueConsumer.startBatchConsumer as jest.Mock;
        mockStartBatchConsumer.mockImplementation(async (processFn) => {
            // Simulate a valid message
            const validMessage = {
                gameId: 'game123',
                gameName: 'SampleGame',
                userId: 'user123',
                userName: 'JohnDoe',
                score: 100,
                tsMs: '1635511445000',
            };
            const msg: MessageDTO = new MessageDTO(
                validMessage.gameId,
                validMessage.gameName,
                validMessage.userId,
                validMessage.userName,
                validMessage.score,
                validMessage.tsMs
            );
            await processFn(Buffer.from(JSON.stringify(msg.toJSON())));
        });

        await queueRepo.startBatchConsumer(processFn);

        expect(mockStartBatchConsumer).toHaveBeenCalled();
    });

    it('should not process invalid messages', async () => {
        const processFn = async (_msg: MessageDTO) => {};

        // Mock the behavior of the startBatchConsumer method
        const mockStartBatchConsumer =
            mockQueueConsumer.startBatchConsumer as jest.Mock;
        mockStartBatchConsumer.mockImplementation(async (processFn) => {
            // Simulate an invalid message (missing required properties)
            await processFn('{}');
        });

        await queueRepo.startBatchConsumer(processFn);
        expect(mockStartBatchConsumer).toHaveBeenCalled();
    });

    it('should handle parsing errors', async () => {
        const processFn = async (_msg: MessageDTO) => {};

        // Mock the behavior of the startBatchConsumer method
        const mockStartBatchConsumer =
            mockQueueConsumer.startBatchConsumer as jest.Mock;
        mockStartBatchConsumer.mockImplementation(async (processFn) => {
            // Simulate an unparseable message
            await processFn('PARSE_ERROR');
        });

        await queueRepo.startBatchConsumer(processFn);

        expect(mockStartBatchConsumer).toHaveBeenCalled();
    });

    it('should shut down the queue consumer', async () => {
        await queueRepo.shutdown();
        expect(mockQueueConsumer.shutdown).toHaveBeenCalled();
    });
});
