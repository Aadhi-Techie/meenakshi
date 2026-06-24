import { MessageCircle, ShieldCheck, CreditCard, Banknote, MapPin, Award, Phone } from 'lucide-react';
import { PROD_LIST as PL } from '../../constants/data';
import { WA } from '../../constants/config';

// --- Styles ---
const branchButtonStyle = {
  display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid var(--brd)", color: "var(--w)", padding: "10px 14px", borderRadius: 8,
  fontSize: 13, textDecoration: "none", fontWeight: 600, cursor: "pointer", transition: "background 0.2s"
};

// 🌟 5. CSS Conflict Fixed 🌟
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
      console.log("WhatsApp click event sent to Google Analytics");
    }
  };

  return (
    <footer role="contentinfo" aria-label="Site Footer" style={{ background: "var(--bg)", borderTop: "1px solid var(--brd)", paddingTop: 80, paddingBottom: 30 }}>
      <div className="wrap" style={{ padding: "0 24px" }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))", gap: 40, marginBottom: 52 }}>
          
          {/* 1. Brand & Social Media Section */}
          <div style={{ gridColumn: "span auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div aria-hidden="true" style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg,var(--o),var(--o2))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontWeight: 800, fontSize: 20, color: "#fff" }}>SM</div>
              <div>
                {/* 🌟 1. h2 changed to p for SEO hierarchy 🌟 */}
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 16, color: "var(--w)", margin: 0 }}>Sri Meenakshi</p>
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

            {/* 🌟 4. Social Media Hidden Temporarily 🌟 */}
            {/* <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
              <a href="#" target="_blank" rel="noopener noreferrer" style={{ ...baseIconStyle, background: "#1877F2" }} aria-label="Facebook"><FbIcon /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" style={{ ...baseIconStyle, background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" }} aria-label="Instagram"><InstaIcon /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" style={{ ...baseIconStyle, background: "#FF0000" }} aria-label="YouTube"><YtIcon /></a>
            </div> */}
          </div>

          {/* 2. Quick Links (SEO Optimized) */}
          <nav aria-label="Footer Navigation">
            <h3 style={headingStyle}>{t.footer?.q || "Quick Links"}</h3>
            {["home", "about", "services", "gallery", "contact"].map(k => (
              <a key={k} href={`/${k === 'home' ? '' : k}`} onClick={(e) => { e.preventDefault(); go(k); }} style={{ color: "var(--sl3)", fontSize: 13.5, marginBottom: 12, textTransform: "capitalize", cursor: "pointer", transition: "color .2s", display: "block", textDecoration: "none" }} onMouseEnter={e => e.currentTarget.style.color="var(--o)"} onMouseLeave={e => e.currentTarget.style.color="var(--sl3)"}>
                {t.nav[k]}
              </a>
            ))}
          </nav>

          {/* 3. Products (SEO Optimized) */}
          <nav aria-label="Footer Products">
            <h3 style={headingStyle}>{t.footer?.p || "Products"}</h3>
            {PL.map(p => (
              <a key={p.id} href={`/category-${p.id}`} onClick={(e) => { e.preventDefault(); go(`category-${p.id}`); }} style={{ color: "var(--sl3)", fontSize: 13.5, marginBottom: 12, cursor: "pointer", transition: "color .2s", display: "block", textDecoration: "none" }} onMouseEnter={e => e.currentTarget.style.color="var(--o)"} onMouseLeave={e => e.currentTarget.style.color="var(--sl3)"}>
                {isTamil && p.tn ? p.tn : p.name}
              </a>
            ))}
          </nav>

          {/* 4. Contact Details & Address */}
          <address style={{ fontStyle: "normal" }}>
            <h3 style={headingStyle}>{t.footer?.h || "Contact & Hours"}</h3>
            <div style={{ color: "var(--sl3)", fontSize: 13.5, marginBottom: 16, lineHeight: 1.6 }}>
              No:26/23, Sathiya Narayanan St,<br />Palavan Salai, Perambur,<br />Chennai – 600011
            </div>
            
            <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Phone size={14} color="var(--sl3)" />
              <a href="tel:+919790923750" style={{ color: "var(--w)", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>+91 9790923750</a>
            </div>

            <div style={{ color: "var(--sl3)", fontSize: 13.5, marginBottom: 4 }}>{t.footer?.wk || "Mon - Sat: 9:00 AM - 8:00 PM"}</div>
            <div style={{ color: "var(--sl3)", fontSize: 13.5, marginBottom: 16 }}>{t.footer?.su || "Sunday: 9:00 AM - 2:00 PM"}</div>
            
            <a href={WA} target="_blank" rel="noopener noreferrer" onClick={handleWhatsAppClick} style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--w)", fontWeight: 700, fontSize: 13.5, textDecoration: "none" }}>
              <MessageCircle size={15} color="#25d366" /> {t.wa || "Chat on WhatsApp"}
            </a>
          </address>

          {/* 5. Locations */}
          <div>
            <h3 style={headingStyle}>{isTamil ? "எங்கள் கிளைகள்" : "Our Branches"}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              <a href="https://maps.app.goo.gl/78uYFBgwiX9KH27c8" target="_blank" rel="noopener noreferrer" style={branchButtonStyle} onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"} onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
                <MapPin size={16}/> {isTamil ? "ஸ்ரீ மீனாட்சி கிளாஸ் & பிளைவுட்" : "Sri Meenakshi Glass & Plywood"}
              </a>
              <a href="https://maps.app.goo.gl/DsMgqTztD1HzqeSc8" target="_blank" rel="noopener noreferrer" style={branchButtonStyle} onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"} onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
                <MapPin size={16}/> {isTamil ? "ஸ்ரீ ஆதிதனலட்சுமி கிளாஸ் & பிளைவுட்ஸ்" : "Sree Adhidhanalakshi Glass & Plywoods"}
              </a>
            </div>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, color: "var(--sl)" }}>{isTamil ? "பணம் செலுத்தும் முறைகள்" : "Payment Modes"}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", background: "rgba(255,255,255,0.03)", borderRadius: 4, fontSize: 11, color: "var(--sl3)", border: "1px solid var(--brd)" }}><CreditCard size={12} color="#3b82f6" /> Visa/Master</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", background: "rgba(255,255,255,0.03)", borderRadius: 4, fontSize: 11, color: "var(--sl3)", border: "1px solid var(--brd)" }}><Banknote size={12} color="#10b981" /> Cash</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--brd)", paddingTop: 24, paddingBottom: 24, textAlign: "center" }}>
           <p style={{ color: "var(--sl3)", fontSize: 12, lineHeight: 1.6, maxWidth: 950, margin: "0 auto" }}>
             {isTamil ? (
               <><strong>ஸ்ரீ மீனாட்சி கிளாஸ் அண்ட் ப்ளைவுட்ஸ்  (Sree Meenakshi Glass and Plywoods)</strong> உயர்தர கட்டுமானப் பொருட்களின் முன்னணி மொத்த விற்பனையாளர் ஆவர். நாங்கள் பெரம்பூரில் உள்ள <strong>சிறந்த பிளைவுட் கடை (Best Plywood Shop in Perambur)</strong> மற்றும் <strong>சென்னையில் தரமான கண்ணாடிகள் (Toughened Glass dealers in Chennai)</strong> வழங்குவதில் முன்னணியில் உள்ளோம். சென்னை, பெரம்பூர், திருவள்ளூர், காஞ்சிபுரம், செங்கல்பட்டு, ஸ்ரீபெரும்புதூர் மற்றும் செங்குன்றம் (Redhills) ஆகிய பகுதிகள் முழுவதும் உள்ள வாடிக்கையாளர்களுக்கு சிறந்த சேவையை வழங்கி வருகிறோம்.</>
             ) : (
               <><strong>Sree Meenakshi Glass and Plywoods</strong> is the leading wholesale supplier and dealer of high-quality building materials. We are recognized as the <strong>Best Plywood Shop in Perambur</strong> and top-rated <strong>Toughened Glass dealers in Chennai</strong>. We proudly serve customers across Chennai, Perambur, Thiruvallur, Kanchipuram, Chengalpattu, Sriperumbudur, and Redhills with trust and quality for over two decades.</>
             )}
           </p>
        </div>

        <div style={{ borderTop: "1px solid var(--brd)", paddingTop: 24, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
          <div style={{ color: "var(--sl3)", fontSize: 13 }}>
            {t.footer?.copy ? t.footer.copy.replace('2025', currentYear) : `© ${currentYear} Sree Meenakshi Glass and Plywoods. All Rights Reserved.`}
            {/* 🌟 3. Admin Icon changed to Button 🌟 */}
            <button onClick={() => go("admin")} style={{ cursor: 'pointer', opacity: 0.1, marginLeft: 8, background: "none", border: "none" }} aria-label="Admin Login">🔒</button>
          </div>
          <div style={{ display: "flex", gap: 20, fontSize: 13, color: "var(--sl3)" }}>
            {/* 🌟 2. Privacy & Terms changed to Real Links 🌟 */}
            <a href="/privacy" onClick={(e) => { e.preventDefault(); go("privacy"); }} style={{ color: "var(--sl3)", textDecoration: "none", cursor: "pointer", transition: "color .2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--o)"} onMouseLeave={e => e.currentTarget.style.color = "var(--sl3)"}>{isTamil ? "தனியுரிமை கொள்கை" : "Privacy Policy"}</a>
            <a href="/terms" onClick={(e) => { e.preventDefault(); go("terms"); }} style={{ color: "var(--sl3)", textDecoration: "none", cursor: "pointer", transition: "color .2s" }} onMouseEnter={e => e.currentTarget.style.color = "var(--o)"} onMouseLeave={e => e.currentTarget.style.color = "var(--sl3)"}>{isTamil ? "சேவை விதிமுறைகள்" : "Terms of Service"}</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

// Icons (Hidden for now, but kept in code for future use)
// const FbIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
// const InstaIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
// const YtIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>;