import { lazy } from 'react';

const SignIn = lazy(() => import('../pages/Authentication/SignIn'));
const SignUp = lazy(() => import('../pages/Authentication/SignUp'));

const auth_pages = {
  '/auth/signin': SignIn,
  '/auth/signup': SignUp,
};

export default auth_pages;
