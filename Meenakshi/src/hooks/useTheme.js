import { useState, useEffect } from 'react';

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    // 1. சர்வர் பக்கத்தில் இருந்தால் 'light'-ஐ ரிட்டர்ன் செய்யவும்
    if (typeof window === 'undefined') return 'light';

    // 2. பிரௌசரில் இருந்தால் மட்டும் localStorage-ஐ செக் செய்யவும்
    const saved = localStorage.getItem('sm-theme');
    if (saved) return saved;

    // 3. சிஸ்டம் செட்டிங்ஸை எடுக்கவும்
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    // 4. பிரௌசரில் இருக்கும்போது மட்டும் DOM-ல் செட் செய்யவும்
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('sm-theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return { theme, toggleTheme };
}