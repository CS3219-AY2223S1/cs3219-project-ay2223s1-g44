import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { authContext } from '../hooks/useAuth';
import { useMatchDetail } from '../hooks/useMatch';

function ProtectedLayout() {
  const auth = useContext(authContext);
  const { match, question, matchLoading } = useMatchDetail(auth.user.username);
  const { isLoading, isAuthed } = auth;

  if (isLoading || matchLoading) {
    return null;
  }

  if (match.id !== '' && window.location.pathname !== '/collab-space') {
    return <Navigate to="/collab-space" replace />;
  }

  return !isAuthed ? <Navigate to="/login" replace /> : <Outlet />;
}

export default ProtectedLayout;
