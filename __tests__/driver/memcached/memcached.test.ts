import Memcached from '../../../src/driver/memcached/memcached';
import memcached from 'memcached';
import { ConfigDTO, MemcachedConfigDTO } from '../../../src/models';
import assert from 'assert';
import logger from '../../../src/utils/logger';

jest.mock('memcached');

describe('Memcached', () => {
    const mockedMemcachedConfig: MemcachedConfigDTO = new MemcachedConfigDTO(
        'localhost:11211',
        60
    );
    const mockedConfig: ConfigDTO = new ConfigDTO();
    const loggerDebugSpy = jest
        .spyOn(logger, 'debug')
        .mockImplementation(() => {});
    const loggerErrorSpy = jest
        .spyOn(logger, 'error')
        .mockImplementation(() => {});

    mockedConfig.memcachedConfig = mockedMemcachedConfig;

    const commandData: memcached.CommandData = {
        start: 0,
        execution: 0,
        callback: () => {},
        type: 'test_type',
        command: 'test_command',
        validate: new Array(['test_validate', () => {}]),
    };

    let memcachedInstance: Memcached;
    let memcachedClientMock: jest.Mocked<memcached>;

    beforeEach(() => {
        memcachedClientMock = Memcached.newMemcachedClient(
            mockedConfig
        ) as jest.Mocked<memcached>;
        memcachedInstance = new Memcached(mockedConfig, memcachedClientMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should resolve with null when key is not found', async function (this: any) {
            const key = 'non-existent-key';
            memcachedClientMock.get.mockImplementation((_, callback) => {
                callback.call(this, null, null);
            });
            const data = await memcachedInstance.get(key);
            expect(data).toBeNull();
        });

        it('should resolve with data when key is found', async function (this: any) {
            const key = 'existing-key';
            const value = 'some-value';
            memcachedClientMock.get.mockImplementation((_, callback) => {
                callback.call(this, null, value);
            });
            const data = await memcachedInstance.get(key);
            expect(data).toBe(value);
        });

        it('should reject with error when memcachedClient.get returns error', async function (this: any) {
            const key = 'existing-key';
            const error = new Error('some-error');
            memcachedClientMock.get.mockImplementation((_, callback) => {
                callback.call(this, error, null);
            });
            await expect(memcachedInstance.get(key)).rejects.toThrow(error);
        });
    });

    describe('setAsync', () => {
        it('should set value with default TTL when _ttl is not provided', () => {
            const key = 'some-key';
            const value = 'some-value';
            assert(mockedConfig.memcachedConfig !== undefined);
            const ttl = mockedConfig.memcachedConfig.defaultTTL;
            memcachedClientMock.set.mockImplementation(
                (_key, _value, _ttl, _callback) => {}
            );
            memcachedInstance.setAsync(key, value);
            expect(memcachedClientMock.set).toHaveBeenCalledWith(
                key,
                value,
                ttl,
                expect.any(Function)
            );
        });

        it('should set value with provided TTL when _ttl is provided', () => {
            const key = 'some-key';
            const value = 'some-value';
            const ttl = 120;
            memcachedClientMock.set.mockImplementation(
                (_key, _value, _ttl, _callback) => {}
            );
            memcachedInstance.setAsync(key, value, ttl);
            expect(memcachedClientMock.set).toHaveBeenCalledWith(
                key,
                value,
                ttl,
                expect.any(Function)
            );
        });

        it('should log error when memcachedClient.set returns error', () => {
            const key = 'some-key';
            const value = 'some-value';
            const error = new Error('some-error');
            memcachedClientMock.set.mockImplementation(
                (_key, _value, _ttl, callback) => {
                    callback.call(commandData, error, false);
                }
            );
            memcachedInstance.setAsync(key, value);
            assert(mockedConfig.memcachedConfig !== undefined);
            expect(memcachedClientMock.set).toHaveBeenCalledWith(
                key,
                value,
                mockedConfig.memcachedConfig.defaultTTL,
                expect.any(Function)
            );
            expect(loggerErrorSpy).toHaveBeenCalledWith(
                `Error setting value in Memcache: ${error} for key: ${key}`
            );
        });

        it('should log success when memcachedClient.set is successful', () => {
            const key = 'some-key';
            const value = 'some-value';
            memcachedClientMock.set.mockImplementation(
                (_key, _value, _ttl, callback) => {
                    callback.call(commandData, null, true);
                }
            );
            memcachedInstance.setAsync(key, value);
            assert(mockedConfig.memcachedConfig !== undefined);
            expect(memcachedClientMock.set).toHaveBeenCalledWith(
                key,
                value,
                mockedConfig.memcachedConfig.defaultTTL,
                expect.any(Function)
            );
            expect(loggerDebugSpy).toHaveBeenCalledWith(
                `Value has been set in Memcache for key: ${key}`
            );
        });
    });
});
