import TopScorersDTO from "./topScorersDTO";

export default class TopScoresDTO{
    private readonly _gameId: string;
    private readonly _gameName: string;
    private readonly _topScorers: TopScorersDTO[];
    private readonly _lastUpdatedAt: number;

    get gameId(): string {
        return this._gameId;
    }

    get gameName(): string {
        return this._gameName;
    }

    get topScorers(): TopScorersDTO[] {
        return this._topScorers;
    }

    get lastUpdatedAt(): number {
        return this._lastUpdatedAt;
    }

    constructor(gameId: string, gameName: string, topScorers: TopScorersDTO[], lastUpdatedAt: number) {
        this._gameId = gameId;
        this._gameName = gameName;
        this._topScorers = topScorers;
        this._lastUpdatedAt = lastUpdatedAt;
    }
}