import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import { io } from 'socket.io-client';
import { useParams } from 'react-router';

const socket = io('http://localhost:8001')

export default function WaitingRoomPage() {
    const [remainingTime, setRemainingTime] = useState(30);
    const [foundMatch, setFoundMatch] = useState(false);
    const { diff } = useParams();

    useEffect(() => {
        socket.emit('createMatch', {username: 'test', difficulty: diff});
    }, []);

    useEffect(() => {
        socket.on('matched', () => {
            setFoundMatch(true);
        });
    }, [socket]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (remainingTime === 0) {
                return;
            }
            setRemainingTime(remainingTime-1);

            if (remainingTime === 0) {
                console.log("time out")
            }
        }, 1000)
        return () => clearInterval(intervalId);
    }, [remainingTime])

    return (
    <Container>
            <Typography>
                {/* {route.params.difficulty} */}
            </Typography>
            <Typography>
                {
                foundMatch
                ? <>FOUND A MATCH</>
                : remainingTime === 0
                ? <>No match found at the moment</>
                : remainingTime + 's'
                }
            </Typography>
    </Container>
    );
}