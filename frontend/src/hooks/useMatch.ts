import axios from 'axios';
import {
  createContext, useContext, useEffect, useState,
} from 'react';
import { STATUS_CODE_OK } from '../constants';
import { useAuth } from './useAuth';

interface MatchContextProps {
  match: any,
  question: any,
  isLoading: boolean;
  endMatch: () => void;
}

interface Match {
  id: string,
  difficulty: string,
  isActive: true,
  matchId:string,
  questionId: string,
  username1: string,
  username2: string,
}

export const matchContext = createContext({} as MatchContextProps);

export const useMatchDetail = () => {
  const auth = useAuth();
  const [match, setMatch] = useState<Match | null>(null);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  const getMatch = async (username: string) => {
    await axios
      .get(`http://localhost:8001/match/${username}`)
      .then((response) => {
        if (response.status === STATUS_CODE_OK) {
          setMatch(response.data.match);
          setQuestion(response.data.question);
        }
      })
      .catch(() => {
        // TODO: error handling
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const endMatch = () => {
    // TODO: END MATCH
  };

  useEffect(() => {
    if (auth.user.username !== '') {
      getMatch(auth.user.username);
    }
  }, [auth]);

  return {
    match,
    question,
    isLoading: loading,
    endMatch,
  };
};
