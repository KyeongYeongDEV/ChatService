import createApp from './app';
import  http from 'http';
import {Server} from 'socket.io';
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT;

(async function serverStart() {
    const app = await createApp();
    const server = http.createServer(app);
    const io = new Server(server);

    io.on('connetion', (socket) => {
        console.log('A user connected : ', socket.id);

        socket.on('send_mesage', (data: { room: string | string[]; }) => {
            console.log('Message received : ', data);
            io.to(data.room).emit('receive_message', data);
        });

        socket.on('join_room', (room: any) => {
            socket.join(room);
            console.log(`User with ID : ${socket.id} joined room : ${room}`);
        });

        socket.on('disconnet', () => {
            console.log('User disconnected : ', socket.id);
        });
    });
    

    server.listen(PORT, () => {
        console.log(`Server started on ${PORT}`); 
    });
})();
