import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {
  Box,
  Flex,
  AspectRatio,
  Select,
} from '@chakra-ui/react';
import * as Automerge from '@automerge/automerge';
import 'ace-builds';
import AceEditor from 'react-ace';
import io, { Socket } from 'socket.io-client';
import _ from 'lodash';
import './CollabSpace.scss';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/webpack-resolver';

import { authContext } from '../../hooks/useAuth';
import { Language, languageOptions } from './utils/languageOptions';

import { updateDoc, TextDoc } from './utils/automerge';
import ChatBox, { Chat } from '../../components/ChatBox';
import { useMatchDetail } from '../../hooks/useMatch';

export default function CollabSpacePage() {
  const { user } = useContext(authContext);
  const { match, question } = useMatchDetail();
  const [chats, setChats] = useState<Chat[]>([]);

  const socketRef = useRef<Socket>();
  const [editorLanguage, setEditorLanguage] = useState<string>(languageOptions[0].value);
  const [editorText, setEditorText] = useState<string>('');
  const editorDocRef = useRef<Automerge.Doc<TextDoc>>(Automerge.init());

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateView = useCallback(_.throttle((text) => {
    setEditorText(text);
  }, 150), []);

  useEffect(() => {
    socketRef.current = io('ws://localhost:8002');
    const { current: socket } = socketRef;

    socket.on('connect', () => {
      socket.emit('joinRoom', { match: match?._id, user });
    });

    socket.on('joinRoomSuccess', (obj: { changes : Uint8Array[] }) => {
      const { changes } = obj;

      const [doc] = Automerge.applyChanges<Automerge.Doc<TextDoc>>(
        Automerge.init(),
        changes.map((change: ArrayBuffer) => new Uint8Array(change)),
      );

      editorDocRef.current = doc;
      setEditorText(doc.text.toString());
    });

    socket.on('updateCodeSuccess', (diff : Uint8Array[]) => {
      const { current: oldDoc } = editorDocRef;
      const newDoc = Automerge.applyChanges<Automerge.Doc<TextDoc>>(
        oldDoc,
        diff.map((change: ArrayBuffer) => new Uint8Array(change)),
      )[0];
      editorDocRef.current = newDoc;
      setEditorText(newDoc.text.toString());
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
  }, [user, match, updateView]);

  const handleCodeChange = (code: string) => {
    const { current: socket } = socketRef;
    if (!socket) {
      return;
    }
    setEditorText(code);

    const { current: oldDoc } = editorDocRef;
    const newDoc = updateDoc(oldDoc, code);
    const diff = Automerge.getChanges<Automerge.Doc<TextDoc>>(editorDocRef.current, newDoc);
    editorDocRef.current = newDoc;
    socket.emit('updateCode', diff);
  };

  const onSelectChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const { current: socket } = socketRef;
    if (!socket) {
      return;
    }

    const { value } = e.target;

    setEditorLanguage(value);
    socket.emit('setLanguage', value);
  };

  const handleChatSend = (newChat: string) => {
    const { current: socket } = socketRef;
    if (!socket || !newChat) {
      return;
    }

    socket.emit('sendChat', {
      username: user.username,
      content: newChat,
    });
  };

  return (
    <Flex
      gap={{ base: 2, lg: 4 }}
      mt="60px"
      p={{ base: 2, lg: 4 }}
      height="calc(100vh - 60px)"
    >
      <Flex
        gap={{ base: 2, lg: 4 }}
        direction={{ base: 'column', lg: 'row' }}
        width={{ base: '60%', lg: '80%' }}
      >
        <Flex
          width={{ base: '100%', lg: '50%' }}
          height={{ base: '50%', lg: '100%' }}
          bg="white"
          borderRadius={12}
          className="question-container"
          p={4}
          color="brand-gray.4"
          dangerouslySetInnerHTML={{
            __html:
            `<h1>${question?.data.title}</h1>${question?.data.question}`,
          }}
        />

        <Flex
          width={{ base: '100%', lg: '50%' }}
          height={{ base: '50%', lg: '100%' }}
          flexDirection="column"
          py={4}
          bg="white"
          borderRadius={12}
        >
          <Select
            onChange={onSelectChange}
            value={editorLanguage}
            mx={4}
            mb={4}
            width="100%"
            boxSize="border-box"
            variant="unstyled"
            size="xs"
          >
            {languageOptions.map((lang: Language) => (
              <option
                key={lang.key}
                value={lang.value}
              >
                {lang.name}
              </option>
            ))}
          </Select>
          <Flex flexGrow={1}>
            <AceEditor
              mode={editorLanguage}
              theme="github"
              width="100%"
              onChange={handleCodeChange}
              value={editorText}
              name="ACE_EDITOR"
              height="100%"
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                fontSize: 11,
              }}
            />
          </Flex>
        </Flex>
      </Flex>

      <Flex direction="column" width={{ base: '40%', lg: '20%' }} gap={{ base: 2, lg: 4 }}>
        <AspectRatio ratio={4 / 3}>
          {/* TODO:  video chat */}
          <Box bg="white" borderRadius={12}>
            test
          </Box>
        </AspectRatio>
        <AspectRatio ratio={4 / 3}>
          <Box bg="white" borderRadius={12}>
            test
          </Box>
        </AspectRatio>

        <Flex
          direction="column"
          flexGrow={1}
          bg="white"
          overflow="hidden"
          borderRadius={12}
        >
          <ChatBox
            chats={chats}
            handleChatSend={handleChatSend}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
