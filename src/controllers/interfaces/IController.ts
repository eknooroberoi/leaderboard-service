import { Request, Response } from 'express';

export interface IController {
    handleRequest(req: Request, res: Response): Promise<void>;
}
