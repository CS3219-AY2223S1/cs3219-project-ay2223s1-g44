import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  Box, Center, Text, Heading, VStack, Flex, ButtonProps,
} from '@chakra-ui/react';
import io, { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router';
import { DIFFICULTIES, DifficultyProps } from './data';
import ContentLayout from '../../layouts/ContentLayout';
import Button from '../../components/Button';
import { authContext } from '../../hooks/useAuth';

type DifficultyCardProps = {
  difficulty: DifficultyProps
  selectedDifficultyState: [string, React.Dispatch<React.SetStateAction<string>>]
};

function DifficultyCard({
  disabled,
  difficulty,
  selectedDifficultyState,
}: ButtonProps & DifficultyCardProps) {
  const {
    label, value, colour, description, topics,
  } = difficulty;
  const [selectedDifficulty, setSelectedDifficulty] = selectedDifficultyState;

  const handleMouseDown = () => {
    setSelectedDifficulty(value);
  };

  return (
    <VStack
      as="button"
      name={label}
      pointerEvents={disabled ? 'none' : 'auto'}
      opacity={disabled ? 0.5 : 1}
      bg="white"
      flex={1}
      padding={{ base: 4, lg: 8 }}
      borderRadius={12}
      spacing={{ base: 6, lg: 20 }}
      alignItems="start"
      textAlign="left"
      color="brand-blue.1"
      boxShadow={value === selectedDifficulty ? '0 0 0 3px' : '0px 0px 10px rgba(0, 0, 0, 0.01)'}
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
        fontSize={{ base: 16, lg: 20 }}
        fontWeight={500}
        color={colour}
      >
        {label}
      </Heading>
      <Flex
        height={{ base: '40px', lg: '120px' }}
        justifyContent="center"
        alignItems="center"
      >
        <Text
          color="brand-gray.3"
          fontWeight={500}
          lineHeight={1.75}
          fontSize={{ base: 12, lg: 14 }}
        >
          {description}
        </Text>
      </Flex>
      <Box>
        <Heading
          as="h4"
          color="brand-gray.2"
          fontSize={{ base: 10, lg: 12 }}
          pb={1}
        >
          Topics:

        </Heading>
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
  const [isFindingMatch, setIsFindingMatch] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(authContext);
  const [selectedDifficulty] = selectedDifficultyState;
  const socketRef = useRef<Socket>();

  useEffect(() => {
    socketRef.current = io('ws://localhost:8001');
    const { current: socket } = socketRef;

    socket.on('playerFound', (_obj) => {
      setIsFindingMatch(false);
      navigate('/collab-space');
    });

    socket.on('timeOut', () => {
      setIsFindingMatch(false);
    });

    socket.on('disconnect', () => {
      setIsFindingMatch(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  const handleFindMatch: React.MouseEventHandler<HTMLButtonElement> = async (_event) => {
    const { current: socket } = socketRef;
    if (!socket) {
      return;
    }

    setIsFindingMatch(true);
    socket.emit('findMatch', { user, difficulty: selectedDifficulty });
  };

  return (
    <ContentLayout heading="Select difficulty">
      <Center flexDirection="column" position="relative">
        <Flex
          gap={5}
          mb={12}
          direction={{ base: 'column', lg: 'row' }}
        >
          {DIFFICULTIES.map((diff) => (
            <DifficultyCard
              key={diff.label}
              disabled={isFindingMatch}
              difficulty={diff}
              selectedDifficultyState={selectedDifficultyState}
            />
          ))}
        </Flex>
        <Button
          onClick={handleFindMatch}
          isLoading={isFindingMatch}
          disabled={!selectedDifficulty || isFindingMatch}
          width={240}
        >
          Find match
        </Button>
      </Center>
    </ContentLayout>
  );
}

export default LevelSelect;
