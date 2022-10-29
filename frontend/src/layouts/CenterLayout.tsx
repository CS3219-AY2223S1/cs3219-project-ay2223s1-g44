import { Flex, FlexProps } from '@chakra-ui/react';
import React from 'react';

function CenterLayout({ children, ...props }: FlexProps) {
  return (
    <Flex
      {...props}
      direction="row"
      mt="60px"
      height="calc(100vh - 60px)" // TODO: centralise navbar height
      justifyContent="center"
      alignItems="center"
    >
      {children}
    </Flex>
  );
}

export default CenterLayout;
