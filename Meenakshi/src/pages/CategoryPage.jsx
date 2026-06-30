import { useState, useEffect } from 'react';
import { ChevronLeft, Package, MessageCircle, Share2, Info } from 'lucide-react';
import { PageBar, Loader } from '../components/ui';
import { PROD_LIST as PL } from '../constants/data';
import { supabase } from '../supabase'; 

export default function CategoryPage({ id, go, t }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isTamil = t?.nav?.home === "முகப்பு";
  const pData = PL.find(x => x.id === id);
  const catName = pData ? pData.name : id?.charAt(0).toUpperCase() + id?.slice(1);

  const textBack = isTamil ? "முகப்புக்குத் திரும்பு" : "Back to Home";
  const textCollections = isTamil ? "கலெக்‌ஷன்ஸ்" : "Collections";
  const textNoProducts = isTamil ? "இந்தப் பிரிவில் இன்னும் பொருட்கள் சேர்க்கப்படவில்லை." : "No products have been added to this category yet.";
  const textNoImage = isTamil ? "படம் இல்லை" : "No Image Available";
  const textViewDetails = isTamil ? "விவரங்கள்" : "Details";
  const textGetPrice = isTamil ? "விலை கேட்க" : "Get Price";
  const defaultSub = isTamil ? "பொதுவானவை" : "General";

  useEffect(() => {
    async function fetchCategoryProducts() {
      if (!catName) return;
      try {
        setLoading(true);
        const targetCategory = catName.trim().toLowerCase();
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        if (data) {
          const finalProducts = data.filter(item =>
            item.category && item.category.trim().toLowerCase() === targetCategory
          );
          setProducts(finalProducts);
        }
      } catch (err) {
        console.error("Error fetching category products:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCategoryProducts();
  }, [catName]);

  const varieties = [...new Set(products.map(p => p.subcategory ? p.subcategory.trim() : defaultSub))];

  if (loading) return <Loader done={() => {}} />;

  // ✅ Track global card index across all varieties for lazy-loading priority
  let cardIndex = 0;

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
                  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
                  const itemUrl = `${baseUrl}/product-${item.id}`;
                  const rawWaMessage = `Hi Sree Meenakshi Glass & Plywoods,\n\nI am interested in this product. Please share the best price and details.\n\n📦 *Product:* ${item.name}\n📄 *Category:* ${item.category || 'N/A'}\n\n🔗 *Product Link:* \n${itemUrl}`;
                  const waMessage = encodeURIComponent(rawWaMessage);
                  const whatsappLink = `https://api.whatsapp.com/send?phone=919790923750&text=${waMessage}`;

                  const inStock = item.in_stock !== false;

                  // ✅ First 4 cards (visible on initial load) load eagerly, rest lazy-load
                  const isAboveFold = cardIndex < 4;
                  cardIndex++;

                  return (
                    <div key={item.id} className="g ch" onClick={() => go(`product-${item.id}`)}
                      style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${inStock ? 'var(--brd)' : 'rgba(239,68,68,0.3)'}`, cursor: "pointer", display: "flex", flexDirection: "column", position: "relative" }}>

                      <div style={{
                        position: "absolute", top: 12, left: 12, zIndex: 3,
                        background: inStock ? "rgba(34,197,94,0.9)" : "rgba(239,68,68,0.9)",
                        color: "#fff", fontSize: 11, fontWeight: 700,
                        padding: "4px 10px", borderRadius: 20,
                        backdropFilter: "blur(4px)",
                        display: "flex", alignItems: "center", gap: 4
                      }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", opacity: 0.8 }} />
                        {inStock
                          ? (isTamil ? "கையிருப்பில் உள்ளது" : "In Stock")
                          : (isTamil ? "தற்போது இல்லை" : "Out of Stock")}
                      </div>

                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          loading={isAboveFold ? "eager" : "lazy"}
                          decoding="async"
                          width="300"
                          height="240"
                          style={{ width: "100%", height: 240, objectFit: "cover", opacity: inStock ? 1 : 0.6 }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: 240, background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sl3)", opacity: inStock ? 1 : 0.6 }}>
                          {textNoImage}
                        </div>
                      )}

                      <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: inStock ? "var(--w)" : "var(--sl3)", marginBottom: 8, textTransform: "capitalize" }}>
                          {item.name}
                        </h3>

                        <p style={{
                          color: "#cbd5e1", fontSize: 13.5, lineHeight: 1.6, marginBottom: 20,
                          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
                          overflow: "hidden", textOverflow: "ellipsis", flex: 1
                        }}>
                          {item.description}
                        </p>

                        <div style={{ display: "flex", gap: 8 }}>
                          <div className="bo" style={{ flex: 1, padding: "10px", fontSize: 13, borderRadius: 8, textAlign: "center", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                            <Info size={16} /> {textViewDetails}
                          </div>

                          {inStock ? (
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bw"
                              onClick={(e) => e.stopPropagation()}
                              style={{ flex: 1, padding: "10px", borderRadius: 8, background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
                              <MessageCircle size={16} /> {textGetPrice}
                            </a>
                          ) : (
                            <div style={{ flex: 1, padding: "10px", borderRadius: 8, background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13, fontWeight: 600 }}>
                              {isTamil ? "தற்போது இல்லை" : "Unavailable"}
                            </div>
                          )}

                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                if (navigator.share) {
                                  await navigator.share({ title: `${item.name} | SreeMeenakshi Glass & Plywoods`, text: `Check out: *${item.name}*\n\n🔗 ${itemUrl}` });
                                } else {
                                  await navigator.clipboard.writeText(itemUrl);
                                  alert(isTamil ? "லிங்க் காப்பி செய்யப்பட்டது!" : "Link copied!");
                                }
                              } catch (error) { console.log("Share error:", error); }
                            }}
                            className="bw"
                            style={{ padding: "10px", borderRadius: 8, color: "var(--w)", border: "1px solid var(--brd)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
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