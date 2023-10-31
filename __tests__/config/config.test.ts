import config from '../../src/config/config';

describe('config', () => {
    it('should have a Kafka consumer config', () => {
        const kafkaConsumerConfig = config.kafkaConsumerConfig;
        expect(kafkaConsumerConfig).toBeDefined();
        expect(kafkaConsumerConfig?.brokers).toBeDefined();
        expect(kafkaConsumerConfig?.groupId).toBeDefined();
        expect(kafkaConsumerConfig?.topics).toBeDefined();
        expect(kafkaConsumerConfig?.batchAutoResolve).toBeDefined();
        expect(kafkaConsumerConfig?.clientId).toBeDefined();
        expect(kafkaConsumerConfig?.fromBeginning).toBeDefined();
    });

    it('should have a MySQL config', () => {
        const mySQLConfig = config.mySQLConfig;
        expect(mySQLConfig).toBeDefined();
        expect(mySQLConfig?.host).toBeDefined();
        expect(mySQLConfig?.port).toBeDefined();
        expect(mySQLConfig?.userName).toBeDefined();
        expect(mySQLConfig?.password).toBeDefined();
        expect(mySQLConfig?.database).toBeDefined();
    });

    it('should have a Memcached config', () => {
        const memCachedConfig = config.memcachedConfig;
        expect(memCachedConfig).toBeDefined();
        expect(memCachedConfig?.location).toBeDefined();
        expect(memCachedConfig?.defaultTTL).toBeDefined();
    });
});
