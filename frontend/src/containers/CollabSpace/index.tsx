import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {
  Text,
  Box,
} from '@chakra-ui/react';
import * as Automerge from '@automerge/automerge';
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import io, { Socket } from 'socket.io-client';
import _ from 'lodash';
import { authContext } from '../../hooks/useAuth';
import { languageOptions } from './utils/languageOptions';

import { changeTextDoc, TextDoc } from './utils/automerge';

export default function CollabSpacePage() {
  const [language, setLanguage] = useState(languageOptions[0]);
  const { user } = useContext(authContext);
  const matchId = 'test';
  const [newMessage, setNewMessage] = useState('');
  const [chatBoxMessages, setChatBoxMessages] = useState(
    [{ message: `Welcome to ${matchId}`, key: 0 }],
  );
  const socket = useRef<Socket>();
  const [editorDoc, setEditorDoc] = useState<Automerge.Doc<TextDoc>>();
  const isSocketRef = useRef<boolean>(false);
  const editorDocRef = useRef<Automerge.Doc<TextDoc>>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateView = useCallback(_.throttle((doc) => {
    setEditorDoc(doc);
  }, 150), []);

  useEffect(() => {
    socket.current = io('ws://localhost:8002');
    const sc = socket.current;

    sc.on('connect', () => {
      sc.emit('joinRoom', { matchId, user });
    });

    sc.on('joinRoomSuccess', (obj) => {
      const { changes } = obj;

      const [doc] = Automerge.applyChanges<Automerge.Doc<TextDoc>>(
        Automerge.init(),
        changes.map((change: ArrayBuffer) => new Uint8Array(change)),
      );

      editorDocRef.current = doc;
      setEditorDoc(doc);
    });

    socket.current!.on('updateCodeSuccess', (changes) => {
      isSocketRef.current = true;
      const newDoc = Automerge.applyChanges<Automerge.Doc<TextDoc>>(
        Automerge.clone(editorDocRef.current!),
        changes.map((change: ArrayBuffer) => new Uint8Array(change)),
      )[0];
      editorDocRef.current = newDoc;
      updateView(newDoc);
    });

    sc.on('setLanguage', (lang) => {
      setLanguage(lang);
    });

    sc.on('chatBox', (message) => {
      setChatBoxMessages((arr) => [...arr, { message, key: arr.length }]);
    });

    sc.on('disconnect', (reason) => {
      sc.emit('disconnect_users', reason);
    });

    return () => {
      sc.close();
    };
  }, [user, language, updateView]);

  const onCodeChange = (code: string) => {
    if (!socket.current) {
      return;
    }
    if (isSocketRef.current) {
      isSocketRef.current = false;
      return;
    }
    const newDoc = changeTextDoc(editorDocRef.current!, code!);
    const changes = Automerge.getChanges(editorDocRef.current!, newDoc);
    socket.current.emit('updateCode', changes);
    editorDocRef.current = newDoc;
  };

  // code referenced from:
  // https://www.freecodecamp.org/news/how-to-build-react-based-code-editor/amp/
  const onSelectChange = (
    lang: any,
  ) => {
    if (!socket.current) {
      return;
    }
    if (lang === undefined) {
      setLanguage(languageOptions[0]);
    } else {
      setLanguage(lang);
    }
    socket.current.emit('setLanguage', lang);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!socket.current) {
      return;
    }
    event.preventDefault();
    const message = `${String(user.username)}: ${newMessage}`;
    setChatBoxMessages((arr) => [...arr, { message, key: arr.length }]);
    socket.current.emit('chatBox', message);
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

      <form onSubmit={handleSubmit}>
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
          language={language.value}
          value={editorDoc?.text.toString()}
          theme="cobalt"
          onChange={(code) => onCodeChange(code!)}
        />
      </div>
    </div>
  );
}
