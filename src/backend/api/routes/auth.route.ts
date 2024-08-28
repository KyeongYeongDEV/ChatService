import { Router } from "express";
import Container from "typedi";
import AuthController from "../controllers/auth.controller";
import { ValidationMiddleware } from "../middlewares/validation.middleware";

export default ({ app } : {app : Router}) => {
    const route = Router();
    app.use('/auth', route);

    route.post('/login', Container.get(ValidationMiddleware).validateUserLogin, Container.get(AuthController).login.bind(AuthController));
    route.post('/join', /*Container.get(ValidationMiddleware).validateUserJoin,*/ Container.get(AuthController).join.bind(AuthController));
}