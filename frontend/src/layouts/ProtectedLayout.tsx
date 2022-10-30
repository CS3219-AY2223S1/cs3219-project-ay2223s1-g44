import {
  Text,
  Button as ChakraButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useRef } from 'react';
import {
  Navigate, Outlet, useLocation, useNavigate,
} from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

import Button from '../components/Button';

import { authContext } from '../hooks/useAuth';
import { Match, useMatchDetail } from '../hooks/useMatch';

type BasicModalProps = {
  partner: string;
  match: Match;
  endMatch: () => void;
};

function BasicModal({ partner, match, endMatch }: BasicModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const socketRef = useRef<Socket>();
  const navigate = useNavigate();

  useEffect(() => {
    socketRef.current = io('ws://localhost:8002');
    const { current: socket } = socketRef;

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const handleResumeMatch = () => {
    onClose();
    navigate('/collab-space');
  };

  const handleLeaveMatch = () => {
    const { current: socket } = socketRef;
    if (!socket || !match) {
      return;
    }

    onClose();
    endMatch();
    socket.emit('leaveMatch', { matchId: match.id });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      isCentered
    >
      <ModalOverlay />
      <ModalContent p={2}>
        <ModalHeader
          fontWeight={500}
          color="brand-gray.4"
          mb={4}
        >
          Match in progress
        </ModalHeader>
        <ModalBody
          fontSize={14}
          color="brand-gray.3"
          lineHeight="1.75em"
          mb={4}
        >
          <Text>
            {'You have an ongoing match with '}
            <Text as="span" fontWeight={700}>{partner}</Text>
            .
            Would you like to resume?
          </Text>
        </ModalBody>

        <ModalFooter>
          <ChakraButton
            variant="link"
            fontSize={{ base: 12, lg: 14 }}
            onClick={handleLeaveMatch}
            mr={6}
            fontWeight={500}
            color="brand-red.1"
            transition="color 75ms ease-in"
            height={{ base: '40px', lg: '48px' }}
            _hover={
              { color: 'brand-red.2' }
            }
            _active={
              { color: 'brand-red.3' }
            }
          >
            Leave match
          </ChakraButton>
          <Button
            fontSize="14px"
            onClick={handleResumeMatch}
          >
            Resume match
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function ProtectedLayout() {
  const auth = useContext(authContext);
  const location = useLocation();
  const { match, endMatch, matchLoading } = useMatchDetail();
  const { user: { username }, isLoading, isAuthed } = auth;

  let partner = '';
  if (match) {
    const {
      playerOne: { user: { username: playerOneUsername } },
      playerTwo: { user: { username: playerTwoUsername } },
    } = match;
    partner = username === playerOneUsername ? playerTwoUsername : playerTwoUsername;
  }

  if (isLoading || matchLoading) {
    return null;
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Outlet />
      {match && location.pathname !== '/collab-space' && (
      <BasicModal
        partner={partner}
        match={match}
        endMatch={endMatch}
      />
      )}
    </>
  );
}

export default ProtectedLayout;
