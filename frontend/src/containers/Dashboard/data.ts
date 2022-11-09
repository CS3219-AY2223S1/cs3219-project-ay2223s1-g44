export type Difficulty = {
  label?: string;
  value: string;
  colour?: string;
};

export const DIFFICULTIES: Difficulty[] = [
  {
    label: 'Easy',
    value: 'Easy',
  },
  {
    label: 'Medium',
    value: 'Medium',
  },
  {
    label: 'Hard',
    value: 'Hard',
  },
];

type DifficultyTags = {
  Easy: Difficulty;
  Medium: Difficulty;
  Hard: Difficulty;
};

export const DIFFICULTY_TAGS: DifficultyTags = {
  Easy: {
    value: 'Easy',
    colour: 'brand-green.1',
  },
  Medium: {
    value: 'Medium',
    colour: 'brand-orange.1',
  },
  Hard: {
    value: 'Hard',
    colour: 'brand-red.1',
  },
};

export type MatchHistoryCardProps = {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  date: Date;
};
