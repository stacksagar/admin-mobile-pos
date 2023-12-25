import { lazy } from 'react';

const setting_pages = {
  '': lazy(() => import('../pages/Settings/SubPages/HeaderSetting')),
  header: lazy(() => import('../pages/Settings/SubPages/HeaderSetting')),
  footer: lazy(() => import('../pages/Settings/SubPages/FooterSetting')),
  invoice: lazy(() => import('../pages/Settings/SubPages/InvoiceSetting')),
  colors: lazy(() => import('../pages/Settings/SubPages/ColorsSetting')),
  banner: lazy(() => import('../pages/Settings/SubPages/BannerSetting')),
  code: lazy(() => import('../pages/Settings/SubPages/CodeSetting')),
};

export default setting_pages;
