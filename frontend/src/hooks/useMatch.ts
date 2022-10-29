import axios from 'axios';
import { useEffect, useState } from 'react';
import { STATUS_CODE_OK } from '../constants';

interface Match {
  id: string,
  difficulty: string,
  isActive: boolean,
  matchId: string,
  questionId: string,
  username1: string,
  username2: string,
}

const emptyMatch: Match = {
  id: '',
  difficulty: '',
  isActive: false,
  matchId: '',
  questionId: '',
  username1: '',
  username2: '',
};

interface Question {
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
}

const emptyQuestion: Question = {
  data: {
    difficulty: '',
    id: 0,
    link: '',
    question: '',
    similar_topics: [],
    title: '',
    title_slug: '',
  },
  message: '',
};

export const useMatchDetail = (username: string) => {
  const [match, setMatch] = useState(emptyMatch);
  const [question, setQuestion] = useState(emptyQuestion);
  const [loading, setLoading] = useState(true);

  const endMatch = () => {
    // TODO: END MATCH
  };

  useEffect(() => {
    if (username !== '') {
      axios.get(`http://localhost:8001/match/${username}`)
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
    }
  }, [username]);

  return {
    match,
    question,
    matchLoading: loading,
    endMatch,
  };
};
