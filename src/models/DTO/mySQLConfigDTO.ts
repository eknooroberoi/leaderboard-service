export default class MySQLConfigDTO {
    private readonly _host: string;
    private readonly _port: number;
    private readonly _userName: string;
    private readonly _password: string;
    private readonly _database: string;

    constructor(
        host: string,
        port: number,
        userName: string,
        password: string,
        database: string
    ) {
        this._host = host;
        this._port = port;
        this._userName = userName;
        this._password = password;
        this._database = database;
    }

    get host(): string {
        return this._host;
    }

    get port(): number {
        return this._port;
    }

    get userName(): string {
        return this._userName;
    }

    get password(): string {
        return this._password;
    }

    get database(): string {
        return this._database;
    }
}
