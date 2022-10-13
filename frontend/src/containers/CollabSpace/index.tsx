import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  Code,
  Box,
  FormErrorMessage,
} from '@chakra-ui/react';
import io from 'socket.io-client';
import { authContext } from '../../hooks/useAuth';

let handleSubmit: Function;
const socket = io('http://localhost:8002', { transports: ['websocket'] });

export default function CollabSpacePage() {
  const { user } = useContext(authContext);
  // const [errorMessage, setErrorMessage] = useState('');
  const [input, setInput] = useState('');
  const matchId = 'test';
  const [newMessage, setNewMessage] = useState('');
  const [chatBoxMessages, setChatBoxMessages] = useState(
    [{ message: `Welcome to ${matchId}`, key: 0 }],
  );
  const clearMessage = () => setNewMessage('');
  const [hasPreprocessed, setHasPreprocessed] = useState(false);
  const [editorValue, setEditorValue] = useState('');

  const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const code = event.target.value;
    setEditorValue(code);
    socket.emit('codeEditor', code);
    console.log('sending');
  };

  const preprocessing = () => {
    socket.on('connect', () => {
      socket.emit('joinRoom', { matchId, user });
    });

    socket.on('codeEditor', (code) => {
      setEditorValue(code);
      console.log('receiving');
    });

    socket.on('chatBox', (message) => {
      console.log(`Received ${socket.id}`);
      setChatBoxMessages((arr) => [...arr, { message, key: arr.length }]);
    });

    socket.on('disconnect', (reason) => {
      console.log('other user disconnected');
      socket.emit('disconnect_users', reason);
    });
    setHasPreprocessed(true);
  };

  if (!hasPreprocessed) preprocessing();

  handleSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const array = chatBoxMessages;
    const message = `${String(user.username)}: ${newMessage}`;
    array.push({ message, key: array.length });
    socket.emit('chatBox', message);
    clearMessage();
    setChatBoxMessages(array);
    console.log(chatBoxMessages);
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
