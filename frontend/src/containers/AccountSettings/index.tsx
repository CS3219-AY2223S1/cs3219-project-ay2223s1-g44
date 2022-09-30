import React, { useContext, useState } from 'react';
import axios from 'axios';
import {
  Button, Flex, Input,
} from '@chakra-ui/react';
import useToast from '../../hooks/useToast';
import { URL_USER_SVC } from '../../configs';
import { STATUS_CODE_OK } from '../../constants';

import { authContext } from '../../hooks/useAuth';

function AccountSettings() {
  const { authLogout } = useContext(authContext);
  const toast = useToast();

  const [password, setPassword] = useState('');

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
      .catch((_) => {
        // TODO: error handling
      });
  };

  const handlePasswordChange = async () => {
    if (password) {
      await axios
        .put(`${URL_USER_SVC}/password`, { password }, { withCredentials: true })
        .then((response) => {
          if (response.status === STATUS_CODE_OK) {
            toast({
              title: 'Password changed',
              description: 'Password has been changed successfully!',
              status: 'success',
            });
          }
        })
        .catch((_) => {
          toast({
            title: 'Error',
            description: 'Please try again later.',
            status: 'error',
          });
        });
    } else {
      toast({
        title: 'Error',
        description: 'Password cannot be empty!',
        status: 'error',
      });
    }
  };

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      height="100%"
      pt="100px"
      width="600px"
      maxWidth="80%"
      mx="auto"
    >
      <Input
        variant="filled"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        maxWidth="400px"
        mb={6}
      />
      <Button
        variant="outline"
        onClick={() => {
          handlePasswordChange();
        }}
        mb={6}
      >
        Change Password
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          handleLogout();
        }}
        mb={6}
      >
        Log out
      </Button>
      <Button
        onClick={() => {
          handleDelete();
        }}
      >
        Delete Your Account
      </Button>
    </Flex>
  );
}

export default AccountSettings;
