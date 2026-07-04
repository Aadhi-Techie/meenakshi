import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { ArrowRight } from 'lucide-react';

export default function GalleryPreview({ go, t }) {
  const [catImages, setCatImages] = useState({});
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
            const catDb = item.category.toLowerCase();
            if (catDb.includes('glass') && !imageMap['glass']) imageMap['glass'] = item.image_url;
            else if (catDb.includes('plywood') && !imageMap['plywoods']) imageMap['plywoods'] = item.image_url;
            else if (catDb.includes('aluminium') && !imageMap['aluminium']) imageMap['aluminium'] = item.image_url;
            else if (catDb.includes('upvc') && !imageMap['upvc']) imageMap['upvc'] = item.image_url;
            else if (catDb.includes('wpc') && !imageMap['wpc']) imageMap['wpc'] = item.image_url;
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

  const categories = [
    { id: 'glass',     name: isTamil ? 'கண்ணாடி ஷோரூம்'       : 'Glass Showroom',       fallbackImg: '/assets/categories/glass.webp'     },
    { id: 'plywoods',  name: isTamil ? 'பிளைவுட் ஸ்டாக்'       : 'Plywood Stock',        fallbackImg: '/assets/categories/plywood.webp'   },
    { id: 'aluminium', name: isTamil ? 'அலுமினியம் வேலைகள்'    : 'Aluminium Works',      fallbackImg: '/assets/categories/aluminium.webp' },
    { id: 'upvc',      name: isTamil ? 'UPVC விண்டோ சிஸ்டம்ஸ்' : 'UPVC Window Systems',  fallbackImg: '/assets/categories/UPVC.webp'      },
    { id: 'wpc',       name: isTamil ? 'WPC ஷோரூம்'            : 'WPC Showroom',         fallbackImg: '/assets/categories/wpc_tv.webp'   },
  ];

  return (
    <section aria-labelledby="gallery-preview-heading" style={{ padding: "80px 24px", background: "var(--bg)", overflow: "hidden" }}>
      <div className="wrap">

        {/* Section Header */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, gap: 20 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(255,115,0,0.1)", border: "1px solid rgba(255,115,0,0.2)", borderRadius: 100, color: "var(--o)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
              {t.glBdg || (isTamil ? "தொகுப்பு" : "Gallery")}
            </div>
            <h2 id="gallery-preview-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 42px)", fontWeight: 800, color: "var(--w)", marginBottom: 10, whiteSpace: "pre-line" }}>
              {t.glH || (isTamil ? "திட்ட தொகுப்பு" : "Project Gallery")}
            </h2>
            <p style={{ color: "var(--sl3)", fontSize: 16, maxWidth: 600 }}>
              {t.glP || (isTamil ? "சென்னை முழுவதும் நாங்கள் சமீபத்தில் முடித்த ப்ராஜெக்ட்களை இங்கே காணுங்கள்." : "Explore our recent installations and material supply projects across Chennai.")}
            </p>
          </div>
          <button className="bw" aria-label={t.viewAll || "View All Gallery"} onClick={() => go('gallery')} style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: 8, borderRadius: 12 }}>
            {t.viewAll || (isTamil ? "அனைத்தும் காண்க" : "View All")} <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Cards */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24 }}>
          {categories.map((cat) => {
            // ✅ FIX: Supabase photo இருந்தா அது, இல்லன்னா fallbackImg (webp icon)
            const displayImg = catImages[cat.id] || cat.fallbackImg;
            const isRealPhoto = !!catImages[cat.id];

            return (
              <div
                key={cat.id}
                role="button"
                tabIndex={0}
                aria-label={`Explore ${cat.name}`}
                onClick={() => go(`category-${cat.id}`)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(`category-${cat.id}`); } }}
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
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(255,115,0,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* ✅ FIX: எப்பவும் image காட்டு — real photo or webp icon */}
                <img
                  src={displayImg}
                  alt={`${cat.name} - Sree Meenakshi Glass and Plywoods Chennai`}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: isRealPhoto ? "cover" : "contain",
                    position: "absolute",
                    inset: 0,
                    padding: isRealPhoto ? "0" : "40px",
                    background: isRealPhoto ? "transparent" : "rgba(255,255,255,0.03)",
                  }}
                />

                {/* Gradient Overlay */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  padding: 24,
                  textAlign: "center",
                  zIndex: 1,
                }}>
                  <h3 style={{ color: "var(--w)", fontSize: 22, fontWeight: 700, fontFamily: "'Cormorant Garamond', serif", margin: 0 }}>
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