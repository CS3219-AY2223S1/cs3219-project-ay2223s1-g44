import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { URL_USER_SVC } from '../configs';
import { STATUS_CODE_OK } from '../constants';

// @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
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
        // @ts-expect-error TS(2550): Property 'finally' does not exist on type 'Promise... Remove this comment to see the full error message
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
