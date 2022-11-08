import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {
  Button,
  Box,
  Flex,
  AspectRatio,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import * as Automerge from '@automerge/automerge';
import 'ace-builds';
import AceEditor from 'react-ace';
import io, { Socket } from 'socket.io-client';
import Peer from 'simple-peer';
import './CollabSpace.scss';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/webpack-resolver';

import { useNavigate } from 'react-router';
import axios from 'axios';
import { authContext } from '../../hooks/useAuth';
import { Language, languageOptions } from './utils/languageOptions';

import { updateDoc, TextDoc } from './utils/automerge';
import ChatBox, { Chat } from '../../components/ChatBox';
import { useMatchDetail } from '../../hooks/useMatch';
import { STATUS_CODE_OK } from '../../constants';

export default function CollabSpacePage() {
  const { user } = useContext(authContext);
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const socketRef = useRef<Socket>();
  const { match, matchLoading } = useMatchDetail();
  const [editorLanguage, setEditorLanguage] = useState<string>(languageOptions[0].value);
  const [editorText, setEditorText] = useState<string>('');
  const editorDocRef = useRef<Automerge.Doc<TextDoc>>(Automerge.init());

  const userVideoRef = useRef<HTMLVideoElement>(
    document.createElement('video') as HTMLVideoElement,
  );
  const partnerPeerRef = useRef<Peer.Instance>(null!);
  const partnerVideoRef = useRef<HTMLVideoElement>(null!);
  const [partnerPeerConnected, setPartnerPeerConnected] = useState<boolean>(false);

  useEffect(() => {
    if (matchLoading) {
      return;
    }
    if (!match) {
      navigate('/');
    }
  }, [match, matchLoading, navigate]);

  const handleLeaveMatch = () => {
    const { current: socket } = socketRef;
    if (!socket || !match) {
      return;
    }
    axios.post(`http://localhost:8001/end/${match.id}`)
      .then((response) => {
        if (response.status === STATUS_CODE_OK) {
          onClose();
          socket.emit('leaveMatch', { matchId: match.id });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleJoinRoomSuccess = useCallback((obj: {
    changes : Uint8Array[],
    savedChats: Chat[]
  }) => {
    const { changes, savedChats } = obj;

    const [doc] = Automerge.applyChanges<Automerge.Doc<TextDoc>>(
      Automerge.init(),
      changes.map((change: ArrayBuffer) => new Uint8Array(change)),
    );

    editorDocRef.current = doc;
    setEditorText(doc.text.toString());
    setChats(savedChats);
  }, []);

  const handleUpdateCodeSuccess = useCallback((diff : Uint8Array[]) => {
    const { current: oldDoc } = editorDocRef;
    const newDoc = Automerge.applyChanges<Automerge.Doc<TextDoc>>(
      oldDoc,
      diff.map((change: ArrayBuffer) => new Uint8Array(change)),
    )[0];
    editorDocRef.current = newDoc;
    setEditorText(newDoc.text.toString());
  }, []);

  const handleConnect = useCallback(() => {
    const { current: socket } = socketRef;
    if (socket && !matchLoading && match) {
      socket.emit('joinRoom', { matchId: match.id, user });
    }
  }, [match, matchLoading, user]);

  const createPeer = ({ partner, callerId, stream }: {
    partner: string;
    callerId: string;
    stream: MediaStream;
  }) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      const { current: socket } = socketRef;
      if (socket) {
        socket.emit('sendSignal', { partner, callerId, signal });
      }
    });

    return peer;
  };

  const addPeer = ({ partner, callerId, stream }: {
    partner: string;
    callerId: string;
    stream: MediaStream;
  }) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      const { current: socket } = socketRef;
      if (socket) {
        socket.emit('returnSignal', { callerId, signal });
      }
    });

    peer.signal(partner);

    return peer;
  };

  useEffect(
    () => {
      socketRef.current = io('ws://localhost:8002');
      const { current: socket } = socketRef;

      (async () => {
        await navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            if (userVideoRef.current) {
              userVideoRef.current.srcObject = stream;
            }
          });
      })();

      socket.on('connect', () => {
        handleConnect();
      });

      socket.on('joinRoomSuccess', (obj: {
        changes : Uint8Array[],
        savedChats: Chat[],
        partnerSocketId : string
      }) => {
        const { changes, savedChats, partnerSocketId } = obj;
        handleJoinRoomSuccess({ changes, savedChats });

        if (partnerSocketId) {
          const { current: { srcObject } } = userVideoRef;
          const peer = createPeer({
            partner: partnerSocketId,
            callerId: socket.id,
            stream: srcObject as MediaStream,
          });
          partnerPeerRef.current = peer;

          peer.on('stream', (stream) => {
            partnerVideoRef.current.srcObject = stream;
          });
          setPartnerPeerConnected(true);
        }
      });

      socket.on('sendSignalSuccess', (obj) => {
        const { callerId, signal }: {
          callerId: string;
          signal: string;
        } = obj;
        const { current: { srcObject } } = userVideoRef;
        const peer = addPeer({
          partner: signal,
          callerId,
          stream: srcObject as MediaStream,
        });
        partnerPeerRef.current = peer;

        peer.on('stream', (stream) => {
          partnerVideoRef.current.srcObject = stream;
        });
        setPartnerPeerConnected(true);
      });

      socket.on('returnSignalSuccess', (obj) => {
        const { signal } = obj;
        partnerPeerRef.current.signal(signal);
      });

      socket.on('partnerDisconnect', () => {
        setPartnerPeerConnected(false);
        partnerPeerRef.current.destroy();
      });

      socket.on('updateCodeSuccess', (diff : Uint8Array[]) => {
        handleUpdateCodeSuccess(diff);
      });

      socket.on('leaveMatchSuccess', () => {
        socket.disconnect();
        // TODO: modal
        navigate('/');
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
    },
    [
      navigate,
      handleConnect,
      handleJoinRoomSuccess,
      handleUpdateCodeSuccess,
    ],
  );

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
    socketRef.current?.emit('sendChat', {
      username: user.username,
      content: newChat,
    });
  };

  return (
    <Flex
      gap={{ base: 2, lg: 4 }}
      p={{ base: 2, lg: 4 }}
      height="100vh"
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
            `<h1>${match?.question?.title}</h1>${match?.question?.question}`,
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
        <Button
          minHeight={{ base: '40px', lg: '48px' }}
          height={{ base: '40px', lg: '48px' }}
          fontSize={{ base: 12, lg: 14 }}
          onClick={onOpen}
          bg="brand-red.1"
          color="brand-white"
          transition="background-color 100ms ease-out, opacity 100ms ease-out"
          fontWeight="500"
          borderRadius={8}
          _hover={
            { bg: 'brand-red.2' }
          }
          _active={
            { bg: 'brand-red.3' }
          }
        >
          Leave match
        </Button>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          isCentered
        >
          <ModalOverlay />
          <ModalContent p={2}>
            <ModalHeader
              fontWeight={500}
              color="brand-gray.4"
              mb={4}
            >
              Match in progress
            </ModalHeader>
            <ModalBody
              fontSize={14}
              color="brand-gray.3"
              lineHeight="1.75em"
              mb={4}
            >
              Would you like to leave this match?
            </ModalBody>
            <ModalFooter>
              <Button
                variant="link"
                fontSize={{ base: 12, lg: 14 }}
                onClick={onClose}
                mr={6}
                fontWeight={500}
              >
                Resume match
              </Button>
              <Button
                minHeight={{ base: '40px', lg: '48px' }}
                height={{ base: '40px', lg: '48px' }}
                fontSize={{ base: 12, lg: 14 }}
                onClick={handleLeaveMatch}
                bg="brand-red.1"
                color="brand-white"
                transition="background-color 100ms ease-out, opacity 100ms ease-out"
                fontWeight="500"
                borderRadius={8}
                _hover={
                  { bg: 'brand-red.2' }
                }
                _active={
                  { bg: 'brand-red.3' }
                }
              >
                Leave match
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <AspectRatio ratio={4 / 3}>
          {/* TODO:  video chat */}
          <Box bg="white" borderRadius={12}>
            <video
              style={{ width: '100%', height: '100%' }}
              playsInline
              muted
              ref={userVideoRef}
              autoPlay
            />
          </Box>
        </AspectRatio>
        <AspectRatio ratio={4 / 3}>
          <Box bg="white" borderRadius={12}>
            {partnerPeerConnected ? (
              <video
                playsInline
                muted
                ref={partnerVideoRef}
                autoPlay
              />
            ) : null}
          </Box>
        </AspectRatio>

        <Flex
          direction="column"
          bg="white"
          overflow="hidden"
          grow={1}
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
