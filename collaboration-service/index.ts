import cors from 'cors';
import express, { urlencoded } from "express";
import http_server from "http";
import { Server, Socket } from "socket.io";
import * as Automerge from "@automerge/automerge";
import {v4 as uuidv4} from "uuid";
import { roomHandler } from "./room/index";

const port = 8002;
const host = "localhost";

//video chat
const app = express();
app.use(
  cors({
      credentials: true,
      origin: [
          // Local development: 3000
          /^http:\/\/localhost:3000/,
      ],
  })
);

// Create the http server
const server = http_server.createServer(app);

// Create an io instance
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

type TextDoc = {
  text: Automerge.Text,
};

type User = {
  id: string,
  username: string,
};

type MatchData = {
  matchId: string,
  user: User,
  videoRoomId: string
}

type Chat = {
  id: string,
  username?: string,
  content: string,
}

// video
const rooms: Record<string, string[]> = {};

interface IRoomParams {
    videoRoomId: string;
    peerId: string;
}

interface IJoinRoomParams extends IRoomParams {
    userName: string;
}

const matchIdDocMap = new Map<string, Automerge.Doc<TextDoc>>();
const matchIdChatMap = new Map<string, Chat[]>(); // TODO: combine with matchIdDocMap ?
const socketIdMatchDataMap = new Map<string, MatchData>();

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("joinRoom", (obj) => {
    const { matchId, user } = obj;
    const videoRoomId =  matchId + 'video-room';
    socketIdMatchDataMap.set(socket.id, {matchId, user, videoRoomId});
    if (!rooms[videoRoomId]) {
      rooms[videoRoomId] = [];
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
    const changes = Automerge.getAllChanges(matchIdDocMap.get(matchId)!);

    if (!matchIdChatMap.has(matchId)) {
      matchIdChatMap.set(
        matchId,
        []
      );
    }
    const chats = matchIdChatMap.get(matchId)!;
    const serverChat: Chat = {
      id: uuidv4(),
      content: `${user.username} has joined the room.`
    }
    const newSavedChats = [...chats, serverChat]
    matchIdChatMap.set( matchId, newSavedChats);
    
    socket.emit("joinRoomSuccess", { changes, socketId: socket.id });
    io.to(matchId).emit("sendChatSuccess", newSavedChats);
  });

  socket.on("updateCode", (changes) => {
    const { matchId } = socketIdMatchDataMap.get(socket.id)!;
    const oldDoc = matchIdDocMap.get(matchId)!;
    const [doc] = Automerge.applyChanges(Automerge.clone(oldDoc), changes);

    matchIdDocMap.set(matchId, doc);
    socket.to(matchId).emit("updateCodeSuccess", changes);
  });

  socket.on("setLanguage", (lang) => {
    const { matchId } = socketIdMatchDataMap.get(socket.id)!;
    socket.to(matchId).emit("setLanguageSuccess", lang);
  });

  socket.on("sendChat", (newChat) => {
    const { matchId } = socketIdMatchDataMap.get(socket.id)!;

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

  // Ref: https://www.youtube.com/watch?v=IkNaQZG2Now
  const joinVideoRoom = ({ videoRoomId, peerId }: IRoomParams) => {
    console.log("user joined the room", videoRoomId, peerId);
    rooms[videoRoomId].push(peerId);
    socket.join(videoRoomId);
    socket.to(videoRoomId).emit("user-joined-video", { peerId });
    console.log(rooms[videoRoomId]);
  };

  // Ref: https://www.youtube.com/watch?v=IkNaQZG2Now
  socket.on("join-video-room", ({ peerId }: IJoinRoomParams) => {
    const { videoRoomId } = socketIdMatchDataMap.get(socket.id)!;
    joinVideoRoom({videoRoomId, peerId});

    socket.on("disconnect", (reason) => {
      console.log(peerId);
      console.log("user left the room", peerId);
      rooms[videoRoomId] = rooms[videoRoomId]?.filter((id) => id !== peerId);
      socket.to(videoRoomId).emit("userDisconnectedFromVideo", peerId);
      socket.disconnect();
    });
  });

  // Ref: https://www.youtube.com/watch?v=IkNaQZG2Now
  socket.on("disconnectFromVideo", (obj) => {
    const { videoRoomId } = socketIdMatchDataMap.get(socket.id)!;
    const { peerId } = obj
    console.log("user left the room", peerId);
    rooms[videoRoomId] = rooms[videoRoomId]?.filter((id) => id !== peerId);

    socket.leave(videoRoomId);
    socket.to(videoRoomId).emit("userDisconnectedFromVideo", peerId);
  });

  socket.on("disconnect", (reason) => {
    console.log(`${socket.id} ${reason}`)

    if (!socketIdMatchDataMap.get(socket.id)) {
      return;
    }
    const { matchId, user } = socketIdMatchDataMap.get(socket.id)!;
    const chats = matchIdChatMap.get(matchId)!;
    const serverChat: Chat = {
      id: uuidv4(),
      content: `${user.username} has left the room.`
    }
    const newSavedChats = [...chats, serverChat]
    matchIdChatMap.set( matchId, newSavedChats);
    io.to(matchId).emit("sendChatSuccess", newSavedChats);

    // delete socketid  from map
    socketIdMatchDataMap.delete(socket.id);
  });
});

// Http server listen
server.listen(port, host, undefined, () =>
  console.log(`Server running on port ${host} ${port}`)
);
