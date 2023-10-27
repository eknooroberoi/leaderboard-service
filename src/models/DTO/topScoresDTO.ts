import TopScorerDTO from "./topScorerDTO";
import {Serializable} from "./Serilizable";

export default class TopScoresDTO extends Serializable{
    private readonly _gameId: string;
    private readonly _gameName: string;
    private readonly _topScorers: TopScorerDTO[];
    private readonly _lastUpdatedAt: number;

    get gameId(): string {
        return this._gameId;
    }

    get gameName(): string {
        return this._gameName;
    }

    get topScorers(): TopScorerDTO[] {
        return this._topScorers;
    }

    get lastUpdatedAt(): number {
        return this._lastUpdatedAt;
    }

    constructor(gameId: string, gameName: string, topScorers: TopScorerDTO[], lastUpdatedAt: number) {
        super();
        this._gameId = gameId;
        this._gameName = gameName;
        this._topScorers = topScorers;
        this._lastUpdatedAt = lastUpdatedAt;
    }
}