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
  const [input, setInput] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:8002', { transports: ['websocket'] });

    // @ts-ignore
    // source code:
    // eslint-disable-next-line max-len
    // https://github.com/Rowadz/real-time-collaborative-code-editor/blob/main/src/RealTimeEditor.jsx
    /*
    const editor = CodeMirror.fromTextArea(document.getElementById('codemirrortext'), {
      lineNumbers: true,
      keyMap: 'sublime',
      theme: 'material-ocean',
      mode: 'javascript',
    });
    editor.refresh();
    */
    const editor = document.getElementById('codemirrortext') as HTMLInputElement;

    editor?.addEventListener('keyup', (event) => {
      const text = editor.value;
      console.log(`hehe: ${text}`);
      console.log(roomID);
      if (roomID === '') {
        setErrorMessage('No room found!');
      } else {
        console.log(`i am called ${text}`);
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
      // editor.setValue(code);
      editor.value = code;
    });

    socket.on('disconnect', (reason) => {
      console.log('other user disconnected');
      // socket.emit('disconnect_users', reason);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomID]);

  const handleUserInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

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
