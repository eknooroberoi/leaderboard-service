import http from 'http';
import closeWithGrace from 'close-with-grace';

import app from './app';
import logger from './utils/logger';

const PORT: number = 3000;
const GRACEFUL_SHUTDOWN_TIMEOUT_IN_MSECS: number = 10000;

const appServer: http.Server = app.listen(PORT);
logger.info(`leaderboard-service listening on port: ${PORT}`);

async function shutdownServer(): Promise<void> {
    // TODO:- Implement shutdown hook
    logger.info('app server closed');
}
appServer.on('close', () => {
    shutdownServer().catch(() => logger.error('Failed to shutdown gracefully'));
});

closeWithGrace(
    { delay: GRACEFUL_SHUTDOWN_TIMEOUT_IN_MSECS },
    async function ({ err }): Promise<void> {
        if (err) {
            logger.error(
                `error occurred while shutting down gracefully: ${err.message}`
            );
        }
        await shutdownServer();
    }
);
