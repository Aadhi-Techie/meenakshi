import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { WA } from '../../constants/config';

export default function Services({ go, t }) {
  // மொழி கண்டறிதல்
  const isTamil = t.nav?.home === "முகப்பு";

  // Category Names & Local SEO Descriptions
  const servicesList = [
    { 
      id: 'glass', 
      name: isTamil ? "பிரீமியம் கண்ணாடி" : "Premium Glass Supply", 
      desc: isTamil ? "பெரம்பூரில் தரமான கண்ணாடி வேலைகள்." : "High-quality toughened glass solutions in Perambur.",
      img: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&q=80&w=400&h=400" 
    },
    { 
      id: 'ply', 
      name: isTamil ? "மொத்த விலை பிளைவுட்" : "Wholesale Plywoods", 
      desc: isTamil ? "நீடித்த உழைக்கும் பிளைவுட் ரகங்கள்." : "Durable and premium plywoods for interior projects.",
      img: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=400&h=400" 
    },
    { 
      id: 'upv', 
      name: isTamil ? "UPVC விண்டோ சிஸ்டம்ஸ்" : "UPVC Window Systems", 
      desc: isTamil ? "சிறந்த ஆற்றல் சேமிப்பு கொண்ட UPVC." : "Energy-efficient UPVC windows in Chennai & Perambur.",
      img: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=400&h=400" 
    },
    { 
      id: 'wpv', 
      name: isTamil ? "WPVC கதவுகள்" : "WPVC Doors & Panels", 
      desc: isTamil ? "நீர்ப்புகா மற்றும் நவீன WPVC கதவுகள்." : "Waterproof and modern WPVC doors and panels.",
      img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400&h=400" 
    },
    { 
      id: 'alu', 
      name: isTamil ? "அலுமினியம் தீர்வுகள்" : "Aluminium Solutions", 
      desc: isTamil ? "அலுமினியம் செக்ஷன் வேலைகள்." : "Custom aluminium sections for commercial spaces.",
      img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400&h=400" 
    },
    { 
      id: 'hdw', 
      name: isTamil ? "ஹார்டுவேர் பொருட்கள்" : "Hardwares & Fittings", 
      desc: isTamil ? "சிறந்த தரமான இன்டீரியர் ஹார்டுவேர்." : "Premium interior hardware and fittings supplier.",
      img: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=400&h=400" 
    }
  ];

  return (
    <section id="services" aria-labelledby="services-heading" style={{ padding: "80px 24px", background: "var(--bg)", position: "relative" }}>
      
      <div style={{ position: "absolute", top: "20%", left: "-10%", width: 400, height: 400, background: "#38bdf8", filter: "blur(200px)", opacity: 0.05, borderRadius: "50%", pointerEvents: "none" }} />
      
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 32, width: "100%" }}>
          
          <div style={{ flex: "1 1 450px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: 100, color: "#38bdf8", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 20 }}>
              {isTamil ? "சேவைகள்" : "Our Services"}
            </div>
            
            <h2 id="services-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 800, lineHeight: 1.2, color: "var(--w)", marginBottom: 16 }}>
              {isTamil ? "பெரம்பூர், சென்னையில்\nமுழுமையான கட்டிட பொருட்கள்" : "Building Material Suppliers\nin Perambur, Chennai"}
            </h2>
            
            <p style={{ color: "var(--sl3)", fontSize: 16, lineHeight: 1.7, margin: 0, maxWidth: 550 }}>
              {isTamil 
                ? "பெரம்பூர் மற்றும் சென்னையைச் சுற்றியுள்ள பகுதிகளில் பிரீமியம் கண்ணாடி, பிளைவுட், UPVC விண்டோஸ் மற்றும் WPVC கதவுகளுக்கான முன்னணி மொத்த விற்பனையாளர்." 
                : "Leading wholesale and retail suppliers of premium Glass, Plywoods, UPVC Windows, and WPVC Doors in Perambur, Chennai."}
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 8 }}>
            <button className="bo" aria-label="Explore Collections" onClick={() => go('category-glass')} style={{ padding: "14px 28px", fontSize: 15, borderRadius: 12, display: "flex", alignItems: "center", gap: 8, fontWeight: 700, border: "none", color: "#fff", background: "var(--o)", cursor: "pointer" }}>
              {isTamil ? "தயாரிப்புகளை காண்க" : "Explore Collections"} <ArrowRight size={18} />
            </button>
            <a href={WA} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Us" style={{ padding: "14px 28px", fontSize: 15, background: "rgba(255,255,255,0.03)", border: "1px solid var(--brd)", borderRadius: 12, color: "var(--w)", display: "flex", alignItems: "center", gap: 8, textDecoration: "none", fontWeight: 600 }}>
              <MessageCircle size={18} color="#25d366" /> {isTamil ? "WhatsApp" : "Chat on WhatsApp"}
            </a>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, width: "100%" }}>
          {servicesList.map(p => (
            <div key={p.id} role="button" tabIndex={0} onClick={() => go(`category-${p.id}`)} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--brd)", padding: 28, borderRadius: 20, display: "flex", flexDirection: "column", gap: 20, cursor: "pointer", transition: "all 0.3s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", overflow: "hidden", border: "2px solid var(--o)" }}>
                  <img src={p.img} alt={`${p.name} in Perambur`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: 6, background: "rgba(255,255,255,0.03)", borderRadius: 8, color: "var(--sl3)" }}><ArrowRight size={14} /></div>
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 700, color: "var(--w)", fontFamily: "'Cormorant Garamond', serif" }}>{p.name}</h3>
              <p style={{ fontSize: 13.5, color: "var(--sl3)", lineHeight: 1.6, marginTop: -8 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}