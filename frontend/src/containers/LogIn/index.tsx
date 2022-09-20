import React, { useState, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  useColorModeValue,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { URL_USER_SVC } from '../../configs';
import {
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_INTERNAL_SERVER_ERROR,
  STATUS_CODE_OK,
  STATUS_CODE_UNAUTHORIZED,
} from '../../constants';

import { authContext } from '../../hooks/useAuth';

function LoginPage() {
  const { authLogin } = useContext(authContext);

  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setFormValues((fv) => ({
      ...fv,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async () => {
    const { username, password } = formValues;
    setIsLoading(true);

    await axios
      .post(`${URL_USER_SVC}/login`, { username, password }, { withCredentials: true })
      .then((response) => {
        if (response.status === STATUS_CODE_OK) {
          authLogin();
        }
      })
      .catch((err) => {
        // TODO: clean up status check
        if (err.response.status === STATUS_CODE_BAD_REQUEST) {
          setErrorMessage('Could not find an existing user!');
        } else if (err.response.status === STATUS_CODE_UNAUTHORIZED) {
          setErrorMessage('Username or password is incorrect!');
        } else if (err.response.status === STATUS_CODE_INTERNAL_SERVER_ERROR) {
          setErrorMessage('Database failure when retrieving existing user!');
        } else {
          setErrorMessage('Please try again later.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const formBackground = useColorModeValue('gray.200', 'gray.700');

  return (
    <Flex height="100%" alignItems="center" justifyContent="center">
      <Flex
        direction="column"
        background={formBackground}
        p={12}
        rounded={6}
        mx="10vw"
        maxWidth="400px"
      >
        <Heading mb={10}>Log in</Heading>
        <FormControl isInvalid={Boolean(errorMessage)} isDisabled={isLoading}>
          <Input
            placeholder="Username"
            variant="filled"
            mb={4}
            id="username"
            type="text"
            name="username"
            onChange={handleChange}
            value={formValues.username}
          />
          <Input
            placeholder="Password"
            variant="filled"
            id="password"
            type="password"
            name="password"
            onChange={handleChange}
            value={formValues.password}
          />
          <Box height={10} pt={2}>
            {Boolean(errorMessage)
              && <FormErrorMessage my={0}>{errorMessage}</FormErrorMessage>}
          </Box>
        </FormControl>
        <Button colorScheme="teal" onClick={handleSignup} isLoading={isLoading}>Log in</Button>
      </Flex>
    </Flex>
  );
}

export default LoginPage;
