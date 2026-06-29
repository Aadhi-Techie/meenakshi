import { useState, useEffect } from 'react';

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    // ஏற்கெனவே செட் செய்துள்ளாரா என செக் செய்யும்
    const saved = localStorage.getItem('sm-theme');
    if (saved) return saved;
    // இல்லையென்றால் மொபைல் சிஸ்டம் செட்டிங்ஸை எடுக்கும்
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sm-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return { theme, toggleTheme };
}