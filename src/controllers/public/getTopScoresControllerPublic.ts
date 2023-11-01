import { Request, Response } from 'express';
import { ILeaderboardService } from '../../services';
import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';
import { RequestQueryParamsDTO, TopScoresDTO } from '../../models';
import { IController } from '../interfaces/IController';
import logger from '../../utils/logger';

// TODO :- Have single instance of ajv in the application
const ajv: Ajv = new Ajv(); // ajv is used for validating json object schema

class GetTopScoresControllerPublic implements IController {
    static CONSISTENT_READ_HEADER: string = 'CONSISTENT-READ';
    static requestQueryParamsSchema: JSONSchemaType<RequestQueryParamsDTO> = {
        type: 'object',
        properties: {
            gameId: { type: 'string', minLength: 1 },
            limit: { type: 'string', minLength: 1 },
        },
        required: ['gameId', 'limit'],
        additionalProperties: false,
    };
    static requestQueryParamsSchemaValidate: ValidateFunction<RequestQueryParamsDTO> =
        ajv.compile(GetTopScoresControllerPublic.requestQueryParamsSchema);

    leaderboardService: ILeaderboardService;

    constructor(leaderboardService: ILeaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    async handleRequest(req: Request, res: Response) {
        try {
            if (
                !GetTopScoresControllerPublic.requestQueryParamsSchemaValidate(
                    req.query
                )
            ) {
                res.status(400).send({ errMsg: 'Invalid query parameters' });
                return;
            }
            const gameId: string = req.query.gameId;
            const limit: number = parseInt(req.query.limit);
            const consistentRead: boolean =
                req.get(GetTopScoresControllerPublic.CONSISTENT_READ_HEADER) ===
                'true';
            const topScores: TopScoresDTO | null =
                await this.leaderboardService.getTopScores(
                    gameId,
                    limit,
                    consistentRead
                );
            if (topScores === null) {
                // Did not find entry, return 404
                res.status(404).send({
                    errMsg: `No entry found for game: ${gameId}`,
                });
                return;
            }
            res.status(200).send(topScores.toJSON());
        } catch (err: any) {
            logger.error(`Error while handling request: ${err.message}`);
            res.status(500).send({ errMsg: 'Internal Server Error' });
        }
    }
}

export default GetTopScoresControllerPublic;
