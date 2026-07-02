import { useState, useEffect } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { supabase } from '../../supabase';

export default function Hero({ go, t }) {
  const [slideImages, setSlideImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isTamil = t?.nav?.home === "முகப்பு";

  const catNames = isTamil
    ? ["கண்ணாடி", "பிளைவுட்", "UPVC", "WPVC"]
    : ["Glass", "Plywoods", "UPVC", "WPVC"];

  const showroomTxt  = isTamil ? "ஷோரூம்" : "Showroom";
  const defaultSubTxt = isTamil ? "சிறந்த தரமான கலெக்‌ஷன்ஸ்" : "Premium Quality Collections";
  const badgeTxt     = isTamil ? "சென்னையின் முன்னணி ட்ரேடர்ஸ்" : "CHENNAI'S PREMIER TRADERS";

  const [headLine1, headLine2] = (t?.hH || "").split('\n');

  const fallbackImageUrl = "/assets/hero-bg.jpg";

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // 🌟 திருத்தம்: ப்ராடக்ட் பக்கத்திற்குச் செல்ல 'id' காலமையும் சேர்த்து எடுக்கிறோம்
        const { data, error } = await supabase
          .from('products')
          .select('id, category, subcategory, image_url')
          .not('image_url', 'is', null);

        if (error) throw error;
        
        if (data && data.length > 0) {
          const sortedData = data.sort((a, b) => {
            const catA = a.category.toLowerCase();
            const catB = b.category.toLowerCase();
            
            const isPriorityA = (catA.includes('upvc') || catA.includes('wpvc')) ? 0 : 1;
            const isPriorityB = (catB.includes('upvc') || catB.includes('wpvc')) ? 0 : 1;
            
            return isPriorityA - isPriorityB;
          });
          
          setSlideImages(sortedData);
        }
      } catch (err) {
        console.error("Hero images எடுக்க முடியவில்லை:", err.message);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (slideImages.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % slideImages.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [slideImages]);

  const defaultSlide = { id: null, category: isTamil ? "பிரீமியம்" : "Premium", subcategory: defaultSubTxt, image_url: fallbackImageUrl };
  const currentSlide = slideImages.length > 0 ? slideImages[currentIndex] : defaultSlide;

  return (
    <section aria-labelledby="hero-heading" style={{ paddingTop: "clamp(100px, 12vw, 140px)", paddingBottom: "60px", background: "var(--bg)", position: "relative", overflow: "hidden" }}>

      {/* ── 🌟 INJECTING RESPONSIVE LAYOUT FIX CSS ── */}
      <style>{`
        .hero-wrap-container {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 40px;
        }
        .hero-right-card {
          flex: 1 1 400px;
          z-index: 1;
          animation: fadeUp 1s ease;
          width: 100%;
        }
        @media (max-width: 768px) {
          .hero-wrap-container {
            flex-direction: column-reverse !important; /* மொபைலில் ஸ்லைடர் மேலே வர */
            gap: 28px !important;
          }
          .hero-right-card {
            flex: 1 1 100% !important;
          }
          .hero-card-padding {
            padding: 16px !important; /* மொபைலில் கார்டு கட் ஆகாமல் தடுக்க சுருக்கப்பட்ட அளவு */
            border-radius: 24px !important;
          }
          .hero-slider-img-box {
            height: 240px !important; /* மொபைல் திரைக்கு ஏற்ற கச்சிதமான உயரம் */
          }
        }
      `}</style>

      {/* Background glow */}
      <div style={{ position: "absolute", top: "10%", left: "5%", width: 300, height: 300, background: "var(--o)", filter: "blur(150px)", opacity: 0.15, borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 300, height: 300, background: "#38bdf8", filter: "blur(150px)", opacity: 0.1, borderRadius: "50%", pointerEvents: "none" }} />

      <div className="hero-wrap-container wrap">

        {/* Left Content */}
        <div style={{ flex: "1 1 400px", zIndex: 1, animation: "fadeUp .8s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(255, 115, 0, 0.1)", border: "1px solid rgba(255, 115, 0, 0.2)", borderRadius: 100, color: "var(--o)", fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 24 }}>
            <Star size={14} fill="var(--o)" aria-hidden="true" /> {badgeTxt}
          </div>

          <h1 id="hero-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(42px, 5.5vw, 68px)", fontWeight: 800, lineHeight: 1.15, color: "var(--w)", marginBottom: 24, whiteSpace: "pre-line" }}>
            <span style={{ color: "var(--o)" }}>{headLine1}</span><br />
            {headLine2}
          </h1>

          <p style={{ color: "var(--sl3)", fontSize: "clamp(15px, 1.8vw, 17px)", lineHeight: 1.6, marginBottom: 32, maxWidth: 480 }}>
            {t?.hS}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <button className="bo" aria-label={t?.hBtn1} onClick={() => go('gallery')} style={{ padding: "14px 28px", fontSize: 15, borderRadius: 12, display: "flex", alignItems: "center", gap: 8 }}>
              {t?.hBtn1} <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button className="bw" aria-label={t?.hBtn2} onClick={() => go('contact')} style={{ padding: "14px 28px", fontSize: 15, borderRadius: 12 }}>
              {t?.hBtn2}
            </button>
          </div>
        </div>

        {/* Right Slider */}
        <div className="hero-right-card">
          <div className="hero-card-padding" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--brd)", borderRadius: 32, padding: 24, display: "flex", flexDirection: "column", gap: 20, backdropFilter: "blur(10px)" }}>

            {/* Image Box ➡️ 🌟 கிளிக் செய்தால் ப்ராடக்ட் விவரப் பக்கத்திற்குச் செல்லும் ட்ரிக் */}
            <div 
              onClick={() => {
                if (currentSlide.id) {
                  go(`product-${currentSlide.id}`); // 🔗 ஐடி இருந்தால் நேரடி ப்ராடக்ட் பக்கம்!
                } else if (currentSlide.category) {
                  go(`category-${currentSlide.category.toLowerCase()}`); // சேஃப்பஸ்ட் ஃபால்பேக் கேட்டகிரி
                }
              }} 
              className="hero-slider-img-box"
              style={{ width: "100%", height: "300px", borderRadius: 20, background: "var(--bg2)", position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", transition: "transform 0.3s ease" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.01)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <img
                src={currentSlide.image_url}
                alt={`${currentSlide.category || 'Premium'} ${showroomTxt} - Sree Meenakshi Glass and Plywoods`}
                fetchPriority="high"
                decoding="async"
                onError={(e) => { e.target.onerror = null; e.target.src = fallbackImageUrl; }}
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.5s ease" }}
              />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px 20px 20px", background: "linear-gradient(to top, rgba(0,0,0,0.95), transparent)", textAlign: "center" }}>
                <h2 style={{ color: "var(--w)", fontSize: 20, fontWeight: 700, fontFamily: "'Cormorant Garamond', serif", margin: 0 }}>
                  {currentSlide.category} {showroomTxt}
                </h2>
                <p style={{ color: "var(--sl)", fontSize: 12, marginTop: 4, margin: 0 }}>
                  {currentSlide.subcategory || defaultSubTxt}
                </p>
              </div>
            </div>

            {/* Slider dots */}
            <div role="group" aria-label="Image Slider Controls" style={{ display: "flex", justifyContent: "center", gap: 8 }}>
              {slideImages.length > 0 ? slideImages.slice(0, 10).map((slide, i) => ( // 💡 மேக்ஸிமம் 10 டாட்டுகள் மட்டும் மொபைலில் கச்சிதமாக தெரிய
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === currentIndex ? "true" : undefined}
                  style={{ width: i === currentIndex ? 20 : 7, height: 7, borderRadius: 4, background: i === currentIndex ? "var(--o)" : "var(--sl3)", transition: "all 0.3s ease", border: "none", cursor: "pointer", padding: 0 }}
                />
              )) : (
                <div style={{ width: 24, height: 7, borderRadius: 4, background: "var(--o)" }} />
              )}
            </div>

            {/* Category Buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { name: catNames[0], route: "glass",    icon: "🪟" },
                { name: catNames[1], route: "plywoods", icon: "🪵" },
                { name: catNames[2], route: "upvc",     icon: "🏗️" },
                { name: catNames[3], route: "wpvc",     icon: "🚪" }
              ].map(cat => (
                <button
                  key={cat.route}
                  aria-label={`View ${cat.name} category`}
                  onClick={() => go(`category-${cat.route}`)}
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--brd)", padding: "10px 12px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, color: "var(--sl3)", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "var(--w)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "var(--sl3)"; }}
                >
                  <span style={{ fontSize: 16 }} aria-hidden="true">{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}