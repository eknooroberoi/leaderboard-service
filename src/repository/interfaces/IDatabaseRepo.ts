import {GameDAO, TopScorerDAO} from "../../models";
import Persistable from "../../models/DAO/persistable";

export default interface IDatabaseRepo{
    saveEntity(entity: Persistable): Promise<void>
    saveOrUpdateEntity<T extends Persistable>(entity: T, entityClazz: { new (): T; }, overwrite: string[], conflictTarget: string[]): Promise<void>
    getGameData(gameId: string): Promise<GameDAO | null>
    getTopScorersData(gameId: string, limit: number): Promise<TopScorerDAO[] | null>
    shutdown(): Promise<void>
}