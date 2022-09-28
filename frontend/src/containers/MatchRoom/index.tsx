import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { Container } from '@mui/material';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

import { authContext } from '../../hooks/useAuth';

export default function WaitingRoomPage() {
  const { user } = useContext(authContext);

  const [remainingTime, setRemainingTime] = useState(5);
  const [foundMatch, setFoundMatch] = useState(false);
  const { difficulty } = useParams();
  const effectRan = useRef(false); // TODO: move page away entirely so that this is not needed
  const id = useRef<number>();

  const clear = () => {
    window.clearInterval(id.current);
  };

  useEffect(() => {
    const socket = io('http://localhost:8001');

    socket.on('connect', () => {
      if (!effectRan.current) {
        socket.emit('findMatch', { user, difficulty });
        effectRan.current = true;
      }
    });

    socket.on('playerFound', () => {
      setFoundMatch(true);
    });

    return () => {
      socket.close();
    };
  }, [user, difficulty]);

  useEffect(() => {
    id.current = window.setInterval(() => {
      setRemainingTime((rt) => rt - 1);
    }, 1000);
    return clear;
  }, []);

  const renderContent = () => {
    if (foundMatch) {
      return <div>FOUND A MATCH</div>;
    } if (remainingTime < 1) {
      return <div>NO MATCH FOUND AT THE MOMENT</div>;
    }
    return `${remainingTime}s`;
  };

  return (
    <Container>
      {/* <Typography>
        {route.params.difficulty}
      </Typography> */}
      {renderContent()}
    </Container>
  );
}
