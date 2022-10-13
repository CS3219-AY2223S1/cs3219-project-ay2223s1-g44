import React, {
  useContext, useEffect, useState, useRef,
} from 'react';
import {
  Text,
  Box,
} from '@chakra-ui/react';
import io, { Socket } from 'socket.io-client';
import { authContext } from '../../hooks/useAuth';

let handleSubmit: Function;

export default function CollabSpacePage() {
  const { user } = useContext(authContext);
  const matchId = 'test';
  const [newMessage, setNewMessage] = useState('');
  const [chatBoxMessages, setChatBoxMessages] = useState(
    [{ message: `Welcome to ${matchId}`, key: 0 }],
  );
  const [editorValue, setEditorValue] = useState('');
  const socket = useRef<Socket>();

  useEffect(() => {
    socket.current = io('http://localhost:8002', { transports: ['websocket'] });

    socket.current.on('connect', () => {
      socket.current!.emit('joinRoom', { matchId, user });
    });

    socket.current.on('codeEditor', (code) => {
      setEditorValue(code);
    });

    socket.current.on('chatBox', (message) => {
      setChatBoxMessages((arr) => [...arr, { message, key: arr.length }]);
    });

    socket.current.on('disconnect', (reason) => {
      socket.current!.emit('disconnect_users', reason);
    });

    return () => {
      socket.current!.close();
    };
  }, [user]);

  const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const code = event.target.value;
    setEditorValue(code);
    socket.current!.emit('codeEditor', code);
  };

  handleSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const message = `${String(user.username)}: ${newMessage}`;
    setChatBoxMessages((arr) => [...arr, { message, key: arr.length }]);
    socket.current!.emit('chatBox', message);
    setNewMessage('');
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
          {matchId}
        </Text>
      </Text>

      <textarea
        rows={30}
        cols={50}
        placeholder="Type Your Text..."
        value={editorValue}
        onChange={handleCodeChange}
      />

      <Box width={300} height={400} borderWidth={1} borderColor="grey">
        {chatBoxMessages
        && chatBoxMessages.map((message) => <Text key={message.key}>{message.message}</Text>)}
      </Box>
      <form onSubmit={(event) => handleSubmit(event)}>
        <input
          type="text"
          name="input"
          onChange={(event) => setNewMessage(event.target.value)}
          value={newMessage}
          style={{ border: 'solid black 2px' }} // TODO: remove this nasty ass css
        />
        <input type="submit" value="Submit" />
      </form>
    </>
  );
}
