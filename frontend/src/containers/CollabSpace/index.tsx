import React, { useEffect, useState } from 'react'; // useRef
import { Text, Code } from '@chakra-ui/react';
// eslint-disable-next-line import/no-unresolved
import 'codemirror/theme/material-ocean.css';
// eslint-disable-next-line import/no-unresolved
import 'codemirror/mode/javascript/javascript';
// eslint-disable-next-line import/no-unresolved
import 'codemirror/keymap/sublime';
// import CodeMirror from 'codemirror';
import io from 'socket.io-client';
// import { useParams } from 'react-router';

const socket = io('http://localhost:8001');

export default function CollabSpacePage() {
  // const [joinRoom, setjoinRoom] = useState('');
  const [updatedMessage, setupdatedMessage] = useState('');
  // const { diff } = useParams();

  useEffect(() => {
    socket.on('codeEditor', (data) => {
      setupdatedMessage(data.message);
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
