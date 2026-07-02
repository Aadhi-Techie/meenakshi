import { useState, useEffect } from 'react';
import { ChevronLeft, Search, MessageCircle } from 'lucide-react';
import { PageBar, Loader } from '../components/ui';
import { WA } from '../constants/config';
import { supabase } from '../supabase'; // Supabase Connection 

export default function SearchResultsPage({ query, go, t }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // தேடப்படும் வார்த்தையைச் சரிசெய்ய
  const searchQuery = decodeURIComponent(query).toLowerCase();
// 💡 பக்கத்தின் மேல் பகுதியில் 't' வேரியபிளைப் பயன்படுத்தி தமிழ் மொழியைக் கண்டறியும் வரியைச் சேர்த்துக் கொள்ளுங்கள்
const isTamil = t?.nav?.home === "முகப்பு"; 

useEffect(() => {
  const fetchProducts = async () => {
    // 🌟 கண்டிஷனை ஃபங்ஷனின் உள்ளே கொண்டு வந்து பாதுகாப்பான அசிங்க்ரோனஸ் (Asynchronous) லாஜிக்காக மாற்றுகிறோம்
    // இதன் மூலம் 'set-state-in-effect' எர்ரர் 100% வராது!
    if (!searchQuery || searchQuery.trim() === '') {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Supabase-ல் பல காலம்களில் (columns) தேடுவதற்கு 'or' பயன்படுத்துகிறோம்
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,subcategory.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);

      if (error) throw error;

      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error("Error fetching search products:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🌟 ஃபங்ஷனை நேரடியாக இங்கே கால் செய்கிறோம்
  fetchProducts();
}, [searchQuery]);

if (loading) return <Loader done={() => {}} />;

  return (
    <div style={{ paddingTop: 72, background: "var(--bg)", minHeight: "100vh" }}>
      // 💡 SearchResultsPage.jsx-ல் கீழே இருக்கும் ரிட்டர்ன் பகுதிக்குள் இப்படிப் பயன்படுத்துங்கள்:
      <h1 style={{ color: 'var(--w)', fontSize: '24px', fontWeight: 700 }}>
        {isTamil ? `"${query}" க்கான தேடல் முடிவுகள்` : `Search Results for "${query}"`}
        </h1>
      <PageBar />
      <div className="wrap" style={{ padding: "60px 24px" }}>
        
        <button className="bw" onClick={() => go("home")} style={{ padding: "8px 16px", marginBottom: 30 }}>
          <ChevronLeft size={16} /> Back to Home
        </button>

        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, color: "var(--w)", marginBottom: 10 }}>
          Search Results for "{searchQuery}"
        </h1>
        <p style={{ color: "var(--sl)", marginBottom: 40, fontSize: 16 }}>
          Found {products.length} product(s) matching your search.
        </p>

        {products.length === 0 ? (
          <div className="g" style={{ textAlign: "center", padding: "80px 20px", color: "var(--sl3)", fontSize: 16, borderRadius: 16, border: "1px dashed var(--brd)" }}>
            <Search size={40} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
            Sorry, we couldn't find any products matching "{searchQuery}". Try a different keyword!
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 24, animation: "fadeUp .6s ease" }}>
            {products.map(item => (
              
              /* Product Card */
              <div key={item.id} className="g ch" onClick={() => go(`product-${item.id}`)} style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--brd)", cursor: "pointer" }}>
                
                {/* Cloudinary நீக்கப்பட்டு, நேரடியாக Supabase image_url பயன்படுத்தப்பட்டுள்ளது */}
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    style={{ width: "100%", height: 240, objectFit: "cover" }} 
                  />
                ) : (
                  <div style={{ width: "100%", height: 240, background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sl3)" }}>
                    No Image
                  </div>
                )}
                
                <div style={{ padding: 20 }}>
                  <div style={{ fontSize: 11, color: "var(--o)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>{item.category}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--w)", marginBottom: 8 }}>{item.name}</h3>
                  {item.price && <div style={{ fontSize: 16, fontWeight: 800, color: "var(--w)", marginBottom: 16 }}>{item.price}</div>}
                  
                  <div style={{ display: "flex", gap: 10 }}>
                    <div className="bo" style={{ flex: 1, padding: "10px", fontSize: 13, borderRadius: 8, textAlign: "center", fontWeight: 600 }}>
                      View Details
                    </div>
                    <a href={WA} target="_blank" rel="noopener noreferrer" className="bw" onClick={(e) => e.stopPropagation()} style={{ padding: "10px", borderRadius: 8, color: "#22c55e", borderColor: "rgba(34,197,94,.3)", display: "flex", alignItems: "center" }}>
                      <MessageCircle size={16} />
                    </a>
                  </div>
                </div>
              </div>

            ))}
          </div>
        )}
      </div>
    </div>
  );
}