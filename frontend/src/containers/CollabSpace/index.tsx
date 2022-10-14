import React, {
  useContext,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import {
  Text,
  Code,
  Box,
  FormErrorMessage,
} from '@chakra-ui/react';
import io from 'socket.io-client';
import Editor from '@monaco-editor/react';
import { authContext } from '../../hooks/useAuth';
import { languageOptions } from './utils/languageOptions';
import CodeEditorWindow from './Editor/CodeEditorWIndow';
import LanguagesDropdown from './Editor/LanguagesDropdown';

export default function CollabSpacePage() {
  const javascriptDefault = '// some comment';
  const { user } = useContext(authContext);
  const [matchID, setMatchID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [code, setCode] = useState(javascriptDefault);
  const [customInput, setCustomInput] = useState('');
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState('oceanic-next');
  const [language, setLanguage] = useState(languageOptions[0]);
  const socket = io('http://localhost:8002', { transports: ['websocket'] });

  const onSelectChange = (
    sl: React.SetStateAction<{ id: number; name: string; label: string; value: string; }>,
  ) => {
    console.log('selected Option...', sl);
    setLanguage(sl);
  };

  const onChange = (action: any, data: React.SetStateAction<string>) => {
    switch (action) {
      case 'code': {
        if (matchID === '') {
          setErrorMessage('No room found!');
        } else {
          setCode(data);
          socket.emit('codeEditor', { data, matchID });
        }
        break;
      }
      default: {
        console.warn('case not handled!', action, data);
      }
    }
  };

  useEffect(() => {
    /*
    const editor = document.getElementById('codemirrortext') as HTMLInputElement;

    editor?.addEventListener('keyup', (event) => {
      const data = editor.value;
      if (matchID === '') {
        setErrorMessage('No room found!');
      } else {
        socket.emit('codeEditor', { data, matchID });
      }
    });
    */

    socket.on('connect', () => {
      const room = localStorage.getItem('matchId');

      if (room == null) {
        setErrorMessage('Unable to join room. Make sure you find a match first!');
      } else {
        setMatchID(room);
        socket.emit('joinRoom', { room, user });
      }
    });

    socket.on('codeEditor', (data) => {
      console.log(data);
      onChange('code', data);
      // editor.value = data;
    });

    socket.on('disconnect', (reason) => {
      console.log('other user disconnected');
      socket.emit('disconnect_users', reason);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

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
          {matchID}
        </Text>
      </Text>

      <div className="px-4 py-2">
        <LanguagesDropdown
          onSelectChange={onSelectChange}
        />
      </div>

      <CodeEditorWindow
        code={code}
        onChange={onChange}
        language={language?.value}
        theme={theme}
      />

      <Box height={10} pt={2}>
        {Boolean(errorMessage)
          && <FormErrorMessage my={0}>{errorMessage}</FormErrorMessage>}
      </Box>
    </div>
  );
}
