import { useState, useEffect } from 'react';

export default function useTheme() {
  // 1. ஆரம்பத்திலிருந்தே சரியான theme-ஐத் தீர்மானிக்க ஒரு ஹெல்பர் பங்க்ஷன்
  const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('sm-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  // 2. நேரடியாக useState-லேயே பங்க்ஷனை அழைத்தால், இது ஒரே ஒருமுறை மட்டுமே நடக்கும் (No cascading renders)
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    // 3. theme மாறும்போது மட்டும் அப்டேட் செய்ய இது போதும்
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sm-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return { theme, toggleTheme };
}