import * as http from "http";
import { Server } from "socket.io";
import * as Automerge from "@automerge/automerge";
import {v4 as uuidv4} from "uuid";
import { Chat, MatchData, TextDoc, User } from "./types";

const port = 8002;
const host = "localhost";

// Create the http server
const server = http.createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true }));
});

// Create an io instance
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

const matchIdDocMap = new Map<string, Automerge.Doc<TextDoc>>();
const matchIdChatMap = new Map<string, Chat[]>(); // TODO: combine with matchIdDocMap ?
const matchIdSocketIdMap = new Map<string, string[]>();
const socketIdMatchDataMap = new Map<string, MatchData>();

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("joinRoom", (obj) => {
    const { matchId, user } = obj;
    socketIdMatchDataMap.set(socket.id, {matchId, user});
    if (!matchId) {
      console.error(socket.id, matchId, 'Invalid matchId');
      return;
    }
    socket.join(matchId);

    // initialise match document
    if (!matchIdDocMap.has(matchId)) {
      matchIdDocMap.set(
        matchId,
        Automerge.change<TextDoc>(
          Automerge.init(),
          (doc) => {
            doc.text = new Automerge.Text('');
            return doc.text;
          })
      );
    }
    const doc = matchIdDocMap.get(matchId);
    if (!doc) {
      console.error('Document does not exist.')
      return;
    }
    const changes = Automerge.getAllChanges(doc);

    if (!matchIdChatMap.has(matchId)) {
      matchIdChatMap.set(matchId, []);
    }
    const chats = matchIdChatMap.get(matchId)!;
    const serverChat: Chat = {
      id: uuidv4(),
      content: `${user.username} has joined the room.`
    }
    const newSavedChats = [...chats, serverChat]
    matchIdChatMap.set( matchId, newSavedChats);

    let partnerSocketId = ''
    if (!matchIdSocketIdMap.has(matchId)) {
      matchIdSocketIdMap.set(matchId, [socket.id]);
    } else {
      const socketIdArr = matchIdSocketIdMap.get(matchId);
      partnerSocketId = socketIdArr?.[0]!;
      socketIdArr?.push(socket.id);
    }
    
    socket.emit("joinRoomSuccess", { changes, savedChats: newSavedChats, partnerSocketId });
    socket.to(matchId).emit("sendChatSuccess", newSavedChats);
  });

  socket.on("updateCode", (changes) => {
    const matchData = socketIdMatchDataMap.get(socket.id);
    if (!matchData) {
      console.error('Match data does not exist.');
      return;
    }
    const { matchId } = matchData!;
    const oldDoc = matchIdDocMap.get(matchId)!;
    const [doc] = Automerge.applyChanges(Automerge.clone(oldDoc), changes);

    matchIdDocMap.set(matchId, doc);
    socket.to(matchId).emit("updateCodeSuccess", changes);
  });

  socket.on("setLanguage", (lang) => {
    const matchData = socketIdMatchDataMap.get(socket.id);
    if (!matchData) {
      console.error('Match data does not exist.');
      return;
    }
    const { matchId } = matchData!;
    socket.to(matchId).emit("setLanguageSuccess", lang);
  });

  socket.on("sendChat", (newChat) => {
    const matchData = socketIdMatchDataMap.get(socket.id);
    if (!matchData) {
      console.error('Match data does not exist.');
      return;
    }
    const { matchId } = matchData!;

    const chats = matchIdChatMap.get(matchId)!;
    const {username, content} = newChat;
    const newChatWithId: Chat = {
      id: uuidv4(),
      username,
      content
    }
    const newSavedChats = [...chats, newChatWithId]
    matchIdChatMap.set( matchId, newSavedChats);
    io.to(matchId).emit("sendChatSuccess", newSavedChats);
  });

  socket.on('sendSignal', obj => {
    const { partner, callerId, signal } = obj;
    io.to(partner)
      .emit('sendSignalSuccess', { callerId, signal })
  })

  socket.on('returnSignal', obj => {
    const { callerId, signal } = obj;
    io.to(callerId)
      .emit('returnSignalSuccess', { signal })
  })

  socket.on("leaveMatch", ({matchId}) => {
    if (!matchId) {
      console.error('Match ID does not exist.');
      return;
    }
    matchIdDocMap.delete(matchId);
    matchIdChatMap.delete(matchId);
    io.to(matchId).emit("leaveMatchSuccess");
  });

  socket.on("disconnect", (reason) => {
    console.log(`${socket.id} ${reason}`);

    if (!socketIdMatchDataMap.get(socket.id)) {
      return;
    }
    const { matchId, user } = socketIdMatchDataMap.get(socket.id)!;

    const socketIds = matchIdSocketIdMap.get(matchId);
    if (socketIds) {
      const filteredSocketIds = socketIds.filter(id => id !== socket.id)
      matchIdSocketIdMap.set(matchId, filteredSocketIds);
    }
    socket.to(matchId).emit('partnerDisconnect');

    const chats = matchIdChatMap.get(matchId) || [];
    const serverChat: Chat = {
      id: uuidv4(),
      content: `${user.username} has left the room.`
    }
    const newSavedChats = [...chats, serverChat]
    matchIdChatMap.set( matchId, newSavedChats);
    io.to(matchId).emit("sendChatSuccess", newSavedChats);
  });
});

// Http server listen
server.listen(port, host, undefined, () =>
  console.log(`Server running on port ${host} ${port}`)
);