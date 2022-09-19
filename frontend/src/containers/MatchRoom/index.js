import React, { useEffect, useRef, useState } from 'react';
import { Container } from '@mui/material';
import { io } from 'socket.io-client';
import { useParams } from 'react-router';

const socket = io('http://localhost:8001');

export default function WaitingRoomPage() {
  const [remainingTime, setRemainingTime] = useState(5);
  const [foundMatch, setFoundMatch] = useState(false);
  const { diff } = useParams();
  const effectRan = useRef(false);
  const id = useRef(null);

  const clear = () => {
    window.clearInterval(id.current);
  };
  useEffect(() => {
    id.current = window.setInterval(() => {
      setRemainingTime((rt) => rt - 1);
    }, 1000);
    return () => clear();
  }, []);

  useEffect(() => {
    if (remainingTime === 0) {
      socket.emit('timeOut', { username: 'test', difficulty: diff });
      clear();
    }
  }, [remainingTime, diff]);

  useEffect(() => {
    if (!effectRan.current) {
      socket.emit('createMatch', { username: 'test', difficulty: diff });
      effectRan.current = true;
    }
  }, [diff]);

  useEffect(() => {
    socket.on('matched', () => {
      setFoundMatch(true);
    });
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
