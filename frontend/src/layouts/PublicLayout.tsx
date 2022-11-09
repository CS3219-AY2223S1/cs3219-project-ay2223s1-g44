import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { authContext } from '../hooks/useAuth';

function PublicLayout() {
  const auth = useContext(authContext);

  const { isLoading, isAuthed } = auth;

  if (isLoading) {
    return null;
  }

  return isAuthed ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

export default PublicLayout;
