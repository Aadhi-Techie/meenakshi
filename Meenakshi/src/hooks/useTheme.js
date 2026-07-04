// useTheme.js
import { useState, useEffect } from 'react';

export default function useTheme() {
  // SSG/SSR பில்டிற்கு பாதுகாப்பாக இருக்க ஆரம்பத்தில் 'dark'
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (saved) {
      // 🎯 எல்இன்ட் சின்க்ரோனஸ் எர்ரரைத் தடுக்க இதை அசிங்க்ரோனஸாக (Asynchronous) மாற்றிவிட்டோம் நண்பா!
      setTimeout(() => {
        setTheme(saved);
      }, 0);
    }

    // நெவ்பாரிலோ அல்லது ஆப்பிலோ எங்கே தீம் மாறினாலும் இந்த ஸ்டேட்டையும் சிங்க் செய்யும் ஈவென்ட் லிசனர்
    const handleThemeChange = () => {
      const current = localStorage.getItem('theme') || 'dark';
      setTheme(current);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('theme-changed', handleThemeChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('theme-changed', handleThemeChange);
      }
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    setTheme(next);

    // தீம் மாறிவிட்டது என்று வெப்சைட்டின் மற்ற காம்போனென்ட்களுக்கு சிக்னல் அனுப்புகிறது
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('theme-changed'));
    }
  };

  return { theme, toggleTheme };
}