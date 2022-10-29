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
import Select, { SingleValue } from 'react-select';
import io, { Socket } from 'socket.io-client';
import _ from 'lodash';

import { authContext } from '../../hooks/useAuth';
import { Language, languageOptions } from './utils/languageOptions';

import { changeTextDoc, TextDoc } from './utils/automerge';
import { matchContext } from '../../hooks/useMatch';

type Chat = {
  id: string,
  username?: string,
  content: string,
};

export default function CollabSpacePage() {
  const { user } = useContext(authContext);
  const matchDetail = useContext(matchContext);
  const matchId = 'test';
  const [newMessage, setNewMessage] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);

  // isSocketRef used to differentiate user and partner code update
  const socketRef = useRef<Socket>();
  const isSocketRef = useRef<boolean>(false);

  // editorDoc for rendering, editorDocRef for actual content
  const [editorLanguage, setEditorLanguage] = useState<Language>(languageOptions[0]);
  const [editorDoc, setEditorDoc] = useState<Automerge.Doc<TextDoc>>();
  const editorDocRef = useRef<Automerge.Doc<TextDoc>>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateView = useCallback(_.throttle((doc) => {
    setEditorDoc(doc);
  }, 150), []);

  useEffect(() => {
    if (matchDetail.match) {
      console.log(matchDetail);
    }
    socketRef.current = io('ws://localhost:8002');
    const { current: socket } = socketRef;

    socket.on('connect', () => {
      socket.emit('joinRoom', { matchId, user });
    });

    socket.on('joinRoomSuccess', (obj: { changes : Uint8Array[] }) => {
      const { changes } = obj;

      const [doc] = Automerge.applyChanges<Automerge.Doc<TextDoc>>(
        Automerge.init(),
        changes.map((change: ArrayBuffer) => new Uint8Array(change)),
      );
      editorDocRef.current = doc;
      setEditorDoc(doc);
    });

    socketRef.current!.on('updateCodeSuccess', (changes) => {
      isSocketRef.current = true;
      const newDoc = Automerge.applyChanges<Automerge.Doc<TextDoc>>(
        Automerge.clone(editorDocRef.current!),
        changes.map((change: ArrayBuffer) => new Uint8Array(change)),
      )[0];
      editorDocRef.current = newDoc;
      updateView(newDoc);
    });

    socket.on('setLanguageSuccess', (lang) => {
      setEditorLanguage(lang);
    });

    socket.on('sendChatSuccess', (savedChats: Chat[]) => {
      setChats(savedChats);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, matchDetail, updateView]);

  const handleCodeChange = (code: string) => {
    const { current: socket } = socketRef;
    if (!socket) {
      return;
    }
    if (isSocketRef.current) {
      isSocketRef.current = false;
      return;
    }

    const newDoc = changeTextDoc(editorDocRef.current!, code!);
    const changes = Automerge.getChanges(editorDocRef.current!, newDoc);

    socket.emit('updateCode', changes);
    editorDocRef.current = newDoc;
  };

  const onSelectChange = (
    lang: SingleValue<Language>,
  ) => {
    const { current: socket } = socketRef;
    if (!socket) {
      return;
    }

    setEditorLanguage(lang as Language);
    socket.emit('setLanguage', lang);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const { current: socket } = socketRef;
    if (!socket) {
      return;
    }

    event.preventDefault();
    socket.emit('sendChat', {
      username: user.username,
      content: newMessage,
    });
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
        {chats
        && chats.map((c: Chat) => (
          <Text key={c.id}>
            {c.username
              ? `${c.username}: ${c.content}`
              : `${c.content}`}
          </Text>
        ))}
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
          onChange={onSelectChange}
          value={editorLanguage}
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
          // language={language.value}
          value={editorDoc?.text.toString()}
          theme="cobalt"
          onChange={(code) => handleCodeChange(code!)}
        />
      </div>
    </div>
  );
}
