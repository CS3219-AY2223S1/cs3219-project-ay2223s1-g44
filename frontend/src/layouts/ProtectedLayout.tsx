import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { authContext } from '../hooks/useAuth';
import { matchContext } from '../hooks/useMatch';

function ProtectedLayout() {
  const auth = useContext(authContext);
  const matchDetail = useContext(matchContext);

  const { isLoading, isAuthed } = auth;

  if (isLoading || matchDetail.isLoading) {
    return null;
  }

  return !isAuthed ? <Navigate to="/login" replace /> : <Outlet />;
}

export default ProtectedLayout;
