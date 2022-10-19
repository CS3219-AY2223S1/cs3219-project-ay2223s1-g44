// TODO: add props for each attribute ?
export interface DifficultyProps {
  label: string,
  colour: string,
  description: string,
  topics: string[]
}

export const DIFFICULTIES: DifficultyProps[] = [
  {
    label: 'Easy',
    colour: 'brand-green.1',
    description: 'Straight forward solutions. Tests the basics of data structures and algorithms',
    topics: ['Binary Tree', 'Hash Table', 'Pointers'],
  },
  {
    label: 'Medium',
    colour: 'brand-orange.1',
    description: 'More advanced data structures and algorithms with complicated twists and brain-teasers.',
    topics: ['BFS/DFS', 'Heaps', 'Recursion'],
  },
  {
    label: 'Hard',
    colour: 'brand-red.1',
    description: 'Even more complex data structures and algorithms with even harder twists on top.',
    topics: ['Backtracking', 'DP', 'Math'],
  },
];
