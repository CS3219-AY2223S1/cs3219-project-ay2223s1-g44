import { Flex } from '@chakra-ui/react';
import React from 'react';

interface CenterLayoutProps {
  children?: React.ReactNode
}

function CenterLayout({ children }: CenterLayoutProps) {
  return (
    <Flex
      direction="column"
      height="calc(100vh - 60px)" // TODO: centralise navbar height
      justifyContent="center"
      alignItems="center"
    >
      {children}
    </Flex>
  );
}

export default CenterLayout;
