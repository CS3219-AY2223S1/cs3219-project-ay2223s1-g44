import redisClient from "../utils/redis-client.js";
import dispatcher from "../utils/dispatcher.js";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import { v4 as uuidV4 } from "uuid";
import { ormCreateMatch } from '../model/match-orm.js';
import { getRandomQuestion } from "../utils/getQuestion.js";

export async function cancelPendingMatches({
  socket
}: any) {
  const matches = await redisClient.keys(`match_*`);
  const findMatchIdPromises: any = [];

  matches.forEach(matchId => {
    const promise = redisClient.hGetAll(matchId)
      .then((players) => {
        const { playerOne, playerTwo } = players;
        const parsedPlayerOne = JSON.parse(playerOne);
        if (parsedPlayerOne.socketId === socket.id && !playerTwo) {
          return redisClient.del(matchId);
        }
      })
    findMatchIdPromises.push(promise);
  })

  Promise
    .all(findMatchIdPromises)
    .then((deleteMatchIdPromises) => {
      Promise.all(deleteMatchIdPromises);
    })
    .catch((err) => {
      // TODO: dispatch error
      console.error(err);
    })
}

async function createMatch({
  user,
  socketId,
  difficulty
}: any) {
  const matchId = `match_${difficulty}_${uuidV4()}`;
  await redisClient
    .hSet(matchId, 'playerOne', JSON.stringify({ user, socketId }))
    .catch((err) => {
      // TODO: dispatch error
      console.error(err);
    });
  setTimeout(async () => {
    await redisClient
      .hGetAll(matchId)
      .then(async (players) => {
        const { playerTwo } = players;
        const isMatchFull = Boolean(playerTwo);

        if (!isMatchFull) {
          // @ts-expect-error TS(2554): Expected 5 arguments, but got 2.
          dispatcher('timeOut', socketId);
          await redisClient.del(matchId);
        }
      })
  }, 5000);
}

async function joinMatch({
  matchId,
  user,
  socketId
}: any) {
  await redisClient
    .hSet(matchId, 'playerTwo', JSON.stringify({ user, socketId }))
    .catch((err) => {
      // TODO: dispatch error
      console.error(err);
    });
}

export async function findMatch({
  socket,
  user,
  difficulty
}: any) {
  const matches = await redisClient.keys(`match_${difficulty}_*`);
  const promises: any = [];

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
        throw new Error('Match not empty.');
      })
    promises.push(promise);
  })

  // @ts-expect-error TS(2550): Property 'any' does not exist on type 'PromiseCons... Remove this comment to see the full error message
  Promise.any(promises)
    .then(async (data: any) => {
      const { matchId, playerOne, playerTwo } = data;
      joinMatch({ matchId, user, socketId: socket.id });

      const question = await getRandomQuestion(difficulty);

      ormCreateMatch(matchId, playerOne.user.username, playerTwo.user.username, difficulty, question.data.id);

      dispatcher('playerFound', playerOne.socketId, playerTwo.user, matchId, question);
      dispatcher('playerFound', playerTwo.socketId, playerOne.user, matchId, question);
    })
    .catch((err: any) => {
      // @ts-expect-error TS(2304): Cannot find name 'AggregateError'.
      if (err instanceof AggregateError) {
        // TODO: dispatch error
        createMatch({ user, socketId: socket.id, difficulty });
      }
    })
}
