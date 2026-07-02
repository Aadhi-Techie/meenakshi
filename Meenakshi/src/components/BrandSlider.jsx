
import './BrandSlider.css';

// 🌟 லோக்கல் ஃபோல்டரில் உள்ள படங்களை இணைப்பது
const BRANDS = [
  { name: "Saint-Gobain", logoUrl: "/assets/logo/saint-gobain.svg" },
  { name: "Greenply", logoUrl: "/assets/logo/greenply.svg" },
  { name: "Qute", logoUrl: "/assets/logo/qute.png" }, 
  { name: "Jindal Aluminium", logoUrl: "/assets/logo/jindal.png" },
  { name: "CenturyPly", logoUrl: "/assets/logo/centuryply.png" },
  { name: "AIS Glass", logoUrl: "/assets/logo/ais.png" },
  { name: "Godrej", logoUrl: "/assets/logo/godrej.png" },
  { name: "Dorma", logoUrl: "/assets/logo/dorma.png" },
  { name: "Hettich", logoUrl: "/assets/logo/hettich.svg" },
];  

const BrandSlider = () => {
  return (
    <div style={{ background: "var(--bg)", padding: "60px 0", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
      <h3 style={{ textAlign: "center", textTransform: "uppercase", letterSpacing: "2px", fontSize: "14px", color: "var(--sl)", fontWeight: 700, marginBottom: "40px" }}>
        Authorized Dealers For
      </h3>
      
      <div className="brand-slider-container" style={{ position: "relative", display: "flex", width: "100%" }}>
        
        {/* லோகோக்கள் மறையும் Effect (Fade Left & Right) */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "80px", background: "linear-gradient(to right, var(--bg), transparent)", zIndex: 2 }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "80px", background: "linear-gradient(to left, var(--bg), transparent)", zIndex: 2 }} />

        <div className="slider-track" style={{ display: "flex", alignItems: "center" }}>
          {/* ஸ்லைடர் தொடர்ச்சியாக ஓட Array-ஐ இரண்டு முறை Loop செய்கிறோம் */}
          {[...BRANDS, ...BRANDS].map((Brand, index) => (
            <div key={index} className="slide-item" 
              style={{ 
                /* 🌟 பக்கா மாடர்ன் வெள்ளை கார்டு டிசைன் (Sleek White Cards) */
                background: "#ffffff", 
                borderRadius: "12px",
                padding: "10px 25px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "75px",
                minWidth: "160px",
                margin: "0 15px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                transition: "transform 0.3s ease",
                cursor: "default"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <img 
                src={Brand.logoUrl} 
                alt={Brand.name} 
                className="brand-logo" 
                style={{ 
                  maxHeight: "45px", 
                  maxWidth: "100%", 
                  objectFit: "contain", 
                  display: Brand.logoUrl ? "block" : "none",
                  filter: "none" // 🌟 எந்த பில்டரும் இல்லை, ஒரிஜினல் கலர் அப்படியே வரும்!
                }}
                onError={(e) => {
                  e.target.style.display = 'none'; 
                  e.target.nextSibling.style.display = 'block'; 
                }}
              />
              {/* படம் வேலை செய்யவில்லை என்றால் மட்டும் இந்த Text தெரியும் */}
              <span style={{ 
                display: Brand.logoUrl ? "none" : "block", 
                color: "#0f172a", // வெள்ளை கார்டில் கருப்பு எழுத்து
                fontWeight: 900, 
                fontSize: "20px", 
                letterSpacing: "1px",
                fontFamily: "'Cormorant Garamond', serif" 
              }}>
                {Brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandSlider;