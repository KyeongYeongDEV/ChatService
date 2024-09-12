import { Application } from "express";
import { Server, Socket } from "socket.io";
import http from 'http';
import Container from "typedi";
import JwtService from "../service/jwt.service";
import ChatService from "../service/chat.service";

export default async ({app, server} : { app : Application, server: http.Server }) => {
    try {
        const io = new Server(server, {
            cors : {
                origin : "*", //필요한 도메인으로 설정하거나, 모든 도멘에서 접속을 허용
                methods: ["GET", "POST"]
            }
        });

        app.set("io", io);
        
        io.on("connection", (socket: Socket) => {
            console.log(`User connected: ${socket.id}`);
    
            socket.on("join_room", (room) => {
                socket.join(room);
                console.log(`User ${socket.id} joined room: ${room}`);
            });
    
            socket.on("chat message", async (data) => {
                try {
                    const jwtService = Container.get(JwtService);
                    const chatService = Container.get(ChatService);
                    
                    const { token, cr_id, u_id, content } = data;
                    const decodedToken = jwtService.decodedToken(token);
                    io.to(cr_id).emit("authenticated", u_id);
                    
                    console.log("message user :",u_id);
                    
                    if (decodedToken !== null) {
                        const [ u_id, sender_name ] = decodedToken;
                        console.log("login user :",u_id);
                        await chatService.saveMessage({ cr_id, u_id, sender_name, content, io });
                        
                        io.to(cr_id).emit("chat message", { u_id, sender_name, content });
                    }
                } catch (err) {
                    console.error("Error handling chat message:", err);
                }
            });
    
            socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
            });
        });  
        
    } catch (error) {
        console.error('Socket 연결 오류 : ',error); 
        throw error; 
    }
}