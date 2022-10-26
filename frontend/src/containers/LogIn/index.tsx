import React, { useState, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Flex,
  Heading,
  Text,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { URL_USER_SVC } from '../../configs';
import {
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_INTERNAL_SERVER_ERROR,
  STATUS_CODE_OK,
  STATUS_CODE_UNAUTHORIZED,
} from '../../constants';
import Input from '../../components/Input';
import Button from '../../components/Button';

import CenterLayout from '../../layouts/CenterLayout';

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

  const handleLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

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

  return (
    <CenterLayout>
      <Flex
        direction="column"
        mx="10vw"
        maxWidth="420px"
        width="fit-content"
      >
        <Heading
          mb={12}
          fontWeight={500}
          fontSize={34}
          color="brand-gray.4"
        >
          Log in
        </Heading>

        <FormControl
          isInvalid={Boolean(errorMessage)}
          isDisabled={isLoading}
        >
          <form onSubmit={handleLogin}>
            <Input
              placeholder="Username"
              id="username"
              type="text"
              name="username"
              onChange={handleChange}
              value={formValues.username}
              mb={3}
            />
            <Input
              placeholder="Password"
              id="password"
              type="password"
              name="password"
              onChange={handleChange}
              value={formValues.password}
            />
            <Box height={12} pt={2}>
              {Boolean(errorMessage)
              && <FormErrorMessage my={0} fontSize={12}>{errorMessage}</FormErrorMessage>}
            </Box>
            <Button
              type="submit"
              isLoading={isLoading}
              width="100%"
            >
              Log In
            </Button>
          </form>
        </FormControl>

        <Flex mt={6} justifyContent="center">
          <Text
            as="span"
            textAlign="center"
            fontSize={12}
            fontWeight={500}
            color="brand-gray.2"
          >
            {'Don\'t have an account yet?'}
          </Text>
          <Text
            as="span"
            textAlign="center"
            pl={1}
            fontSize={12}
            fontWeight={700}
            transition="color 75ms ease-in"
            color="brand-blue.1"
            _hover={
              { color: 'brand-blue.2' }
            }
            _active={
              { color: 'brand-blue.3' }
            }
          >
            <Link to="/register">Sign Up</Link>
          </Text>
        </Flex>
      </Flex>
    </CenterLayout>
  );
}

export default LoginPage;
