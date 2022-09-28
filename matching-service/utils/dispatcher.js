import { io } from "../index.js" // TODO: proper import and abstraction

export default function dispatcher(event, socketId) {
    io.to(socketId).emit(event);
}
