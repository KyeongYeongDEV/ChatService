import { Request, Response, NextFunction } from "express";

export default (err : Error, req : Request, res : Response, next : NextFunction) => {
    console.error(err.stack);

    res.status(500).json({
        message : "Interal Server Error",
        error : err.message,
    });
}