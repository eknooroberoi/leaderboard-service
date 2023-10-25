export default class MessageDTO{
    private readonly _gameId: string;
    private readonly _gameName: string;
    private readonly _userId: string;
    private readonly _userName: string;
    private readonly _score: number;
    private readonly _tsMs: string;

    constructor(gameId: string, gameName: string, userId: string, userName: string, score: number, tsMs: string | undefined) {
        this._gameId = gameId;
        this._gameName = gameName;
        this._userId = userId;
        this._userName = userName;
        this._score = score;
        if (tsMs !== undefined) {
            this._tsMs = tsMs;
        } else { // set to currentTime if not defined
            this._tsMs = Date.now().toString();
        }

    }

    get gameId(): string {
        return this._gameId;
    }

    get gameName(): string {
        return this._gameName;
    }

    get userId(): string {
        return this._userId;
    }

    get userName(): string {
        return this._userName;
    }

    get score(): number {
        return this._score;
    }

    get tsMs(): string {
        return this._tsMs;
    }
}