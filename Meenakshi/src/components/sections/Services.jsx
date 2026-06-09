import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { WA } from '../../constants/config';

export default function Services({ go, t }) {
  // மொழி கண்டறிதல் (தமிழ் அல்லது ஆங்கிலம்)
  const isTamil = t.nav?.home === "முகப்பு";

  // Category Names translation logic
  const catNames = {
    glass: isTamil ? "பிரீமியம் கண்ணாடி" : "Premium Glass Supply",
    ply: isTamil ? "மொத்த விலை பிளைவுட்" : "Wholesale Plywoods",
    upv: isTamil ? "UPVC விண்டோ சிஸ்டம்ஸ்" : "UPVC Window Systems",
    wpv: isTamil ? "WPVC கதவுகள் மற்றும் பேனல்கள்" : "WPVC Doors & Panels",
    alu: isTamil ? "அலுமினியம் தீர்வுகள்" : "Aluminium Solutions",
    hdw: isTamil ? "ஹார்டுவேர் பொருட்கள்" : "Hardwares & Fittings"
  };

  const servicesList = [
    { 
      id: 'glass', 
      name: catNames.glass, 
      img: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&q=80&w=400&h=400" 
    },
    { 
      id: 'ply', 
      name: catNames.ply, 
      img: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=400&h=400" 
    },
    { 
      id: 'upv', 
      name: catNames.upv, 
      img: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=400&h=400" 
    },
    { 
      id: 'wpv', 
      name: catNames.wpv, 
      img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400&h=400" 
    },
    { 
      id: 'alu', 
      name: catNames.alu, 
      img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400&h=400" 
    },
    { 
      id: 'hdw', 
      name: catNames.hdw, 
      img: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=400&h=400" 
    }
  ];

  return (
    <section id="services" aria-labelledby="services-heading" style={{ padding: "80px 24px", background: "var(--bg)", position: "relative" }}>
      
      {/* Background glow aesthetic */}
      <div style={{ position: "absolute", top: "20%", left: "-10%", width: 400, height: 400, background: "#38bdf8", filter: "blur(200px)", opacity: 0.05, borderRadius: "50%", pointerEvents: "none" }} />
      
      <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: 60 }}>
        
        {/* Left Content (Text) */}
        <div style={{ flex: "1 1 350px", animation: "fadeUp 0.8s ease forwards" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: 100, color: "#38bdf8", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 24 }}>
            {t.svBdg || (isTamil ? "சேவைகள்" : "Services")}
          </div>
          
          <h2 id="services-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 48px)", fontWeight: 800, lineHeight: 1.2, color: "var(--w)", marginBottom: 24, whiteSpace: "pre-line" }}>
            {t.svH || (isTamil ? "முழுமையான கட்டிட\nபொருட்கள் சேவைகள்" : "End-to-End Building\nMaterial Services")}
          </h2>
          
          <p style={{ color: "var(--sl3)", fontSize: 16, lineHeight: 1.8, marginBottom: 40, maxWidth: 450 }}>
            {t.svP || (isTamil ? "பிரீமியம் கண்ணாடி, பிளைவுட், UPVC சிஸ்டம்ஸ் மற்றும் அலுமினியப் பொருட்களின் முன்னணி சப்ளையர்." : "Chennai's primary traders of premium glass, plywood, UPVC systems, and architectural aluminium.")}
          </p>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <button className="bo" aria-label={t.hBtn1 || "Explore Collections"} onClick={() => go('category-glass')} style={{ padding: "16px 32px", fontSize: 16, borderRadius: 12, display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
              {t.hBtn1 || (isTamil ? "தயாரிப்புகளை காண்க" : "Explore Collections")} <ArrowRight size={18} aria-hidden="true" />
            </button>
            <a href={WA} target="_blank" rel="noopener noreferrer" aria-label={t.wa || "WhatsApp Us"} style={{ padding: "16px 32px", fontSize: 16, background: "rgba(255,255,255,0.03)", border: "1px solid var(--brd)", borderRadius: 12, color: "var(--w)", display: "flex", alignItems: "center", gap: 8, textDecoration: "none", fontWeight: 600, transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}>
              <MessageCircle size={18} color="#25d366" aria-hidden="true" /> {t.wa || (isTamil ? "WhatsApp" : "Chat on WhatsApp")}
            </a>
          </div>
        </div>

        {/* Right Content (Services Grid with IMAGES instead of Icons) */}
        <div style={{ flex: "2 1 500px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, animation: "fadeUp 1s ease forwards" }}>
          {servicesList.map(p => (
            <div key={p.id} 
              role="button"
              tabIndex={0}
              aria-label={`Explore ${p.name}`}
              onClick={() => go(`category-${p.id}`)} 
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  go(`category-${p.id}`);
                }
              }}
              style={{ 
                background: "rgba(255,255,255,0.02)", 
                border: "1px solid var(--brd)", 
                padding: 30, 
                borderRadius: 20, 
                display: "flex", 
                flexDirection: "column", 
                gap: 20, 
                cursor: "pointer", 
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" 
              }} 
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "var(--o)"; e.currentTarget.style.transform = "translateY(-5px)"; }} 
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "var(--brd)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                
                {/* Circular Container with Image */}
                <div style={{ 
                    width: 60, height: 60, 
                    borderRadius: "50%", 
                    overflow: "hidden", 
                    border: "2px solid var(--o)", 
                    boxShadow: "0 4px 12px rgba(255,115,0,0.15)"
                }}>
                  <img src={p.img} alt={`${p.name} - Sri Meenakshi Glass And Plywoods Traders Services`} style={{
                      width: "100%", height: "100%", 
                      objectFit: "cover", 
                  }} />
                </div>
                
                <div style={{ padding: 6, background: "rgba(255,255,255,0.03)", borderRadius: 8, color: "var(--sl3)" }}>
                  <ArrowRight size={14} aria-hidden="true" />
                </div>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--w)", fontFamily: "'Cormorant Garamond', serif" }}>{p.name}</h3>
              <p style={{ fontSize: 13.5, color: "var(--sl3)", lineHeight: 1.6, marginTop: -8 }}>
                {isTamil ? "வீடுகள் மற்றும் வணிக தேவைகளுக்கான சிறந்த தயாரிப்புகள்." : "Premium collections for all residential & commercial requirements."}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}