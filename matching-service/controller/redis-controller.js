import redisClient from "../utils/redis-client.js"
import dispatcher from "../utils/dispatcher.js";
import { v4 as uuidV4 } from "uuid"

async function createMatch({ user, socketId, difficulty }) {
  const matchId = `match_${difficulty}_${uuidV4()}`;
  await redisClient
    .hSet(matchId, 'playerOne', JSON.stringify({ user, socketId }))
    .catch((err) => {
      // TODO: dispatch error
      console.error(err);
    });
  redisClient.expire(matchId, 5);
}

async function joinMatch({ matchId, user, socketId }) {
  await redisClient
    .hSet(matchId, 'playerTwo', JSON.stringify({ user, socketId }))
    .catch((err) => {
      // TODO: dispatch error
      console.error(err);
    });
  redisClient.expire(matchId, 60 * 60 * 24);
}

export async function findMatch({ socket, user, difficulty }) {
  const matches = await redisClient.keys(`match_${difficulty}_*`);
  const promises = [];

  if (matches.length === 0) {
    createMatch({ user, socketId: socket.id, difficulty });
    return;
  }

  matches.forEach(matchId => {
    const promise = redisClient.hGetAll(matchId)
      .then((players) => {
        const { playerOne, playerTwo } = players;
        const parsedPlayerOne = JSON.parse(playerOne);
        const isMatchCreatedByClient = parsedPlayerOne.user.id === user.id;
        const isMatchFull = Boolean(playerTwo);

        if (!isMatchFull && !isMatchCreatedByClient) {
          return { matchId, playerOne: parsedPlayerOne, playerTwo: { user, socketId: socket.id } };
        }
      })
    promises.push(promise);
  })

  Promise.race(promises)
    .then((data) => {
      if (data) {
        const { matchId, playerOne, playerTwo } = data;
        joinMatch({ matchId, user, socketId: socket.id });

        dispatcher('playerFound', playerOne.socketId, playerTwo.user);
        dispatcher('playerFound', playerTwo.socketId, playerOne.user);
      } else {
        createMatch({ user, socketId: socket.id, difficulty });
      }
    })
    .catch((err) => {
      // TODO: dispatch error
      console.error(err);
    })
}
