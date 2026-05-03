import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('shacl-theme') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('shacl-theme', theme);
  }, [theme]);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme: () => setTheme(t => (t === 'dark' ? 'light' : 'dark')),
  };
}
