export default class UserDAO{
    public static readonly COLUMN_NAMES: object = {
        id: 'id',
        name: 'name',
    }

    private readonly _id: string;
    private readonly _name: string;

    constructor(userId: string, userName: string) {
        this._id = userId;
        this._name = userName;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }
}