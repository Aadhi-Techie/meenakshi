import { useState, useEffect } from 'react';
import { ChevronLeft, Package, MessageCircle, Share2, Info } from 'lucide-react';
import { PageBar, Loader } from '../components/ui';
import { PROD_LIST as PL } from '../constants/data';
import { supabase } from '../supabase'; 

export default function CategoryPage({ id, go, t }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check language (Tamil or English)
  const isTamil = t?.nav?.home === "முகப்பு";

  const pData = PL.find(x => x.id === id);
  const catName = pData ? pData.name : id?.charAt(0).toUpperCase() + id?.slice(1);

  // Internationalization text setup
  const textBack = isTamil ? "முகப்புக்குத் திரும்பு" : "Back to Home";
  const textCollections = isTamil ? "கலெக்‌ஷன்ஸ்" : "Collections";
  const textNoProducts = isTamil ? "இந்தப் பிரிவில் இன்னும் பொருட்கள் சேர்க்கப்படவில்லை." : "No products have been added to this category yet.";
  const textNoImage = isTamil ? "படம் இல்லை" : "No Image Available";
  const textViewDetails = isTamil ? "விவரங்கள்" : "Details";
  const textGetPrice = isTamil ? "விலை கேட்க" : "Get Price";
  const defaultSub = isTamil ? "பொதுவானவை" : "General";

  useEffect(() => {
    async function fetchCategoryProducts() {
      try {
        setLoading(true);
        
        const cleanSearchTerm = catName.trim();

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .ilike('category', `%${cleanSearchTerm}%`); 

        if (error) throw error;

        if (data) {
          const finalProducts = data.filter(item => 
            item.category && item.category.trim().toLowerCase() === cleanSearchTerm.toLowerCase()
          );
          
          setProducts(finalProducts.length > 0 ? finalProducts : data);
        }
      } catch (err) {
        console.error("Error fetching category products:", err.message);
      } finally {
        setLoading(false);
      }
    }

    if (catName) {
      fetchCategoryProducts();
    }
  }, [catName]);

  const varieties = [...new Set(products.map(p => p.subcategory ? p.subcategory.trim() : defaultSub))];

  if (loading) return <Loader done={() => {}} />;

  return (
    <div style={{ paddingTop: 72, background: "var(--bg)", minHeight: "100vh" }}>
      <PageBar />
      <div className="wrap" style={{ padding: "60px 24px" }}>
        
        {/* Navigation Button */}
        <button className="bw" onClick={() => go("home")} style={{ padding: "8px 16px", marginBottom: 30 }}>
          <ChevronLeft size={16} /> {textBack}
        </button>

        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,5vw,52px)", fontWeight: 800, color: "var(--w)", marginBottom: 40 }}>
          {catName} {textCollections}
        </h1>

        {varieties.length === 0 ? (
          <div className="g" style={{ textAlign: "center", padding: "80px 20px", color: "var(--sl3)", fontSize: 16, borderRadius: 16, border: "1px dashed var(--brd)" }}>
            <Package size={40} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
            {textNoProducts}
          </div>
        ) : (
          varieties.map(v => (
            <div key={v} style={{ marginBottom: 60, animation: "fadeUp .6s ease" }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--o)", borderBottom: "1px solid var(--brd)", paddingBottom: 12, marginBottom: 24 }}>{v}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 24 }}>
                
                {products.filter(p => (p.subcategory ? p.subcategory.trim() : defaultSub) === v).map(item => {
                  
                  // 🌟 1. தற்போதைய வெப்சைட்டின் பேஸ் URL-ஐ எடுக்கிறோம்
                  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
                  // 🌟 2. இந்த குறிப்பிட்ட ப்ராடக்ட்டுக்கான நேரடி லிங்க்கை உருவாக்குகிறோம்
                  const itemUrl = `${baseUrl}/product-${item.id}`;
                  
                  // 🌟 3. வாட்ஸ்அப்பில் ஓனருக்குப் போக வேண்டிய மெசேஜ் ஃபார்மட் (விலை கேட்பதற்காக)
                  const rawWaMessage = `Hi Sree Meenakshi Glass & Plywoods,\n\nI am interested in this product. Please share the best price and details.\n\n📦 *Product:* ${item.name}\n📄 *Category:* ${item.category || 'N/A'}\n\n🔗 *Product Link:* \n${itemUrl}`;
                  const waMessage = encodeURIComponent(rawWaMessage);
                  
                  // 🌟 4. மொபைல் மற்றும் பிசி இரண்டிலும் 100% வேலை செய்யும் அதிகாரப்பூர்வ வாட்ஸ்அப் ஏபிஐ லிங்க்
                  const whatsappLink = `https://api.whatsapp.com/send?phone=919790923750&text=${waMessage}`;

                  return (
                    <div key={item.id} className="g ch" onClick={() => go(`product-${item.id}`)} style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--brd)", cursor: "pointer", display: "flex", flexDirection: "column" }}>
                      
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          style={{ width: "100%", height: 240, objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: 240, background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sl3)" }}>
                          {textNoImage}
                        </div>
                      )}

                      <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--w)", marginBottom: 8, textTransform: "capitalize" }}>
                          {item.name}
                        </h3>
                        
                        <p style={{ 
                          color: "#cbd5e1", 
                          fontSize: 13.5, 
                          lineHeight: 1.6, 
                          marginBottom: 20,
                          display: "-webkit-box",
                          WebkitLineClamp: 3, 
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          flex: 1
                        }}>
                          {item.description}
                        </p>
                        
                        {/* 🌟 திருத்தப்பட்ட பட்டன்கள் பகுதி (No Price/Size) 🌟 */}
                        <div style={{ display: "flex", gap: 8 }}>
                          
                          {/* 1. View Details (சிறிய பட்டன்) */}
                          <div className="bo" style={{ flex: 1, padding: "10px", fontSize: 13, borderRadius: 8, textAlign: "center", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                            <Info size={16} /> {textViewDetails}
                          </div>
                          
                          {/* 2. Get Price on WhatsApp (முக்கிய பட்டன்) */}
                          <a 
                            href={whatsappLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="bw" 
                            onClick={(e) => e.stopPropagation()} 
                            style={{ flex: 1, padding: "10px", borderRadius: 8, background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none", fontSize: 13, fontWeight: 600 }}
                          >
                            <MessageCircle size={16} /> {textGetPrice}
                          </a>

                          {/* 3. Share Button */}
                          <button 
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                if (navigator.share) {
                                  await navigator.share({
                                    title: `${item.name} | SreeMeenakshi Glass & Plywoods`,
                                    text: `Check out this premium product from SreeMeenakshi Glass & Plywoods: *${item.name}*\n\n🔗 *Link:* ${itemUrl}`,
                                  });
                                } else {
                                  await navigator.clipboard.writeText(itemUrl);
                                  alert(isTamil ? "லிங்க் காப்பி செய்யப்பட்டது!" : "Link copied to clipboard!");
                                }
                              } catch (error) {
                                console.log("Error sharing:", error);
                              }
                            }}
                            className="bw" 
                            style={{ padding: "10px", borderRadius: 8, color: "var(--w)", border: "1px solid var(--brd)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            title={isTamil ? "பகிரவும்" : "Share"}
                          >
                            <Share2 size={16} />
                          </button>
                          
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}