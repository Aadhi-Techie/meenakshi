// useScrolled.js
import { useState, useEffect } from 'react';

export default function useScrolled(threshold = 10) {
  const [scrolled, setScrolled] = useState(false); // 🌟 fixed default, server-safe

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll(); // client mount aana pinbu real value set pannum
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}