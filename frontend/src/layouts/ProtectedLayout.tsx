import React, { useContext, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { authContext } from '../hooks/useAuth';

function ProtectedLayout() {
  const auth = useContext(authContext);

  useEffect(() => {
    if (auth.isAuthed && !auth.isLoading) {
      fetch(`http://localhost:8001/match/${auth.user.username}`)
        .then((res) => res.json())
        .then((res) => console.log(res));
    }
  }, [auth]);

  const { isLoading, isAuthed } = auth;

  if (isLoading) {
    return null;
  }

  return !isAuthed ? <Navigate to="/login" replace /> : <Outlet />;
}

export default ProtectedLayout;
