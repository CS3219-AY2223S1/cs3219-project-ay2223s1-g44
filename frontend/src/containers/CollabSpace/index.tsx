import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  Code,
  Box,
  FormErrorMessage,
} from '@chakra-ui/react';
import io from 'socket.io-client';
import { authContext } from '../../hooks/useAuth';

export default function CollabSpacePage() {
  const { user } = useContext(authContext);
  const [roomID, setRoomID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [input, setInput] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:8002', { transports: ['websocket'] });

    const editor = document.getElementById('codemirrortext') as HTMLInputElement;

    editor?.addEventListener('keyup', (event) => {
      const text = editor.value;
      if (roomID === '') {
        setErrorMessage('No room found!');
      } else {
        socket.emit('codeEditor', { text, roomID });
      }
    });

    socket.on('connect', () => {
      const room = localStorage.getItem('matchId');

      if (room == null) {
        setErrorMessage('Unable to join room. Make sure you find a match first!');
      } else {
        setRoomID(room);
        socket.emit('joinRoom', { room, user });
      }
    });

    socket.on('codeEditor', (code) => {
      editor.value = code;
    });

    socket.on('disconnect', (reason) => {
      console.log('other user disconnected');
      socket.emit('disconnect_users', reason);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomID]);

  return (
    <>
      <Text fontSize="2xl">
        Your username is:
        <Text>
          {user.username}
        </Text>
      </Text>
      <Text fontSize="2xl">
        Your roomID is:
        <Text fontSize="2xl">
          {roomID}
        </Text>
      </Text>

      <textarea
        rows={30}
        cols={50}
        placeholder="Type Your Text..."
        id="codemirrortext"
      />

      <Box height={10} pt={2}>
        {Boolean(errorMessage)
          && <FormErrorMessage my={0}>{errorMessage}</FormErrorMessage>}
      </Box>
    </>
  );
}
