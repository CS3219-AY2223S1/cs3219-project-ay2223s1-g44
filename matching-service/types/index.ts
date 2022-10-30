export type User = {
  id: string;
  username: string;
};

export type Difficulty = 'easy' | 'medium' | 'hard';

export type Question = {
  id: number;
  title: string;
  title_slug: string;
  link: string;
  difficulty: Difficulty;
  similar_topics: string[];
  question: string;
}

export type Match = {
  playerOne: {
    user: User;
    socketId: string;
  };
  playerTwo: {
    user: User;
    socketId: string;
  };
  question: {
    data: Question;
    message: string;
  };
}

export type MatchHistory = {
  matchId: string;
  playerOneUsername: string;
  playerTwoUsername: string;
  question: {
      questionId: number;
      title: string;
      difficulty: Difficulty;
  };
}