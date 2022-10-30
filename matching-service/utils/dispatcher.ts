import { io } from "../index.js" // TODO: proper import and abstraction

export default function dispatcher(event: any, socketId: any, data: any, matchId: any, question: any) {
    io.to(socketId).emit(event, { data, matchId, question });
}
