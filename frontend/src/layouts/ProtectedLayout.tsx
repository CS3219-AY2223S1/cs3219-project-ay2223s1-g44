import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { authContext } from '../hooks/useAuth';

function ProtectedLayout() {
  const auth = useContext(authContext);

  // @ts-expect-error TS(2339): Property 'isLoading' does not exist on type 'unkno... Remove this comment to see the full error message
  const { isLoading, isAuthed } = auth;

  if (isLoading) {
    return null;
  }

  return !isAuthed ? <Navigate to="/login" replace /> : <Outlet />;
}

export default ProtectedLayout;
