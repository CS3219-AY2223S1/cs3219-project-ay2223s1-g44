export type NavItemProps = {
  label: string;
  subLabel?: string;
  href?: string;
};

type NavItemRoutesProps = {
  publicRoutes: Array<NavItemProps>;
  protectedRoutes: Array<NavItemProps>;
};

export const ROUTES: NavItemRoutesProps = {
  publicRoutes: [
    {
      label: 'Log In',
      href: 'login',
    },
    {
      label: 'Sign Up',
      href: 'register',
    },
  ],
  protectedRoutes: [
    {
      label: 'Dashboard',
      href: 'dashboard',
    },
    {
      label: 'Match Making',
      href: 'match-making',
    },
  ],
};
