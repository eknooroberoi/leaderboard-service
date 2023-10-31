export default class RequestQueryParamsDTO {
    private readonly _gameId: string;
    private readonly _limit: string;

    constructor(gameId: string, limit: string) {
        this._gameId = gameId;
        this._limit = limit;
    }

    get gameId(): string {
        return this._gameId;
    }

    get limit(): string {
        return this._limit;
    }
}
