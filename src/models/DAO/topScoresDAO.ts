import { TopScoresDTO } from '../index';
import Persistable from './persistable';
import TopScorerDTO from '../DTO/topScorerDTO';
import { Serializable } from '../DTO/Serilizable';

export default class TopScoresDAO
    extends TopScoresDTO
    implements Persistable, Serializable
{
    constructor(
        gameId: string,
        gameName: string,
        topScorers: TopScorerDTO[],
        lastUpdatedAt: number
    ) {
        super(gameId, gameName, topScorers, lastUpdatedAt);
    }
}
