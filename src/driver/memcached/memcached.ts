import MemcachedClient from 'memcached';
import { ConfigDTO } from '../../models';
import assert from 'assert';
import ICache from '../interfaces/ICache';

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
                    // TODO:- Implement custom error for when fail to get data from memcached
                    console.log(
                        `Error getting value from Memcache: ${err} for key: ${key}`
                    );
                    reject(err);
                } else {
                    if (data) {
                        // TODO:- Change to DEBUG logging
                        console.log(`Value retrieved from Memcache for ${key}`);
                        resolve(data);
                    } else {
                        // TODO:- Change to WARN logging
                        console.log(`Value not found in Memcache for ${key}`);
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
                // TODO: Implement custom error when error in setting value in memcache
                console.log(
                    `Error setting value in Memcache: ${err} for key: ${key}`
                );
            } else {
                // TODO: Change to DEBUG Logging
                console.log(`Value has been set in Memcache for key: ${key}`);
            }
        });
    }
}
