import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { authContext } from '../containers/App';

const PublicLayout = () => {
  const auth = useContext(authContext);

  const { isLoading, isAuthed } = auth;

  if (isLoading) {
    return <></>;
  }

  return isAuthed ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicLayout;
