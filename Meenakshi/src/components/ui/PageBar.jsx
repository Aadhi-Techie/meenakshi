import { useState, useEffect } from 'react';

export default function PageBar() {
  const [v, setV] = useState(true);
  
  useEffect(() => { 
    const t = setTimeout(() => setV(false), 600); 
    return () => clearTimeout(t); 
  }, []);
  
  return v ? <div className="pb" style={{ width: "100%" }} /> : null;
}