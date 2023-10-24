export interface ILeaderboard{
    getTopScores(gameId: string, limit: number): Promise<any>;
    shutdown(): Promise<void>;
}