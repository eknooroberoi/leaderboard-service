export default class MemcachedConfigDTO {
    private readonly _location: string;
    private readonly _defaultTTL: number;

    constructor(location: string, defaultTTL: number) {
        this._location = location;
        this._defaultTTL = defaultTTL;
    }

    get location(): string {
        return this._location;
    }

    get defaultTTL(): number {
        return this._defaultTTL;
    }
}
