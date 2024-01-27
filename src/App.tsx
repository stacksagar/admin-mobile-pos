import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Loader from './common/Loaders/Loader';
import NotFound from './pages/NotFound';

import PersistLogin from './middlewares/PersistLogin';
import RequireAuth from './middlewares/AuthenticatedRoutes';
import UnAuthenticatedRoutes from './middlewares/UnAuthenticatedRoutes';

import auth_pages from './routes/auth.routes';
import admin_pages from './routes/admin.routes';
import public_pages from './routes/public.routes';
import AccessDenied from './pages/AccessDenied';
import Settings from './pages/Settings/Settings';
import setting_pages from './routes/setting.routes';
import { useSetting } from './context/setting';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { setting } = useSetting();

  useEffect(() => {
    setting?.client?.site_title &&
      (document.title = setting?.client?.site_title);
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = setting?.client?.favicon || '';
    document.head.appendChild(link);
    setTimeout(() => setLoading(false), 200);
    return () => {
      document.head.removeChild(link);
    };
  }, [setting]);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = setting?.client?.favicon || '';
    document.head.appendChild(link);
  }, [setting]);

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      {/* Open for everyone/public */}
      {Object.entries(public_pages).map(([key, Element]) => (
        <Route
          key={key}
          path={key}
          element={
            <Suspense fallback={<Loader />}>
              <Element />
            </Suspense>
          }
        />
      ))}

      <Route element={<PersistLogin />}>
        {/* Only for Un-Authenticated */}
        <Route element={<UnAuthenticatedRoutes />}>
          {Object.entries(auth_pages).map(([path, Element]) => (
            <Route key={path} path={path} element={<Element />} />
          ))}
        </Route>

        {/* Only For Admin */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<RequireAuth min_role="admin" />}>
            {Object.entries(admin_pages).map(([path, Element]) => (
              <Route
                key={path}
                path={path}
                element={
                  <Suspense fallback={<Loader />}>
                    <Element />
                  </Suspense>
                }
              />
            ))}
          </Route>

          <Route path="/settings" element={<Settings />}>
            {Object.entries(setting_pages).map(([path, Element]) => (
              <Route
                key={path}
                path={path}
                element={
                  <Suspense fallback={<Loader />}>
                    <Element />
                  </Suspense>
                }
              />
            ))}
          </Route>
        </Route>
      </Route>

      {/* Access Denied (if minimum role is not equal!) */}
      <Route
        path="/access-denied"
        element={ 
            <AccessDenied /> 
        }
      />

      {/* Not Found Page (if visit any incorrect url) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
