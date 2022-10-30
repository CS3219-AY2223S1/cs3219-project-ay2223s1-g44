import {
  Circle, Flex, Icon, Text,
} from '@chakra-ui/react';
import React from 'react';
import { IconType } from 'react-icons';

export type FeatureItemProps = {
  icon: IconType;
  heading: string;
  description: string;
};

function FeatureItem({ icon, heading, description }: FeatureItemProps) {
  return (
    <Flex
      direction={{ base: 'row', lg: 'column' }}
      alignItems="center"
      maxW={{ base: '100%', lg: 260 }}
      width="100%"
      flexGrow={1}
    >
      <Circle
        bg="white"
        size={14}
        mb={{ base: 0, lg: 6 }}
        mr={{ base: 4, lg: 0 }}
      >
        <Icon
          as={icon}
          w={6}
          h={6}
          color="brand-gray.2"
        />
      </Circle>
      <Flex
        direction="column"
        // justifyContent="center"
        // alignItems="center"
      >
        <Text
          as="h3"
          fontSize={{ base: 14, lg: 16 }}
          fontWeight={500}
          color="brand-gray.3"
          textAlign={{ base: 'left', lg: 'center' }}
          mb={{ base: 1, lg: 4 }}
        >
          {heading}
        </Text>
        <Text
          fontSize={{ base: 12, lg: 14 }}
          fontWeight={500}
          color="brand-gray.2"
          textAlign={{ base: 'left', lg: 'center' }}
        >
          {description}
        </Text>
      </Flex>
    </Flex>
  );
}

export default FeatureItem;
