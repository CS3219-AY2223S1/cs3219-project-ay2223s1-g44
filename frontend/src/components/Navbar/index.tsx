import React, { useContext } from 'react';
import NavbarTemplate from './NavbarTemplate';

import { authContext } from '../../hooks/useAuth';

const publicRoutes = [
  ['Login', '/login'],
  ['Register', '/register'],
];
const protectedRoutes = [
  ['Account Settings', '/account-settings'],
  ['Dashboard', '/dashboard'],
  ['Choose Level', '/level-select'],
];

function Navbar() {
  // @ts-expect-error TS(2339): Property 'isLoading' does not exist on type 'unkno... Remove this comment to see the full error message
  const { isLoading, isAuthed } = useContext(authContext);

  if (isLoading) {
    return null;
  }

  // @ts-expect-error TS(2322): Type 'string[][]' is not assignable to type 'strin... Remove this comment to see the full error message
  return <NavbarTemplate pages={!isAuthed ? publicRoutes : protectedRoutes} />;
}

export default Navbar;
