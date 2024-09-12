import { Application } from "express";
import { Server, ServerOptions, Socket } from "socket.io";
import http from 'http';
import Container, { Inject, Service } from "typedi";
import ChatService from "../service/chat.service";
import JwtService from "../service/jwt.service";

const chatService = Container.get(ChatService);
const jwtService = Container.get(JwtService);

@Service()
export default class ChatSocket {
    constructor(
        @Inject( () => ChatService ) private readonly chatService : ChatService,
        @Inject( () => JwtService ) private readonly jwtService : JwtService,
    ) {}

    async initializeSocket({ app, server } : { app : Application, server : http.Server }) {
        const io = Container.get<Server>("io");

        app.set("io", io);

        io.on("connection", (socket: Socket) => {
            console.log(`User connected: ${socket.id}`);
    
            socket.on("join_room", (room) => {
                socket.join(room);
                console.log(`User ${socket.id} joined room: ${room}`);
            });
    
            socket.on("chat message", async (data) => {
                try {
                    const { token, cr_id, content } = data;
                    const decodedToken = jwtService.decodedToken(token);
                    if (decodedToken !== null) {
                        const [ u_id, sender_name ] = decodedToken;
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

        return io;
    }
}