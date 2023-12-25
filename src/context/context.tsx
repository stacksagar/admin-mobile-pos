import { AuthProvider } from './auth';
import { DashboardProvider } from './dashboard';
import { POSProvider } from './pos';
import { SettingProvider } from './setting';
import { ThemeProvider } from './theme';

export default function ContextProvider({ children }: any) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DashboardProvider>
          <SettingProvider>
            <POSProvider>{children}</POSProvider>
          </SettingProvider>
        </DashboardProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
