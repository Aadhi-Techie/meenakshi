import { MessageCircle, ShieldCheck, CreditCard, Banknote, MapPin, Award, Phone } from 'lucide-react';
import { PROD_LIST as PL } from '../../constants/data';
import { WA } from '../../constants/config';

// --- Styles ---
const branchButtonStyle = {
  display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid var(--brd)", color: "var(--w)", padding: "10px 14px", borderRadius: 8,
  fontSize: 13, textDecoration: "none", fontWeight: 600, cursor: "pointer", transition: "background 0.2s"
};

const headingStyle = {
  fontSize: 12, fontWeight: 800, color: "var(--w)", letterSpacing: ".08em", textTransform: "uppercase", margin: 0, marginBottom: 18, paddingBottom: 18
};

export default function Footer({ go, t }) {
  const isTamil = t.nav?.home === "முகப்பு";
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag('event', 'whatsapp_click', {
        'event_category': 'Engagement',
        'event_label': 'WhatsApp Chat Initiated',
        'value': 1
      });
    }
  };

  return (
    <footer role="contentinfo" aria-label="Site Footer" style={{ background: "var(--bg)", borderTop: "1px solid var(--brd)", paddingTop: 80, paddingBottom: 30 }}>
      <div className="wrap" style={{ padding: "0 24px" }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))", gap: 40, marginBottom: 52 }}>
          
          {/* 1. Brand Section */}
          <div style={{ gridColumn: "span auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div aria-hidden="true" style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg,var(--o),var(--o2))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontWeight: 800, fontSize: 20, color: "#fff" }}>SM</div>
              <div>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 16, color: "var(--w)", margin: 0 }}>SreeMeenakshi</p>
                <div style={{ fontSize: 9.5, color: "var(--o3)", letterSpacing: ".13em", fontWeight: 700, textTransform: "uppercase" }}>Glass & Plywoods</div>
              </div>
            </div>
            <p style={{ color: "var(--sl3)", fontSize: 13.5, lineHeight: 1.7, marginBottom: 20 }}>
              {isTamil 
                ? "வணிக மற்றும் வீடுகளுக்கான பிரீமியம் கண்ணாடி, பிளைவுட் மற்றும் அலுமினியப் பொருட்களின் முன்னணி சப்ளையர்." 
                : "Chennai's premier traders of premium glass, plywood, and architectural aluminium."}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "#10b981", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                <ShieldCheck size={14} aria-hidden="true" /> {isTamil ? "தொடக்கம் 2007" : "Est. 2007"}
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.2)", color: "#38bdf8", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                <Award size={14} aria-hidden="true" /> GSTIN: 338UWPMD566N1ZW
              </div>
            </div>
          </div>

          {/* 2. Quick Links */}
          <nav aria-label="Footer Navigation">
            <h3 style={headingStyle}>{t.footer?.q || "Quick Links"}</h3>
            {["home", "about", "services", "gallery", "contact"].map(k => (
              <a key={k} href={`/${k === 'home' ? '' : k}`} onClick={(e) => { e.preventDefault(); go(k); }} style={{ color: "var(--sl3)", fontSize: 13.5, marginBottom: 12, textTransform: "capitalize", cursor: "pointer", transition: "color .2s", display: "block", textDecoration: "none" }} onMouseEnter={e => e.currentTarget.style.color="var(--o)"} onMouseLeave={e => e.currentTarget.style.color="var(--sl3)"}>
                {t.nav[k]}
              </a>
            ))}
          </nav>

          {/* 3. Products */}
          <nav aria-label="Footer Products">
            <h3 style={headingStyle}>{t.footer?.p || "Products"}</h3>
            {PL.map(p => (
              <a key={p.id} href={`/category-${p.id}`} onClick={(e) => { e.preventDefault(); go(`category-${p.id}`); }} style={{ color: "var(--sl3)", fontSize: 13.5, marginBottom: 12, cursor: "pointer", transition: "color .2s", display: "block", textDecoration: "none" }} onMouseEnter={e => e.currentTarget.style.color="var(--o)"} onMouseLeave={e => e.currentTarget.style.color="var(--sl3)"}>
                {isTamil && p.tn ? p.tn : p.name}
              </a>
            ))}
          </nav>

          {/* 4. Contact & Hours — FIXED */}
          <address style={{ fontStyle: "normal" }}>
            <h3 style={headingStyle}>{t.footer?.h || "Contact & Hours"}</h3>

            {/* ✅ முதல் ஷோரூம் — New Address */}
            <div style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--o)", marginBottom: 4 }}>
                {isTamil ? "முதல் ஷோரூம்" : "1st Showroom"}
              </div>
              <div style={{ color: "var(--sl3)", fontSize: 13, lineHeight: 1.6 }}>
                Tiru Vi Ka Nagar, Perambur,<br />Chennai – 600011
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", margin: "10px 0" }} />

            {/* ✅ இரண்டாவது ஷோரூம் — Old Address */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--o)", marginBottom: 4 }}>
                {isTamil ? "இரண்டாவது ஷோரூம்" : "2nd Showroom"}
              </div>
              <div style={{ color: "var(--sl3)", fontSize: 13, lineHeight: 1.6 }}>
                No:26/23, Sathiya Narayanan St,<br />Palavan Salai, Perambur,<br />Chennai – 600011
              </div>
            </div>

            {/* Phone */}
            <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <Phone size={14} color="var(--sl3)" />
              <a href="tel:+919790923750" style={{ color: "var(--w)", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>+91 9790923750</a>
            </div>

            {/* ✅ FIXED Hours — 8:30AM to 9PM */}
            <div style={{ color: "var(--sl3)", fontSize: 13.5, marginBottom: 4 }}>
              {isTamil ? "திங்கள்–சனி: 8:30 AM – 9:00 PM" : "Mon – Sat: 8:30 AM – 9:00 PM"}
            </div>
            <div style={{ color: "var(--sl3)", fontSize: 13.5, marginBottom: 16 }}>
              {isTamil ? "ஞாயிறு: 10:00 AM – 5:00 PM" : "Sunday: 10:00 AM – 5:00 PM"}
            </div>
            
            <a href={WA} target="_blank" rel="noopener noreferrer" onClick={handleWhatsAppClick} style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--w)", fontWeight: 700, fontSize: 13.5, textDecoration: "none" }}>
              <MessageCircle size={15} color="#25d366" /> {t.wa || "Chat on WhatsApp"}
            </a>
          </address>

          {/* 5. Locations */}
          <div>
            <h3 style={headingStyle}>{isTamil ? "எங்கள் கிளைகள்" : "Our Branches"}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              <a href="https://maps.app.goo.gl/78uYFBgwiX9KH27c8" target="_blank" rel="noopener noreferrer" style={branchButtonStyle} onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"} onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
                <MapPin size={16}/> {isTamil ? "ஸ்ரீ மீனாட்சி கிளாஸ் & பிளைவுட்" : "SreeMeenakshi Glass & Plywood"}
              </a>
              <a href="https://maps.app.goo.gl/DsMgqTztD1HzqeSc8" target="_blank" rel="noopener noreferrer" style={branchButtonStyle} onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"} onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
                <MapPin size={16}/> {isTamil ? "ஸ்ரீ ஆதிதனலட்சுமி கிளாஸ் & பிளைவுட்ஸ்" : "Sree Adhidhanalakshi Glass & Plywoods"}
              </a>
            </div>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, color: "var(--sl)" }}>{isTamil ? "பணம் செலுத்தும் முறைகள்" : "Payment Modes"}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", background: "rgba(255,255,255,0.03)", borderRadius: 4, fontSize: 11, color: "var(--sl3)", border: "1px solid var(--brd)" }}><CreditCard size={12} color="#3b82f6" /> Visa/Master</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", background: "rgba(255,255,255,0.03)", borderRadius: 4, fontSize: 11, color: "var(--sl3)", border: "1px solid var(--brd)" }}><Banknote size={12} color="#10b981" /> Cash</span>
            </div>
          </div>
        </div>

        {/* SEO Text */}
        <div style={{ borderTop: "1px solid var(--brd)", paddingTop: 24, paddingBottom: 24, textAlign: "center" }}>
           <p style={{ color: "var(--sl3)", fontSize: 12, lineHeight: 1.6, maxWidth: 950, margin: "0 auto" }}>
             {isTamil ? (
               <><strong>ஸ்ரீ மீனாட்சி கிளாஸ் அண்ட் ப்ளைவுட்ஸ் (Sree Meenakshi Glass and Plywoods)</strong> உயர்தர கட்டுமானப் பொருட்களின் முன்னணி மொத்த விற்பனையாளர் ஆவர். நாங்கள் பெரம்பூரில் உள்ள <strong>சிறந்த பிளைவுட் கடை (Best Plywood Shop in Perambur)</strong> மற்றும் <strong>சென்னையில் தரமான கண்ணாடிகள் (Toughened Glass dealers in Chennai)</strong> வழங்குவதில் முன்னணியில் உள்ளோம். சென்னை, பெரம்பூர், திருவள்ளூர், காஞ்சிபுரம், செங்கல்பட்டு, ஸ்ரீபெரும்புதூர் மற்றும் செங்குன்றம் (Redhills) ஆகிய பகுதிகள் முழுவதும் உள்ள வாடிக்கையாளர்களுக்கு சிறந்த சேவையை வழங்கி வருகிறோம்.</>
             ) : (
               <><strong>Sree Meenakshi Glass and Plywoods</strong> is the leading wholesale supplier and dealer of high-quality building materials. We are recognized as the <strong>Best Plywood Shop in Perambur</strong> and top-rated <strong>Toughened Glass dealers in Chennai</strong>. We proudly serve customers across Chennai, Perambur, Thiruvallur, Kanchipuram, Chengalpattu, Sriperumbudur, and Redhills with trust and quality for over two decades.</>
             )}
           </p>
        </div>

        {/* Copyright */}
        <div style={{ borderTop: "1px solid var(--brd)", paddingTop: 24, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
          <div style={{ color: "var(--sl3)", fontSize: 13 }}>
            {t.footer?.copy ? t.footer.copy.replace('2025', currentYear) : `© ${currentYear} Sree Meenakshi Glass and Plywoods. All Rights Reserved.`}
            <button onClick={() => go("admin")} style={{ cursor: 'pointer', opacity: 0.1, marginLeft: 8, background: "none", border: "none" }} aria-label="Admin Login">🔒</button>
          </div>
          <div style={{ display: "flex", gap: 20, fontSize: 13, color: "var(--sl3)" }}>
            <a href="/privacy" onClick={(e) => { e.preventDefault(); go("privacy"); }} style={{ color: "var(--sl3)", textDecoration: "none", cursor: "pointer", transition: "color .2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--o)"} onMouseLeave={e => e.currentTarget.style.color = "var(--sl3)"}>{isTamil ? "தனியுரிமை கொள்கை" : "Privacy Policy"}</a>
            <a href="/terms" onClick={(e) => { e.preventDefault(); go("terms"); }} style={{ color: "var(--sl3)", textDecoration: "none", cursor: "pointer", transition: "color .2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--o)"} onMouseLeave={e => e.currentTarget.style.color = "var(--sl3)"}>{isTamil ? "சேவை விதிமுறைகள்" : "Terms of Service"}</a>
          </div>
        </div>

      </div>
    </footer>
  );
}