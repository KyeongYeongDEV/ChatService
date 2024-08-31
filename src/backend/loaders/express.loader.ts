import { Application, json, urlencoded } from "express";
import router from '../api/index.api';
import errorMiddleware from "../api/middlewares/error.middleware";
import cors from "cors";
import { Server } from "socket.io";
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
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('사용자가 연결되었습니다:', socket.id);

        socket.on('chat message', (msg) => {
            console.log('메시지 수신:', msg);
            io.emit('chat message', msg);
        });

        socket.on('join_room', (room) => {
            socket.join(room);
            console.log(`사용자 ID: ${socket.id}가 방에 참여했습니다: ${room}`);
        });

        socket.on('disconnect', () => {
            console.log('사용자가 연결을 끊었습니다:', socket.id);
        });
    });

    app.use(errorMiddleware);
};
