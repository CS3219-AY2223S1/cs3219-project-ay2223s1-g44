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
  const [chatBoxMessages, setChatBoxMessages] = useState([{ message: `Welcome to ${matchId}`, key: 0 }]);
  const clearMessage = () => setNewMessage('');
  const [hasPreprocessed, setHasPreprocessed] = useState(false);
  const editor = document.getElementById('codemirrortext') as HTMLInputElement;

  editor?.addEventListener('keyup', (event) => {
    const code = editor.value;
    // if (matchId == '') {
    //   setErrorMessage('No room found!');
    // } else {
    socket.emit('codeEditor', code);
    console.log('sending');
    // }
  });

  const preprocessing = () => {
    socket.on('connect', () => {
      // if (matchId == null) {
      //   setErrorMessage('Unable to join room. Make sure you find a match first!');
      // } else {
      socket.emit('joinRoom', { matchId, user });
      // }
    });

    socket.on('codeEditor', (code) => {
      editor.value = code;
      console.log('receiving');
    });

    socket.on('chatBox', (message) => {
      console.log(`Received ${socket.id}`);
      const array = chatBoxMessages;
      array.push({ message, key: array.length });
      setChatBoxMessages(array);
    });

    socket.on('disconnect', (reason) => {
      console.log('other user disconnected');
      socket.emit('disconnect_users', reason);
    });
    setHasPreprocessed(true);
  };

  if (!hasPreprocessed) preprocessing();
  // eslint-disable-next-line react-hooks/exhaustive-deps

  // handleSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   event.preventDefault();
  //   const array = chatBoxMessages;
  //   const message = `${String(user.username)}: ${newMessage}`;
  //   array.push(message);
  //   socket.emit('chatBox', message);
  //   setChatBoxMessages(array);
  // };
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
        id="codemirrortext"
      />

      <Box width={300} height={400} borderWidth={1} borderColor="grey">
        {chatBoxMessages && chatBoxMessages.map((message) => <Text key={message.key}>{message.message}</Text>)}
      </Box>
      <form onSubmit={(event) => handleSubmit(event)}>
        <input type="text" name="input" onChange={(event) => setNewMessage(event.target.value)} value={newMessage} />
        <input type="submit" value="Submit" />
      </form>

      {/* <Box height={10} pt={2}>
        {Boolean(errorMessage)
          && <FormErrorMessage my={0}>{errorMessage}</FormErrorMessage>}
      </Box> */}
    </>
  );
}
