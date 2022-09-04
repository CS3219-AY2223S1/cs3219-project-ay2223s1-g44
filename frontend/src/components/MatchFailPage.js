import React from 'react';
import { Container, Typography } from '@mui/material'

function MatchFailPage() {
    return (
    <Container>
        <Typography>
            Match failed!
        </Typography>
        <Typography>
            There is no user available!
        </Typography>
    </Container>
    );
}

export default MatchFailPage;