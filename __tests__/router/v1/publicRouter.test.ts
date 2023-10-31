import request from 'supertest';
import express, { Request, Response } from 'express';
import { createContainer, asClass } from 'awilix';
import { IController } from '../../../src/controllers';
import { publicRouter } from '../../../src/router/v1/public/publicRouter';

class MockController implements IController {
    async handleRequest(_: Request, res: Response): Promise<void> {
        res.send('Hello, World!');
    }
}

describe('publicRouter', () => {
    it('should handle GET /top-scores', async () => {
        const container = createContainer();
        container.register({
            getTopScoresControllerPublic: asClass(MockController).singleton(),
        });

        const app = express();
        app.use(publicRouter(container));

        const response = await request(app).get('/top-scores');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello, World!');
    });
});
