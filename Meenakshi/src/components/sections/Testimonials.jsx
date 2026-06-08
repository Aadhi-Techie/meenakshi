import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { SecHead, Stars } from '../ui';

export default function Testimonials({ t }) {
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);

  // மொழி கண்டறிதல் (தமிழ் அல்லது ஆங்கிலம்)
  const isTamil = t.nav?.home === "முகப்பு";

  // பன்மொழி (Bilingual) வாடிக்கையாளர் கருத்துக்கள்
  const TESTS = [
    { 
      n: "Rajesh Kumar", 
      r: isTamil ? "உட்புற வடிவமைப்பாளர்" : "Interior Designer", 
      s: 5, 
      t: isTamil 
        ? "சிறந்த தரம் மற்றும் டெலிவரி. 15க்கும் மேற்பட்ட ப்ராஜெக்ட்களுக்கு ஸ்ரீ மீனாட்சியில் இருந்து கண்ணாடி மற்றும் அலுமினியம் வாங்கியுள்ளேன் — இதுவரை எந்த குறையும் இல்லை." 
        : "Outstanding quality and delivery. I've sourced glass and aluminium for 15+ projects through Sri Meenakshi — never a single complaint." 
    },
    { 
      n: "Priya Venkatesh", 
      r: isTamil ? "வீட்டு உரிமையாளர்" : "Homeowner", 
      s: 5, 
      t: isTamil 
        ? "அவர்களது பிளைவுட் மற்றும் UPVC ஜன்னல்களைக் கொண்டு வீட்டை புதுப்பித்தோம். மூன்று வருடங்கள் ஆனாலும் தரம் அப்படியே உள்ளது." 
        : "Renovated our entire home with their plywood and UPVC windows. The quality speaks for itself three years later." 
    },
    { 
      n: "Mohammed Irfan", 
      r: isTamil ? "காண்ட்ராக்டர்" : "Contractor", 
      s: 5, 
      t: isTamil 
        ? "வட சென்னையின் சிறந்த மொத்த விற்பனையாளர். சரியான விலை, எப்போதும் கிடைக்கும் ஸ்டாக் மற்றும் தாமதமில்லாத டெலிவரி." 
        : "Best bulk supplier in North Chennai. Pricing is sharp, stock is always available and delivery is never late." 
    },
    { 
      n: "Lakshmi Devi", 
      r: isTamil ? "கட்டிடக்கலை நிபுணர்" : "Architect", 
      s: 4, 
      t: isTamil 
        ? "கட்டிடக்கலை வரைபடங்களைச் சரியாகப் புரிந்துகொள்ளும் ப்ரொபஷனல் அணி. அவர்களின் அலுமினியம் ஃபேப்ரிகேஷன் மிகச் சிறப்பாக இருந்தது." 
        : "Professional team that understands architectural specifications. Their aluminium curtain wall system was fabricated perfectly." 
    },
    { 
      n: "Santhosh Babu", 
      r: isTamil ? "டெவலப்பர்" : "Developer", 
      s: 5, 
      t: isTamil 
        ? "ஒரு குடியிருப்புக்கு 200 UPVC ஜன்னல்கள் ஆர்டர் செய்தோம் — குறைவற்ற தரம், சரியான நேர டெலிவரி மற்றும் அவர்களின் குழுவே இன்ஸ்டாலேஷன் செய்து முடித்தது." 
        : "Ordered 200 UPVC windows for a residential block — flawless quality, on-time delivery and their site team handled the entire installation." 
    },
    { 
      n: "Anitha Rajan", 
      r: isTamil ? "இன்டீரியர் கன்சல்டன்ட்" : "Interior Consultant", 
      s: 5, 
      t: isTamil 
        ? "இவர்களின் ஹார்டுவேர் கலெக்‌ஷன் சென்னையில் மிகச் சிறந்தது. உடனடி டெலிவரி பல அவசர ப்ராஜெக்ட்களில் எங்களுக்கு உதவியது." 
        : "Their hardware range is unmatched in Chennai. Same-day delivery saved us on multiple urgent projects." 
    },
  ];

  useEffect(() => {
    if (!auto) return;
    const tm = setInterval(() => setIdx(i => (i + 1) % TESTS.length), 5000);
    return () => clearInterval(tm);
  }, [auto, TESTS.length]);

  const sel = (i) => { setIdx(i); setAuto(false); };

  return (
    <section className="sec" aria-label={t.tsH || "Testimonials"} style={{ background: "var(--bg)" }}>
      <div className="wrap">
        <SecHead bdg={t.tsBdg} h={t.tsH} />
        
        {/* SEO & Accessibility Wrapper for Carousel */}
        <div 
          style={{ maxWidth: 720, margin: "0 auto 40px", position: "relative" }}
          role="region" 
          aria-roledescription="carousel" 
          aria-live={auto ? "off" : "polite"}
        >
          {TESTS.map((r, i) => (
            <div 
              key={i} 
              className={`ts ${i === idx ? "on" : ""}`} 
              aria-hidden={i !== idx} 
              style={{ display: i === idx ? 'block' : 'none', animation: "fadeIn 0.5s ease" }}
            >
              <div className="g" style={{ borderRadius: 24, padding: 40, border: "1px solid var(--brd)" }}>
                <MessageCircle size={42} color="var(--o)" style={{ opacity: .28, marginBottom: 20 }} aria-hidden="true" />
                
                {/* SEO Optimized Blockquote */}
                <blockquote style={{ margin: 0 }}>
                  <p style={{ color: "var(--w)", fontSize: 17, lineHeight: 1.88, fontStyle: "italic", marginBottom: 28 }}>
                    "{r.t}"
                  </p>
                </blockquote>
                
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div aria-hidden="true" style={{ width: 54, height: 54, borderRadius: "50%", background: "linear-gradient(135deg,var(--o),var(--o2))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontWeight: 800, fontSize: 24, color: "#ffffff", flexShrink: 0 }}>
                    {r.n[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--w)", fontSize: 16 }}>{r.n}</div>
                    <div style={{ color: "var(--sl3)", fontSize: 13, marginBottom: 5 }}>{r.r}</div>
                    <Stars n={r.s} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Controls for Testimonials */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }} role="tablist">
          {TESTS.map((r, i) => (
            <button 
              key={i} 
              role="tab"
              aria-selected={i === idx}
              aria-label={`View testimonial from ${r.n}`}
              onClick={() => sel(i)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", border: `1.5px solid ${i === idx ? "var(--o)" : "rgba(100,100,100,.1)"}`, background: i === idx ? "rgba(249,115,22,.1)" : "rgba(100,100,100,.03)", borderRadius: 99, cursor: "pointer", transition: "all .3s" }}>
              <div aria-hidden="true" style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,var(--o),var(--o2))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#ffffff", flexShrink: 0 }}>
                {r.n[0]}
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: i === idx ? "var(--o3)" : "var(--sl3)", whiteSpace: "nowrap" }}>
                {r.n.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}