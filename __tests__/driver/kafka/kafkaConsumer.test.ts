import { Kafka, Consumer, EachBatchPayload, RecordBatchEntry } from 'kafkajs';
import assert from 'assert';
import KafkaConsumer from '../../../src/driver/kafka/kafkaConsumer';
import { KafkaConsumerConfigDTO, ConfigDTO } from '../../../src/models';

jest.mock('kafkajs', () => ({
    Kafka: jest.fn(() => ({
        consumer: jest.fn(() => ({
            subscribe: jest.fn(),
            run: jest.fn(),
            disconnect: jest.fn(),
        })),
    })),
}));

describe('KafkaConsumer', () => {
    const mockedKafkaConsumerConfig: KafkaConsumerConfigDTO =
        new KafkaConsumerConfigDTO(['localhost:9092'], 'test-group', [
            'test-topic',
        ]);

    let kafkaClientMock: jest.Mocked<Kafka>;
    let kafkaConsumerClientMock: jest.Mocked<Consumer>;
    let kafkaConsumer: KafkaConsumer;
    let mockedConfig: ConfigDTO;

    beforeEach(() => {
        // Create an instance of ConfigDTO with kafkaConsumerConfig
        mockedConfig = new ConfigDTO();
        mockedConfig.kafkaConsumerConfig = mockedKafkaConsumerConfig;

        // Create a mock Kafka configuration
        const kafkaConfig = {
            clientId: mockedKafkaConsumerConfig.clientId,
            brokers: mockedKafkaConsumerConfig.brokers,
        };

        // Create the Kafka client mock with the mock Kafka configuration
        kafkaClientMock = new Kafka(kafkaConfig) as jest.Mocked<Kafka>;

        // Create the Kafka consumer client mock
        kafkaConsumerClientMock = kafkaClientMock.consumer({
            groupId: mockedKafkaConsumerConfig.groupId,
        }) as jest.Mocked<Consumer>;
        kafkaConsumerClientMock.subscribe.mockResolvedValue(Promise.resolve()); // Mock the subscribe function
        kafkaConsumerClientMock.run.mockResolvedValue(Promise.resolve()); // Mock the run function
        kafkaClientMock.consumer.mockReturnValue(kafkaConsumerClientMock); // Mock the consumer function

        // Create the KafkaConsumer instance with the config
        kafkaConsumer = new KafkaConsumer(
            mockedConfig,
            kafkaConsumerClientMock
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('newKafkaClient', () => {
        it('should create a new Kafka client with the provided configuration', () => {
            KafkaConsumer.newKafkaConsumerClient(mockedConfig);

            expect(Kafka).toHaveBeenCalledWith({
                clientId: mockedKafkaConsumerConfig.clientId,
                brokers: mockedKafkaConsumerConfig.brokers,
            });
        });

        it('should throw an error if the Kafka consumer configuration is undefined', () => {
            expect(() =>
                KafkaConsumer.newKafkaConsumerClient({} as ConfigDTO)
            ).toThrowError(assert.AssertionError);
        });
    });

    describe('constructor', () => {
        it('should create a new Kafka consumer with the provided configuration', () => {
            expect(kafkaConsumer.kafkaConsumerClient).toBe(
                kafkaConsumerClientMock
            );
            expect(kafkaConsumer.kafkaConsumerClientConfig).toEqual(
                mockedKafkaConsumerConfig
            );
        });
    });

    describe('startBatchConsumer', () => {
        it('should consume messages in batches and call the process function', async () => {
            const processFn = jest.fn().mockResolvedValue(undefined);
            const eachBatchPayload: EachBatchPayload = {
                batch: {
                    topic: 'test-topic',
                    partition: 0,
                    highWatermark: '0',
                    messages: [
                        { value: Buffer.from('test-message-1') },
                        { value: Buffer.from('test-message-2') },
                    ] as RecordBatchEntry[],
                    isEmpty: () => false,
                    firstOffset: () => '0',
                    lastOffset: () => '1',
                    offsetLag: () => '0',
                    offsetLagLow: () => '0',
                },
                isRunning: jest.fn().mockReturnValue(true),
                isStale: jest.fn().mockReturnValue(false),
                resolveOffset: jest.fn(),
                heartbeat: jest.fn(),
                pause: jest.fn(),
                commitOffsetsIfNecessary: jest.fn(),
                uncommittedOffsets: jest.fn(),
            };

            kafkaConsumerClientMock.run.mockImplementationOnce(
                async (options) => {
                    if (options?.eachBatch) {
                        await options.eachBatch(eachBatchPayload);
                    }
                }
            );

            await kafkaConsumer.startBatchConsumer(processFn);

            expect(processFn).toHaveBeenCalledTimes(2);
            expect(processFn).toHaveBeenCalledWith(
                Buffer.from('test-message-1')
            );
            expect(processFn).toHaveBeenCalledWith(
                Buffer.from('test-message-2')
            );
            expect(eachBatchPayload.resolveOffset).toHaveBeenCalledTimes(2);
            expect(eachBatchPayload.heartbeat).toHaveBeenCalledTimes(2);
        });
    });

    describe('shutdown', () => {
        it('should disconnect the Kafka consumer', async () => {
            await kafkaConsumer.shutdown();
            expect(kafkaConsumerClientMock.disconnect).toHaveBeenCalled();
        });
    });
});
