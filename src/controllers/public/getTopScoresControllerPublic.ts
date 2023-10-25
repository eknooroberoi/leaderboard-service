import {Request, Response} from "express";
import {ILeaderboardService} from "../../services";

class GetTopScoresControllerPublic {
    leaderboardService: ILeaderboardService;

    constructor(leaderboardService: ILeaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    async handleRequest(req: Request, res: Response){
        try{
            const gameId: string = req.params.gameId;
            const limit: number = parseInt(req.params.limit);
            const topScores = await this.leaderboardService.getTopScores(gameId, limit);
            res.status(200).send(topScores);
        } catch (e){
            // TODO:- Add error mapper
            res.status(500).send({errMsg: "Internal Server Error"});
        }
    }
}

export default GetTopScoresControllerPublic;