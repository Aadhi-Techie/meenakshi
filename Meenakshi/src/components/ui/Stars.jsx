import React from 'react';
import { Star } from 'lucide-react';

export default function Stars({ n, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={size} 
          fill={i < n ? "#f59e0b" : "none"} 
          color={i < n ? "#f59e0b" : "var(--sl3)"} 
        />
      ))}
    </div>
  );
}