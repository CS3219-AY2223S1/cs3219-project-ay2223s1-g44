import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { URL_USER_SVC } from '../configs';
import { STATUS_CODE_OK } from '../constants';

interface UserProps {
  id: string,
  username: string,
}

interface ContextProps {
  isAuthed: boolean,
  isLoading: boolean,
  user: UserProps,
  authLogin: () => void,
  authLogout: () => void,
}

export const authContext = createContext({} as ContextProps);

export const useAuth = () => {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ id: '', username: '' });

  const authLogin = async () => {
    await axios
      .get(`${URL_USER_SVC}/verify`, { withCredentials: true })
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
