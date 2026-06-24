import React from 'react';
import { ArrowRight, Award, ShieldCheck, Zap, Handshake, Star, Store } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function About({ go, t }) {
  // நீங்கள் காட்ட விரும்பும் கடையின் பட லிங்க் (assets-ல் இந்த இமேஜ் இருப்பதை உறுதி செய்யவும்)
  const shopImageUrl = "/assets/About-Image.webp"; // WebP வடிவில் சிறந்த தரம் மற்றும் சிறிய கோப்பு அளவு

  // மொழி கண்டறிதல் (தமிழ் அல்லது ஆங்கிலம்)
  const isTamil = t.nav?.home === "முகப்பு";

  // --- 3D Mouse Tracking Animation Function ---
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (-10 to 10 degrees)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  // Journey Data (Bilingual)
  const journeyData = [
    { year: "2007", desc: isTamil ? "பெரம்பூரில் கண்ணாடி மற்றும் பிளைவுட் வியாபாரத்துடன் தொடக்கம்" : "Founded in Perambur with glass & plywood focus" },
    { year: "2010", desc: isTamil ? "அலுமினியம் ஃபேப்ரிகேஷன் மற்றும் ஹார்டுவேர்ஸிற்கு விரிவாக்கம்" : "Expanded to aluminium fabrication & hardware" },
    { year: "2016", desc: isTamil ? "UPVC மற்றும் WPVC தயாரிப்புகள் அறிமுகம்" : "Introduced UPVC & WPVC product lines" },
    { year: "2020", desc: isTamil ? "அனைத்து தயாரிப்புகளுக்கும் ISI சான்றிதழ் பெறப்பட்டது" : "Achieved ISI certification across all product lines" },
    { year: "2025", desc: isTamil ? "தமிழ்நாடு முழுவதும் 2000+ வாடிக்கையாளர்களுக்கு சேவை" : "Serving 2000+ clients across Tamil Nadu" }
  ];

  // Features Data (Bilingual)
  const featuresData = [
    { 
      icon: <Award size={24} color="var(--o)" aria-hidden="true" />, 
      title: isTamil ? "ISI சான்றளிக்கப்பட்ட பொருட்கள்" : "ISI Certified Materials", 
      desc: isTamil ? "ஒவ்வொரு பொருளும் தரப்பரிசோதனை செய்யப்பட்டு பெறப்படுகிறது." : "Every product quality-checked and sourced from certified manufacturers." 
    },
    { 
      icon: <Handshake size={24} color="var(--o)" aria-hidden="true" />, 
      title: isTamil ? "தனிப்பயனாக்கப்பட்ட சேவை" : "Personalised Service", 
      desc: isTamil ? "அளவீடு முதல் டெலிவரி வரை, எங்கள் நிபுணர்கள் உங்களுடன் இருப்பார்கள்." : "From measurement to delivery, our experts are with you at every step." 
    },
    { 
      icon: <Zap size={24} color="var(--o)" aria-hidden="true" />, 
      title: isTamil ? "அதிவேக டெலிவரி" : "Fastest Delivery", 
      desc: isTamil ? "சென்னை முழுவதும் அன்றே டெலிவரி; வெளியூர்களுக்கு 24 மணி நேரத்திற்குள்." : "Same-day delivery across Chennai; outstation within 24 hours." 
    },
    { 
      icon: <ShieldCheck size={24} color="var(--o)" aria-hidden="true" />, 
      title: isTamil ? "வெளிப்படையான விலை" : "Transparent Pricing", 
      desc: isTamil ? "மறைமுக கட்டணங்கள் இல்லை. மொத்த ஆர்டர்களுக்கு சிறந்த தள்ளுபடி." : "No hidden charges. Best market rates with volume discounts." 
    }
  ];

  return (
    // SEO Semantic Tag <section>
    <section id="about" aria-labelledby="about-heading" style={{ padding: "80px 24px", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      
      {/* Background aesthetic glow */}
      <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: 500, height: 500, background: "var(--o)", filter: "blur(250px)", opacity: 0.08, borderRadius: "50%", pointerEvents: "none" }} />
      
      <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: 60, alignItems: "flex-start" }}>
        
        {/* ================= LEFT COLUMN: Image, Stats & Journey ================= */}
        <div style={{ flex: "1 1 450px", display: "flex", flexDirection: "column", gap: 40, animation: "fadeUp 0.8s ease forwards" }}>
          
          {/* 3D Image & Stats Card */}
          <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ 
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", 
              borderRadius: 24, overflow: "hidden", transition: "transform 0.1s ease-out", 
              transformStyle: "preserve-3d", boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              position: "relative"
            }}
          >
            {/* Image Part - SEO Alt text updated */}
            <div style={{ height: 280, position: "relative" }}>
              <img 
                src={shopImageUrl} 
                alt="Sree Meenakshi Glass and Plywoods Showroom - Premium Glass, Plywood, UPVC and Aluminium Suppliers in Perambur, Chennai" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }} />
              
              {/* 🌟 20+ Years Badge Inside Image */}
              <div style={{ position: "absolute", top: 20, right: 24, background: "var(--o)", color: "#fff", padding: "8px 16px", borderRadius: 10, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, fontSize: 12, boxShadow: "0 4px 12px rgba(255,115,0,0.3)", transform: "translateZ(25px)" }}>
                <Store size={14} /> {isTamil ? "20+ ஆண்டுகள் அனுபவம்" : "20+ Years Excellence"}
              </div>

              <div style={{ position: "absolute", bottom: 20, left: 24, transform: "translateZ(30px)" }}>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: "var(--w)", fontFamily: "'Cormorant Garamond', serif", marginBottom: 4 }}>Sree Meenakshi Glass and Plywoods</h3>
                <p style={{ color: "var(--sl3)", fontSize: 13 }}>No:26/23, Sathiya Narayanan Street, Perambur, Chennai - 600011<br/>Tamil Nadu, India</p>
              </div>
            </div>
            <Helmet>
       
              <meta name="description" content="Discover the legacy of Sree Meenakshi Glass and Plywoods. With over 20 years of excellence, we are Chennai's most trusted wholesale dealer for premium glass and plywoods." />
            </Helmet>

            {/* Stats Grid Part */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "rgba(0,0,0,0.4)", borderTop: "1px solid rgba(255,255,255,0.05)", transform: "translateZ(20px)" }}>
              {[
                { val: "20+", lbl: isTamil ? "ஆண்டுகள்" : "YRS" },
                { val: "2000+", lbl: isTamil ? "வாடிக்கையாளர்கள்" : "CLIENTS" },
                { val: "500+", lbl: isTamil ? "பொருட்கள்" : "SKUS" },
                { val: "5000+", lbl: isTamil ? "ப்ராஜெக்ட்கள்" : "PROJECTS" }
              ].map((stat, i) => (
                <div key={i} style={{ padding: "20px 10px", textAlign: "center", borderRight: i !== 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--o)", fontFamily: "'Cormorant Garamond', serif", marginBottom: 4 }}>{stat.val}</div>
                  <div style={{ fontSize: 10, color: "var(--sl3)", fontWeight: 700, letterSpacing: 1 }}>{stat.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Our Journey Timeline */}
          <div style={{ padding: "0 10px" }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: "var(--w)", fontFamily: "'Cormorant Garamond', serif", marginBottom: 24 }}>
              {t.abJ || (isTamil ? "எங்கள் பயணம்" : "Our Journey")}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, borderLeft: "2px solid rgba(255,115,0,0.2)", paddingLeft: 20, marginLeft: 10 }}>
              {journeyData.map((item, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: -27, top: 4, width: 12, height: 12, borderRadius: "50%", background: "var(--o)", border: "2px solid var(--bg)" }} />
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--w)", fontFamily: "'Cormorant Garamond', serif", marginBottom: 4 }}>{item.year}</div>
                  <p style={{ fontSize: 14, color: "var(--sl3)", lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: Content & Features ================= */}
        <div style={{ flex: "1 1 500px", animation: "fadeUp 1s ease forwards" }}>
          
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(255, 115, 0, 0.1)", border: "1px solid rgba(255, 115, 0, 0.2)", borderRadius: 100, color: "var(--o)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              {t.abBdg || (isTamil ? "எங்கள் கதை" : "Our Story")}
            </div>
            
            {/* 🌟 Trust Badges (ISI + GST + Google Reviews) */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: 100, color: "#10b981", fontSize: 12, fontWeight: 700 }}>
              <ShieldCheck size={14} aria-hidden="true" /> {isTamil ? "அங்கீகரிக்கப்பட்ட டீலர்" : "Authorized Dealer"}
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: 100, color: "#38bdf8", fontSize: 12, fontWeight: 700 }}>
              <Award size={14} aria-hidden="true" /> {isTamil ? "GSTIN: 338UWPMD566N1ZW" : "GSTIN: 338UWPMD566N1ZW"}
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "rgba(234, 179, 8, 0.1)", border: "1px solid rgba(234, 179, 8, 0.2)", borderRadius: 100, color: "#eab308", fontSize: 12, fontWeight: 700 }}>
              <Star size={14} fill="#eab308" aria-hidden="true" /> {isTamil ? "4.9 கூகுள் ரேட்டிங்" : "4.9 Google Reviews"}
            </div>
          </div>
          
          {/* SEO Optimized H2 Tag */}
          <h2 id="about-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 800, lineHeight: 1.1, color: "var(--w)", marginBottom: 24, whiteSpace: "pre-line" }}>
            {t.abH || (isTamil ? "இரண்டு தசாப்தங்களாக\nசென்னையின் நம்பிக்கைக்குரியவர்கள்" : "Trusted by Chennai\nFor Over Two Decades")}
          </h2>
          
          <p style={{ color: "var(--sl3)", fontSize: 16, lineHeight: 1.8, marginBottom: 40 }}>
            {t.abP || (isTamil ? 
              "சென்னை பெரம்பூரில் கடந்த 20 ஆண்டுகளுக்கும் மேலாக தரமான கንஸ்ட்ரக்ஷன் மற்றும் இன்டீரியர் பொருட்களை வழங்கி வரும் முன்னணி நிறுவனம். வாடிக்கையாளர்களுக்கு சிறந்த சேவையை அசல் தயாரிப்புகள் மூலம் வழங்குவதே எங்களின் முதன்மை நோக்கம்." : 
              "For over 20 years, SreeMeenakshi Traders has been Chennai's benchmark for premium quality building materials. We provide authorized wholesale supplies with absolute transparency and market-best standards.")
            }
          </p>
          
          {/* Features 2x2 Grid with 3D Animation */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 40 }}>
            {featuresData.map((feat, i) => (
              <div 
                key={i} 
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ 
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", 
                  padding: 24, borderRadius: 16, transition: "transform 0.1s ease-out", 
                  transformStyle: "preserve-3d", cursor: "default" 
                }}
              >
                <div style={{ transform: "translateZ(20px)" }}>
                  <div style={{ padding: 12, background: "rgba(255,115,0,0.1)", display: "inline-flex", borderRadius: 12, marginBottom: 16 }}>
                    {feat.icon}
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: "var(--w)", marginBottom: 8 }}>{feat.title}</h4>
                  <p style={{ fontSize: 13, color: "var(--sl3)", lineHeight: 1.6 }}>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="bo" 
            aria-label={t.abBtn || "Discuss Your Project"}
            onClick={() => go('contact')} 
            style={{ padding: "16px 32px", fontSize: 16, borderRadius: 12, display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, transition: "transform 0.2s" }} 
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} 
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            {t.abBtn || (isTamil ? "உங்கள் திட்டத்தை பேசலாம்" : "Discuss Your Project")} <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>

      </div>
    </section>
  );
}