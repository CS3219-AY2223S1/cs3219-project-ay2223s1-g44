import React, {
  useEffect, useContext, useRef, useState,
} from 'react';
import { Box } from '@chakra-ui/react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

import { authContext } from '../../hooks/useAuth';

interface FindStateProps {
  isFinding: boolean,
  matchedPlayer: string
}

export default function WaitingRoomPage() {
  const { user } = useContext(authContext);

  const [findState, setFindState] = useState<FindStateProps>({
    isFinding: true,
    matchedPlayer: '',
  });
  const { difficulty } = useParams();
  const effectRan = useRef(false); // TODO: move page away entirely so that this is not needed

  useEffect(() => {
    const socket = io('http://localhost:8001');

    socket.on('connect', () => {
      if (!effectRan.current) {
        socket.emit('findMatch', { user, difficulty });
        effectRan.current = true;
      }
    });

    socket.on('playerFound', (res: { data : { id: string, username: string }, matchId: string }) => {
      localStorage.setItem('matchId', res.matchId);
      setFindState((state) => ({
        ...state,
        isFinding: false,
        matchedPlayer: res.data.username,
      }));
    });

    socket.on('timeOut', () => {
      setFindState((state) => ({
        ...state,
        isFinding: false,
      }));
    });

    return () => {
      socket.close();
    };
  }, [user, difficulty]);

  const renderContent = () => {
    if (findState.isFinding) {
      return <div>FINDING MATCH...</div>;
    }
    if (findState.matchedPlayer) {
      return (
        <div>
          MATCH FOUND WITH PLAYER:
          {' '}
          {findState.matchedPlayer}
        </div>
      );
    }
    return <div>NO MATCH FOUND AT THE MOMENT</div>;
  };

  return (
    <Box>
      {/* <Typography>
        {route.params.difficulty}
      </Typography> */}
      {renderContent()}
    </Box>
  );
}
