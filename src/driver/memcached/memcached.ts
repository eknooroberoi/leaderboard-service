import MemcachedClient from 'memcached';
import { ConfigDTO } from '../../models';
import assert from 'assert';
import ICache from '../interfaces/ICache';
import logger from '../../utils/logger';

export default class Memcached implements ICache {
    static newMemcachedClient(config: ConfigDTO): MemcachedClient {
        assert(config.memcachedConfig !== undefined);
        return new MemcachedClient(config.memcachedConfig.location);
    }

    private readonly memcachedClient: MemcachedClient;
    private readonly defaultTTL: number;

    constructor(config: ConfigDTO, memcachedClient: MemcachedClient) {
        assert(config.memcachedConfig !== undefined);
        this.memcachedClient = memcachedClient;
        this.defaultTTL = config.memcachedConfig.defaultTTL;
    }

    async get(key: string): Promise<any> {
        return new Promise((resolve, reject): void => {
            this.memcachedClient.get(key, (err, data): void => {
                if (err) {
                    logger.error(
                        `Error getting value from Memcache: ${err.message} for key: ${key}`
                    );
                    reject(err);
                } else {
                    if (data) {
                        logger.debug(
                            `Value retrieved from Memcache for ${key}`
                        );
                        resolve(data);
                    } else {
                        logger.warn(`Value not found in Memcache for ${key}`);
                        resolve(null);
                    }
                }
            });
        });
    }

    setAsync(key: string, value: any, _ttl?: number): void {
        let ttl: number = this.defaultTTL;
        if (_ttl !== undefined) {
            ttl = _ttl;
        }
        this.memcachedClient.set(key, value, ttl, (err, _): void => {
            if (err) {
                logger.error(
                    `Error setting value in Memcache: ${err} for key: ${key}`
                );
            } else {
                logger.debug(`Value has been set in Memcache for key: ${key}`);
            }
        });
    }
}
