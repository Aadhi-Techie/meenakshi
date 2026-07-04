// useTheme.js
import { useState, useEffect } from 'react';

export default function useTheme() {
  // SSG பில்டிற்கு பாதுகாப்பாக இருக்க ஆரம்பத்தில் 'dark'
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      
      if (saved) {
        // 🎯 எல்இன்ட் எர்ரரைத் தடுக்க செட்-ஸ்டேட்டை அசிங்க்ரோனஸாக (Asynchronous) மாற்றிவிட்டோம் நண்பா!
        setTimeout(() => {
          setTheme(saved);
          window.document.documentElement.setAttribute('data-theme', saved);
        }, 0);
      }
    }

    const handleThemeChange = () => {
      const current = localStorage.getItem('theme') || 'dark';
      setTheme(current);
      window.document.documentElement.setAttribute('data-theme', current);
    };

    window.addEventListener('theme-changed', handleThemeChange);
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    setTheme(next);

    if (typeof window !== 'undefined') {
      window.document.documentElement.setAttribute('data-theme', next);
      window.dispatchEvent(new Event('theme-changed'));
    }
  };

  return { theme, toggleTheme };
}