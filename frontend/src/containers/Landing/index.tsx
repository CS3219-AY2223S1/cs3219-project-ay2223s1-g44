import React from 'react';
import {
  Icon, Flex, Heading, Text, Circle, HStack,
} from '@chakra-ui/react';
import { MdCode, MdSave, MdLibraryBooks } from 'react-icons/md';
import CenterLayout from '../../layouts/CenterLayout';

function LandingPage() {
  return (
    <CenterLayout>
      <Flex direction="column" alignItems="center">
        <Heading
          fontWeight={500}
          fontSize={34}
          color="brand-gray.4"
          mb={40}
        >
          grind practice questions with peers.
        </Heading>
        <HStack spacing={12}>
          <Flex direction="column" alignItems="center" maxWidth={260}>
            <Circle
              bg="white"
              size={14}
              mb={6}
            >
              <Icon
                as={MdCode}
                w={6}
                h={6}
                color="brand-gray.2"
              />
            </Circle>
            <Text
              fontSize={16}
              fontWeight={500}
              color="brand-gray.3"
              mb={4}
            >
              Collaborative Coding
            </Text>
            <Text
              fontSize={14}
              fontWeight={500}
              color="brand-gray.2"
              textAlign="center"
            >
              Real-time collaborative code editor for maximised cooperation
            </Text>
          </Flex>
          <Flex direction="column" alignItems="center" maxWidth={260}>
            <Circle
              bg="white"
              size={14}
              mb={6}
            >
              <Icon
                as={MdSave}
                w={6}
                h={6}
                color="brand-gray.2"
              />
            </Circle>
            <Text
              fontSize={16}
              fontWeight={500}
              color="brand-gray.3"
              mb={4}
            >
              Save Progress
            </Text>
            <Text
              fontSize={14}
              fontWeight={500}
              color="brand-gray.2"
              textAlign="center"
            >
              Automatic save to maintain question progress
            </Text>
          </Flex>
          <Flex direction="column" alignItems="center" maxWidth={260}>
            <Circle
              bg="white"
              size={14}
              mb={6}
            >
              <Icon
                as={MdLibraryBooks}
                w={6}
                h={6}
                color="brand-gray.2"
              />
            </Circle>
            <Text
              fontSize={16}
              fontWeight={500}
              color="brand-gray.3"
              mb={4}
            >
              Plethora of Questions
            </Text>
            <Text
              fontSize={14}
              fontWeight={500}
              color="brand-gray.2"
              textAlign="center"
            >
              An endless supply of algorithm questions to grind
            </Text>
          </Flex>
        </HStack>

      </Flex>
    </CenterLayout>
  );
}

export default LandingPage;
