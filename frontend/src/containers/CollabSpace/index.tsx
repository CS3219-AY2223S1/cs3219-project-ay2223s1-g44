import React, { useEffect, useState, useRef } from 'react';
import { Text, Code } from '@chakra-ui/react';
// eslint-disable-next-line import/no-unresolved
import 'codemirror/theme/material-ocean.css';
// eslint-disable-next-line import/no-unresolved
import 'codemirror/mode/javascript/javascript';
// eslint-disable-next-line import/no-unresolved
import 'codemirror/keymap/sublime';
import CodeMirror, { EditorView } from 'codemirror';
import io from 'socket.io-client';
// import { useParams } from 'react-router';

const socket = io('http://localhost:8001');

export default function CollabSpacePage() {
  // const [joinRoom, setjoinRoom] = useState('');
  const [updatedMessage, setupdatedMessage] = useState('');
  // const { diff } = useParams();

  useEffect(() => {
    // @ts-ignore
    const editor = CodeMirror.fromTextArea(document.getElementById('ds'), {
      lineNumbers: true,
      keyMap: 'sublime',
      theme: 'material-ocean',
      mode: 'javascript',
    });

    socket.on('codeEditor', (data) => {
      editor.setValue(data);
    });

    socket.on('disconnect', (reason) => {
      socket.emit('disconnected', reason);
    });
  }, []);

  return (
    <div className="App">
      <Text fontSize="2xl">Your username is:</Text>
      <Text fontSize="2xl">The room ID is:</Text>
      <Text fontSize="2xl">
        How many people are connected:
      </Text>
      <Code />

      <textarea id="ds" />

      <body>
        {updatedMessage}
      </body>
    </div>
  );
}
