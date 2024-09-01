import { Server } from 'socket.io';
import http from 'http';

export default function initializeSocket(server : http.Server) {
    const io = new Server(server, {
        cors : {
            origin : "*", //필요한 도메인으로 설정하거나, 모든 도멘에서 접속을 허용
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('사용자가 연결되었습니다', socket.id);

        socket.on('chat message', (msg) => {
            console.log('메시지 수신 : ', msg);
            io.emit('chat message', msg);
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