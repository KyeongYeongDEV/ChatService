import { Application, json, urlencoded } from "express";

import router from '../api/index.api';
import errorMiddleware from "../api/middlewares/error.middleware";
import PassportConfig from "../configs/passport.config";

import cors from "cors";
import path from "path";
import http from "http";
import Container from "typedi";
import passport from "passport";
import ChatService from "../service/chat.service";
import ChatSocket from "../sockets/chat.socket";

export default async ({ app }: { app: Application }) => {
    app.use(cors((req, callback) => {
        console.log(`CORS enabled for: ${req.method} ${req.url}`);
        callback(null, { origin: true });
    }));
    app.use(json());
    app.use(urlencoded({ extended: false }));
    app.use('/api', router());

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../index.html'));
    });

    const passportConfig = Container.get(PassportConfig);
    passportConfig.initialize();
    
    app.use(passport.initialize());

    app.use(errorMiddleware);
};
