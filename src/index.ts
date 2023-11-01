import http from 'http';
import closeWithGrace from 'close-with-grace';

import app from './app';
import logger from './utils/logger';
import { container } from './di';
import { ILeaderboardService } from './services';

const PORT: number = 3000;
const GRACEFUL_SHUTDOWN_TIMEOUT_IN_MSECS: number = 10000;

const appServer: http.Server = app.listen(PORT);
logger.info(`leaderboard-service listening on port: ${PORT}`);

async function shutdownServer(): Promise<void> {
    logger.info('app server closed');
    const leaderboardService: ILeaderboardService = container.resolve<ILeaderboardService>('leaderboardImpl')
    await leaderboardService.shutdown()
}
appServer.on('close', async () => {
    await shutdownServer();
});

closeWithGrace(
    { delay: GRACEFUL_SHUTDOWN_TIMEOUT_IN_MSECS },
    async function (): Promise<void> {
        await shutdownServer();
    }
);
