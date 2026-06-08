import React from 'react';

export default function SecHead({ bdg, h, sub, align = "center" }) {
  return (
    <div className="sh" style={{ textAlign: align }}>
      <span className="bdg">{bdg}</span>
      <h2 style={{ whiteSpace: "pre-line" }}>{h}</h2>
      <div 
        className="sh-ln" 
        style={{ margin: align === "left" ? "0" : "0 auto" }} 
      />
      {sub && (
        <p style={{ 
          marginTop: 16, 
          margin: align === "left" ? "16px 0 0 0" : "16px auto 0" 
        }}>
          {sub}
        </p>
      )}
    </div>
  );
}