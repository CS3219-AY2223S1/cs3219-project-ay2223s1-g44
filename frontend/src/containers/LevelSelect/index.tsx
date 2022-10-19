import React, { useState } from 'react';
import {
  Box, Center, Text, Heading, HStack, VStack, Button, useToast,
} from '@chakra-ui/react';
import { DIFFICULTIES, DifficultyProps } from './data';
import ContentLayout from '../../layouts/ContentLayout';

interface DifficultyCardProps {
  difficulty: DifficultyProps
  selectedDifficultyState: [string, React.Dispatch<React.SetStateAction<string>>]
}

function DifficultyCard({ difficulty, selectedDifficultyState }: DifficultyCardProps) {
  const {
    label, colour, description, topics,
  } = difficulty;
  const [selectedDifficulty, setSelectedDifficulty] = selectedDifficultyState;

  const handleMouseDown = () => {
    setSelectedDifficulty(label);
  };

  return (
    <VStack
      as="button"
      name={label}
      bg="white"
      flex={1}
      padding={8}
      borderRadius={12}
      spacing={24}
      alignItems="start"
      textAlign="left"
      color="brand-blue.1"
      boxShadow={label === selectedDifficulty ? '0 0 0 3px' : '0px 0px 10px rgba(0, 0, 0, 0.01)'}
      transition="transform 50ms ease-out, box-shadow 50ms ease-out"
      _hover={{
        transform: 'scale(1.02)',
      }}
      _active={{
        transform: 'scale(1.01)',
      }}
      onMouseDown={handleMouseDown} // TODO: hacky logic, fixes outline issue
    >
      <Heading
        as="h3"
        fontSize={20}
        fontWeight={500}
        color={colour}
      >
        {label}
      </Heading>
      <Text
        color="brand-gray.3"
        fontWeight={500}
        lineHeight={1.75}
        fontSize={14}
      >
        {description}
      </Text>
      <Box>
        <Heading as="h4" color="brand-gray.2" fontSize={12} pb={1}>Topics:</Heading>
        <Text color="brand-gray.2" fontSize={12} fontWeight={500}>
          {topics.map((topic) => `${topic}, `)}
          etc.
        </Text>
      </Box>
    </VStack>
  );
}

function LevelSelect() {
  const selectedDifficultyState = useState<string>('');
  const [selectedDifficulty] = selectedDifficultyState;

  return (
    <ContentLayout heading="Select difficulty">
      <Center flexDirection="column" position="relative">
        <HStack spacing={5} mb={12}>
          {DIFFICULTIES.map((diff) => (
            <DifficultyCard
              key={diff.label}
              difficulty={diff}
              selectedDifficultyState={selectedDifficultyState}
            />
          ))}
        </HStack>
        <Button
          // onClick={handleSignup}
          // isLoading={isLoading}
          disabled={!selectedDifficulty}
          fontWeight="500"
          borderRadius={8}
          width={240}
          height="48px"
          fontSize={14}
          bg="brand-blue.1"
          color="brand-white"
          transition="background-color 100ms ease-out, opacity 100ms ease-out"
          _hover={
            { bg: 'brand-blue.2' }
          }
          _active={
            { bg: 'brand-blue.3' }
          }
        >
          Find match
        </Button>
      </Center>
    </ContentLayout>
  );
}

export default LevelSelect;
