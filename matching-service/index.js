import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import redisClient from './utils/redis-client.js';
import { findMatch } from './controller/redis-controller.js';

import { Server } from "socket.io";

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"]
  }
});

// initialise redis
(async () => {
  redisClient.on('error', (err) => {
    console.log(err);
  });
  redisClient.on('connect', () => {
    console.log('Redis successfully connected!');
  });

  await redisClient.connect();
})();

io.on('connection', (socket) => {
  console.log('client: ' + socket.id)

  socket.on('findMatch', (obj) => {
    const { user, difficulty } = obj;
    findMatch({ socket, user, difficulty });
  })
})

httpServer.listen(8001);