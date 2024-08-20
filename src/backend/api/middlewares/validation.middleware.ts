import { Request, Response, NextFunction } from "express";
import { Next } from "mysql2/typings/mysql/lib/parsers/typeCast";
import { Service } from "typedi";
import { userLoginValidator } from "../validators/user.validator";

@Service()
export class ValidationMiddleware {
    validateUserLogin = async (req : Request, res : Response, next : NextFunction) => {
        const {error, value} = userLoginValidator.validate(req.body);

        if (error) {
            return res.status(400).json({ error : error.details[0].message });
        }

        next();
    };

    validateUserJoin = async (req : Request, res : Response, next : Next) => {
        const {error, value} = userLoginValidator.validate(req.body);

        if (error) {
            return res.status(400).json({ error : error.details[0].message });
        }

        next();
    }
}
