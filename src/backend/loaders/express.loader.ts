import { Application, json, urlencoded } from "express";
import router from '../api/index.api';
import errorMiddleware from "../api/middlewares/error.middleware";
import cors from "cors";
import initializeSocket from "./socket.loader";
import path from "path";
import http from "http";

export default async ({ app, server }: { app: Application, server: http.Server }) => {
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

    // Socket.IO 서버와 연결
    const io = initializeSocket({app, server});

    app.use(errorMiddleware);
};
