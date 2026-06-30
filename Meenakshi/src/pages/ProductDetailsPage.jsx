import { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle, MessageCircle, Info, AlertCircle, Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { PageBar, Loader } from '../components/ui';
import { supabase } from '../supabase';

export default function ProductDetailsPage({ id, go, t }) {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);

  const isTamil = t.nav?.home === "முகப்பு";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) throw error;
        if (data) setProduct(data);
      } catch (err) {
        console.error("Error fetching product details:", err.message);
        setProduct({
          id, name: "Premium Sample Product (Demo)", category: "Glass",
          subcategory: "Toughened Glass", price: "1,250",
          description: "This is a demo product.",
          image_url: "https://images.unsplash.com/photo-1618220179428-22790b46a0eb?auto=format&fit=crop&w=800&q=80",
          in_stock: true
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  // ✅ Fetch Related Products (same category, excluding current product)
  useEffect(() => {
    const fetchRelated = async () => {
      if (!product?.category) return;
      try {
        setRelatedLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', product.category)
          .neq('id', product.id)
          .limit(20);

        if (error) throw error;

        if (data && data.length > 0) {
          const sameSub = data.filter(p => p.subcategory === product.subcategory);
          const otherSub = data.filter(p => p.subcategory !== product.subcategory);
          const combined = [...sameSub, ...otherSub].slice(0, 4);
          setRelatedProducts(combined);
        } else {
          setRelatedProducts([]);
        }
      } catch (err) {
        console.error("Error fetching related products:", err.message);
        setRelatedProducts([]);
      } finally {
        setRelatedLoading(false);
      }
    };
    fetchRelated();
  }, [product]);

  if (loading) return <Loader done={() => {}} />;
  if (!product) return <div style={{ paddingTop: 120, textAlign: "center", color: "var(--w)", fontSize: 20 }}>Product not found!</div>;

  const inStock = product.in_stock !== false;

  const specs = [
    { label: isTamil ? "பிரிவு" : "Category", value: product.category || "General" },
    { label: isTamil ? "உட்பிரிவு" : "Sub Category", value: product.subcategory || "Standard" }
  ];
  if (product.product_type) specs.push({ label: isTamil ? "வகை" : "Type / Variety", value: product.product_type });
  if (product.brand) specs.push({ label: isTamil ? "பிராண்டு" : "Brand", value: product.brand });
  specs.push({ label: isTamil ? "பயன்பாடு" : "Usage/Application", value: isTamil ? "வணிகம் மற்றும் குடியிருப்பு" : "Commercial & Residential" });
  specs.push({ label: isTamil ? "தரக் குறியீடு" : "Quality Standard", value: isTamil ? "ISI சான்றளிக்கப்பட்ட தரம்" : "ISI Certified Premium Grade" });
  if (product.size) specs.push({ label: isTamil ? "அளவு" : "Size/Dimensions", value: product.size });
  if (product.thickness) specs.push({ label: isTamil ? "தடிமன்" : "Thickness", value: product.thickness });

  const productUrl = typeof window !== 'undefined' ? window.location.href : '';
  const rawWaMessage = `Hi SreeMeenakshi Glass & Plywoods,\n\nI am interested in this product. Please share more details and pricing.\n\n📦 *Product:* ${product.name}\n📄 *Category:* ${product.category || 'N/A'}\n\n🔗 *Product Link:* \n${productUrl}`;
  const waMessage = encodeURIComponent(rawWaMessage);
  const whatsappLink = `https://api.whatsapp.com/send?phone=919790923750&text=${waMessage}`;

  return (
    <div style={{ paddingTop: 72, background: "var(--bg)", minHeight: "100vh" }}>
      <Helmet>
        <meta name="description" content={`Buy high-quality ${product.name} at Sree Meenakshi Glass and Plywoods. ${product.description}`} />
        <meta property="og:title" content={`${product.name} - Sree Meenakshi Glass and Plywoods`} />
        <meta property="og:image" content={product.image_url} />
      </Helmet>

      <PageBar />
      <div className="wrap" style={{ padding: "60px 24px" }}>
        <button className="bw" onClick={() => go(`category-${product.category?.toLowerCase()}`)} style={{ padding: "8px 16px", marginBottom: 30 }}>
          <ChevronLeft size={16} /> {isTamil ? "பொருட்களுக்குத் திரும்பு" : "Back to Products"}
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: 50, alignItems: "start" }}>

          {/* Left: Image */}
          <div style={{ animation: "slideR .6s ease both" }}>
            <div className="g" style={{ borderRadius: 20, overflow: "hidden", border: "1px solid var(--brd)", padding: 20, background: "var(--bg2)", position: "relative" }}>

              <div style={{
                position: "absolute", top: 28, left: 28, zIndex: 3,
                background: inStock ? "rgba(34,197,94,0.92)" : "rgba(239,68,68,0.92)",
                color: "#fff", fontSize: 12, fontWeight: 700,
                padding: "6px 14px", borderRadius: 20,
                backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", gap: 6,
                boxShadow: "0 2px 12px rgba(0,0,0,0.3)"
              }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", animation: inStock ? "pulse 2s infinite" : "none" }} />
                {inStock
                  ? (isTamil ? "கையிருப்பில் உள்ளது" : "In Stock")
                  : (isTamil ? "தற்போது இல்லை" : "Out of Stock")}
              </div>

              <div className="flt" style={{ position: "absolute", top: 28, right: 28, background: "rgba(249,115,22,.15)", color: "var(--o)", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, border: "1px solid rgba(249,115,22,.3)", zIndex: 2 }}>
                {isTamil ? "பிரீமியம் தரம்" : "Premium Quality"}
              </div>

              {product.image_url ? (
                <img src={product.image_url} alt={product.name}
                  style={{ width: "100%", height: "auto", maxHeight: 500, objectFit: "cover", borderRadius: 12, transition: "transform .5s ease", opacity: inStock ? 1 : 0.7 }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
              ) : (
                <div style={{ width: "100%", height: 300, background: "#1a1a1a", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>
                  {isTamil ? "படம் இல்லை" : "No Image Available"}
                </div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div style={{ animation: "fadeUp .8s ease both" }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, color: "var(--w)", marginBottom: 12, lineHeight: 1.1, textTransform: "capitalize" }}>
              {product.name}
            </h1>

            {!inStock && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, marginBottom: 16 }}>
                <AlertCircle size={18} color="#ef4444" />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#ef4444" }}>{isTamil ? "தற்போது கையிருப்பில் இல்லை" : "Currently Out of Stock"}</div>
                  <div style={{ fontSize: 12, color: "var(--sl3)" }}>{isTamil ? "விரைவில் வரும். இப்போதே enquiry பண்ணுங்கள்!" : "Coming soon. Enquire now to be notified!"}</div>
                </div>
              </div>
            )}

            {product.price && inStock && (
              <div style={{ fontSize: 26, fontWeight: 800, color: "var(--o)", marginBottom: 20, display: "flex", alignItems: "baseline", gap: 6 }}>
                {product.price}
              </div>
            )}

            <p style={{ color: "var(--sl)", fontSize: 15.5, lineHeight: 1.7, marginBottom: 30, paddingBottom: 24, borderBottom: "1px solid var(--brd)", textTransform: "capitalize" }}>
              {product.description}
            </p>

            <div style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 18, fontWeight: 700, color: "var(--w)", marginBottom: 16 }}>
                <Info size={18} color="var(--o)" /> {isTamil ? "பொருளின் விவரங்கள்" : "Product Specifications"}
              </div>
              <div style={{ border: "1px solid var(--brd)", borderRadius: 12, overflow: "hidden" }}>
                {specs.map((s, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", padding: "14px 20px", background: i % 2 === 0 ? "var(--bg2)" : "transparent", borderBottom: i !== specs.length - 1 ? "1px solid var(--brd)" : "none" }}>
                    <div style={{ color: "var(--sl3)", fontSize: 14, fontWeight: 600 }}>{s.label}</div>
                    <div style={{ color: "var(--w)", fontSize: 14, fontWeight: 500, textTransform: "capitalize" }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {inStock ? (
                <>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bo"
                    style={{ padding: "16px 32px", fontSize: 16, borderRadius: 12, flex: 1, display: "flex", justifyContent: "center", gap: 10, textDecoration: "none" }}>
                    <CheckCircle size={20} /> {isTamil ? "ஆம்! எனக்கு விருப்பம்" : "Yes! I am Interested"}
                  </a>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bw"
                    style={{ padding: "16px 32px", fontSize: 16, borderRadius: 12, flex: 1, display: "flex", justifyContent: "center", gap: 10, color: "#25d366", borderColor: "rgba(37,211,102,.3)", textDecoration: "none" }}>
                    <MessageCircle size={20} /> {isTamil ? "விலை கேட்க" : "Ask for Price"}
                  </a>
                </>
              ) : (
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bw"
                  style={{ padding: "16px 32px", fontSize: 16, borderRadius: 12, flex: 1, display: "flex", justifyContent: "center", gap: 10, color: "#f59e0b", borderColor: "rgba(245,158,11,.3)", textDecoration: "none" }}>
                  <MessageCircle size={20} /> {isTamil ? "வரும்போது தெரிவிக்கவும்" : "Notify When Available"}
                </a>
              )}
            </div>

            <div style={{ marginTop: 16, fontSize: 12, color: "var(--sl3)", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <CheckCircle size={14} color="var(--gr)" />
              {isTamil ? "குறைந்தபட்ச ஆர்டர் அளவு பொருந்தும். மொத்த விலைக்குத் தொடர்பு கொள்ளவும்." : "Minimum Order Value might apply. Contact for bulk pricing."}
            </div>
          </div>
        </div>

        {/* ✅ Related Products Section */}
        {(relatedLoading || relatedProducts.length > 0) && (
          <div style={{ marginTop: 80, animation: "fadeUp .6s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
              <Sparkles size={20} color="var(--o)" />
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(24px,3vw,32px)", fontWeight: 800, color: "var(--w)" }}>
                {isTamil ? "இதையும் பாருங்கள்" : "You May Also Like"}
              </h2>
            </div>

            {relatedLoading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="g" style={{ borderRadius: 14, overflow: "hidden", border: "1px solid var(--brd)" }}>
                    <div style={{ width: "100%", height: 160, background: "var(--bg2)", animation: "pulse 1.5s ease infinite" }} />
                    <div style={{ padding: 16 }}>
                      <div style={{ height: 14, background: "var(--bg2)", borderRadius: 4, marginBottom: 8, width: "70%" }} />
                      <div style={{ height: 12, background: "var(--bg2)", borderRadius: 4, width: "40%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
                {relatedProducts.map(rp => {
                  const rpInStock = rp.in_stock !== false;
                  return (
                    <div key={rp.id} className="g ch" onClick={() => go(`product-${rp.id}`)}
                      style={{ borderRadius: 14, overflow: "hidden", border: "1px solid var(--brd)", cursor: "pointer", display: "flex", flexDirection: "column", position: "relative" }}>

                      <div style={{
                        position: "absolute", top: 10, left: 10, zIndex: 3,
                        background: rpInStock ? "rgba(34,197,94,0.9)" : "rgba(239,68,68,0.9)",
                        color: "#fff", fontSize: 10, fontWeight: 700,
                        padding: "3px 8px", borderRadius: 16,
                        display: "flex", alignItems: "center", gap: 4
                      }}>
                        {rpInStock ? (isTamil ? "உள்ளது" : "In Stock") : (isTamil ? "இல்லை" : "Out")}
                      </div>

                      {rp.image_url ? (
                        <img src={rp.image_url} alt={rp.name} style={{ width: "100%", height: 160, objectFit: "cover", opacity: rpInStock ? 1 : 0.6 }} />
                      ) : (
                        <div style={{ width: "100%", height: 160, background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sl3)", fontSize: 12 }}>
                          {isTamil ? "படம் இல்லை" : "No Image"}
                        </div>
                      )}

                      <div style={{ padding: 16 }}>
                        <h3 style={{ fontSize: 14.5, fontWeight: 700, color: "var(--w)", marginBottom: 4, textTransform: "capitalize", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {rp.name}
                        </h3>
                        <div style={{ fontSize: 12, color: "var(--sl3)" }}>{rp.subcategory || rp.category}</div>
                        {rp.price && (
                          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--o)", marginTop: 6 }}>{rp.price}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}  