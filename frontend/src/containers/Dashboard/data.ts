export type Difficulty = {
  label?: string;
  value: string;
  colour?: string;
};

export const DIFFICULTIES: Difficulty[] = [
  {
    label: 'Easy',
    value: 'easy',
  },
  {
    label: 'Medium',
    value: 'medium',
  },
  {
    label: 'Hard',
    value: 'hard',
  },
];

type DifficultyTags = {
  easy: Difficulty;
  medium: Difficulty;
  hard: Difficulty;
};

export const DIFFICULTY_TAGS: DifficultyTags = {
  easy: {
    value: 'Easy',
    colour: 'brand-green.1',
  },
  medium: {
    value: 'Medium',
    colour: 'brand-orange.1',
  },
  hard: {
    value: 'Hard',
    colour: 'brand-red.1',
  },
};

export type MatchHistoryCardProps = {
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  date: Date;
};

function randomDate(start: Date, end: Date) { // TODO: remove with mock data
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export const MOCK_DATA: MatchHistoryCardProps[] = [
  {
    title: 'Two Sum',
    difficulty: 'easy',
    date: randomDate(new Date(2022, 0, 1), new Date()),
  },
  {
    title: 'Add Two Numbers',
    difficulty: 'medium',
    date: randomDate(new Date(2022, 0, 1), new Date()),
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    date: randomDate(new Date(2022, 0, 1), new Date()),
  },
  {
    title: 'Median of Two Sorted Arrays',
    difficulty: 'hard',
    date: randomDate(new Date(2022, 0, 1), new Date()),
  },
  {
    title: 'Longest Palindromic Substring',
    difficulty: 'medium',
    date: randomDate(new Date(2022, 0, 1), new Date()),
  },
  {
    title: 'Zigzag Conversion',
    difficulty: 'medium',
    date: randomDate(new Date(2022, 0, 1), new Date()),
  },
  {
    title: 'Reverse Integer',
    difficulty: 'medium',
    date: randomDate(new Date(2022, 0, 1), new Date()),
  },
  {
    title: 'String to Integer',
    difficulty: 'medium',
    date: randomDate(new Date(2022, 0, 1), new Date()),
  },
  {
    title: 'Palindrome Number',
    difficulty: 'easy',
    date: randomDate(new Date(2022, 0, 1), new Date()),
  },
];
