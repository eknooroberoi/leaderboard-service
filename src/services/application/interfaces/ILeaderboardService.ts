import {TopScoresDTO} from "../../../models";

export interface ILeaderboardService{
    getTopScores(gameId: string, limit: number, consistentRead: boolean): Promise<TopScoresDTO | null>;
    shutdown(): Promise<void>;
}