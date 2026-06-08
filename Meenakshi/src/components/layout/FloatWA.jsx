import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { WA } from '../../constants/config'; // Update path if needed

export default function FloatWA({ t }) {
  const [tip, setTip] = useState(true);
  
  useEffect(() => { 
    const x = setTimeout(() => setTip(false), 4000); 
    return () => clearTimeout(x); 
  }, []);

  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9990, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
      
      {/* Accessible Tooltip */}
      {tip && (
        <div 
          id="wa-tooltip" 
          role="tooltip" 
          className="gd" 
          style={{ padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", animation: "fadeUp .3s ease" }}
        >
          💬 {t.wa || "WhatsApp Us"}
        </div>
      )}
      
      {/* SEO Optimized WhatsApp Link */}
      <a 
        href={WA} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label={t.wa || "Chat with us on WhatsApp"}
        aria-describedby={tip ? "wa-tooltip" : undefined}
        onMouseEnter={() => setTip(true)} 
        onMouseLeave={() => setTip(false)}
        onFocus={e => {
          setTip(true);
          e.currentTarget.style.transform = "scale(1.12)";
        }}
        onBlur={e => {
          setTip(false);
          e.currentTarget.style.transform = "scale(1)";
        }}
        style={{ 
          width: 58, 
          height: 58, 
          borderRadius: "50%", 
          background: "linear-gradient(135deg,#25d366,#128c7e)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          color: "#fff", 
          boxShadow: "0 4px 20px rgba(37,211,102,.5)", 
          animation: "waPing 2.2s infinite", 
          transition: "transform .28s", 
          textDecoration: "none" 
        }}
      >
        <MessageCircle size={24} aria-hidden="true" />
      </a>
    </div>
  );
}