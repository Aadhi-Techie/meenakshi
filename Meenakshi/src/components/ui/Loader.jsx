import { useState, useEffect } from 'react';

const ORBS = [
  { w: 500, t: "-10%", l: "-10%", c: "rgba(249,115,22,.05)" },
  { w: 400, t: "60%",  l: "70%",  c: "rgba(56,189,248,.04)" },
  { w: 300, t: "30%",  l: "40%",  c: "rgba(249,115,22,.03)" },
];

export default function Loader({ done }) {
  const [p, setP] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setP(v => {
        if (v >= 100) { 
          clearInterval(t); 
          setTimeout(done, 280); 
          return 100; 
        }
        return v + (v < 70 ? 3 : v < 90 ? 1.2 : 0.6);
      });
    }, 28);
    return () => clearInterval(t);
  }, [done]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg)", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0 }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {ORBS.map((o, i) => (
          <div key={i} style={{ position: "absolute", width: o.w, height: o.w, borderRadius: "50%", background: `radial-gradient(circle,${o.c},transparent 70%)`, top: o.t, left: o.l, animation: `orb ${4 + i}s ease-in-out infinite alternate` }} />
        ))}
      </div>

      <div style={{ position: "relative", width: 100, height: 100, marginBottom: 32 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid rgba(249,115,22,.12)", borderTop: "3px solid var(--o)", animation: "spin 1.1s linear infinite" }} />
        <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: "2px solid rgba(249,115,22,.07)", borderBottom: "2px solid var(--o3)", animation: "spin 1.8s linear infinite reverse" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 800, color: "var(--o)", lineHeight: 1 }}>SM</div>
        </div>
      </div>

      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 6, letterSpacing: ".02em" }}>SreeMeenakshi Traders</div>
      <div style={{ fontSize: 11.5, color: "var(--sl3)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 36 }}>Premium Building Materials · Chennai</div>

      <div style={{ width: 220, height: 3, background: "rgba(255,255,255,.07)", borderRadius: 2, overflow: "hidden", marginBottom: 12 }}>
        <div style={{ height: "100%", width: `${p}%`, background: "linear-gradient(90deg,var(--o),var(--o3))", borderRadius: 2, transition: "width .05s linear" }} />
      </div>
      <div style={{ fontSize: 12, color: "var(--o)", fontWeight: 700 }}>{Math.round(p)}%</div>
    </div>
  );
}