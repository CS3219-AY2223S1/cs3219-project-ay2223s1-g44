import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { authContext } from '../hooks/useAuth';

function ProtectedLayout() {
  const auth = useContext(authContext);

  const { isLoading, isAuthed } = auth;

  if (isLoading) {
    return null;
  }

  return !isAuthed ? <Navigate to="/login" replace /> : <Outlet />;
}

export default ProtectedLayout;
