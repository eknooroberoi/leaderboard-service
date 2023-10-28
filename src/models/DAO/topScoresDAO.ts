import {TopScoresDTO} from "../index";
import Persistable from "./persistable";
import TopScorerDTO from "../DTO/topScorerDTO";

export default class TopScoresDAO extends TopScoresDTO implements Persistable{
    constructor(gameId: string, gameName: string, topScorers: TopScorerDTO[], lastUpdatedAt: number) {
        super(gameId, gameName, topScorers, lastUpdatedAt);
    }
}