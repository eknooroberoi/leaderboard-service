import TopScoresDAO from "../../models/DAO/topScoresDAO";

export default interface ICacheRepo{
    get(key: string): Promise<TopScoresDAO | null>
    setAsync(key:string, value: TopScoresDAO, ttl?: number): void
}