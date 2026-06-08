import React from 'react';
import './BrandSlider.css'; // இதற்கான CSS கீழே உள்ளது

const brands = [
  { name: "Saint-Gobain", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Saint-Gobain_logo.svg" },
  { name: "Greenply", logo: "https://www.greenply.com/assets/images/logo.png" },
  { name: "CenturyPly", logo: "https://www.centuryply.com/assets/img/logo.png" },
  { name: "Dorma", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Dormakaba_logo.svg" },
  // தேவைக்கேற்ப மேலும் பிராண்டுகளை இங்கு சேர்த்துக்கொள்ளலாம்
];

const BrandSlider = () => {
  return (
    <div className="brand-slider-container py-8 bg-gray-50">
      <h3 className="text-center text-2xl font-bold mb-6 text-gray-800">Our Trusted Brands</h3>
      <div className="slider-track-container">
        <div className="slider-track">
          {/* அனிமேஷனுக்காக இரண்டு முறை லோகோக்களை லூப் செய்கிறோம் */}
          {[...brands, ...brands].map((brand, index) => (
            <div key={index} className="slide-item">
              <img src={brand.logo} alt={brand.name} className="brand-logo" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandSlider;