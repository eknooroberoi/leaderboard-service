export default class TopScorersDTO{
    private readonly _userId: string;
    private readonly _userName: string;
    private readonly _score: number;

    get userId(): string {
        return this._userId;
    }

    get userName(): string {
        return this._userName;
    }

    get score(): number {
        return this._score;
    }

    constructor(userId: string, userName: string, score: number) {
        this._userId = userId;
        this._userName = userName;
        this._score = score;
    }
}