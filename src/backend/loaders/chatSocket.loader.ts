import { Application } from "express";
import { Server } from "socket.io";
import http from 'http';

export default async ({app, server} : { app : Application, server: http.Server }) => {
    try {
        const io = new Server(server, {
            cors : {
                origin : "*", //필요한 도메인으로 설정하거나, 모든 도멘에서 접속을 허용
                methods: ["GET", "POST"]
            }
        });

        app.set("io", io);

        return io;
    } catch (error) {
        console.error('Socket 연결 오류 : ',error); 
        throw error; 
    }
}