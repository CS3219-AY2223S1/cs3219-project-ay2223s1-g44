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
    socket.on('createMatch', (param, socket) => {
        const match = createMatch(param.username, param.difficulty, socket.id);
        if (match.status === "IN-PROGRESS") {
            const userOneSocket = match.userOneSocketId;
            const userTwoSocket = match.userTwoSocketId;

            socket.to(userOneSocket).emit('matched');
            socket.to(userTwoSocket).emit('matched');
        }
    });
    socket.on('timeOut', (username, socket) => {
        timeOutMatch(username, socket.id);
    });
})



httpServer.listen(8001);