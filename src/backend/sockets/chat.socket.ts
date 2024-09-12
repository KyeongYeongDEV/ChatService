import { Server, Socket } from "socket.io";
import { Inject, Service } from "typedi";
import ChatService from "../service/chat.service";
import JwtService from "../service/jwt.service";


@Service()
export default class ChatSocket {
    constructor(
        @Inject( () => ChatService ) private readonly chatService : ChatService,
        @Inject( () => JwtService ) private readonly jwtService : JwtService,
    ) {}
        //{ app, server } : { app : Application, server : http.Server }
    async initializeSocket(io : Server) {
        io.on("connection", (socket: Socket) => {
            console.log(`User connected: ${socket.id}`);
    
            socket.on("join_room", (room) => {
                socket.join(room);
                console.log(`User ${socket.id} joined room: ${room}`);
            });
    
            socket.on("chat message", async (data) => {
                try {
                    const { token, cr_id, content } = data;
                    const decodedToken = this.jwtService.decodedToken(token);
                    if (decodedToken !== null) {
                        const [ u_id, sender_name ] = decodedToken;
                        await this.chatService.saveMessage({ cr_id, u_id, sender_name, content, io });
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