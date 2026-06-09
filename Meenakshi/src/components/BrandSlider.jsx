import React from 'react';
import './BrandSlider.css';

const brands = [
  { name: "Saint-Gobain", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Saint-Gobain_logo.svg" },
  { name: "Greenply", logo: "https://www.greenply.com/assets/images/logo.png" },
  { name: "CenturyPly", logo: "https://www.centuryply.com/assets/img/logo.png" },
  { name: "Dorma", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Dormakaba_logo.svg" },
  // தேவைக்கேற்ப மேலும் பிராண்டுகளை இங்கு சேர்த்துக்கொள்ளலாம்
];

const BrandSlider = () => {
  return (
    <div style={{ background: "var(--bg)", padding: "60px 0", borderTop: "1px solid var(--brd)", borderBottom: "1px solid var(--brd)" }}>
      <h3 style={{ textAlign: "center", textTransform: "uppercase", letterSpacing: "2px", fontSize: "14px", color: "var(--sl)", fontWeight: 700, marginBottom: "40px" }}>
        Authorized Dealers For
      </h3>
      
      <div className="brand-slider-container">
        <div className="slider-track">
          {[...brands, ...brands].map((brand, index) => (
            <div key={index} className="slide-item" style={{ 
              background: "#fff", 
              borderRadius: "12px", 
              padding: "15px 30px", 
              margin: "0 15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "80px",
              minWidth: "200px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
            }}>
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="brand-logo" 
                style={{ maxHeight: "40px", maxWidth: "100%", objectFit: "contain" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandSlider;