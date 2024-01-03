import { createContext, useContext, useEffect, useState } from 'react';

import { axios_private } from '../api/api';
import { SettingT } from '../data';

interface Context {
  setting?: SettingT;
  setSetting?: any;
}

const SettingContext = createContext<Context>({});

export function SettingProvider({ children }: { children: React.ReactNode }) {
  const [setting, setSetting] = useState();

  useEffect(() => {
    axios_private.get('/setting').then((res) => {
      setSetting(res.data?.setting);
    });
  }, []);

  return (
    <SettingContext.Provider value={{ setting, setSetting }}>
      {children}
    </SettingContext.Provider>
  );
}

export function useSetting() {
  return useContext(SettingContext);
}
