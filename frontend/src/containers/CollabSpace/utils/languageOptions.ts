// eslint-disable-next-line max-len
// Source code: https://github.com/manuarora700/react-code-editor/blob/main/src/constants/languageOptions.js

export type Language = {
  id: number,
  name: string,
  label: string,
  value: string,
};

export const languageOptions = [
  {
    id: 63,
    name: 'JavaScript (Node.js 12.14.0)',
    label: 'JavaScript (Node.js 12.14.0)',
    value: 'javascript',
  },
  {
    id: 50,
    name: 'C (GCC 9.2.0)',
    label: 'C (GCC 9.2.0)',
    value: 'c',
  },
  {
    id: 54,
    name: 'C++ (GCC 9.2.0)',
    label: 'C++ (GCC 9.2.0)',
    value: 'cpp',
  },
  {
    id: 62,
    name: 'Java (OpenJDK 13.0.1)',
    label: 'Java (OpenJDK 13.0.1)',
    value: 'java',
  },
  {
    id: 71,
    name: 'Python (3.8.1)',
    label: 'Python (3.8.1)',
    value: 'python',
  },
  {
    id: 74,
    name: 'TypeScript (3.7.4)',
    label: 'TypeScript (3.7.4)',
    value: 'typescript',
  },
];
