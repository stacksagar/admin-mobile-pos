import { createContext, useContext, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
export type Theme = 'dark' | 'light';

interface Context {
  theme: Theme;
  setTheme: any;
  toggleTheme: () => void;
}

const ThemeContext = createContext<Context>({} as Context);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const ct = localStorage.getItem('color-theme');
  const currentTheme: Theme = ct && JSON.parse(ct || "''");

  const [theme, setTheme] = useState<Theme>(currentTheme);
  const [, setColorTheme] = useLocalStorage('color-theme', theme);

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  useEffect(() => {
    const className = 'dark';
    const bodyClass = window.document.body.classList;
    theme === 'dark' ? bodyClass.add(className) : bodyClass.remove(className);
    setColorTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
