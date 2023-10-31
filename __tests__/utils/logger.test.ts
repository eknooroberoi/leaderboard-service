import Logger from '../../src/utils/logger';

describe('Logger', () => {
    it('should log an info message', () => {
        const spy = jest.spyOn(Logger['logger'], 'log');
        Logger.info('This is an info message');
        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
                level: 'info',
                message: 'This is an info message',
                datetime: expect.any(String),
            })
        );
        spy.mockRestore();
    });

    it('should log a debug message', () => {
        const spy = jest.spyOn(Logger['logger'], 'log');
        Logger.debug('This is a debug message');
        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
                level: 'debug',
                message: 'This is a debug message',
                datetime: expect.any(String),
            })
        );
        spy.mockRestore();
    });

    it('should log a warning message', () => {
        const spy = jest.spyOn(Logger['logger'], 'log');
        Logger.warn('This is a warning message');
        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
                level: 'warn',
                message: 'This is a warning message',
                datetime: expect.any(String),
            })
        );
        spy.mockRestore();
    });

    it('should log an error message', () => {
        const spy = jest.spyOn(Logger['logger'], 'log');
        Logger.error('This is an error message');
        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
                level: 'error',
                message: 'This is an error message',
                datetime: expect.any(String),
            })
        );
        spy.mockRestore();
    });
});
