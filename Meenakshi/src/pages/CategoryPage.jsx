import { useState, useEffect } from 'react';
import { ChevronLeft, Package, MessageCircle } from 'lucide-react';
import { PageBar, Loader } from '../components/ui';
import { PROD_LIST as PL } from '../constants/data';
import { WA } from '../constants/config';
import { supabase } from '../supabase'; 
import { Helmet } from 'react-helmet-async';

export default function CategoryPage({ id, go, t }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // மொழி கண்டறிதல் (தமிழ் அல்லது ஆங்கிலம்)
  const isTamil = t?.nav?.home === "முகப்பு";

  const pData = PL.find(x => x.id === id);
  const catName = pData ? pData.name : id?.charAt(0).toUpperCase() + id?.slice(1);

  // மொழிக்கு ஏற்ற வார்த்தைகள்
  const textBack = isTamil ? "முகப்புக்குத் திரும்பு" : "Back to Home";
  const textCollections = isTamil ? "கலெக்‌ஷன்ஸ்" : "Collections";
  const textNoProducts = isTamil ? "இந்தப் பிரிவில் இன்னும் பொருட்கள் சேர்க்கப்படவில்லை." : "No products have been added to this category yet.";
  const textNoImage = isTamil ? "படம் இல்லை" : "No Image Available";
  const textViewDetails = isTamil ? "விவரங்களைக் காண்க" : "View Details";
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
        
        <button className="bw" onClick={() => go("home")} style={{ padding: "8px 16px", marginBottom: 30 }}>
          <ChevronLeft size={16} /> {textBack}
        </button>

        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,5vw,52px)", fontWeight: 800, color: "var(--w)", marginBottom: 40 }}>
          {catName} {textCollections}
        </h1>

        <Helmet>
          <title>Sri Meenakshi Glass And Plywoods Traders</title>
        </Helmet>

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
                
                {products.filter(p => (p.subcategory ? p.subcategory.trim() : defaultSub) === v).map(item => (
                  
                  <div key={item.id} className="g ch" onClick={() => go(`product-${item.id}`)} style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--brd)", cursor: "pointer" }}>
                    
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

                    <div style={{ padding: 20 }}>
                      {/* 🌟 1. Title Capitalize மாற்றம் 🌟 */}
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--w)", marginBottom: 8, textTransform: "capitalize" }}>
                        {item.name}
                      </h3>
                      
                      {/* 🌟 2 & 3. Text Color & Line Clamp மாற்றம் 🌟 */}
                      <p style={{ 
                        color: "#cbd5e1", // பிரகாசமான நிறம்
                        fontSize: 13.5, 
                        lineHeight: 1.6, 
                        marginBottom: 16,
                        display: "-webkit-box",
                        WebkitLineClamp: 3, // 3 வரிகளுக்கு மேல் கட் செய்யப்படும்
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}>
                        {item.description}
                      </p>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        {item.price && <div style={{ fontSize: 16, fontWeight: 800, color: "var(--o)" }}>{item.price}</div>}
                        {item.size && <div style={{ fontSize: 12, color: "var(--sl)", padding: "2px 8px", background: "rgba(255,255,255,0.05)", borderRadius: 4 }}>{item.size}</div>}
                      </div>
                      
                      <div style={{ display: "flex", gap: 10 }}>
                        <div className="bo" style={{ flex: 1, padding: "10px", fontSize: 13, borderRadius: 8, textAlign: "center", fontWeight: 600 }}>
                          {textViewDetails}
                        </div>
                        
                        <a href={WA} target="_blank" rel="noopener noreferrer" className="bw" onClick={(e) => e.stopPropagation()} style={{ padding: "10px", borderRadius: 8, color: "#22c55e", borderColor: "rgba(34,197,94,.3)", display: "flex", alignItems: "center" }}>
                          <MessageCircle size={16} />
                        </a>
                      </div>
                    </div>
                  </div>

                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}