import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { STATUS_CODE_OK } from '../constants';
import { authContext } from './useAuth';

type Match = {
  _id: string,
  difficulty: string,
  isActive: boolean,
  matchId: string,
  questionId: string,
  username1: string,
  username2: string,
};

type Question = {
  data: {
    difficulty: string,
    id: number,
    link: string,
    question: string,
    similar_topics: string[],
    title: string,
    title_slug: string,
  },
  message: string,
};

export const useMatchDetail = () => {
  const { user: { username } } = useContext(authContext);
  const [match, setMatch] = useState<Match>();
  const [question, setQuestion] = useState<Question>();
  const [isLoading, setIsLoading] = useState(true);

  const endMatch = () => {
    // TODO: END MATCH
  };

  useEffect(() => {
    setIsLoading(true);
    if (!username) {
      setIsLoading(false);
      // TODO: toast
      return;
    }
    axios.get(`http://localhost:8001/match/${username}`, { timeout: 10000 })
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
        setIsLoading(false);
      });
  }, [username]);

  return {
    match,
    question,
    matchLoading: isLoading,
    endMatch,
  };
};
