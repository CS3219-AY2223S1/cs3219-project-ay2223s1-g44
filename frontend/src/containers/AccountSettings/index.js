import React, {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { useContext, useState } from 'react';
import { URL_USER_SVC } from '../../configs';
import { STATUS_CODE_OK } from '../../constants';

import { authContext } from '../../hooks/useAuth';

function AccountSettings() {
  const { authLogout } = useContext(authContext);

  const [password, setPassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMsg, setDialogMsg] = useState('');

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

  const handleLogout = async () => {
    await axios.delete(`${URL_USER_SVC}/logout`, { withCredentials: true }).then((response) => {
      if (response.status === STATUS_CODE_OK) {
        authLogout();
      }
    }); // TODO: show logout feedback
  };

  const handleDelete = async () => {
    await axios
      .delete(`${URL_USER_SVC}/delete_account`, { withCredentials: true })
      .then((response) => {
        if (response.status === STATUS_CODE_OK) {
          authLogout();
        }
      })
      .catch(() => {
        // TODO: error handling
      });
  };

  const handlePasswordChange = async () => {
    if (password) {
      await axios
        .put(`${URL_USER_SVC}/password`, { password }, { withCredentials: true })
        .then((response) => {
          if (response.status === STATUS_CODE_OK) {
            setSuccessDialog('Password Changed!');
          }
        })
        .catch((err) => {
          setErrorDialog(err);
        });
    } else {
      setErrorDialog('Please enter a valid password!');
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
      <TextField
        label="Password"
        variant="standard"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ marginBottom: '1rem' }}
      />

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
        sx={{ marginBottom: '2rem' }}
      >
        <Button
          variant="outlined"
          onClick={() => {
            handlePasswordChange();
          }}
        >
          Change Password
        </Button>
      </Box>

      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMsg}</DialogContentText>
        </DialogContent>
      </Dialog>

      {/* TODO: only redirect to login page on successful logout */}
      <Button
        variant="outlined"
        onClick={() => {
          handleLogout();
        }}
        sx={{ marginBottom: '2rem' }}
      >
        Log out
      </Button>

      <Box display="flex" flexDirection="row" justifyContent="flex-end">
        <Button
          onClick={() => {
            handleDelete();
          }}
        >
          Delete Your Account
        </Button>
      </Box>
    </Box>
  );
}

export default AccountSettings;
