import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8001')

export default function WaitingRoomPage({route}) {

    socket.on('connect', () => {
        socket.emit('createMatch', {username: 'test', difficulty: 'test'});
        socket.on('matched', () => {
            console.log("matched!!")
        });
    })

    const [remainingTime, setRemainingTime] = useState(30)

    console.log(route)

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
                {/* {route.params.difficulty} */}
            </Typography>
            <Typography>
                {remainingTime}
            </Typography>
            <Typography>
                    s
            </Typography>
    </Container>
    );
}