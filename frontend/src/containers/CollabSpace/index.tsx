import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useReducer,
} from 'react';
import {
  Text,
  Box,
  Button,
} from '@chakra-ui/react';
import * as Automerge from '@automerge/automerge';
import Editor from '@monaco-editor/react';
import Peer from 'peerjs';
import Select, { SingleValue } from 'react-select';
import io, { Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import { authContext } from '../../hooks/useAuth';
import { Language, languageOptions } from './utils/languageOptions';

import { changeTextDoc, TextDoc } from './utils/automerge';

import { peersReducer } from './VideoCallContext/peerReducer';
import { addPeerAction, removePeerAction } from './VideoCallContext/peerActions';

import Video from './VideoCallContext/Video';

type Chat = {
  id: string,
  username?: string,
  content: string,
};

export default function CollabSpacePage() {
  const { user } = useContext(authContext);
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

  // video call declarations
  const myVideo = useRef<any>();
  const [myPeerId, setMyPeerId] = useState<Peer>();
  const [enteredVideoRoom, setEnteredVideoRoom] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peersReducer, {});

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

    socket.on('joinRoomSuccess', (obj: { changes : Uint8Array[], socketId: string }) => {
      const { changes, socketId } = obj;

      const [doc] = Automerge.applyChanges<Automerge.Doc<TextDoc>>(
        Automerge.init(),
        changes.map((change: ArrayBuffer) => new Uint8Array(change)),
      );

      editorDocRef.current = doc;
      setEditorDoc(doc);
    });

    socket.on('updateCodeSuccess', (changes) => {
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

    // Ref: https://www.youtube.com/watch?v=IkNaQZG2Now
    socket.on('userDisconnectedFromVideo', (peerId: string) => {
      console.log(`peer disconnected: ${peerId}`);
      dispatch(removePeerAction(peerId));
    });

    return () => {
      socket.disconnect();
    };
  }, [user, updateView]);

  useEffect(() => {
    const meId = uuidv4();
    const peer = new Peer(meId);
    setMyPeerId(peer);
  }, []);

  useEffect(() => {
    const { current: socket } = socketRef;
    if (!socket) {
      // return;
    }
  }, []);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia(
      { video: true, audio: true },
    ).then((video) => {
      setStream(video);
      if (myVideo.current !== undefined) {
        myVideo.current!.srcObject = video;
      }
    });
  }, [enteredVideoRoom]);

  // Ref: https://www.youtube.com/watch?v=IkNaQZG2Now
  useEffect(() => {
    const { current: socket } = socketRef;
    if (!socket) {
      return;
    }

    if (!myPeerId) {
      return;
    }

    if (!stream) {
      return;
    }

    socket.on('user-joined-video', ({ peerId }) => {
      const call = myPeerId.call(peerId, stream);
      console.log(`peer: ${peerId}`);
      call.on('stream', (peerStream) => {
        dispatch(addPeerAction(peerId, peerStream));
      });
    });

    myPeerId.on('call', (call) => {
      call.answer(stream);
      console.log('call');
      call.on('stream', (peerStream) => {
        dispatch(addPeerAction(call.peer, peerStream));
      });
    });
  }, [myPeerId, stream]);

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

  // Ref: https://www.youtube.com/watch?v=IkNaQZG2Now
  const joinVideoRoom = () => {
    const { current: socket } = socketRef;
    if (!socket) {
      return;
    }

    setEnteredVideoRoom(true);
    // eslint-disable-next-line no-lonely-if
    if (myPeerId) {
      socket.emit('join-video-room', { peerId: myPeerId.id });
    }
  };

  // Ref: https://www.youtube.com/watch?v=IkNaQZG2Now
  const leaveVideoRoom = () => {
    setEnteredVideoRoom(false);

    const { current: socket } = socketRef;
    if (!socket) {
      return;
    }

    if (myPeerId) {
      socket!.emit('disconnectFromVideo', { peerId: myPeerId.id });
    }
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

      {
        // Ref: https://www.youtube.com/watch?v=IkNaQZG2Now
      }
      <div className="grid grid-cols-4 gap-4">
        { enteredVideoRoom && stream ? (
          <Video className="me" key="me" stream={stream} />
        ) : (
          <Text>Error Loading WebCam</Text>
        )}

        { enteredVideoRoom ? (
          Object.values(peers).map((peer: any) => (
            <Video className="not_me" key={peer.id} stream={peer.stream} />
          ))
        ) : (
          <Text>Room Not Joined</Text>
        )}
      </div>

      <div className="call-button">
        { !enteredVideoRoom ? (
          <Button variant="contained" color="secondary" onClick={() => joinVideoRoom()}>
            Join Video Room
          </Button>
        ) : (
          <Button variant="contained" color="secondary" onClick={() => leaveVideoRoom()}>
            Leave Video Room
          </Button>
        )}
      </div>
    </div>
  );
}
