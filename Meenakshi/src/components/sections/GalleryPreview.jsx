import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { ArrowRight } from 'lucide-react';

export default function GalleryPreview({ go, t }) {
  const [catImages, setCatImages] = useState({});

  // மொழி கண்டறிதல் (தமிழ் அல்லது ஆங்கிலம்)
  const isTamil = t.nav?.home === "முகப்பு";

  useEffect(() => {
    const fetchCategoryImages = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('category, image_url')
          .not('image_url', 'is', null);

        if (error) throw error;

        if (data) {
          const imageMap = {};
          
          data.forEach(item => {
            if (!item.category) return;
            // டேட்டாபேஸில் உள்ள பெயரை சிறிய எழுத்தாக்கி கொள்கிறோம்
            const catDb = item.category.toLowerCase();

            // Smart Matching: வார்த்தை இருந்தாலே மேட்ச் ஆகிவிடும்!
            if (catDb.includes('glass') && !imageMap['glass']) imageMap['glass'] = item.image_url;
            else if (catDb.includes('plywood') && !imageMap['plywoods']) imageMap['plywoods'] = item.image_url;
            else if (catDb.includes('aluminium') && !imageMap['aluminium']) imageMap['aluminium'] = item.image_url;
            else if (catDb.includes('upvc') && !imageMap['upvc']) imageMap['upvc'] = item.image_url;
            else if (catDb.includes('wpvc') && !imageMap['wpvc']) imageMap['wpvc'] = item.image_url;
            else if (catDb.includes('hardware') && !imageMap['hardwares']) imageMap['hardwares'] = item.image_url;
          });
          
          setCatImages(imageMap);
        }
      } catch (err) {
        console.error("Gallery images error:", err.message);
      }
    };

    fetchCategoryImages();
  }, []);

  // Bilingual Category Data
  const categories = [
    { id: 'glass', name: isTamil ? 'கண்ணாடி ஷோரூம்' : 'Glass Showroom', fallbackIcon: '🪟' },
    { id: 'plywoods', name: isTamil ? 'பிளைவுட் ஸ்டாக்' : 'Plywood Stock', fallbackIcon: '🪵' },
    { id: 'aluminium', name: isTamil ? 'அலுமினியம் வேலைகள்' : 'Aluminium Works', fallbackIcon: '⚙️' },
    { id: 'upvc', name: isTamil ? 'UPVC விண்டோ சிஸ்டம்ஸ்' : 'UPVC Window Systems', fallbackIcon: '🏗️' },
    { id: 'wpvc', name: isTamil ? 'WPVC ஷோரூம்' : 'WPVC Showroom', fallbackIcon: '🚪' }
  ];

  return (
    // SEO Semantic Tag & Accessibility
    <section aria-labelledby="gallery-preview-heading" style={{ padding: "80px 24px", background: "var(--bg)", overflow: "hidden" }}>
      <div className="wrap">
        
        {/* Section Header */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, gap: 20 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(255, 115, 0, 0.1)", border: "1px solid rgba(255, 115, 0, 0.2)", borderRadius: 100, color: "var(--o)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
              {t.glBdg || (isTamil ? "தொகுப்பு" : "Gallery")}
            </div>
            <h2 id="gallery-preview-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 42px)", fontWeight: 800, color: "var(--w)", marginBottom: 10, whiteSpace: "pre-line" }}>
              {t.glH || (isTamil ? "திட்ட தொகுப்பு" : "Project Gallery")}
            </h2>
            <p style={{ color: "var(--sl3)", fontSize: 16, maxWidth: 600 }}>
              {t.glP || (isTamil ? "சென்னை முழுவதும் நாங்கள் சமீபத்தில் முடித்த ப்ராஜெக்ட்களை இங்கே காணுங்கள்." : "Explore our recent installations and material supply projects across Chennai.")}
            </p>
          </div>
          <button 
            className="bw" 
            aria-label={t.viewAll || "View All Gallery"}
            onClick={() => go('gallery')} 
            style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: 8, borderRadius: 12 }}
          >
            {t.viewAll || (isTamil ? "அனைத்தும் காண்க" : "View All")} <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Cards Layout */}
        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          justifyContent: "center", 
          gap: 24 
        }}>
          {categories.map((cat) => {
            const hasImage = catImages[cat.id];

            return (
              <div
                key={cat.id}
                role="button"
                tabIndex={0}
                aria-label={`Explore ${cat.name}`}
                onClick={() => go(`category-${cat.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    go(`category-${cat.id}`);
                  }
                }}
                style={{
                  flex: "1 1 250px",
                  maxWidth: "280px",
                  height: 350,
                  borderRadius: 24,
                  backgroundColor: "var(--bg2)",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: "1px solid rgba(255,255,255,0.05)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(255, 115, 0, 0.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* SEO Optimized Image Tag instead of Background Image */}
                {hasImage && (
                  <img 
                    src={hasImage} 
                    alt={`${cat.name} - Sri Meenakshi Glass And Plywoods Traders Chennai`} 
                    style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} 
                  />
                )}

                {/* Gradient Overlay */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: hasImage 
                    ? "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)" 
                    : "none",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: hasImage ? "flex-end" : "center",
                  alignItems: "center",
                  padding: 24,
                  textAlign: "center",
                  zIndex: 1
                }}>
                  
                  {!hasImage && (
                    <div style={{ fontSize: 48, marginBottom: 16 }} aria-hidden="true">
                      {cat.fallbackIcon}
                    </div>
                  )}
                  
                  <h3 style={{
                    color: hasImage ? "var(--w)" : "var(--o)",
                    fontSize: 22,
                    fontWeight: 700,
                    fontFamily: "'Cormorant Garamond', serif"
                  }}>
                    {cat.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}