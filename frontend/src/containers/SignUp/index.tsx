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
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { URL_USER_SVC } from '../../configs';
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED } from '../../constants';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMsg, setDialogMsg] = useState('');
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);

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

  const handleSignup = async () => {
    setIsSignupSuccess(false);
    const res = await axios
      .post(`${URL_USER_SVC}/register`, { username, password })
      .catch((err) => {
        if (err.response.status === STATUS_CODE_CONFLICT) {
          setErrorDialog('This username already exists');
        } else {
          setErrorDialog('Please try again later');
        }
      });
    if (res && res.status === STATUS_CODE_CREATED) {
      setSuccessDialog('Account successfully created');
      setIsSignupSuccess(true);
    }
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
        Sign Up
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
        <Button variant="outlined" onClick={handleSignup}>
          Sign up
        </Button>
      </Box>

      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMsg}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {isSignupSuccess ? (
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

export default SignupPage;