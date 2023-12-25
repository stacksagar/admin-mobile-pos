import { createContext, useContext, useState } from 'react';

export type Dashboard = 'dark' | 'light';

interface Context {
  dashboardData: DashboardData;
  setDashboardData: React.Dispatch<React.SetStateAction<DashboardData>>;
}

const DashboardContext = createContext<Context>({} as Context);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [dashboardData, setDashboardData] = useState({} as DashboardData);

  return (
    <DashboardContext.Provider value={{ dashboardData, setDashboardData }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardData() {
  return useContext(DashboardContext);
}
