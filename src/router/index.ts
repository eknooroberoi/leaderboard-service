import {Router, Request, Response} from "express";
import {container} from "../di";
import {AwilixContainer} from "awilix";
import {publicRouter} from "./v1/public/publicRouter";
const containerScope: AwilixContainer = container.createScope();
const router: Router = Router();
router.get('/health', (_req: Request, res: Response) => {
    res.send('Hello World from Livestream Service!!');
});

router.use('/leaderboard-service/v1/public', publicRouter(containerScope))

router.use((_req: Request, res: Response) => {
    res.sendStatus(404);
});

export {router};