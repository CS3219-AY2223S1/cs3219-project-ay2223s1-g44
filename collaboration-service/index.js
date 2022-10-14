import cors from 'cors';
import express from 'express';
import { createServer } from "http";
import { Server } from "socket.io";

const app = express()
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
const port = 8002

const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000"]
    }
});

io.on('connection', (socket) => {
    // When connected, put both users in the same room
    let matchIdHolder;
    let userHolder;
    console.log(socket.id + " joined room")

    socket.on('joinRoom', (obj) => {
        const { matchId, user } = obj;
        matchIdHolder = matchId;
        userHolder = user;
        socket.join(matchId);
    });

    // Track the code for both side, so when every someone edits, the whole code is sent to
    // the other party.
    socket.on('codeEditor', (code) => {
        socket.timeout(30).to(matchIdHolder).emit('codeEditor', code);
    })

    // Track set language for both parties
    socket.on('setLanguage', (lang) => {
        socket.to(matchIdHolder).emit('setLanguage', lang)
    })

    //Tracker for chat bot
    socket.on('chatBox', (message) => {
        console.log(socket.id)
        socket.to(matchIdHolder).emit('chatBox', message)
    })

    socket.on('disconnect', (reason) => {
        console.log(socket.id + reason)
        const leaveRoomMessage = String(userHolder?.username) + " has left the room"
        io.to(matchIdHolder).emit('chatBox', leaveRoomMessage)
    })
})

app.get('/', (req, res) => {
    res.json({ message: "We are at home!" });
});

httpServer.listen(8002, () => console.log('collaboration-service listening on port ' + port));