import  express from 'express';
import  http from 'http';
import  { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();
const  app = express()
const  server = http.createServer(app);
const io = new Server(server);



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});



io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chat message', (msg)=>{
        io.emit('chat message', msg);
    })

    socket.on('disconnect', () =>{
        console.log('user disconnected');
    });

});

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});