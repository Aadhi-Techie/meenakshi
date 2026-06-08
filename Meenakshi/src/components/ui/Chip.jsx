import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function Chip({ children }) {
  return (
    <span className="fc">
      <CheckCircle size={10} color="var(--o)" />
      {children}
    </span>
  );
}