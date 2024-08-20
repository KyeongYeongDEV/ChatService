import createApp from './app';
import  express, { Application } from 'express';
import  http from 'http';
import  { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();
const  app : Application = express()
const  server = http.createServer(app);
const io = new Server(server);


// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

// io.on('connection', (socket) => {
//     console.log('a user connected');

//     socket.on('chat message', (msg)=>{
//         io.emit('chat message', msg);
//     })

//     socket.on('disconnect', () =>{
//         console.log('user disconnected');
//     });

// });

const PORT = process.env.PORT;
(async function serverStart() {
    const app = await createApp();
    http.createServer(app).listen(8000, () => {
        console.log(`Server started on ${PORT}`);
    });
})();
