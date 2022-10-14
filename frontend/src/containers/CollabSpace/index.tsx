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
} from '@chakra-ui/react';
import io, { Socket } from 'socket.io-client';
import Editor from '@monaco-editor/react';
import { authContext } from '../../hooks/useAuth';
import { languageOptions } from './utils/languageOptions';
import CodeEditorWindow from './Editor/CodeEditorWIndow';
import LanguagesDropdown from './Editor/LanguagesDropdown';

let handleSubmit: Function;

export default function CollabSpacePage() {
  const javascriptDefault = '// some comment';
  // const [matchID, setMatchID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editorCode, setEditorCode] = useState(javascriptDefault);
  const [customInput, setCustomInput] = useState('');
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState('oceanic-next');
  const [language, setLanguage] = useState(languageOptions[0]);
  const { user } = useContext(authContext);
  const matchId = 'test';
  const [newMessage, setNewMessage] = useState('');
  const [chatBoxMessages, setChatBoxMessages] = useState(
    [{ message: `Welcome to ${matchId}`, key: 0 }],
  );
  const socket = useRef<Socket>();

  const onSelectChange = (
    sl: React.SetStateAction<{ id: number; name: string; label: string; value: string; }>,
  ) => {
    console.log('selected Option...', sl);
    setLanguage(sl);
  };

  useEffect(() => {
    socket.current = io('http://localhost:8002', { transports: ['websocket'] });

    socket.current.on('connect', () => {
      socket.current!.emit('joinRoom', { matchId, user });
    });

    socket.current.on('codeEditor', (code) => {
      setEditorCode(code);
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
    setEditorCode(event.target.value);
    socket.current!.emit('codeEditor', code);
  };

  handleSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const message = `${String(user.username)}: ${newMessage}`;
    setChatBoxMessages((arr) => [...arr, { message, key: arr.length }]);
    socket.current!.emit('chatBox', message);
    setNewMessage('');
  };

  const onChange = (action: any, code: React.SetStateAction<string>) => {
    switch (action) {
      case 'code': {
        // if (matchId === '') {
        // setErrorMessage('No room found!');
        // } else {
        setEditorCode(code);
        socket.current!.emit('codeEditor', code);
        // }
        break;
      }
      default: {
        console.warn('case not handled!', action, code);
      }
    }
  };

  return (
    <div>
      <textarea
        rows={30}
        cols={50}
        placeholder="Type Your Text..."
        id="codemirrortext"
      />

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

      <div className="px-4 py-2">
        <LanguagesDropdown
          onSelectChange={onSelectChange}
        />
      </div>

      <CodeEditorWindow
        code={editorCode}
        onChange={onChange}
        language={language?.value}
        theme={theme}
      />

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
