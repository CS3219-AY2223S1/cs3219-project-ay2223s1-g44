import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { authContext } from '../hooks/useAuth';
import { useMatchDetail } from '../hooks/useMatch';
import MoveToCollab from './MoveToCollab';

function ProtectedLayout() {
  const auth = useContext(authContext);
  const { match, question, matchLoading } = useMatchDetail(auth.user.username);
  const { isLoading, isAuthed } = auth;
  const [hasActive, setActive] = useState(false);

  useEffect(() => {
    if (match._id !== '' && window.location.pathname !== '/collab-space') {
      setActive(true);
    }
  }, [match]);

  if (isLoading || matchLoading) {
    return null;
  }

  if (hasActive) {
    return <MoveToCollab />;
  }

  return !isAuthed ? <Navigate to="/login" replace /> : <Outlet />;
}

export default ProtectedLayout;
