import { Server } from 'socket.io';
import http from 'http';
import ChatService from '../service/chat.service';
import Container from 'typedi';
import { response } from 'express';

export default function initializeSocket(server : http.Server) {
    const io = new Server(server, {
        cors : {
            origin : "*", //필요한 도메인으로 설정하거나, 모든 도멘에서 접속을 허용
            methods: ["GET", "POST"]
        }
    });

    const chatService = Container.get(ChatService);
    io.on('connection', (socket) => {
        console.log('사용자가 연결되었습니다', socket.id);

        socket.on('chat message', async(data) => {
            try {
                const { cr_id, u_id, sender_name, content } = data;
                console.log("메세지 수신 : ", content);
                const saveMessageResponseDTO = await chatService.saveMessage({ cr_id, u_id, sender_name, content });
                io.to(cr_id).emit('chat message', saveMessageResponseDTO );

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