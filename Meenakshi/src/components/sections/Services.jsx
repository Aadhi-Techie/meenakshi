import { useState } from 'react';
import { ArrowRight, MessageCircle, X, Image as ImageIcon, Video } from 'lucide-react';
import { WA } from '../../constants/config';
import { supabase } from '../../supabase'; // 👈 சுபாபேஸ் கனெக்ஷன்

export default function Services({ t }) {
  const isTamil = t.nav?.home === "முகப்பு";

  // பாப்-அப் ஸ்டேட்ஸ் (States)
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [galleryItems, setGalleryItems] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  // சர்வீஸ் லிஸ்ட்
  const servicesList = [
    { id: 'glass', name: isTamil ? "பிரீமியம் கண்ணாடி" : "Premium Glass Supply", desc: isTamil ? "பெரம்பூரில் தரமான கண்ணாடி வேலைகள்." : "High-quality toughened glass solutions in Perambur.", img: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&q=80&w=400&h=400" },
    { id: 'ply', name: isTamil ? "மொத்த விலை பிளைவுட்" : "Wholesale Plywoods", desc: isTamil ? "நீடித்த உழைக்கும் பிளைவுட் ரகங்கள்." : "Durable and premium plywoods for interior projects.", img: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=400&h=400" },
    { id: 'upv', name: isTamil ? "UPVC விண்டோ சிஸ்டம்ஸ்" : "UPVC Window Systems", desc: isTamil ? "சிறந்த ஆற்றல் சேமிப்பு கொண்ட UPVC." : "Energy-efficient UPVC windows in Chennai & Perambur.", img: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=400&h=400" },
    { id: 'wpv', name: isTamil ? "WPVC கதவுகள்" : "WPVC Doors & Panels", desc: isTamil ? "நீர்ப்புகா மற்றும் நவீன WPVC கதவுகள்." : "Waterproof and modern WPVC doors and panels.", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400&h=400" },
    { id: 'alu', name: isTamil ? "அலுமினியம் தீர்வுகள்" : "Aluminium Solutions", desc: isTamil ? "அலுமினியம் செக்ஷன் வேலைகள்." : "Custom aluminium sections for commercial spaces.", img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400&h=400" },
    { id: 'hdw', name: isTamil ? "ஹார்டுவேர் பொருட்கள்" : "Hardwares & Fittings", desc: isTamil ? "சிறந்த தரமான இன்டீரியர் ஹார்டுவேர்." : "Premium interior hardware and fittings supplier.", img: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=400&h=400" }
  ];

  // கார்டை கிளிக் செய்யும்போது சுபாபேஸில் இருந்து மீடியாக்களை எடுக்கும் ஃபங்ஷன்
  const handleCardClick = async (id, catName) => {
    setSelectedCategory(catName);
    setModalOpen(true);
    setLoadingMedia(true);
    setGalleryItems([]);

    try {
      const { data, error } = await supabase
        .from('project_gallery')
        .select('*')
        .eq('category_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGalleryItems(data || []);
    } catch (err) {
      console.error("Error fetching media:", err);
    } finally {
      setLoadingMedia(false);
    }
  };

  return (
    <section id="services" aria-labelledby="services-heading" style={{ padding: "80px 24px", background: "var(--bg)", position: "relative" }}>
      
      {/* ── 🌟 INJECTING 3D ANIMATION CSS VIA STYLE TAG ── */}
      <style>{`
        /* Service Cards 3D Hover Effect */
        .service-card-3d {
          transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease, border-color 0.3s ease !important;
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        .service-card-3d:hover {
          transform: translateY(-10px) rotateX(6deg) rotateY(4deg) scale(1.02) !important;
          box-shadow: 0 20px 40px rgba(56, 189, 248, 0.12), 0 0 30px rgba(249, 115, 22, 0.08) !important;
          border-color: rgba(56, 189, 248, 0.35) !important;
        }
        .service-card-3d-child {
          transform: translateZ(25px);
        }

        /* Pop-up Window 3D Entrance Animation */
        @keyframes modalEntrance3D {
          0% {
            opacity: 0;
            transform: scale(0.7) perspective(1200px) rotateX(-25deg) translateZ(-400px);
          }
          100% {
            opacity: 1;
            transform: scale(1) perspective(1200px) rotateX(0deg) translateZ(0);
          }
        }
        .modal-content-3d {
          animation: modalEntrance3D 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transform-style: preserve-3d;
        }

        /* Pop-up Media Cards 3D Effect */
        .media-item-3d {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease !important;
        }
        .media-item-3d:hover {
          transform: scale(1.05) translateY(-5px) !important;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6) !important;
          z-index: 10;
        }
      `}</style>

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
              {isTamil ? "பெரம்பூர் மற்றும் சென்னையைச் சுற்றியுள்ள பகுதிகளில் பிரீமியம் கண்ணாடி, பிளைவுட், UPVC விண்டோஸ் மற்றும் WPVC கதவுகளுக்கான முன்னணி மொத்த விற்பனையாளர்." : "Leading wholesale and retail suppliers of premium Glass, Plywoods, UPVC Windows, and WPVC Doors in Perambur, Chennai."}
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 8 }}>
            <a href={WA} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Us" style={{ padding: "14px 28px", fontSize: 15, background: "rgba(255,255,255,0.03)", border: "1px solid var(--brd)", borderRadius: 12, color: "var(--w)", display: "flex", alignItems: "center", gap: 8, textDecoration: "none", fontWeight: 600 }}>
              <MessageCircle size={18} color="#25d366" /> {isTamil ? "WhatsApp" : "Chat on WhatsApp"}
            </a>
          </div>
        </div>

        {/* சர்வீஸ் கார்டுகள் கிரிட் ➡️ 🌟 3D Classes Add Seyyappattullathu */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, width: "100%" }}>
          {servicesList.map(p => (
            <div 
              key={p.id} 
              role="button" 
              tabIndex={0} 
              onClick={() => handleCardClick(p.id, p.name)} 
              className="service-card-3d"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--brd)", padding: 28, borderRadius: 20, display: "flex", flexDirection: "column", gap: 20, cursor: "pointer" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }} className="service-card-3d-child">
                <div style={{ width: 60, height: 60, borderRadius: "50%", overflow: "hidden", border: "2px solid var(--o)" }}>
                  <img src={p.img} alt={`${p.name} in Perambur`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: 6, background: "rgba(255,255,255,0.03)", borderRadius: 8, color: "var(--sl3)" }}><ArrowRight size={14} /></div>
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 700, color: "var(--w)", fontFamily: "'Cormorant Garamond', serif" }} className="service-card-3d-child">{p.name}</h3>
              <p style={{ fontSize: 13.5, color: "var(--sl3)", lineHeight: 1.6, marginTop: -8 }} className="service-card-3d-child">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 🌟 SITE WORK INSTALLATION MODAL (POP-UP) ── */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          
          {/* Modal Container ➡️ 🌟 3D entrance class inbaikkappattullathu */}
          <div className="modal-content-3d" style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, width: '100%', maxWidth: 850, maxHeight: '85vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.7)' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#fff', margin: 0, fontSize: 20, fontWeight: 700, fontFamily: "'Cormorant Garamond', serif" }}>
                {selectedCategory} - {t.nav?.gallery || "Gallery"}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={24} /></button>
            </div>

            {/* Modal Body (Media Grid) */}
            <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
              {loadingMedia ? (
                <p style={{ color: 'var(--o)', textAlign: 'center', margin: '40px 0', fontSize: 16 }}>⏳ {isTamil ? "லோடு ஆகிறது..." : "Loading live works..."}</p>
              ) : galleryItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.4)' }}>
                  <p style={{ margin: 0, fontSize: 16 }}>{isTamil ? "தற்போது படங்கள் எதுவும் இல்லை." : "No installation updates uploaded yet for this category."}</p>
                  <p style={{ fontSize: 13, color: 'var(--o)', marginTop: 8 }}>{isTamil ? "விரைவில் எங்களது நேரடி வேலைகளின் போட்டோக்கள் இணைக்கப்படும்!" : "Real project updates from Perambur sites coming soon!"}</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                  {galleryItems.map(item => {
                    // 💡 Supabase column names safe fallback handle
                    const currentUrl  = item.media_url || item.url;
                    const currentType = item.media_type || item.type;
                    const isVideo     = currentType === 'video' || currentUrl?.toLowerCase().endsWith('.mp4') || currentUrl?.toLowerCase().endsWith('.webm');

                    return (
                      <div key={item.id} className="media-item-3d" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
                        <div style={{ height: 160, width: '100%', background: '#000', position: 'relative' }}>
                          
                          {/* 🌟 Fixed Video / Image Broken logic */}
                          {isVideo ? (
                            <video 
                              src={currentUrl} 
                              controls 
                              preload="metadata"
                              playsInline
                              muted
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          ) : (
                            <img 
                              src={currentUrl} 
                              alt={item.title || "Sree Meenakshi Site Work"} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                              loading="lazy"
                            />
                          )}
                        </div>
                        
                        {item.title && (
                          <div style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                            {isVideo ? <Video size={14} color="var(--o)" /> : <ImageIcon size={14} color="var(--o)" />}
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
} 