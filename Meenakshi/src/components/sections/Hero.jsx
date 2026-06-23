import { useState, useEffect } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { supabase } from '../../supabase';

export default function Hero({ go, t }) {
  const [slideImages, setSlideImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // திருத்தம் 1: '?' சேர்த்து பாதுகாப்பாக மாற்றப்பட்டுள்ளது
  const isTamil = t?.nav?.home === "முகப்பு";

  // Category பட்டன்களுக்கான வார்த்தைகள்
  const catNames = isTamil 
    ? ["கண்ணாடி", "பிளைவுட்", "UPVC", "WPVC"] 
    : ["Glass", "Plywoods", "UPVC", "WPVC"];

  const showroomTxt = isTamil ? "ஷோரூம்" : "Showroom";
  const defaultSubTxt = isTamil ? "சிறந்த தரமான கலெக்‌ஷன்ஸ்" : "Premium Quality Collections";
  const badgeTxt = isTamil ? "சென்னையின் முன்னணி ட்ரேடர்ஸ்" : "CHENNAI'S PREMIER TRADERS";

  const [headLine1, headLine2] = (t?.hH || "").split('\n');

  // Fetch images from Supabase
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('category, subcategory, image_url')
          .not('image_url', 'is', null);

        if (error) throw error;

        if (data && data.length > 0) {
          setSlideImages(data);
        }
      } catch (err) {
        console.error("Hero images எடுக்க முடியவில்லை:", err.message);
      }
    };

    fetchImages();
  }, []);

  // Auto Slide Logic
  useEffect(() => {
    if (slideImages.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slideImages.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [slideImages]);

  // Local Default Image
  const fallbackImageUrl = "/assets/hero-bg.jpg"; 

  const defaultSlide = {
    category: isTamil ? "பிரீமியம்" : "Premium",
    subcategory: defaultSubTxt,
    image_url: fallbackImageUrl
  };

  const currentSlide = slideImages.length > 0 ? slideImages[currentIndex] : defaultSlide;

  return (
    <section aria-labelledby="hero-heading" style={{ paddingTop: "120px", paddingBottom: "60px", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      
      {/* Background glow effects */}
      <div style={{ position: "absolute", top: "10%", left: "5%", width: 300, height: 300, background: "var(--o)", filter: "blur(150px)", opacity: 0.15, borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 300, height: 300, background: "#38bdf8", filter: "blur(150px)", opacity: 0.1, borderRadius: "50%", pointerEvents: "none" }} />

      <div className="wrap" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "40px" }}>
        
        {/* Left Side Content */}
        <div style={{ flex: "1 1 400px", zIndex: 1, animation: "fadeUp .8s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(255, 115, 0, 0.1)", border: "1px solid rgba(255, 115, 0, 0.2)", borderRadius: 100, color: "var(--o)", fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 24 }}>
            <Star size={14} fill="var(--o)" aria-hidden="true" /> {badgeTxt}
          </div>
          
          <h1 id="hero-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 800, lineHeight: 1.1, color: "var(--w)", marginBottom: 24, whiteSpace: "pre-line" }}>
            <span style={{ color: "var(--o)" }}>{headLine1}</span><br />
            {headLine2}
          </h1>
          
          <p style={{ color: "var(--sl3)", fontSize: "clamp(16px, 2vw, 18px)", lineHeight: 1.6, marginBottom: 40, maxWidth: 480 }}>
            {t?.hS}
          </p>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {/* திருத்தம் 2: go('gallery') என மாற்றி உள்ளேன் (அனைத்து படங்களையும் காண) */}
            <button className="bo" aria-label={t?.hBtn1} onClick={() => go('gallery')} style={{ padding: "16px 32px", fontSize: 16, borderRadius: 12, display: "flex", alignItems: "center", gap: 8 }}>
              {t?.hBtn1} <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button className="bw" aria-label={t?.hBtn2} onClick={() => go('contact')} style={{ padding: "16px 32px", fontSize: 16, borderRadius: 12 }}>
              {t?.hBtn2}
            </button>
          </div>
        </div>

        {/* Right Side Slider */}
        <div style={{ flex: "1 1 400px", zIndex: 1, animation: "fadeUp 1s ease" }}>
          <div style={{ 
            background: "rgba(255,255,255,0.02)", 
            border: "1px solid var(--brd)", 
            borderRadius: 32, 
            padding: 24,
            display: "flex", 
            flexDirection: "column", 
            gap: 24,
            backdropFilter: "blur(10px)"
          }}>
            
            {/* Image Container with Proper SEO Img Tag */}
            <div style={{ 
              width: "100%", 
              height: "300px", 
              borderRadius: 20, 
              background: "var(--bg2)", 
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.05)"
            }}>
               <img 
                 src={currentSlide.image_url} 
                 alt={`${currentSlide.category || 'Premium'} ${showroomTxt} - Sree Meenakshi Glass and Plywoods`}
                 fetchPriority="high"
                 decoding="async"
                 style={{
                   width: "100%", 
                   height: "100%", 
                   objectFit: "cover",
                   transition: "opacity 0.5s ease" 
                 }} 
               />
              
              {/* Text overlay */}
              <div style={{ 
                position: "absolute", 
                bottom: 0, left: 0, right: 0, 
                padding: "40px 20px 20px", 
                background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
                textAlign: "center"
              }}>
                <h3 style={{ color: "var(--w)", fontSize: 22, fontWeight: 700, fontFamily: "'Cormorant Garamond', serif" }}>
                  {currentSlide.category} {showroomTxt}
                </h3>
                <p style={{ color: "var(--sl)", fontSize: 13, marginTop: 4 }}>
                  {currentSlide.subcategory || defaultSubTxt}
                </p>
              </div>
            </div>

            {/* Slider Dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }} aria-label="Image Slider Controls">
              {slideImages.length > 0 ? slideImages.map((_, i) => (
                <div key={i} style={{ 
                  width: i === currentIndex ? 24 : 8, 
                  height: 8, 
                  borderRadius: 4, 
                  background: i === currentIndex ? "var(--o)" : "var(--sl3)",
                  transition: "all 0.3s ease"
                }} />
              )) : (
                <div style={{ width: 24, height: 8, borderRadius: 4, background: "var(--o)" }} />
              )}
            </div>

            {/* Category Buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { name: catNames[0], route: "glass", icon: "🪟" }, 
                { name: catNames[1], route: "plywoods", icon: "🪵" },
                { name: catNames[2], route: "upvc", icon: "🏗️" }, 
                { name: catNames[3], route: "wpvc", icon: "🚪" }
              ].map(cat => (
                <button 
                  key={cat.route} 
                  aria-label={`View ${cat.name} category`}
                  onClick={() => go(`category-${cat.route}`)}
                  style={{ 
                    background: "rgba(255,255,255,0.03)", 
                    border: "1px solid var(--brd)", 
                    padding: 12, 
                    borderRadius: 12, 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 12,
                    color: "var(--sl3)",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "var(--w)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "var(--sl3)"; }}
                >
                  <span style={{ fontSize: 18 }} aria-hidden="true">{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}