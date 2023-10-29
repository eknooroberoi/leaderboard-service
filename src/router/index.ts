import {Router, Request, Response} from "express";
import swaggerUi from 'swagger-ui-express';
import {container} from "../di";
import {AwilixContainer} from "awilix";
import {publicRouter} from "./v1/public/publicRouter";
import {swaggerSpec} from "./swagger-config";
const containerScope: AwilixContainer = container.createScope();
const router: Router = Router();
router.get('/health', (_req: Request, res: Response) => {
    res.send('Hello World from Livestream Service!!');
});

// Define Swagger UI endpoint
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

router.use('/leaderboard-service/v1/public', publicRouter(containerScope))

router.use((_req: Request, res: Response) => {
    res.sendStatus(404);
});

export {router};