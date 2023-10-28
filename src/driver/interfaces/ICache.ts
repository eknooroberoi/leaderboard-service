export default interface ICache {
    get(key: string): Promise<any>
    setAsync(key:string, value: any, ttl?: number): void
}