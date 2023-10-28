import MemcachedClient  from 'memcached';
import {ConfigDTO} from "../../models";
import assert from "assert";
import ICache from "../interfaces/ICache";

export default class Memcached implements ICache{
      memcachedClient: MemcachedClient
      defaultTTL: number

      constructor(config: ConfigDTO) {
            assert(config.memcachedConfig !== undefined)
            this.memcachedClient = new MemcachedClient(config.memcachedConfig.location)
            this.defaultTTL = config.memcachedConfig.defaultTTL;
      }

      async get(key: string) : Promise<any> {
            return new Promise((resolve, reject): void => {
                  this.memcachedClient.get(key, (err, data): void => {
                        if (err) {
                              // TODO:- Implement custom error for when fail to get data from memcached
                              console.error(`Error getting value from Memcache: ${err} for key: ${key}`);
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

      setAsync(key: string, value: any, _ttl?: number): void{
            let ttl: number = this.defaultTTL;
            if (_ttl !== undefined){
                  ttl = _ttl
            }
            this.memcachedClient.set(key, value, ttl, (err): void => {
                  if (err) {
                        // TODO: Implement custom error when error in setting value in memcache
                        console.error(`Error setting value in Memcache: ${err} for key: ${key}`);
                  } else {
                        // TODO: Change to DEBUG Logging
                        console.log(`Value has been set in Memcache for key: ${key}`);
                  }
            });
      }
}