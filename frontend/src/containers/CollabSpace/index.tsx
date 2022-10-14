import React, {
  useContext,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import {
  Text,
  Box,
  Code,
} from '@chakra-ui/react';
import io, { Socket } from 'socket.io-client';
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import { authContext } from '../../hooks/useAuth';
import { languageOptions } from './utils/languageOptions';

let handleSubmit: Function;

export default function CollabSpacePage() {
  const javascriptDefault = '// some comment';
  // const [matchID, setMatchID] = useState('');
  const [editorCode, setEditorCode] = useState(javascriptDefault);
  const [theme, setTheme] = useState('oceanic-next');
  const [language, setLanguage] = useState(languageOptions[0]);
  const { user } = useContext(authContext);
  const matchId = 'test';
  const [newMessage, setNewMessage] = useState('');
  const [chatBoxMessages, setChatBoxMessages] = useState(
    [{ message: `Welcome to ${matchId}`, key: 0 }],
  );
  const socket = useRef<Socket>();

  useEffect(() => {
    socket.current = io('http://localhost:8002');

    socket.current.on('connect', () => {
      socket.current!.emit('joinRoom', { matchId, user });
    });

    socket.current.on('codeEditor', (code) => {
      setEditorCode(code);
    });

    socket.current.on('setLanguage', (lang) => {
      const promise = new Promise((resolve) => {
        setLanguage(lang);
        resolve('promise success');
      });

      promise.then(() => console.log(`success: ${language.value}`));
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
  }, [user, language, editorCode]);

  const onChange = (action: string, code: React.SetStateAction<string> | string | undefined) => {
    switch (action) {
      case 'code': {
        // if (matchId === '') {
        // setErrorMessage('No room found!');
        // } else {
        if (code === undefined) {
          setEditorCode('');
        } else {
          setEditorCode(code);
        }
        // }
        socket.current!.emit('codeEditor', code);
        break;
      }
      default: {
        console.warn('case not handled!', action, code);
      }
    }
  };

  // code referenced from:
  // https://www.freecodecamp.org/news/how-to-build-react-based-code-editor/amp/
  const onSelectChange = (
    lang: any,
  ) => {
    if (lang === undefined) {
      setLanguage(languageOptions[0]);
    } else {
      setLanguage(lang);
    }
    socket.current!.emit('setLanguage', lang);
  };

  handleSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const message = `${String(user.username)}: ${newMessage}`;
    setChatBoxMessages((arr) => [...arr, { message, key: arr.length }]);
    socket.current!.emit('chatBox', message);
    setNewMessage('');
  };

  return (
    <div>
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

      {
        // code referenced from:
        // https://www.freecodecamp.org/news/how-to-build-react-based-code-editor/amp/
      }
      <div className="px-4 py-2">
        <Select
          placeholder="Filter By Category"
          options={languageOptions}
          defaultValue={languageOptions[0]}
          onChange={(selectedOption) => {
            onSelectChange(selectedOption);
          }}
          value={language}
        />
      </div>

      {
        // code referenced from:
        // https://www.freecodecamp.org/news/how-to-build-react-based-code-editor/amp/
      }
      <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
        <Editor
          height="85vh"
          width="100%"
          language={language?.value || 'javascript'}
          value={editorCode}
          theme={theme}
          defaultValue="// some comment"
          onChange={(event) => {
            onChange('code', event);
          }}
        />
      </div>

      <Box width={300} height={400} borderWidth={1} borderColor="grey">
        {chatBoxMessages
        && chatBoxMessages.map((
          message: {
            key: React.Key | null | undefined;
            message: string | number | boolean |
            React.ReactElement<any, string | React.JSXElementConstructor<any>>
            | React.ReactFragment | React.ReactPortal | null | undefined; },
        ) => <Text key={message.key}>{message.message}</Text>)}
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
    </div>
  );
}
