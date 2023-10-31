import { ICache } from '../driver';
import ICacheRepo from './interfaces/ICacheRepo';
import TopScoresDAO from '../models/DAO/topScoresDAO';
import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';
import { DatabaseRepo } from './index';
import { wrapInPromise } from '../utils/helpers';
import { TopScoresDTO } from '../models';

// TODO :- Have single instance of ajv in the application
const ajv: Ajv = new Ajv(); // ajv is used for validating json object schema

export default class CacheRepo implements ICacheRepo {
    static topScoresSchema: JSONSchemaType<TopScoresDAO> = {
        $id: 'file:///topScores.json',
        type: 'object',
        properties: {
            gameId: { type: 'string' },
            gameName: { type: 'string' },
            topScorers: { $ref: 'topScorers.json' },
            lastUpdatedAt: { type: 'integer' },
            toJSON: { type: 'object' },
        },
        required: ['gameId', 'gameName', 'topScorers', 'lastUpdatedAt'],
        additionalProperties: true,
    };
    static topScoresSchemaValidate: ValidateFunction<TopScoresDAO> = ajv
        .addSchema(DatabaseRepo.topScorersSchema)
        .compile(CacheRepo.topScoresSchema);
    private cacheImpl: ICache;

    constructor(cacheDriver: ICache) {
        this.cacheImpl = cacheDriver;
    }

    async get(key: string): Promise<TopScoresDAO | null> {
        const val = await this.cacheImpl.get(key);
        if (val !== undefined && val !== null) {
            try {
                const parsedVal: object = JSON.parse(val);
                if (CacheRepo.topScoresSchemaValidate(parsedVal)) {
                    return new TopScoresDTO(
                        parsedVal.gameId,
                        parsedVal.gameName,
                        parsedVal.topScorers,
                        parsedVal.lastUpdatedAt
                    );
                }
            } catch (error) {
                console.error(
                    `Error validating value returned from memcached. Err: ${error}`
                );
            }
        }
        return wrapInPromise(null);
    }

    async setAsync(
        key: string,
        value: TopScoresDAO,
        ttl?: number
    ): Promise<void> {
        //Serialize(stringify) value before storing
        const stringifiedVal: string = JSON.stringify(value.toJSON());
        //Store stringified value
        this.cacheImpl.setAsync(key, stringifiedVal, ttl);
    }
}
