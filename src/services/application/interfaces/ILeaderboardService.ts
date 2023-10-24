export interface ILeaderboardService{
    getTopScores(gameId: string, limit: number): Promise<any>;
    shutdown(): Promise<void>;
}