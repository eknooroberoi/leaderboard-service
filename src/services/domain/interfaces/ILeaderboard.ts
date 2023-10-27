import {TopScoresDTO} from "../../../models";

export interface ILeaderboard{
    getTopScores(gameId: string, limit: number): Promise<TopScoresDTO | null>;
    shutdown(): Promise<void>;
}