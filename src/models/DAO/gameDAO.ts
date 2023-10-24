export default class GameDAO{
    public static readonly COLUMN_NAMES: object = {
        id: 'id',
        name: 'name',
    }

    private readonly _id: string;
    private readonly _name: string;

    constructor(gameId: string, gameName: string) {
        this._id = gameId;
        this._name = gameName;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

}