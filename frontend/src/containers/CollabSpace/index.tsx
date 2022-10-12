
import {
  Text,
  Code,
} from '@chakra-ui/react';
import io from 'socket.io-client';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-ocean.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/keymap/sublime';
import CodeMirror from 'codemirror';
import { authContext } from '../../hooks/useAuth';

export default function CollabSpacePage() {
  console.log('test');
  // const matchId = localStorage.getItem('matchId');
  const matchId = 'testRoom';
  const textArea = useRef() as React.MutableRefObject<HTMLTextAreaElement>;
  const { user } = useContext(authContext);
<<<<<<< HEAD
  const [roomID, setRoomID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [input, setInput] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:8002', { transports: ['websocket'] });

    const editor = document.getElementById('codemirrortext') as HTMLInputElement;

    editor?.addEventListener('keyup', (event) => {
      const text = editor.value;
      if (roomID === '') {
        setErrorMessage('No room found!');
      } else {
        socket.emit('codeEditor', { text, roomID });
      }
    });

    socket.on('connect', () => {
      const room = localStorage.getItem('matchId');

      if (room == null) {
        setErrorMessage('Unable to join room. Make sure you find a match first!');
      } else {
        setRoomID(room);
        socket.emit('joinRoom', { room, user });
      }
    });

    socket.on('codeEditor', (code) => {
      // editor.setValue(code);
      editor.value = code;
    });

    socket.on('disconnect', (reason) => {
      console.log('other user disconnected');
      // socket.emit('disconnect_users', reason);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomID]);
=======

  useEffect(() => {
    const socket = io('http://localhost:8002');
    console.log('test 2');
    const editor = CodeMirror.fromTextArea(textArea.current, {
      lineNumbers: true,
      keyMap: 'sublime',
      theme: 'material-ocean',
      mode: 'javascript',
    });

    editor.on('change', (instance, changes) => {
      const { origin } = changes;
      if (origin !== 'setValue') {
        const value = instance.getValue();
        if (matchId != null) {
          socket.emit('codeEditor', { value, matchId });
        }
      }
    });

    if (matchId !== null) {
      socket.on('connect', () => {
        console.log(matchId);
        socket.emit('joinRoom', { matchId, user });

        socket.on('codeEditor', (code) => {
          editor.setValue(code);
        });

        socket.on('disconnect', (reason) => {
          console.log('other user disconnected');
          socket.emit('disconnect_users', reason);
        });
      });
    }
  }, [user]);
  // useEffect(() => {
  //   // @ts-ignore
  //   // source code:
  //   // eslint-disable-next-line max-len
  //   // https://github.com/Rowadz/real-time-collaborative-code-editor/blob/main/src/RealTimeEditor.jsx
  //   const editor = CodeMirror.fromTextArea(document.getElementById('ds'), {
  //     lineNumbers: true,
  //     keyMap: 'sublime',
  //     theme: 'material-ocean',
  //     mode: 'javascript',
  //   });
>>>>>>> 57e8583240892540397c0e3bb75b5fc6f85f0132

  //   socket.on('connect', () => {
  //     const room = localStorage.getItem('matchId');

  //     if (room == null) {
  //       setErrorMessage('Unable to join room. Make sure you find a match first!');
  //     } else {
  //       socket.emit('joinRoom', { room, user });
  //     }
  //   });

  //   editor.on('change', (instance, changes) => {
  //     const { origin } = changes;
  //     if (origin !== 'setValue') {
  //       const value = instance.getValue();
  //       if (roomID === '') {
  //         setErrorMessage('No room found!');
  //       } else {
  //         socket.emit('codeEditor', { value, roomID });
  //       }
  //     }
  //   });

  //   socket.on('codeEditor', (code) => {
  //     editor.setValue(code);
  //   });

  //   socket.on('disconnect', (reason) => {
  //     console.log('other user disconnected');
  //     socket.emit('disconnect_users', reason);
  //   });

  //   return () => {
  //     socket.close();
  //   };
  // }, []);
  return (
    <>
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
<<<<<<< HEAD

      <textarea
        rows={30}
        cols={50}
        placeholder="Type Your Text..."
        id="codemirrortext"
      />

      <Box height={10} pt={2}>
        {Boolean(errorMessage)
          && <FormErrorMessage my={0}>{errorMessage}</FormErrorMessage>}
      </Box>
    </>
=======
      <Code />
      <textarea ref={textArea} />
    </div>
>>>>>>> 57e8583240892540397c0e3bb75b5fc6f85f0132
  );
}
