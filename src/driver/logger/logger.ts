import winston, { format, transports } from 'winston';
import { LogLevel } from '../../config/consts';
import { Dictionary } from 'ts-essentials';
import config from '../../config/config';
import assert from 'assert';

const logLevelMap = {
    [LogLevel.DEFAULT]: 'info', // Default log level is info
    [LogLevel.INFO]: 'info',
    [LogLevel.WARNING]: 'warn',
    [LogLevel.DEBUG]: 'debug',
    [LogLevel.ERROR]: 'error',
};

class Logger {
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: 'info', // Set the default log level
            format: format.combine(
                format.timestamp(),
                format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] ${level}: ${message}`;
                })
            ),
            transports: [
                new transports.Console(), // Log to the console
                new transports.File({ filename: 'error.log', level: 'error' }),
                new transports.File({ filename: 'combined.log' }),
            ],
        });
    }

    private logEntry(
        severity: LogLevel,
        message: string,
        payload: Dictionary<any> = {}
    ) {
        assert(config.loggerConfig !== undefined);
        if (severity < config.loggerConfig.logLevel) {
            return;
        }
        payload.datetime = new Date().toISOString();

        this.logger.log({
            level: logLevelMap[severity],
            message: message,
            ...payload,
        });
    }

    info(message: string, payload: Dictionary<any> = {}) {
        this.logEntry(LogLevel.INFO, message, payload);
    }

    debug(message: string, payload: Dictionary<any> = {}) {
        this.logEntry(LogLevel.DEBUG, message, payload);
    }

    warn(message: string, payload: Dictionary<any> = {}) {
        this.logEntry(LogLevel.WARNING, message, payload);
    }

    error(message: string, payload: Dictionary<any> = {}) {
        this.logEntry(LogLevel.ERROR, message, payload);
    }
}

export default new Logger();
