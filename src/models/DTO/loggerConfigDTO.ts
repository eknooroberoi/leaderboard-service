import { LogLevel } from '../../config/consts';

export default class LoggerConfigDTO {
    private readonly _logLevel: LogLevel;

    constructor(logLevel: LogLevel) {
        this._logLevel = logLevel;
    }

    get logLevel(): LogLevel {
        return this._logLevel;
    }
}
