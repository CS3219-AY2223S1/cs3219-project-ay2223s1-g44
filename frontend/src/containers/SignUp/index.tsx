import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED } from '../../constants';

function SignupPage() {
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
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

  const handleSignup = async () => {
    const { username, password } = formValues;
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
        <Heading mb={10}>Sign up</Heading>
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
            // mb={6}
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
        <Button colorScheme="teal" onClick={handleSignup} isLoading={isLoading}>Sign up</Button>
      </Flex>
    </Flex>
  );
}

export default SignupPage;
