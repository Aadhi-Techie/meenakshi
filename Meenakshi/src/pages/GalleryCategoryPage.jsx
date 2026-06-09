import { useState, useEffect } from 'react';
import { ChevronLeft, Maximize2, X, Image as ImageIcon } from 'lucide-react';
import { PageBar, Loader } from '../components/ui';
import { supabase } from '../supabase';
import { Helmet } from 'react-helmet-async';
export default function GalleryCategoryPage({ id, go, t }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [lb, setLb] = useState(null); // Lightbox State

  const isTamil = t.nav?.home === "முகப்பு";

  useEffect(() => {
    async function fetchGalleryImages() {
      try {
        setLoading(true);
        // Supabase-ல் இருந்து படமுள்ள அனைத்துப் பொருட்களையும் எடுக்கிறோம்
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .not('image_url', 'is', null)
          .order('id', { ascending: false }); // புதிய படங்கள் முதலில் வர

        if (error) throw error;

        if (data) {
          setImages(data);
          
          // Home page-ல் இருந்து குறிப்பிட்ட Category-ஐ கிளிக் செய்து வந்தால்...
          if (id && id !== "all") {
            // ID-யை Title Case-ஆக மாற்றி Filter-ல் செட் செய்கிறோம் (e.g. "glass" -> "Glass")
            const formattedId = id.charAt(0).toUpperCase() + id.slice(1);
            setActiveFilter(formattedId);
          }
        }
      } catch (err) {
        console.error("Error fetching gallery images:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGalleryImages();
  }, [id]);

  if (loading) return <Loader done={() => {}} />;

  // 🌟 Auto-Generate Filter Tabs based on Database Categories 🌟
 const uniqueCategories = Array.from(
    new Set(images.map(img => img.category?.trim().toLowerCase()))
  ).filter(Boolean);
  
  // 2. முதல் எழுத்தை மட்டும் Capital ஆக மாற்றுகிறோம் (UI-ல் அழகாகத் தெரிய)
  const dbCategories = uniqueCategories.map(cat => 
    cat.charAt(0).toUpperCase() + cat.slice(1)
  );

  const CATEGORIES = ["All", ...dbCategories];
  // 🌟 Client-side Filtering 🌟
  const filteredImages = activeFilter === "All" 
    ? images 
    : images.filter(img => img.category?.toLowerCase() === activeFilter.toLowerCase());

  return (
    <div style={{ paddingTop: 72, background: "var(--bg)", minHeight: "100vh", color: "var(--w)" }}>
      <PageBar />
      
      <div className="wrap" style={{ padding: "60px 24px", animation: "fadeUp .6s ease" }}>
        
        <button className="bw" onClick={() => go("home")} style={{ padding: "8px 16px", marginBottom: 30, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <ChevronLeft size={16} /> {isTamil ? "முகப்புக்குத் திரும்பு" : "Back to Home"}
        </button>

        {/* Header Section */}
        <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(249,115,22,0.1)", color: "var(--o)", borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
            <ImageIcon size={16} /> {isTamil ? "எங்கள் வேலைகள்" : "Our Portfolio"}
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, marginBottom: 16, lineHeight: 1.1 }}>
            {isTamil ? "சமீபத்திய ப்ராஜெக்ட்கள்" : "Recent Completed Projects"}
          </h1>
          <p style={{ color: "var(--sl3)", fontSize: 15, lineHeight: 1.6 }}>
            {isTamil 
              ? "நாங்கள் செய்து முடித்த பிரீமியம் கண்ணாடி, UPVC மற்றும் இன்டீரியர் வேலைகளின் புகைப்படத் தொகுப்பு."
              : "Browse through our collection of recently completed premium glass, UPVC, and interior projects."}
          </p>
        </div>

        {/* 🌟 Dynamic Filter Tabs 🌟 */}
        {CATEGORIES.length > 1 && (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 40 }}>
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 30,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  background: activeFilter === cat || activeFilter.toLowerCase() === cat.toLowerCase() ? "var(--o)" : "transparent",
                  color: activeFilter === cat || activeFilter.toLowerCase() === cat.toLowerCase() ? "#fff" : "var(--sl)",
                  border: activeFilter === cat || activeFilter.toLowerCase() === cat.toLowerCase() ? "1px solid var(--o)" : "1px solid var(--brd)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
         
        {/* 🌟 Dynamic SEO Tags 🌟 */}
        <Helmet>
          <title>
            {activeFilter === "All" 
              ? "Our Projects & Gallery | Sri Meenakshi Glass And Plywoods Traders" 
              : `${activeFilter} Projects & Gallery | Sri Meenakshi Glass And Plywoods Traders`}
          </title>
          <meta name="description" content={`View our premium collection of ${activeFilter === "All" ? "toughened glass, UPVC profiles, plywoods, and modular kitchen hardware" : activeFilter}. See the exceptional quality of Sri Meenakshi Traders.`} />
        </Helmet>
        {/* 🌟 Image Grid from Supabase 🌟 */}
        {filteredImages.length === 0 ? (
           <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--sl3)", background: "var(--bg2)", borderRadius: 16, border: "1px dashed var(--brd)" }}>
             <ImageIcon size={48} style={{ margin: "0 auto 16px", opacity: 0.2 }} />
             <p>{isTamil ? "இந்தப் பிரிவில் இன்னும் படங்கள் பதிவேற்றப்படவில்லை." : "No projects found in this category yet."}</p>
           </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {filteredImages.map((img) => (
              <div 
                key={img.id} 
                onClick={() => setLb(img)}
                style={{ 
                  position: "relative", 
                  borderRadius: 16, 
                  overflow: "hidden", 
                  cursor: "pointer",
                  aspectRatio: "4/3",
                  background: "var(--bg2)",
                  border: "1px solid var(--brd)",
                  animation: "scaleIn .4s ease both"
                }}
              >
                <img 
                  src={img.image_url} 
                  alt={img.name} 
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} 
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
                
                {/* Overlay with Real Data */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 20, pointerEvents: "none" }}>
                  <span style={{ color: "var(--o)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
                    {img.subcategory ? `${img.category} • ${img.subcategory}` : img.category}
                  </span>
                  <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: 0, textTransform: "capitalize" }}>{img.name}</h3>
                </div>
                
                {/* Hover Zoom Icon */}
                <div style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", opacity: 0.8 }}>
                  <Maximize2 size={16} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🌟 Premium Cinematic Lightbox 🌟 */}
      {lb && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(10px)" }}>
          <button 
            onClick={() => setLb(null)}
            style={{ position: "absolute", top: 30, right: 30, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.8)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >
            <X size={24} />
          </button>
          
          <div style={{ maxWidth: 1000, width: "100%", animation: "scaleIn .3s ease" }}>
            <img src={lb.image_url} alt={lb.name} style={{ width: "100%", maxHeight: "80vh", objectFit: "contain", borderRadius: 12 }} />
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <span style={{ color: "var(--o)", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{lb.category}</span>
              <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 600, marginTop: 8, textTransform: "capitalize" }}>{lb.name}</h2>
              {lb.description && <p style={{ color: "var(--sl)", fontSize: 14, marginTop: 8, maxWidth: 600, margin: "8px auto 0" }}>{lb.description}</p>}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}