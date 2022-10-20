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
import * as Automerge from '@automerge/automerge';
import Editor, { OnMount } from '@monaco-editor/react';
import Select from 'react-select';
import * as Y from 'yjs';
import io, { Socket } from 'socket.io-client';
import { SocketIOProvider } from 'y-socket.io';
import * as MonacoCollabExt from '@convergencelabs/monaco-collab-ext';
import { authContext } from '../../hooks/useAuth';
import { languageOptions } from './utils/languageOptions';

import './index.css';
import { changeTextDoc, TextDoc } from './utils/automerge';

export default function CollabSpacePage() {
  const [language, setLanguage] = useState(languageOptions[0]);
  const [editorCode, setEditorCode] = useState('');
  const { user } = useContext(authContext);
  const matchId = 'test';
  const [newMessage, setNewMessage] = useState('');
  const [chatBoxMessages, setChatBoxMessages] = useState(
    [{ message: `Welcome to ${matchId}`, key: 0 }],
  );
  const ydoc = useRef<Y.Doc>();
  const provider = useRef<SocketIOProvider>();
  const socket = useRef<Socket>();
  const [editorDoc, setEditorDoc] = useState<Automerge.Doc<TextDoc>>();

  useEffect(() => {
    if (!ydoc.current) {
      console.log('setting doc');
      ydoc.current = new Y.Doc();
      const yMap = ydoc.current.getMap('data');

      if (!yMap.has('codeEditor')) {
        yMap.set('codeEditor', '');
        yMap.observe(() => {
          setEditorCode(yMap.get('codeEditor') as string);
        });
      }
    }
  }, [editorCode]);

  useEffect(() => {
    if (!!ydoc.current! && !provider.current) {
      console.log('setting providers');
      provider.current = new SocketIOProvider(
        'ws://localhost:8002',
        matchId,
        ydoc.current,
        {
          autoConnect: true,
        },
      );
    }
  }, [user]);

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
      setEditorDoc(doc);
    });

    socket.current!.on('updateCodeSuccess', (changes) => {
      setEditorDoc((oldDoc) => {
        console.log(oldDoc?.text.elems);
        return Automerge.applyChanges<Automerge.Doc<TextDoc>>(
          Automerge.clone(oldDoc!),
          changes.map((change: ArrayBuffer) => new Uint8Array(change)),
        )[0];
      });
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
  }, [user, language]);

  const onCodeChange = (code: string) => {
    if (!socket.current) {
      return;
    }
    const newDoc = changeTextDoc(editorDoc!, code!);
    setEditorDoc(newDoc);
    const changes = Automerge.getChanges(editorDoc!, newDoc);
    socket.current.emit('updateCode', changes);
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
    // ydoc.current!.getMap('data').set('chatMessage', message);
    setChatBoxMessages((arr) => [...arr, { message, key: arr.length }]);
    socket.current.emit('chatBox', message);
    setNewMessage('');
  };

  const cursorManager = useRef<MonacoCollabExt.RemoteCursorManager>();
  const selectionManager = useRef<MonacoCollabExt.RemoteSelectionManager>();

  const staticUser = {
    id: 'static',
    label: 'Static User',
    color: 'blue',
  };

  const handleEditorDidMount: OnMount = (editor, _monaco) => {
    cursorManager.current = new MonacoCollabExt.RemoteCursorManager({
      editor,
      tooltips: true,
      tooltipDuration: 2,
    });
    const staticUserCursor = cursorManager
      .current
      .addCursor(staticUser.id, staticUser.color, staticUser.label);
    selectionManager.current = new MonacoCollabExt.RemoteSelectionManager({ editor });
    selectionManager.current.addSelection(staticUser.id, staticUser.color, staticUser.label);

    staticUserCursor.setOffset(50);
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
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  );
}