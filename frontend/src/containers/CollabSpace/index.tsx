import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  Code,
  Box,
  FormErrorMessage,
} from '@chakra-ui/react';
import io from 'socket.io-client';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-ocean.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/keymap/sublime';
import CodeMirror from 'codemirror';
import { authContext } from '../../hooks/useAuth';

export default function CollabSpacePage() {
  const { user } = useContext(authContext);
  const [roomID, setRoomID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const socket = io('http://localhost:8002');

  useEffect(() => {
    // @ts-ignore
    // source code:
    // eslint-disable-next-line max-len
    // https://github.com/Rowadz/real-time-collaborative-code-editor/blob/main/src/RealTimeEditor.jsx
    const editor = CodeMirror.fromTextArea(document.getElementById('ds'), {
      lineNumbers: true,
      keyMap: 'sublime',
      theme: 'material-ocean',
      mode: 'javascript',
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

    editor.on('change', (instance, changes) => {
      const { origin } = changes;
      if (origin !== 'setValue') {
        const value = instance.getValue();
        if (roomID === '') {
          setErrorMessage('No room found!');
        } else {
          socket.emit('codeEditor', { value, roomID });
        }
      }
    });

    socket.on('codeEditor', (code) => {
      editor.setValue(code);
    });

    socket.on('disconnect', (reason) => {
      console.log('other user disconnected');
      socket.emit('disconnect_users', reason);
    });

    return () => {
      socket.close();
    };
  }, [socket, user, roomID]);

  return (
    <div className="App">
      <Text fontSize="2xl">
        Your username is:
        <text>
          {user.username}
        </text>
      </Text>
      <Text fontSize="2xl">
        Your roomID is:
        <Text fontSize="2xl">
          {roomID}
        </Text>
      </Text>
      <Code />

      <textarea id="ds" />

      <Box height={10} pt={2}>
        {Boolean(errorMessage)
          && <FormErrorMessage my={0}>{errorMessage}</FormErrorMessage>}
      </Box>
    </div>
  );
}
