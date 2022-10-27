import React from 'react';
import { Flex, Heading } from '@chakra-ui/react';

type ContentLayoutProps = {
  children?: React.ReactNode;
  heading: string;
};

function ContentLayout({ children, heading }: ContentLayoutProps) {
  return (
    <Flex
      direction="column"
      maxW={960}
      w={960}
      margin="auto"
      justifyContent="top"
      alignItems="start"
    >
      <Heading
        mt={20}
        mb={10}
        fontSize={34}
        fontWeight={500}
        color="brand-gray.4"
      >
        {heading}

      </Heading>
      {children}
    </Flex>
  );
}

export default ContentLayout;
