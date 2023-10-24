export default class LeaderboardDAO {
    public static readonly COLUMN_NAMES = {
        userId: 'user_id',
        gameId: 'game_id',
        score: 'score',
        updatedAt: 'updated_at',
    }

    private readonly _userId: string;
    private readonly _gameId: string;
    private readonly _score: string;
    private readonly _updatedAt: string;

    constructor(userId: string, gameId: string, score: string, updatedAt: string) {
        this._userId = userId;
        this._gameId = gameId;
        this._score = score;
        this._updatedAt = updatedAt;
    }

    get userId(): string {
        return this._userId;
    }

    get gameId(): string {
        return this._gameId;
    }

    get score(): string {
        return this._score;
    }

    get updatedAt(): string {
        return this._updatedAt;
    }

}