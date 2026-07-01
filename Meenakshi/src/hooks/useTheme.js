// useTheme.js
import { useState, useEffect } from 'react';

export default function useTheme() {
  const [theme, setTheme] = useState('dark'); // fixed default, server-safe

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved && saved !== theme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(saved);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      return next;
    });
  };

  return { theme, toggleTheme };
}