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

io.on('connection', socket => {
    // When connected, put both users in the same room
    var matchIdHolder;
    var userHolder;
    //console.log(socket.id + " joined room")

    socket.on('joinRoom', (obj) => {
        const { room, user } = obj;
        console.log(JSON.stringify(user) + " joined room")
        //matchIdHolder = matchId;
        //userHolder = user;
        socket.join(room);
    });

    // Track the code for both side, so when every someone edits, the whole code is sent to
    // the other party.
    socket.on('codeEditor', (obj) => {
        const { data, matchID } = obj
        console.log(`data: ${data} room: ${matchID}`)
        socket.to(matchID).emit('codeEditor', data)
    })

    //Tracker for chat bot
    socket.on('chatBox', (obj) => {
        socket.broadcast.emit('chatBox', obj)
    })

    socket.on('disconnect', (reason) => {
        //console.log(socket.id + reason)
        //var leaveRoomMessage = String(userHolder.username) + " has left the room"
        //socket.broadcast.emit('chatBox', leaveRoomMessage)
    })

})

app.get('/', (req, res) => {
    res.json({ message: "We are at home!" });
});

httpServer.listen(8002, () => console.log('collaboration-service listening on port ' + port));