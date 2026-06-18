import { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle, MessageCircle, Info } from 'lucide-react';
import { Helmet } from 'react-helmet-async'; 
import { PageBar, Loader } from '../components/ui';
import { supabase } from '../supabase';

export default function ProductDetailsPage({ id, go, t }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if the current language is Tamil
  const isTamil = t.nav?.home === "முகப்பு";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) setProduct(data);
      } catch (err) {
        console.error("Error fetching product details:", err.message);
        // Fallback demo data if product is not found or backend fails
        setProduct({
          id: id,
          name: "Premium Sample Product (Demo)",
          category: "Glass",
          subcategory: "Toughened Glass",
          price: "1,250",
          description: "This is a demo product because the backend currently has no data.",
          image_url: "https://images.unsplash.com/photo-1618220179428-22790b46a0eb?auto=format&fit=crop&w=800&q=80"
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) return <Loader done={() => {}} />;
  if (!product) return <div style={{ paddingTop: 120, paddingBottom: 100, textAlign: "center", color: "var(--w)", fontSize: 20 }}>Product not found!</div>;

  // Define product specifications for the details table
  const specs = [
    { label: isTamil ? "பிரிவு" : "Category", value: product.category || "General" },
    { label: isTamil ? "உட்பிரிவு" : "Sub Category", value: product.subcategory || "Standard" }
  ];
  
  if (product.product_type) {
    specs.push({ label: isTamil ? "வகை" : "Type / Variety", value: product.product_type });
  }
  if (product.brand) {
    specs.push({ label: isTamil ? "பிராண்டு" : "Brand", value: product.brand });
  }

  // Default specifications applied to all products
  specs.push({ label: isTamil ? "பயன்பாடு" : "Usage/Application", value: isTamil ? "வணிகம் மற்றும் குடியிருப்பு" : "Commercial & Residential" });
  specs.push({ label: isTamil ? "தரக் குறியீடு" : "Quality Standard", value: isTamil ? "ISI சான்றளிக்கப்பட்ட தரம்" : "ISI Certified Premium Grade" });

  if (product.size) {
    specs.push({ label: isTamil ? "அளவு" : "Size/Dimensions", value: product.size });
  }
  if (product.thickness) {
    specs.push({ label: isTamil ? "தடிமன்" : "Thickness", value: product.thickness });
  }

  // Get the current page URL to share it via WhatsApp
  const productUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  // Format the WhatsApp text message with product details
  const rawWaMessage = `Hi Sri Meenakshi Glass & Plywoods,\n\nI am interested in this product. Please share more details and pricing.\n\n📦 *Product:* ${product.name}\n📄 *Category:* ${product.category || 'N/A'}\n\n🔗 *Product Link:* \n${productUrl}`;
  const waMessage = encodeURIComponent(rawWaMessage);
  
  // Generate the final WhatsApp link with the updated admin phone number
  const whatsappLink = `https://api.whatsapp.com/send?phone=919790923750&text=${waMessage}`;

  return (
    <div style={{ paddingTop: 72, background: "var(--bg)", minHeight: "100vh" }}>
      
      {/* Dynamic SEO Meta Tags Start */}
      <Helmet>
        <title>{product.name} | Sri Meenakshi Glass And Plywoods Traders</title>
        <meta name="description" content={`Buy high-quality ${product.name} at Sri Meenakshi Glass And Plywoods Traders. ${product.description}`} />
        <meta property="og:title" content={`${product.name} - Sri Meenakshi Glass And Plywoods Traders`} />
        <meta property="og:image" content={product.image_url} />
      </Helmet>
      {/* Dynamic SEO Meta Tags End */}

      <PageBar />
      <div className="wrap" style={{ padding: "60px 24px" }}>
        
        {/* Back Navigation Button */}
        <button className="bw" onClick={() => go(`category-${product.category?.toLowerCase()}`)} style={{ padding: "8px 16px", marginBottom: 30 }}>
          <ChevronLeft size={16} /> {isTamil ? "பொருட்களுக்குத் திரும்பு" : "Back to Products"}
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: 50, alignItems: "start" }}>
          
          {/* Left Column: Product Image Gallery */}
          <div style={{ animation: "slideR .6s ease both" }}>
            <div className="g" style={{ borderRadius: 20, overflow: "hidden", border: "1px solid var(--brd)", padding: 20, background: "var(--bg2)", position: "relative" }}>
              <div className="flt" style={{ position: "absolute", top: 30, right: 30, background: "rgba(249,115,22,.15)", color: "var(--o)", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, border: "1px solid rgba(249,115,22,.3)", zIndex: 2 }}>
                {isTamil ? "பிரீமியம் தரம்" : "Premium Quality"}
              </div>
              
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{ width: "100%", height: "auto", maxHeight: 500, objectFit: "cover", borderRadius: 12, transition: "transform .5s ease" }}
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

          {/* Right Column: Product Details & Action Buttons */}
          <div style={{ animation: "fadeUp .8s ease both" }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, color: "var(--w)", marginBottom: 12, lineHeight: 1.1, textTransform: "capitalize" }}>
              {product.name}
            </h1>
            
            {product.price && (
              <div style={{ fontSize: 26, fontWeight: 800, color: "var(--o)", marginBottom: 20, display: "flex", alignItems: "baseline", gap: 6 }}>
                {product.price}
              </div>
            )}

            <p style={{ color: "var(--sl)", fontSize: 15.5, lineHeight: 1.7, marginBottom: 30, paddingBottom: 24, borderBottom: "1px solid var(--brd)", textTransform: "capitalize" }}>
              {product.description}
            </p>

            {/* Product Specifications Table */}
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

            {/* Call to Action (CTA) Buttons */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bo" style={{ padding: "16px 32px", fontSize: 16, borderRadius: 12, flex: 1, display: "flex", justifyContent: "center", gap: 10, textDecoration: "none" }}>
                 <CheckCircle size={20} /> {isTamil ? "ஆம்! எனக்கு விருப்பம்" : "Yes! I am Interested"}
              </a>
              
              {/* WhatsApp Enquiry Button */}
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bw" 
                 style={{ padding: "16px 32px", fontSize: 16, borderRadius: 12, flex: 1, display: "flex", justifyContent: "center", gap: 10, color: "#25d366", borderColor: "rgba(37,211,102,.3)", textDecoration: "none" }}>
                <MessageCircle size={20} /> {isTamil ? "விலை கேட்க" : "Ask for Price"}
              </a>
            </div>
            
            {/* Disclaimer Text */}
            <div style={{ marginTop: 16, fontSize: 12, color: "var(--sl3)", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
               <CheckCircle size={14} color="var(--gr)" /> {isTamil ? "குறைந்தபட்ச ஆர்டர் அளவு பொருந்தும். மொத்த விலைக்குத் தொடர்பு கொள்ளவும்." : "Minimum Order Value might apply. Contact for bulk pricing."}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}