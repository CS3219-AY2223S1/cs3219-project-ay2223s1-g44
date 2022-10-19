import { extendTheme } from '@chakra-ui/react';
// import { mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  fonts: {
    heading: '\'Cereal\', sans-serif',
    body: '\'Cereal\', sans-serif',
  },
  styles: {
    global: {
      'html, body': {
        backgroundColor: 'brand-white',
      },
      '*': {
        letterSpacing: '0.05em', // TODO: hacky maybe ?
      },
    },
  },
  colors: {
    'brand-blue': {
      1: '#6496ea',
      2: '#5580c7',
      3: '#4669a4',
    },
    'brand-gray': {
      1: '#f2f2f2',
      2: '#9d9fa7',
      3: '#686a77',
      4: '#434656',
    },
    'brand-green': {
      1: '#00ab78',
    },
    'brand-orange': {
      1: '#f1c01e',
    },
    'brand-red': {
      1: '#ff375f',
    },
    'brand-white': '#f7f7f7',
  },
});

export default theme;
