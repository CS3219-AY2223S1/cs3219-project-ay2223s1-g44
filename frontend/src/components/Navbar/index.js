import React, { useContext } from 'react';
import NavbarTemplate from './NavbarTemplate';

import { authContext } from '../../containers/App';

const publicRoutes = [
  ['Login', '/login'],
  ['Register', '/register'],
];
const protectedRoutes = [
  ['Account Settings', '/account-settings'],
  ['Dashboard', '/dashboard'],
  ['Choose Level', '/level-select'],
];

const Navbar = () => {
  const { isLoading, isAuthed } = useContext(authContext);

  if (isLoading) {
    return <></>;
  }

  return <NavbarTemplate pages={!isAuthed ? publicRoutes : protectedRoutes} />;
};

export default Navbar;
