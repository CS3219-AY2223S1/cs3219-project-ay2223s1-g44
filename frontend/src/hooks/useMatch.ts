import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Socket } from 'socket.io-client';
import { STATUS_CODE_OK } from '../constants';
import { authContext } from './useAuth';

export type User = {
  id: string;
  username: string;
};

export type Question = {
  id: number;
  title: string;
  title_slug: string;
  link: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  similar_topics: string[];
  question: string;
};

export type Match = {
  id: string;
  playerOne: {
    user: User;
    socketId: string;
  };
  playerTwo: {
    user: User;
    socketId: string;
  };
  question: Question;
};

export const useMatchDetail = () => {
  const { user: { username } } = useContext(authContext);
  const [match, setMatch] = useState<Match>();
  const [isLoading, setIsLoading] = useState(true);

  const endMatch = () => {
    setIsLoading(true);
    if (!match) {
      setIsLoading(false);
      // TODO: toast
      return;
    }
    axios.post(`http://localhost:8001/end/${match.id}`)
      .then((response) => {
        if (response.status === STATUS_CODE_OK) {
          setMatch(undefined);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    if (!username) {
      setIsLoading(false);
      setMatch(undefined);
      // TODO: toast
      return;
    }
    axios.get(`http://localhost:8001/match/${username}`, { timeout: 10000 })
      .then((response) => {
        if (response.status === STATUS_CODE_OK) {
          const { match: existingMatch } = response.data;
          setMatch(existingMatch);
        }
      })
      .catch(() => {
        setMatch(undefined);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [username]);

  return {
    match,
    matchLoading: isLoading,
    endMatch,
  };
};
