// eslint-disable-next-line max-len
// Source code: https://github.com/manuarora700/react-code-editor/blob/main/src/constants/languageOptions.js

export type Language = {
  name: string,
  value: string,
  key: string
};

export const languageOptions: Language[] = [
  {
    name: 'Python',
    value: 'python',
    key: 'python',
  },
  {
    name: 'JavaScript',
    value: 'javascript',
    key: 'javascript',
  },
  {
    name: 'Typescript',
    value: 'typescript',
    key: 'typescript',
  },
  {
    name: 'C',
    value: 'c_cpp',
    key: 'c',
  },
  {
    name: 'C++',
    value: 'c_cpp',
    key: 'cpp',
  },
  {
    name: 'Java',
    value: 'java',
    key: 'java',
  },
];
