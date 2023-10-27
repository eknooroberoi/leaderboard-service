import {Request, Response} from "express";
import {ILeaderboardService} from "../../services";
import Ajv, {JSONSchemaType, ValidateFunction} from "ajv";
import {RequestQueryParamsDTO, TopScoresDTO} from "../../models";

// TODO :- Have single instance of ajv in the application
const ajv: Ajv = new Ajv()  // ajv is used for validating json object schema

class GetTopScoresControllerPublic {
    leaderboardService: ILeaderboardService;

    static requestQueryParamsSchema: JSONSchemaType<RequestQueryParamsDTO> = {
        type: "object",
        properties: {
            gameId: {type: "string"},
            limit: {type: "string"}
        },
        required: ['gameId', 'limit'],
        additionalProperties: false
    };
    static requestQueryParamsSchemaValidate: ValidateFunction<RequestQueryParamsDTO> = ajv.compile(GetTopScoresControllerPublic.requestQueryParamsSchema);

    constructor(leaderboardService: ILeaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    async handleRequest(req: Request, res: Response){
        try{
            if (!GetTopScoresControllerPublic.requestQueryParamsSchemaValidate(req.query)){
                res.status(400).send({errMsg: "Invalid query parameters"});
                return
            }
            const gameId: string = req.query.gameId;
            const limit: number = parseInt(req.query.limit);
            const topScores: TopScoresDTO | null = await this.leaderboardService.getTopScores(gameId, limit);
            if (topScores === null){ // Did not find entry, return 404
                res.status(404).send({errMsg: `No entry found for game: ${gameId}`})
                return
            }
            res.status(200).send(topScores.toJSON());
        } catch (e){
            // TODO:- Add error mapper
            console.log(e);
            res.status(500).send({errMsg: "Internal Server Error"});
        }
    }
}

export default GetTopScoresControllerPublic;