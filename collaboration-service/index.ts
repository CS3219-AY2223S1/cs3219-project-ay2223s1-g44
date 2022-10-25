import * as http from 'http'
import { Server } from 'socket.io'
import * as Automerge from '@automerge/automerge'

const port = 8002
const host = 'localhost'

export type TextDoc = {
    text: Automerge.Text;
};

// Create the http server
const server = http.createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true }))
})

// Create an io instance
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"]
    }
});


const matchIdDocMap = new Map();

io.on('connection', (socket) => {
    // When connected, put both users in the same room
    let matchIdHolder: any, userHolder: any;
    console.log(socket.id + " joined room");
    socket.on('joinRoom', (obj) => {
        const { matchId, user } = obj;
        matchIdHolder = matchId;
        userHolder = user;
        socket.join(matchId);
        if (!matchIdDocMap.has(matchId)) {
            matchIdDocMap.set(matchId, Automerge.change<TextDoc>(Automerge.init(), (doc) => {
                doc.text = new Automerge.Text('');
                return doc.text;
            }));
        }
        const changes = Automerge.getAllChanges(matchIdDocMap.get(matchId));
        socket.emit('joinRoomSuccess', { changes });
    });
    socket.on('updateCode', (changes) => {
        const oldDoc = matchIdDocMap.get(matchIdHolder);
        const [doc] = Automerge.applyChanges(Automerge.clone(oldDoc), changes);
        matchIdDocMap.set(matchIdHolder, doc);
        socket.to(matchIdHolder).emit('updateCodeSuccess', changes);
    });
    // Track set language for both parties
    socket.on('setLanguage', (lang) => {
        socket.to(matchIdHolder).emit('setLanguage', lang);
    });
    //Tracker for chat bot
    socket.on('chatBox', (message) => {
        console.log(message);
        socket.to(matchIdHolder).emit('chatBox', message);
    });
    socket.on('position', (offset) => {
        socket.broadcast.emit('positionSuccess', offset);
    });
    socket.on('disconnect', (reason) => {
        console.log(socket.id + reason);
        const leaveRoomMessage = String(userHolder?.username) + " has left the room";
        io.to(matchIdHolder).emit('chatBox', leaveRoomMessage);
    });
});

// Http server listen
server.listen(port, host, undefined, () => console.log(`Server running on port ${host} ${port}`));
