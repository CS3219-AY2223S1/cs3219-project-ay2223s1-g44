import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { URL_USER_SVC } from '../configs';
import { STATUS_CODE_OK } from '../constants';

type User = {
  id: string,
  username: string,
};

type ContextProps = {
  isAuthed: boolean,
  isLoading: boolean,
  user: User,
  authLogin: () => void,
  authLogout: () => void,
};

export const authContext = createContext({} as ContextProps);

export const useAuth = () => {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ id: '', username: '' });

  const authLogin = async () => {
    setLoading(true);
    await axios
      .get(`${URL_USER_SVC}/verify`, { withCredentials: true, timeout: 10000 })
      .then((response) => {
        if (response.status === STATUS_CODE_OK) {
          setUser(response.data.user);
          setAuthed(true);
        }
      })
      .catch(() => {
        // TODO: error handling
        setAuthed(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const authLogout = () => setAuthed(false);

  useEffect(() => {
    authLogin();
  }, []);

  return {
    isAuthed: authed,
    isLoading: loading,
    user,
    authLogin,
    authLogout,
  };
};
