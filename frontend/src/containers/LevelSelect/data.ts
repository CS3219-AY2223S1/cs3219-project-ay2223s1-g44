// TODO: add props for each attribute ?
export type DifficultyProps = {
  label: string,
  value: string,
  colour: string,
  description: string,
  topics: string[]
};

export const DIFFICULTIES: DifficultyProps[] = [
  {
    label: 'Easy',
    value: 'easy',
    colour: 'brand-green.1',
    description: 'Straight forward solutions. Tests the basics of data structures and algorithms',
    topics: ['Binary Tree', 'Hash Table', 'Pointers'],
  },
  {
    label: 'Medium',
    value: 'medium',
    colour: 'brand-orange.1',
    description: 'More advanced data structures and algorithms with complicated twists and brain-teasers.',
    topics: ['BFS/DFS', 'Heaps', 'Recursion'],
  },
  {
    label: 'Hard',
    value: 'hard',
    colour: 'brand-red.1',
    description: 'Even more complex data structures and algorithms with even harder twists on top.',
    topics: ['Backtracking', 'DP', 'Math'],
  },
];
