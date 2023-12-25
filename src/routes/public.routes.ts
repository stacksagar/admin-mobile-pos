import { lazy } from 'react';

const Contact = lazy(() => import('../pages/Contact')); 
const public_pages = { 
  'contact': Contact, 
};

export default public_pages;
