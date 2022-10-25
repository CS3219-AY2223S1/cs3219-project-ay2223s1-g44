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
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Select,
} from '@chakra-ui/react';
import * as Automerge from '@automerge/automerge';
import Editor, { OnMount } from '@monaco-editor/react';
import io, { Socket } from 'socket.io-client';
import _ from 'lodash';
import { IoSend } from 'react-icons/io5';
import './CollabSpace.scss';

import { editor } from 'monaco-editor';
import { authContext } from '../../hooks/useAuth';
import { Language, languageOptions } from './utils/languageOptions';

import { changeTextDoc, TextDoc } from './utils/automerge';
import { MOCK_TITLE, MOCK_QUESTION } from './mock';
import Chats, { Chat } from '../../components/Chats';

export default function CollabSpacePage() {
  const { user } = useContext(authContext);
  const matchId = 'test';
  const [newMessage, setNewMessage] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);

  // isSocketRef used to differentiate user and partner code update
  const socketRef = useRef<Socket>();
  const isSocketRef = useRef<boolean>(false);

  // editorDoc for rendering, editorDocRef for actual content
  const [editorLanguage, setEditorLanguage] = useState<string>(languageOptions[0].value);
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const [editorDoc, setEditorDoc] = useState<Automerge.Doc<TextDoc>>();
  const editorDocRef = useRef<Automerge.Doc<TextDoc>>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateView = useCallback(_.throttle((doc) => {
    setEditorDoc(doc);
  }, 150), []);

  useEffect(() => {
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
  }, [user, updateView]);

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

  const onSelectChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const { current: socket } = socketRef;
    if (!socket) {
      return;
    }

    const { value } = e.target;

    setEditorLanguage(value);
    socket.emit('setLanguage', value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { current: socket } = socketRef;
    if (!socket || !newMessage) {
      return;
    }

    socket.emit('sendChat', {
      username: user.username,
      content: newMessage,
    });
    setNewMessage('');
  };

  const handleEditorMount: OnMount = (editorInstance, _monaco) => {
    editorRef.current = editorInstance;
  };

  return (
    <Flex gap={{ base: 2, lg: 4 }} p={{ base: 2, lg: 4 }} height="calc(100vh - 60px)">
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
          dangerouslySetInnerHTML={{ __html: `<h1>${MOCK_TITLE}</h1>${MOCK_QUESTION}` }}
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
                value={lang.value}
              >
                {lang.label}
              </option>
            ))}
          </Select>
          <Flex flexGrow={1} overflow="hidden">
            <Editor
              language={editorLanguage}
              value={editorDoc?.text.toString()}
              theme="cobalt"
              height="100%"
              onMount={handleEditorMount}
              options={{
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize: 11,
              }}
              onChange={(code) => handleCodeChange(code!)}
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
          <Chats chats={chats} />
          <form onSubmit={handleSubmit}>
            <InputGroup borderTop="1px solid" borderColor="brand-gray.1">
              <Input
                type="text"
                name="input"
                onChange={(event) => setNewMessage(event.target.value)}
                value={newMessage}
                borderRadius={12}
                borderTopRadius={0}
                fontSize={12}
                variant="filled"
                bg="white"
                border="none"
                color="brand-gray.4"
                _hover={{ bg: 'gray.50' }}
                _focus={{
                  border: 'none',
                  bg: 'gray.100',
                }}
              />
              <InputRightElement>
                <IconButton
                  aria-label="submit"
                  type="submit"
                  bg="none"
                  fontSize={16}
                  color="brand-blue.1"
                  icon={<IoSend />}
                  _hover={{
                    bg: 'none',
                    color: 'brand-blue.2',
                  }}
                  _active={{
                    bg: 'none',
                    color: 'brand-blue.3',
                  }}
                />
              </InputRightElement>
            </InputGroup>
          </form>
        </Flex>
      </Flex>
    </Flex>
  );
}
