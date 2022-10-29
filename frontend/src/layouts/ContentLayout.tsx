import React from 'react';
import { Flex, Heading } from '@chakra-ui/react';

type ContentLayoutProps = {
  children?: React.ReactNode;
  heading: string;
};

function ContentLayout({ children, heading }: ContentLayoutProps) {
  return (
    <Flex
      direction="row"
      mt="60px"
      justifyContent="center"
      mb={{ base: 24, lg: 0 }}
    >
      <Flex
        mx="10vw"
        maxWidth="960px"
        direction="column"
        width="100%"
        alignItems="center"
        flexGrow={1}
      >
        <Heading
          mt={{ base: 16, lg: 20 }}
          fontSize={{ base: 28, lg: 34 }}
          mb={{ base: 8, lg: 12 }}
          fontWeight={500}
          color="brand-gray.4"
          width="100%"
        >
          {heading}
        </Heading>
        {children}
      </Flex>
    </Flex>
  );
}

export default ContentLayout;
