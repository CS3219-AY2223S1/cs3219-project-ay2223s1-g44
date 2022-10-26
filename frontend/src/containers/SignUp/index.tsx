import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Text,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { URL_USER_SVC } from '../../configs';
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED } from '../../constants';
import Input from '../../components/Input';
import Button from '../../components/Button';

import CenterLayout from '../../layouts/CenterLayout';

function SignupPage() {
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setFormValues((fv) => ({
      ...fv,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const { username, password, confirmPassword } = formValues;
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);
    await axios
      .post(`${URL_USER_SVC}/register`, { username, password })
      .then((res) => {
        if (res && res.status === STATUS_CODE_CREATED) {
          navigate('/login');
        }
      })
      .catch((err) => {
        if (err.response.status === STATUS_CODE_CONFLICT) {
          setErrorMessage('This username already exists');
        } else {
          setErrorMessage('Please try again later');
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
        width="300px"
      >
        <Heading
          mb={12}
          fontWeight={500}
          fontSize={34}
          color="brand-gray.4"
        >
          Sign Up
        </Heading>

        <FormControl
          isInvalid={Boolean(errorMessage)}
          isDisabled={isLoading}
        >
          <form onSubmit={handleSignup}>
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
              mb={3}
              onChange={handleChange}
              value={formValues.password}
            />
            <Input
              placeholder="Confirm password"
              id="confirm-password"
              type="password"
              name="confirmPassword"
              onChange={handleChange}
              value={formValues.confirmPassword}
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
              Sign Up
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
            Already have an account?
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
            <Link to="/login">Log In</Link>
          </Text>
        </Flex>
      </Flex>
    </CenterLayout>
  );
}

export default SignupPage;
