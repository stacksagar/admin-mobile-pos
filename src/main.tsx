import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ContextsProvider from './context/context';

import { ToastContainer } from 'react-toastify';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './app/store';

import MaterialUIThemeProvider from './common/MaterialUi/MaterialUIThemeProvider';

// CSS/Styles
import 'react-responsive-pagination/themes/classic.css';
import './css/index.css';
import 'react-toastify/dist/ReactToastify.css';
import './css/custom.css';
import 'suneditor/dist/css/suneditor.min.css';
import './css/overwrite.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ContextsProvider>
      <MaterialUIThemeProvider>
        <ReduxProvider store={store}>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <ToastContainer />
              <App />
            </QueryClientProvider>
          </BrowserRouter>
        </ReduxProvider>
      </MaterialUIThemeProvider>
    </ContextsProvider>
  </React.StrictMode>
);
