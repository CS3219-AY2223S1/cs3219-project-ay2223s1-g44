import React, { useContext, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Button as ChakraButton,
} from '@chakra-ui/react';
import useToast from '../../hooks/useToast';
import { URL_USER_SVC } from '../../configs';
import { STATUS_CODE_OK } from '../../constants';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { authContext } from '../../hooks/useAuth';
import ContentLayout from '../../layouts/ContentLayout';

function AccountSettings() {
  const { user: { username }, authLogout } = useContext(authContext);
  const toast = useToast();

  const [newPassword, setNewPassword] = useState('');

  const handlePasswordChange:React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;
    setNewPassword(value);
  };

  const handlePasswordSubmit:React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!newPassword) {
      toast({
        title: 'Error',
        description: 'Password cannot be empty!',
        status: 'error',
      });
      return;
    }

    await axios
      .put(`${URL_USER_SVC}/password`, { password: newPassword }, { withCredentials: true })
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
  };

  const handleAccountDelete: React.MouseEventHandler<HTMLButtonElement> = async () => {
    await axios
      .delete(`${URL_USER_SVC}/delete_account`, { withCredentials: true })
      .then((response) => {
        if (response.status === STATUS_CODE_OK) {
          toast({
            title: 'Account deletion',
            description: 'Account deleted successfully!',
            status: 'success',
          });
          authLogout();
        }
      })
      .catch((_) => {
        toast({
          title: 'Error',
          description: 'Please try again later.',
          status: 'error',
        });
      });
  };

  return (
    <ContentLayout heading="Account settings">
      <Flex
        direction="column"
        maxW="420px"
        width="100%"
      >
        <form onSubmit={handlePasswordSubmit}>
          <FormControl
            color="brand-gray.3"
            mb={{ base: 10, lg: 12 }}
          >
            <Box mb={4}>
              <FormLabel fontSize={{ base: 14, lg: 16 }}>
                Username
              </FormLabel>
              <Input
                value={username}
                id="username"
                isReadOnly
                isDisabled
              />
            </Box>
            <Box>
              <FormLabel fontSize={{ base: 14, lg: 16 }}>
                Password
              </FormLabel>
              <Input
                type="password"
                id="password"
                onChange={handlePasswordChange}
                value={newPassword}
              />
            </Box>
          </FormControl>
          <Button width="100%" type="submit" disabled={!newPassword}>Change password</Button>
        </form>
        <ChakraButton
          fontSize={{ base: 10, lg: 12 }}
          variant="link"
          mt={{ base: 4, lg: 6 }}
          onClick={handleAccountDelete}
          textAlign="center"
          fontWeight={700}
          color="brand-red.1"
          transition="color 75ms ease-in"
          _hover={
            { color: 'brand-red.2' }
          }
          _active={
            { color: 'brand-red.3' }
          }
        >
          Delete account
        </ChakraButton>
      </Flex>
    </ContentLayout>
  );
}

export default AccountSettings;
