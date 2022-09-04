import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8001')

const WaitingRoomPage = (props) =>  {

    socket.on('connect', () => {
        socket.emit('createMatch', {username: props.username, difficulty: props.difficulty});
        socket.on('matched', () => {
            <Navigate to={{
                pathname: 'room',
                socket: socket,
            }}
                />
        });
    })

    const [remainingTime, setRemainingTime] = useState(3)

    useEffect(() => {
        const intervalId = setInterval(() => {
            setRemainingTime(remainingTime-1);

            if (remainingTime === 1) {
                console.log("time out")
            }
        }, 1000)
        return () => clearInterval(intervalId);
    }, [remainingTime])

    if (remainingTime === 0) {
        return <Navigate to="/match-fail" />
    }


    return (
    <Container>
            <Typography>
                {remainingTime}
            </Typography>
            <Typography>
                    s
            </Typography>
    </Container>
    );
}

export default WaitingRoomPage;