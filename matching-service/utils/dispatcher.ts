import { io } from "../index" // TODO: proper import and abstraction
import { Question } from "../types";

export default function dispatcher(event: string, socketId: string, data: any, matchId: string, question: Question) {
    io.to(socketId).emit(event, { data, matchId, question });
}
