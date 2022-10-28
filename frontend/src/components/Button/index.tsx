import React from 'react';
import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react';

function Button({ children, ...props }: ButtonProps) {
  return (
    <ChakraButton
      {...props}
      height={{ base: '40px', lg: '48px' }}
      fontSize={{ base: 12, lg: 14 }}
      bg="brand-blue.1"
      color="brand-white"
      transition="background-color 100ms ease-out, opacity 100ms ease-out"
      fontWeight="500"
      borderRadius={8}
      _hover={
        { bg: 'brand-blue.2' }
      }
      _active={
        { bg: 'brand-blue.3' }
      }
    >
      {children}
    </ChakraButton>
  );
}

export default Button;
