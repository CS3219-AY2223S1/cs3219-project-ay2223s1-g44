import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { URL_USER_SVC } from '../configs';
import {
    STATUS_CODE_BAD_REQUEST,
    STATUS_CODE_DATABASE_FAILURE,
    STATUS_CODE_NOT_VALID,
    STATUS_CODE_OK,
} from '../constants';
import { setAuthToken } from '../util/setAuthToken';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMsg, setDialogMsg] = useState('');
    const [isLoginSuccess, setIsLoginSuccess] = useState(false);

    const handleLogin = async () => {
        await axios
            .post(`${URL_USER_SVC}/login`, { username, password })
            .then((response) => {
                const token = response.data.token;
                localStorage.setItem('token', token);
                setAuthToken(token);

                if (response.status === STATUS_CODE_OK) {
                    setSuccessDialog('Logging in!');
                    setIsLoginSuccess(true);
                }
            })
            .catch((err) => {
                setIsLoginSuccess(false);

                if (err.response.status === STATUS_CODE_BAD_REQUEST) {
                    setErrorDialog('Could not find an existing user!');
                } else if (err.response.status === STATUS_CODE_NOT_VALID) {
                    setErrorDialog('Username or password is incorrect!');
                } else if (err.response.status === STATUS_CODE_DATABASE_FAILURE) {
                    setErrorDialog('Database failure when retrieving existing user!');
                }
            });
    };

    const closeDialog = () => setIsDialogOpen(false);

    const setSuccessDialog = (msg) => {
        setIsDialogOpen(true);
        setDialogTitle('Success');
        setDialogMsg(msg);
    };

    const setErrorDialog = (msg) => {
        setIsDialogOpen(true);
        setDialogTitle('Error');
        setDialogMsg(msg);
    };

    return (
        <Box display={'flex'} flexDirection={'column'} width={'30%'}>
            <Typography variant={'h3'} marginBottom={'2rem'}>
                Login
            </Typography>
            <TextField
                label="Username"
                variant="standard"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ marginBottom: '1rem' }}
                autoFocus
            />
            <TextField
                label="Password"
                variant="standard"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: '2rem' }}
            />
            <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
                <Button variant={'outlined'} onClick={handleLogin}>
                    Login
                </Button>
            </Box>

            <Dialog open={isDialogOpen} onClose={closeDialog}>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    {isLoginSuccess ? (
                        <Button component={Link} to="/login">
                            Log in
                        </Button>
                    ) : (
                        <Button onClick={closeDialog}>Done</Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default LoginPage;
