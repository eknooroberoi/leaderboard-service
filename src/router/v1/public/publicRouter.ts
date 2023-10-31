import { AwilixContainer } from 'awilix';
import { Router, Request, Response } from 'express';
import { IController } from '../../../controllers';

function publicRouter(container: AwilixContainer): Router {
    const router: Router = Router();

    router.get('/top-scores', async (req: Request, res: Response) => {
        await container
            .resolve<IController>('getTopScoresControllerPublic')
            .handleRequest(req, res);
    });

    return router;
}

export { publicRouter };
