import redisClient from "../utils/redis-client";
import dispatcher from "../utils/dispatcher";
import { v4 as uuidV4 } from "uuid";
import { ormCreateMatchHistory } from '../model/match-orm';
import { getRandomQuestion } from "../utils/get-question";
import { Socket } from "socket.io";
import { Difficulty, Match, MatchHistory, Question, User } from "../types/index";
import _ from "lodash";

export async function cancelPendingMatches({
  socket
}: {
  socket: Socket
}) {
  const matches = await redisClient.keys(`match_*`);
  const findMatchIdPromises: Promise<number | undefined>[] = [];

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
}: {
  user: User,
  socketId: string,
  difficulty: Difficulty
}) {
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
  socketId,
  user
}: {
  matchId: string,
  socketId: string,
  user: User
}) {
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
}: {
  socket: Socket,
  user: User,
  difficulty: Difficulty
}) {
  const matches = await redisClient.keys(`match_${difficulty}_*`);
  const promises: Promise<{
    matchId: string;
    playerOne: {
      user: User;
      socketId: string;
    };
    playerTwo: {
        user: User;
        socketId: string;
    };
  }>[] = [];

  if (matches.length === 0) {
    createMatch({ user, socketId: socket.id, difficulty });
    return;
  }

  matches.forEach(matchId => {
    const promise = redisClient.hGetAll(matchId)
      .then((players) => {
        const { playerOne, playerTwo } = players;
        const parsedPlayerOne: {
          user: User;
          socketId: string;
        } = JSON.parse(playerOne);
        const isMatchCreatedByClient = parsedPlayerOne.user.id === user.id;
        const isMatchFull = Boolean(playerTwo);

        if (!isMatchFull && !isMatchCreatedByClient) {
          return { matchId, playerOne: parsedPlayerOne, playerTwo: { user, socketId: socket.id } };
        }
        throw new Error('Match not empty.');
      })
    promises.push(promise);
  })

  Promise.any(promises)
    .then(async (data) => {
      const { matchId, playerOne, playerTwo } = data;
      joinMatch({ matchId, user, socketId: socket.id });

      const question = await getRandomQuestion(difficulty);

      if (!question) {
        throw new Error('Could not find question!');
      }

      await redisClient
        .hSet(matchId, 'question', JSON.stringify(question))
        .catch((err) => {
          throw err;
        });

      dispatcher('playerFound', playerOne.socketId, playerTwo.user, matchId, question);
      dispatcher('playerFound', playerTwo.socketId, playerOne.user, matchId, question);
    })
    .catch((err: ((reason: any) => void | PromiseLike<void>) | null | undefined) => {
      if (err instanceof AggregateError) {
        // TODO: dispatch error
       return createMatch({ user, socketId: socket.id, difficulty });
      }
      console.error(err);
    })
}

export async function findExistingMatch(username: string) {
  const matches = await redisClient.keys(`match_*`);
  const promises: Promise<{
    id: string,
    playerOne: {
      user: User;
      socketId: string;
    };
    playerTwo: {
        user: User;
        socketId: string;
    };
    question: Question
  }>[] = [];

  if (matches.length === 0) {
    return;
  }

  matches.forEach(matchId => {
    const promise = redisClient.hGetAll(matchId)
      .then((match) => {
        const { playerOne, playerTwo, question } = match;
        const parsedPlayerOne: {
          user: User;
          socketId: string;
        } = JSON.parse(playerOne);
        const parsedPlayerTwo: {
          user: User;
          socketId: string;
        } = JSON.parse(playerTwo);
        const parsedQuestion: Question = JSON.parse(question);
        const isPlayerOneCurrentPlayer = parsedPlayerOne.user.username === username;
        const isPlayerTwoCurrentPlayer = parsedPlayerTwo.user.username === username;
        const isCurrentPlayerInMatch = isPlayerOneCurrentPlayer || isPlayerTwoCurrentPlayer;

        if (isCurrentPlayerInMatch) {
          return { id: matchId, playerOne: parsedPlayerOne, playerTwo: parsedPlayerTwo, question: parsedQuestion };
        }
        throw new Error('Current player not in match.');
      })
    promises.push(promise);
  })

  return Promise.any(promises)
    .then(async (data) => {
      return data;
    })
    .catch((err) => {
      if (err instanceof AggregateError) {
        // TODO: dispatch error (no existing match)
      }
      console.error(err);
    })
}

export async function leaveMatch(matchId: string): Promise<MatchHistory | void> {
  return await redisClient.hGetAll(matchId)
    .then((match) => {
      if (!match) {
        throw new Error('Match does not exist.');
      }
      const { playerOne, playerTwo, question } = match;
      const parsedPlayerOne: {
        user: User;
        socketId: string;
      } = JSON.parse(playerOne);
      const parsedPlayerTwo: {
        user: User;
        socketId: string;
      } = JSON.parse(playerTwo);
      const parsedQuestion: Question = JSON.parse(question);
      console.log(parsedQuestion)

      return {
        matchId,
        playerOneUsername: parsedPlayerOne.user.username,
        playerTwoUsername: parsedPlayerTwo.user.username,
        question: {
          questionId: parsedQuestion.id,
          title: parsedQuestion.title,
          difficulty: parsedQuestion.difficulty
        }
      }
    })
    .then(async (matchHistory) => {
      await redisClient.del(matchId);
      return matchHistory;
    })
    .catch(err => {
      console.error(err);
    })
}
