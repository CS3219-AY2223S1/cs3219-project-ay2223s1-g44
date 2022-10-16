import React, {
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import {
  Text,
  Box,
} from '@chakra-ui/react';
import io, { Socket } from 'socket.io-client';
import CodeMirror from 'codemirror';
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import { authContext } from '../../hooks/useAuth';
import { languageOptions } from './utils/languageOptions';
import 'codemirror/lib/codemirror.css';
// import 'codemirror/lib/codemirror';
import 'codemirror/theme/material-ocean.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/keymap/sublime';

let handleSubmit: Function;

export default function CollabSpacePage() {
  // const [matchID, setMatchID] = useState('');
  const chosenTheme = 'oceanic-next';

  const [isReceiving, setIsReceiving] = useState(true);
  const [editorCode, setEditorCode] = useState('');
  const [language, setLanguage] = useState(languageOptions[0]);
  const { user } = useContext(authContext);
  const matchId = 'test';
  const [newMessage, setNewMessage] = useState('');
  const [chatBoxMessages, setChatBoxMessages] = useState(
    [{ message: `Welcome to ${matchId}`, key: 0 }],
  );
  const socket = useRef<Socket>();
  const editor = useRef<CodeMirror.Editor>();

  useEffect(() => {
    // eslint-disable-next-line max-len
    // souce: https://github.com/Rowadz/real-time-collaborative-code-editor/blob/main/src/RealTimeEditor.jsx
    editor.current = CodeMirror.fromTextArea(
      document.getElementById('codeeditor')! as HTMLTextAreaElement,
      {
        lineNumbers: true,
        keyMap: 'sublime',
        theme: 'material-ocean',
        mode: 'javascript',
      },
    );
  }, []);

  useEffect(() => {
    if (!isReceiving) {
      const code = editorCode;
      socket.current!.emit('codeEditor', code);
    }
  }, [isReceiving, editorCode]);

  useEffect(() => {
    socket.current = io('http://localhost:8002');

    socket.current.on('connect', () => {
      socket.current!.emit('joinRoom', { matchId, user });
    });

    socket.current.on('codeEditor', (code) => {
      editor.current!.setValue(code);

      setIsReceiving(true);
      if (isReceiving) {
        setEditorCode(code);
        setIsReceiving(false);
      }
    });

    // eslint-disable-next-line max-len
    // souce: https://github.com/Rowadz/real-time-collaborative-code-editor/blob/main/src/RealTimeEditor.jsx
    editor.current!.on('change', (instance, changes) => {
      const { origin } = changes;
      // if (oigin === '+input' || origin === '+delete' || origin === 'cut') {
      if (origin !== 'setValue') {
        console.log(instance.getValue());
        socket.current!.emit('codeEditor', instance.getValue());
      }
    });

    socket.current.on('setLanguage', (lang) => {
      setLanguage(lang);
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
  }, [user, isReceiving]);

  const onChange = (code: React.SetStateAction<string> | string | undefined) => {
    // if (matchId === '') {
    // setErrorMessage('No room found!');
    // } else {
    // setIsReceiving(false);
    if (code === undefined) {
      setEditorCode('');
    } else {
      setEditorCode(code);
    }
  };

  const delayState = (code: React.SetStateAction<string> | string | undefined) => {
    setIsReceiving(false);
    onChange(code);
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

      <textarea id="codeeditor" />

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
          theme={chosenTheme}
          defaultValue="// some comment"
          onChange={(event) => delayState(event)}
        />
      </div>
    </div>
  );
}
