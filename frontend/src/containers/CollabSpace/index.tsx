import React, { useEffect, useState } from 'react'; // useRef
// import { Container } from '@mui/material';
// import CodeMirror from 'codemirror';
import { io } from 'socket.io-client';
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
      <input
        placeholder="empty..."
        onChange={(e) => {
          setupdatedMessage(e.target.value);
        }}
      />

      <body>
        {updatedMessage}
      </body>
    </div>
  );
}
