import { useState } from 'react';
import { supabase } from '../../supabase';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const tData = {
  en: {
    visit_us: "Visit Us",
    call: "Call",
    email: "Email",
    hours: "Hours",
    hours_mon_sat: "Mon-Sat: 9 AM - 8 PM",
    hours_sun: "Sunday: 10 AM - 5 PM",
    call_now: "Call Now",
    send_sms: "Send SMS",
    whatsapp_us: "WhatsApp Us",
    send_enquiry: "Sri Meenakshi Glass & Plywoods Traders - Send an Enquiry",
    full_name: "Full Name",
    email_address: "Email Address",
    phone_number: "Phone Number",
    product_interest: "Product Interest",
    your_message: "Your Message",
    send_message: "Send Message",
    sending: "Sending...",
    error_required: "❌ Name, Phone and Message are required!",
    status_sending: "⏳ Sending enquiry...",
    status_success: "✅ Enquiry Sent! Opening WhatsApp...",
    error_failed: "❌ Error",
    find_us: "Find Us on Map",
    
    // Placeholders (English)
    ph_name: "e.g. Raj Kumar",
    ph_email: "e.g. raj@gmail.com",
    ph_phone: "e.g. 9876543210",
    ph_interest: "e.g. Toughened Glass, Plywood",
    ph_message: "Tell us about your requirement..."
  },
  ta: {
    visit_us: "முகவரி",
    call: "அழைக்க",
    email: "மின்னஞ்சல்",
    hours: "வேலை நேரம்",
    hours_mon_sat: "திங்கள்-சனி: காலை 9 - இரவு 8 மணி",
    hours_sun: "ஞாயிறு: காலை 10 - மாலை 5 மணி",
    call_now: "இப்போதே அழைக்க",
    send_sms: "எஸ்.எம்.எஸ் அனுப்ப",
    whatsapp_us: "வாட்ஸ்அப் செய்ய",
    send_enquiry: "ஸ்ரீ மீனாட்சி கிளாஸ் & பிளைவுட்ஸ் டிரேடர்ஸ் - விசாரணை",
    full_name: "முழு பெயர்",
    email_address: "மின்னஞ்சல் முகவரி",
    phone_number: "தொலைபேசி எண்",
    product_interest: "தேவைப்படும் தயாரிப்பு",
    your_message: "உங்கள் கருத்து",
    send_message: "மெசேஜ் அனுப்பவும்",
    sending: "அனுப்பப்படுகிறது...",
    error_required: "❌ பெயர், போன் எண் மற்றும் கருத்து கட்டாயம் தேவை!",
    status_sending: "⏳ விசாரணை அனுப்பப்படுகிறது...",
    status_success: "✅ விசாரணை அனுப்பப்பட்டது! வாட்ஸ்அப் திறக்கப்படுகிறது...",
    error_failed: "❌ பிழை ஏற்பட்டது",
    find_us: "எங்கள் இடம் (Map)",

    // Placeholders (Tamil)
    ph_name: "உதா: ராஜ் குமார்",
    ph_email: "உதா: raj@gmail.com",
    ph_phone: "உதா: 9876543210",
    ph_interest: "உதா: 12mm கிளாஸ், பிளைவுட்",
    ph_message: "உங்கள் தேவையை இங்கே எழுதவும்..."
  }
};

export default function Contact({ currentLang = 'ta' }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', interest: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  const adminWhatsAppNumbers = ["919884822999"]; 
  const [randomAdminWhatsApp] = useState(() => adminWhatsAppNumbers[Math.floor(Math.random() * adminWhatsAppNumbers.length)]);

  const t = (key) => {
    return tData[currentLang]?.[key] || tData['en']?.[key] || key;
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      setStatusMessage(t('error_required'));
      return;
    }
    try {
      setLoading(true);
      setStatusMessage(t('status_sending'));
      const { error: dbError } = await supabase.from('enquiries').insert([{
        name: formData.name.trim(), 
        phone: formData.phone.trim(), 
        message: `Email: ${formData.email} | Interest: ${formData.interest}\n\n${formData.message.trim()}`
      }]);
      if (dbError) throw dbError;
      
      setStatusMessage(t('status_success'));
      const whatsappText = `Hi Sri Meenakshi Glass & Plywoods Traders,\n\nNew Enquiry from Website:\n\n👤 *Name:* ${formData.name}\n📞 *Phone:* ${formData.phone}\n📧 *Email:* ${formData.email || 'N/A'}\n🎯 *Interest:* ${formData.interest || 'N/A'}\n💬 *Message:* ${formData.message}`;
      const whatsappUrl = `https://wa.me/${randomAdminWhatsApp}?text=${encodeURIComponent(whatsappText)}`;
      
      setFormData({ name: '', email: '', phone: '', interest: '', message: '' });
      setTimeout(() => { window.open(whatsappUrl, '_blank'); setStatusMessage(''); }, 1500);
    } catch (err) {
      console.error(err);
      setStatusMessage(`${t('error_failed')}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    padding: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", 
    borderRadius: 16, display: "flex", gap: 16, alignItems: "flex-start", cursor: "default"
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", background: "rgba(0,0,0,0.5)", 
    border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, 
    color: "#ffffff", fontSize: 15, fontWeight: 500, outline: "none", boxSizing: "border-box"
  };

  const labelStyle = {
    fontSize: 13, color: "#cbd5e1", fontWeight: 700, letterSpacing: 1, 
    textTransform: "uppercase", display: "block", marginBottom: 8 
  };

  return (
    <section id="contact" className="contact-section" style={{ background: "var(--bg)", position: "relative", overflow: "hidden", padding: "80px 0" }}>
      
      {/* CSS for Bright Placeholder Text */}
      <style>{`
        .custom-input::placeholder {
          color: #9ca3af;
          opacity: 1;
        }
        .custom-input:focus {
          border-color: var(--o) !important;
          background: rgba(0,0,0,0.7) !important;
        }
      `}</style>

      <div style={{ position: "absolute", top: "20%", left: "-10%", width: 400, height: 400, background: "var(--o)", filter: "blur(200px)", opacity: 0.08, borderRadius: "50%", pointerEvents: "none" }} />
      
      <div className="contact-wrap" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", gap: "40px", flexWrap: "wrap" }}>
        
        {/* Left Column - Info Cards */}
        <div className="contact-info-col" style={{ flex: "1 1 350px", display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <Helmet>
            
            <meta name="description" content="Visit Sri Meenakshi Glass And Plywoods Traders in Perambur, Chennai. Get directions, contact number, and WhatsApp details for wholesale glass, plywood, and UPVC inquiries." />
          </Helmet>

          <div style={cardStyle}>
            <div style={{ padding: 12, background: "rgba(255,115,0,0.1)", borderRadius: 12, color: "var(--o)" }}><MapPin size={20} /></div>
            <div>
              <h4 style={{ color: "var(--sl3)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{t('visit_us')}</h4>
              <p style={{ color: "var(--w)", fontSize: 14, lineHeight: 1.6 }}>No:26/23, Sathiya Narayanan Street, Palavan Salai,<br />Perambur, Chennai - 600011</p>
            </div>
          </div>

          <div style={{...cardStyle, alignItems: "center"}}>
            <div style={{ padding: 12, background: "rgba(255,115,0,0.1)", borderRadius: 12, color: "var(--o)" }}><Phone size={20} /></div>
            <div>
              <h4 style={{ color: "var(--sl3)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{t('call')}</h4>
              <p style={{ color: "var(--w)", fontSize: 15, fontWeight: 600 }}>+91 9940504234,  +91 9884822999</p>
            </div>
          </div>

          <div style={{...cardStyle, alignItems: "center"}}>
            <div style={{ padding: 12, background: "rgba(255,115,0,0.1)", borderRadius: 12, color: "var(--o)" }}><Mail size={20} /></div>
            <div>
              <h4 style={{ color: "var(--sl3)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{t('email')}</h4>
              <p style={{ color: "var(--w)", fontSize: 15, fontWeight: 600, wordBreak: "break-all" }}>srimeenakshiglassandplywoods@gmail.com</p>
            </div>
          </div>

          <div style={{...cardStyle, alignItems: "center"}}>
            <div style={{ padding: 12, background: "rgba(255,115,0,0.1)", borderRadius: 12, color: "var(--o)" }}><Clock size={20} /></div>
            <div>
              <h4 style={{ color: "var(--sl3)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{t('hours')}</h4>
              <p style={{ color: "var(--w)", fontSize: 14, lineHeight: 1.6 }}>{t('hours_mon_sat')}<br/>{t('hours_sun')}</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: "8px" }}>
            <div className="action-btns-row" style={{ display: "flex", gap: "10px" }}>
              <a href={`tel:+${randomAdminWhatsApp}`} style={{ flex: 1, padding: "14px", background: "var(--o)", borderRadius: 12, color: "#fff", textDecoration: "none", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, fontWeight: 700 }}>
                <Phone size={18} /> {t('call_now')}
              </a>
              <a href={`sms:+${randomAdminWhatsApp}`} style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, color: "#fff", textDecoration: "none", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, fontWeight: 700 }}>
                <MessageCircle size={18} /> {t('send_sms')}
              </a>
            </div>
            <a href={`https://wa.me/${randomAdminWhatsApp}`} target="_blank" rel="noopener noreferrer" style={{ width: "100%", padding: "14px", background: "linear-gradient(to right, #10b981, #059669)", borderRadius: 12, color: "#fff", textDecoration: "none", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, fontWeight: 700 }}>
              <MessageCircle size={18} /> {t('whatsapp_us')}
            </a>
          </div>

          {/* 🌟 உங்கள் கடையின் ஒரிஜினல் இமேஜ் 🌟 */}
          <div style={{ 
            flex: 1, 
            marginTop: "16px", 
            borderRadius: "16px", 
            overflow: "hidden", 
            border: "1px solid rgba(255,255,255,0.05)", 
            position: "relative", 
            minHeight: "180px", 
            background: `url(/assets/About-Image.png) center/cover no-repeat` 
          }}>
             <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)", padding: "30px 20px 20px" }}>
                <h4 style={{ color: "#fff", margin: 0, fontSize: 18, fontFamily: "'Cormorant Garamond', serif" }}>
                  {currentLang === 'ta' ? "ஸ்ரீ மீனாட்சி கிளாஸ் & பிளைவுட்ஸ்" : "Sree Meenakshi Glass & Plywoods"}
                </h4>
                <p style={{ color: "var(--sl3)", fontSize: 13, margin: "5px 0 0 0" }}>
                  {currentLang === 'ta' ? "2007 முதல் உங்கள் நம்பிக்கைக்குரிய நிறுவனம்." : "Quality you can trust, since 2007."}
                </p>
             </div>
          </div>

        </div>

        {/* Right Column - Form & Map */}
        <div className="contact-form-col" style={{ flex: "1 1 500px", display: "flex", flexDirection: "column", gap: "40px" }}>
          
          {/* Contact Form */}
          <div style={{ background: "rgba(255,255,255,0.02)", padding: "32px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <h3 style={{ fontSize: 24, fontWeight: 700, color: "var(--w)", fontFamily: "'Cormorant Garamond', serif", marginBottom: 32 }}>
              {t('send_enquiry')}
            </h3>

            <form onSubmit={handleEnquirySubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div className="input-row" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <div className="input-group" style={{ flex: "1 1 200px" }}>
                  <label style={labelStyle}>{t('full_name')} <span style={{color: '#ef4444'}}>*</span></label>
                  <input type="text" name="name" className="custom-input" placeholder={t('ph_name')} value={formData.name} onChange={handleChange} required style={inputStyle} />
                </div>
                <div className="input-group" style={{ flex: "1 1 200px" }}>
                  <label style={labelStyle}>{t('email_address')}</label>
                  <input type="email" name="email" className="custom-input" placeholder={t('ph_email')} value={formData.email} onChange={handleChange} style={inputStyle} />
                </div>
              </div>

              <div className="input-row" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <div className="input-group" style={{ flex: "1 1 200px" }}>
                  <label style={labelStyle}>{t('phone_number')} <span style={{color: '#ef4444'}}>*</span></label>
                  <input type="tel" name="phone" className="custom-input" placeholder={t('ph_phone')} value={formData.phone} onChange={handleChange} required style={inputStyle} />
                </div>
                <div className="input-group" style={{ flex: "1 1 200px" }}>
                  <label style={labelStyle}>{t('product_interest')}</label>
                  <input type="text" name="interest" className="custom-input" placeholder={t('ph_interest')} value={formData.interest} onChange={handleChange} style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>{t('your_message')} <span style={{color: '#ef4444'}}>*</span></label>
                <textarea name="message" className="custom-input" placeholder={t('ph_message')} value={formData.message} onChange={handleChange} rows="4" required style={{...inputStyle, resize: "none"}}></textarea>
              </div>

              {statusMessage && (
                <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 14, color: statusMessage.includes('❌') ? '#ef4444' : 'var(--o)' }}>
                  {statusMessage}
                </div>
              )}

              <button type="submit" disabled={loading} className="bo" style={{ padding: 16, fontSize: 16, borderRadius: 12, fontWeight: 700, display: "flex", justifyContent: "center", alignItems: "center", gap: 10, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, border: "none", color: "#fff", background: "var(--o)" }}>
                <Send size={18} /> {loading ? t('sending') : t('send_message')}
              </button>
            </form>
          </div>

          {/* 🌟 Google Maps Embed 🌟 */}
          <div style={{ width: "100%", height: "350px", borderRadius: "24px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6051.081892017348!2d80.22710297770998!3d13.121689200000018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ab93a27e75%3A0x3d0ff2ecdb2bf1c1!2sSree%20Meenakshi%20Glasses%20and%20Plywoods!5e1!3m2!1sen!2sin!4v1780918986429!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Sri Meenakshi Glass And Plywoods Traders Location"
            ></iframe>
          </div>

        </div>
      </div>
    </section>
  );
}