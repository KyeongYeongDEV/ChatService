import { NextFunction, Request, Response } from 'express';

export default class Controller {
    protected async handleAsync(fn : (req : Request, res : Response) => Promise<any> , req : Request, res : Response, next : NextFunction) {
        try {
            await fn(req, res);
        } catch (err) {
            next(err);
        }  
    }
}