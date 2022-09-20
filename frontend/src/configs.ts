const URI_USER_SVC = process.env.URI_USER_SVC || 'http://localhost:8000';

const PREFIX_USER_SVC = '/api/user';

export interface NavItemProps {
  label: string;
  subLabel?: string;
  children?: Array<NavItemProps>;
  href?: string;
}

interface NavItemRoutesProps {
  publicRoutes: Array<NavItemProps>,
  protectedRoutes: Array<NavItemProps>,
}

export const ROUTES: NavItemRoutesProps = {
  publicRoutes: [],
  protectedRoutes: [
    {
      label: 'Account Settings',
      href: 'account-settings',
    },
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

export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC;
