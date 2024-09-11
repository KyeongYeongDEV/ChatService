import { Server } from 'socket.io';
import http from 'http';
import ChatService from '../service/chat.service';
import Container from 'typedi';
import { Application } from 'express';
import JwtService from '../service/jwt.service';

export default function initializeSocket({ app, server } : { app : Application, server : http.Server }) {
    const io = new Server(server, {
        cors : {
            origin : "*", //필요한 도메인으로 설정하거나, 모든 도멘에서 접속을 허용
            methods: ["GET", "POST"]
        }
    });

    app.set("io", io);

    const chatService = Container.get(ChatService);
    const jwtService = Container.get(JwtService);
    
    io.on('connection', (socket) => {
        console.log('사용자가 연결되었습니다', socket.id);

        socket.on('chat message', async(data) => {
            try {
                const { token, cr_id, content } = data;
                console.log("메세지 수신 : ", content);

                const decodedToken = jwtService.decodedToken(token);
                if(decodedToken !== null){
                    const [u_id, sender_name] = decodedToken;
                    socket.to(cr_id).emit('authenticated', {u_id})

                    const saveMessageResponseDTO = await chatService.saveMessage({ cr_id, u_id, sender_name, content, io });
                }
            } catch (error) {
                console.log("메세지 저장 중 오류 발생 : ", error);
            }
        });

        socket.on('join_room', (room) => {
            socket.join(room);
            console.log(`사용자 ID : ${socket.id}가 방에 참여했습니다 : ${room}`);
        });

        socket.on('disconnect', () =>{
            console.log('사용자가 연결을 끊었습니다 : ', socket.id);
        });
    });

    return io;
}