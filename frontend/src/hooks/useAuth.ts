import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { URL_USER_SVC } from '../configs';
import { STATUS_CODE_OK } from '../constants';

export const authContext = createContext();

export const useAuth = () => {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await axios
        .get(`${URL_USER_SVC}/verify`, { withCredentials: true })
        .then((response) => {
          if (response.status === STATUS_CODE_OK) {
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
    })();
  }, []);

  const authLogin = () => setAuthed(true);
  const authLogout = () => setAuthed(false);

  return {
    authContext,
    isAuthed: authed,
    isLoading: loading,
    authLogin,
    authLogout,
  };
};
