import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { authContext } from '../containers/App';

const ProtectedLayout = () => {
  const auth = useContext(authContext);

  const { isLoading, isAuthed } = auth;

  if (isLoading) {
    return <></>;
  }

  return !isAuthed ? <Navigate to="/login" replace /> : <Outlet />;
};

export default ProtectedLayout;
