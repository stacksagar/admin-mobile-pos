import { AuthProvider } from './auth';
import { DashboardProvider } from './dashboard';
import { GlobalStateProvider } from './globalState';
import { POSProvider } from './pos';
import { SettingProvider } from './setting';
import { ThemeProvider } from './theme';

export default function ContextProvider({ children }: any) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DashboardProvider>
          <SettingProvider>
            <GlobalStateProvider>
              <POSProvider>{children}</POSProvider>
            </GlobalStateProvider>
          </SettingProvider>
        </DashboardProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
