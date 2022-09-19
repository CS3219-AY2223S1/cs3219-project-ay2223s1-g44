import React, {
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
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { URL_USER_SVC } from '../../configs';
import {
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_INTERNAL_SERVER_ERROR,
  STATUS_CODE_OK,
  STATUS_CODE_UNAUTHORIZED,
} from '../../constants';

import { authContext } from '../../hooks/useAuth';

function LoginPage() {
  // @ts-expect-error TS(2339): Property 'authLogin' does not exist on type 'unkno... Remove this comment to see the full error message
  const { authLogin } = useContext(authContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMsg, setDialogMsg] = useState('');
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);

  const setSuccessDialog = (msg: any) => {
    setIsDialogOpen(true);
    setDialogTitle('Success');
    setDialogMsg(msg);
  };

  const setErrorDialog = (msg: any) => {
    setIsDialogOpen(true);
    setDialogTitle('Error');
    setDialogMsg(msg);
  };

  const handleLogin = async () => {
    await axios
      .post(`${URL_USER_SVC}/login`, { username, password }, { withCredentials: true })
      .then((response) => {
        if (response.status === STATUS_CODE_OK) {
          // TODO: remove unnecessary login success modal
          setSuccessDialog('Successfully logged in!');
          setIsLoginSuccess(true);
          authLogin();
        }
      })
      .catch((err) => {
        setIsLoginSuccess(false);

        // TODO: clean up status check
        if (err.response.status === STATUS_CODE_BAD_REQUEST) {
          setErrorDialog('Could not find an existing user!');
        } else if (err.response.status === STATUS_CODE_UNAUTHORIZED) {
          setErrorDialog('Username or password is incorrect!');
        } else if (err.response.status === STATUS_CODE_INTERNAL_SERVER_ERROR) {
          setErrorDialog('Database failure when retrieving existing user!');
        } else {
          setErrorDialog('Please try again later.');
        }
      });
  };

  const closeDialog = () => setIsDialogOpen(false);

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      height="100%"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h3" marginBottom="2rem">
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
      <Box display="flex" flexDirection="row" justifyContent="flex-end">
        <Button variant="outlined" onClick={handleLogin}>
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
            <Button component={Link} to="/dashboard">
              To dashboard
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
