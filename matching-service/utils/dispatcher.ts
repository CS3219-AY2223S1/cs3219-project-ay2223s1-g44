import { io } from "../index.js" // TODO: proper import and abstraction

export default function dispatcher(event, socketId, data, matchId, question) {
    io.to(socketId).emit(event, { data, matchId, question });
}
