import React, { useEffect, useState } from 'react';
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

export default function CollabSpacePage() {
  const [roomID, setRoomID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:8002');
    console.log(localStorage.getItem('matchId'));

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

    socket.on('joinRoom', () => {
      const room = localStorage.getItem('matchId');
      console.log(`hello ${localStorage.getItem('matchId')}`);

      if (room == null) {
        setErrorMessage('Unable to join room. Make sure you find a match first!');
      } else {
        setRoomID(room);
        socket.emit('joinRoom', room);
      }
    });

    socket.on('codeEditor', (code) => {
      // eslint-disable-next-line no-console
      console.log(code);
      editor.setValue(code);
    });

    socket.on('disconnect_users', (reason) => {
      socket.emit('disconnected', reason);
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="App">
      <Text fontSize="2xl"> Your roomID is: </Text>
      <Text fontSize="2xl">
        {roomID}
      </Text>
      <Text fontSize="2xl">The room ID is:</Text>
      <Text fontSize="2xl">
        How many people are connected:
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
