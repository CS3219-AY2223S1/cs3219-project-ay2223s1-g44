const express = require('express')
const app = express()
const { createServer } = require("http");
const { Server } = require("socket.io");
const port = 8001

const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000"]
    }
});

io.on('connection', socket => {
    // When connected, put both users in the same room
    socket.on('joinRoom', (obj) => {
        socket.join(obj.room)
    });

    // Track the code for both side, so when every someone edits, the whole code is sent to
    // the other party.
    socket.on('codeEditor', (obj) => {
        socket.broadcast.emit('codeEditor', obj)
    })

    //Tracker for chat bot
    socket.on('chatBox', (obj) => {
        socket.broadcast.emit('chatBox', obj)
    })

    socket.on('disconnect', (reason) => {
        console.log(reason)
        // To let other user know that the user is disconnected
        socket.broadcast.emit('disconnect', reason)
    })
})

app.get('/', (req, res) => {
    res.json({ message: "We are at home!" });
  });

app.listen(port, () => console.log('collaboration-service listening on port ' + port));