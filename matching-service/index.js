import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

import { createMatch, getMatches, timeOutMatch } from './controller/match-controller.js';
import { Server } from "socket.io";

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

app.get('/', getMatches);

const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000"]
    }
});

io.on('connection', socket => {
    console.log(socket.id)
    socket.on('createMatch', (obj) => {
        createMatch(obj.username, obj.difficulty, socket.id).then(
            res => {
                if (res.status == 201) {
                    console.log(res)
                    if (res.obj.status == "IN-PROGRESS") {
                        io.to(res.obj.userOneSocketId).emit("matched");
                        io.to(res.obj.userTwoSocketId).emit("matched");
                    }
                }
            }
        ).catch(e => console.log(e))
    });
    socket.on('timeOut', (obj) => {
        timeOutMatch(obj.username, obj.difficulty, socket.id);
    });
    socket.on('disconnect', (reason) =>
        console.log(reason)
    )
})

httpServer.listen(8001);