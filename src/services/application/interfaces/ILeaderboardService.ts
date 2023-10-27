import {TopScoresDTO} from "../../../models";

export interface ILeaderboardService{
    getTopScores(gameId: string, limit: number): Promise<TopScoresDTO | null>;
    shutdown(): Promise<void>;
}