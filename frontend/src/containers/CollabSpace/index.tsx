/* eslint-disable jsx-a11y/media-has-caption */
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
  Button,
  Textarea,
} from '@chakra-ui/react';
import * as Automerge from '@automerge/automerge';
import Editor from '@monaco-editor/react';
import Peer, { Instance, SignalData } from 'simple-peer';
import Select, { SingleValue } from 'react-select';
import io, { Socket } from 'socket.io-client';
import _ from 'lodash';

import { authContext } from '../../hooks/useAuth';
import { Language, languageOptions } from './utils/languageOptions';

import { changeTextDoc, TextDoc } from './utils/automerge';

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
  // source code: https://github.com/NikValdez/VideoChatTut/blob/master/frontend/src/App.js
  const [mySocketId, setMySocketId] = useState<string>('');
  const [stream, setStream] = useState<MediaStream>();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState<string | SignalData>();
  const [callAccepted, setCallAccepted] = useState(false);
  const [partnerVideo, setPartnerVideo] = useState<any>();
  const [callEnded, setCallEnded] = useState(false);
  const myVideo = useRef<any>();
  // const partnerVideo = useRef<MediaStream>();
  const connectionRef = useRef<Instance>();

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
      setMySocketId(socketId);
      console.log(socketId);
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

    socketRef.current!.on('callUser', (data) => {
      console.log(data);
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });

    socketRef.current!.on('endCall', () => {
      setReceivingCall(false);
      setCallEnded(true);
      setCallAccepted(false);
      setCaller('');
      setCallerSignal('');
      connectionRef.current!.destroy();
      window.location.reload();
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

  const handleCamera = () => {
    // setCameraOn(!isCameraOn);
  };

  const startWebCam = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((video) => {
      setStream(video);
      if (myVideo.current !== undefined) {
        myVideo.current!.srcObject = video;
      }
    });
  };

  const stopWebCam = () => {
    if (myVideo.current !== undefined) {
      myVideo.current.getTracks().forEach((track: any) => {
        track.stop();
      });
    }
  };

  useEffect(() => {
    startWebCam();
  }, []);

  const callUser = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (data) => {
      console.log('i am calling');
      socketRef.current!.emit('callUser', {
        userCalling: mySocketId,
        signalData: data,
        from: mySocketId,
        name: user.username,
      });
    });

    peer.on('stream', (video) => {
      setPartnerVideo(video);
    });

    socketRef.current!.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current! = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (data) => {
      socketRef.current!.emit('answerCall', { signal: data, to: caller });
    });

    peer.on('stream', (video) => {
      setPartnerVideo(video);
    });

    if (callerSignal !== undefined) {
      console.log(callerSignal);
      peer.signal(callerSignal);
    }

    connectionRef.current! = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current!.destroy();
    // socketRef.current!.emit('endCall');
    window.location.reload();
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

      <div>
        <Button variant="contained" color="secondary" onClick={handleCamera}>
          Turn On Camera
        </Button>
      </div>

      <div className="video-container">
        <div className="video">
          {
            true
              ? stream
                && (
                  <video
                    autoPlay
                    playsInline
                    muted
                    ref={(video) => {
                      if (video && (stream !== null)) {
                        // eslint-disable-next-line no-param-reassign
                        video.srcObject = stream;
                      }
                    }}
                    style={{ width: '300px' }}
                  />
                )
              : <Text>Camera not on</Text>
          }
        </div>
        <div className="video">
          {callAccepted && !callEnded
            ? (
              <video
                playsInline
                ref={(video) => {
                  if (video && (partnerVideo !== null)) {
                    // eslint-disable-next-line no-param-reassign
                    video.srcObject = partnerVideo;
                  }
                }}
                autoPlay
                style={{ width: '300px' }}
              />
            )
            : null}
        </div>
      </div>

      <div>
        {receivingCall && !callAccepted ? (
          <div className="caller">
            <h1>
              is calling...
            </h1>
            <Button variant="contained" color="primary" onClick={answerCall}>
              Answer
            </Button>
          </div>
        ) : null}
      </div>

      <div className="call-button">
        {callAccepted && !callEnded ? (
          <Button variant="contained" color="secondary" onClick={leaveCall}>
            End Call
          </Button>
        ) : (
          <Button variant="contained" color="secondary" onClick={() => callUser()}>
            Start Call
          </Button>
        )}
      </div>
    </div>
  );
}
