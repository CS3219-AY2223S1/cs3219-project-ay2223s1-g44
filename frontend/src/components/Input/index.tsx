import React from 'react';
import { Input as ChakraInput, InputProps } from '@chakra-ui/react';

function Input({ ...props } : InputProps) {
  return (
    <ChakraInput
      {...props}
      borderRadius={8}
      variant="filled"
      height="48px"
      fontSize={14}
      fontWeight={500}
      pl={4}
      bg="white"
      color="brand-gray.4"
      _hover={{ bg: 'gray.50' }}
      _focus={{
        borderColor: 'brand-blue.1',
        bg: 'gray.100',
      }}
    />
  );
}

export default Input;
