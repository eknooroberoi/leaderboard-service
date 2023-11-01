import { ISQLDataSource } from '../driver';
import IDatabaseRepo from './interfaces/IDatabaseRepo';
import { GameDAO, LeaderboardDAO, TopScorerDAO, UserDAO } from '../models';
import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';
import { wrapInPromise } from '../utils/helpers';
import Persistable from '../models/DAO/persistable';
import logger from '../utils/logger';

// TODO :- Have single instance of ajv in the application
const ajv: Ajv = new Ajv(); // ajv is used for validating json object schema

export default class DatabaseRepo implements IDatabaseRepo {
    static topScorersSchema: JSONSchemaType<TopScorerDAO[]> = {
        $id: 'file:///topScorers.json',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                userId: { type: 'string' },
                userName: { type: 'string' },
                score: { type: 'integer' },
            },
            required: ['userId', 'userName', 'score'],
            additionalProperties: true,
        },
    };
    static topScorersSchemaValidate: ValidateFunction<TopScorerDAO[]> =
        ajv.compile(DatabaseRepo.topScorersSchema);

    private readonly _sqlDatabaseImpl: ISQLDataSource;

    get sqlDatabaseImpl(): ISQLDataSource {
        return this._sqlDatabaseImpl;
    }

    constructor(sqlDriver: ISQLDataSource) {
        this._sqlDatabaseImpl = sqlDriver;
    }

    async saveEntity(entity: Persistable): Promise<void> {
        await this._sqlDatabaseImpl.getDBImpl().manager.save(entity);
    }

    async saveOrUpdateEntity<T extends Persistable>(
        entity: T,
        entityClazz: { new (): T },
        overwrite: string[],
        conflictTarget: string[]
    ) {
        await this._sqlDatabaseImpl
            .getDBImpl()
            .createQueryBuilder()
            .insert()
            .into(entityClazz)
            .values(entity)
            .orUpdate(overwrite, conflictTarget)
            .execute();
    }

    async getGameData(gameId: string): Promise<GameDAO | null> {
        return this._sqlDatabaseImpl
            .getDBImpl()
            .getRepository(GameDAO)
            .findOne({
                where: {
                    id: gameId,
                },
            });
    }

    async getTopScorersData(
        gameId: string,
        limit: number
    ): Promise<TopScorerDAO[] | null> {
        const topScorersData = await this._sqlDatabaseImpl
            .getDBImpl()
            .getRepository(LeaderboardDAO)
            .createQueryBuilder('leaderboard')
            .select([
                'leaderboard.score AS score',
                'user.id AS userId',
                'user.name AS userName',
            ])
            .innerJoin(UserDAO, 'user', 'user.id = leaderboard.userId')
            .where('leaderboard.gameId = :gameId', { gameId })
            .orderBy('leaderboard.score', 'DESC')
            .addOrderBy('leaderboard.updatedAt', 'ASC')
            .limit(limit)
            .getRawMany();

        if (!DatabaseRepo.topScorersSchemaValidate(topScorersData)) {
            logger.error(
                'Could not validate scorers data, returning empty response'
            );
            return wrapInPromise(null);
        }
        return wrapInPromise(topScorersData);
    }

    async shutdown(): Promise<void> {
        await this._sqlDatabaseImpl.shutdown();
    }
}
