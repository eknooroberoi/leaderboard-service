import http from 'http';
import closeWithGrace from 'close-with-grace';

import app from './app';

const PORT: number = 3000;
const GRACEFUL_SHUTDOWN_TIMEOUT_IN_MSECS: number = 10000;

const appServer: http.Server = app.listen(PORT);
console.log('leaderboard-service listening on port:', PORT);

async function shutdownServer(): Promise<void> {
    // TODO:- Implement shutdown hook
    console.log('app server closed');
}
appServer.on('close', () => {
    shutdownServer().catch(() => console.log('Failed to shutdown gracefully'));
});

closeWithGrace(
    { delay: GRACEFUL_SHUTDOWN_TIMEOUT_IN_MSECS },
    async function ({ err }) {
        if (err) {
            console.error(err);
        }
        await shutdownServer();
    }
);
