import { useState } from 'react';
import { supabase } from '../../supabase';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const tData = {
  en: {
    visit_us: "Our Second Showroom",
    new_address: "Our First Showroom",
    call: "Call Sree Meenakshi", email: "Email", hours: "Opening Hours",
    hours_mon_sat: "Mon-Sat: 8:30 AM - 9:00 PM", hours_sun: "Sunday: 10:00 AM - 5:00 PM",
    call_now: "Call Now", whatsapp_us: "WhatsApp Us",
    send_enquiry: "Sree Meenakshi | UPVC, WPC & Plywood Shop in Perambur",
    form_title: "Sree Meenakshi Glass & Plywoods, Perambur",
    form_subtitle: "Contact us for wholesale price list",
    full_name: "Full Name", email_address: "Email Address",
    phone_number: "Phone Number", product_interest: "Product Interest", your_message: "Your Message",
    send_message: "Send Message", sending: "Sending...",
    error_required: "❌ Name, Phone and Message are required!",
    error_phone_invalid: "❌ Please enter a valid 10-digit phone number!",
    error_email_invalid: "❌ Please enter a valid email address!",
    status_sending: "⏳ Sending...", status_success: "✅ Enquiry Sent!",
    error_failed: "❌ Error occurred",
    ph_name: "e.g. Raj Kumar", ph_email: "e.g. raj@gmail.com",
    ph_phone: "e.g. 9876543210", ph_interest: "e.g. Toughened Glass, Plywood",
    ph_message: "Tell us about your requirement..."
  },
  ta: {
    visit_us: "எங்கள் இரண்டாவது ஷோரூம்",
    new_address: "எங்கள் முதல் ஷோரூம்",
    call: "அழைக்க", email: "மின்னஞ்சல்", hours: "வேலை நேரம்",
    hours_mon_sat: "திங்கள்-சனி: காலை 8:30  - இரவு 9:00 மணி", hours_sun: "ஞாயிறு: காலை 10:00 AM - மாலை 5:00 PM   மணி",
    call_now: "அழைக்க", whatsapp_us: "வாட்ஸ்அப்",
    send_enquiry: "ஸ்ரீ மீனாட்சி | பெரம்பூர் கிளாஸ் & பிளைவுட் கடை",
    form_title: "ஸ்ரீ மீனாட்சி கிளாஸ் & பிளைவுட்ஸ், பெரம்பூர்",
    form_subtitle: "மொத்த விலைப் பட்டியலுக்கு தொடர்பு கொள்ளுங்கள்",
    full_name: "முழு பெயர்", email_address: "மின்னஞ்சல்",
    phone_number: "தொலைபேசி எண்", product_interest: "தேவைப்படும் பொருள்", your_message: "உங்கள் கருத்து",
    send_message: "அனுப்பவும்", sending: "அனுப்பப்படுகிறது...",
    error_required: "❌ பெயர், போன் மற்றும் கருத்து தேவை!",
    error_phone_invalid: "❌ சரியான 10-இலக்க எண்!",
    error_email_invalid: "❌ சரியான மின்னஞ்சல்!",
    status_sending: "⏳ அனுப்பப்படுகிறது...", status_success: "✅ அனுப்பப்பட்டது!",
    error_failed: "❌ பிழை ஏற்பட்டது",
    ph_name: "உதா: ராஜ் குமார்", ph_email: "உதா: raj@gmail.com",
    ph_phone: "உதா: 9876543210", ph_interest: "உதா: கிளாஸ், பிளைவுட்",
    ph_message: "உங்கள் தேவையை இங்கே எழுதவும்..."
  }
};

const cardStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 16,
  padding: '20px 24px',
  background: 'var(--bg2)',
  borderRadius: 14,
  border: '1px solid var(--brd)',
};

const iconBadge = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  background: 'rgba(237,108,2,0.18)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  marginTop: 2,
};

const labelStyle = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.12em',
  color: 'var(--sl2)',
  textTransform: 'uppercase',
  margin: 0,
  marginBottom: 6,
};

const mapLabelStyle = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--w)',
  marginBottom: 10,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
};

const fieldLabelStyle = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: 'var(--sl2)',
  textTransform: 'uppercase',
  marginBottom: 6,
  display: 'block',
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  background: 'var(--bg)',
  border: '1px solid var(--brd)',
  borderRadius: 10,
  color: 'var(--w)',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
};

export default function Contact({ currentLang = 'ta' }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', interest: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const adminNumbers = ["919790923750", "919884822999", "919940504234"];

  const t = (key) => tData[currentLang]?.[key] || tData['en']?.[key] || key;

  const set = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) return setStatusMessage(t('error_required'));
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return setStatusMessage(t('error_email_invalid'));

    const cleanPhone = formData.phone.trim().replace(/\s+/g, '');
    if (!/^\d{10}$/.test(cleanPhone)) return setStatusMessage(t('error_phone_invalid'));

    try {
      setLoading(true);
      setStatusMessage(t('status_sending'));

      const { error: dbError } = await supabase.from('enquiries').insert([{ ...formData, phone: cleanPhone, status: 'pending' }]);
      if (dbError) throw dbError;

      const w3Res = await fetch("https://api.web3forms.com/submit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_key: "baec8202-6a45-4d3a-b5a1-57258449c864", ...formData, phone: cleanPhone })
      });
      if (!w3Res.ok) console.warn('Web3Forms failed:', await w3Res.text());

      setStatusMessage(t('status_success'));
      const msg = `New Enquiry: ${formData.name}, Phone: ${cleanPhone}, Interest: ${formData.interest}, Message: ${formData.message}`;
      window.open(`https://wa.me/${adminNumbers[0]}?text=${encodeURIComponent(msg)}`, '_blank');
      setFormData({ name: '', email: '', phone: '', interest: '', message: '' });
      setTimeout(() => setStatusMessage(''), 5000);
    } catch {
      setStatusMessage(t('error_failed'));
      setTimeout(() => setStatusMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Contact Us | Sree Meenakshi Glass & Plywoods – Perambur</title></Helmet>

      <section style={{ padding: '72px 24px', background: 'var(--bg)', transition: 'background 0.3s ease' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* ── TOP ROW: Info Cards (Left) & Form + Shop Image (Right) ── */}
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>

            {/* Left: Info Cards */}
            <div style={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* 1. முதல் ஷோரூம் */}
              <div style={cardStyle}>
                <div style={iconBadge}><MapPin size={20} color="var(--o)" /></div>
                <div>
                  <p style={labelStyle}>{t('new_address')}</p>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--sl)' }}>
                    Tiru Vi Ka Nagar, Perambur,<br />Chennai, Greater Chennai,<br />Tamil Nadu 600011
                  </p>
                </div>
              </div>

              {/* 2. இரண்டாவது ஷோரூம் */}
              <div style={cardStyle}>
                <div style={iconBadge}><MapPin size={20} color="var(--o)" /></div>
                <div>
                  <p style={labelStyle}>{t('visit_us')}</p>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--sl)' }}>
                    No:26/23, Sathiya Narayanan Street, Palavan Salai,<br />Perambur, Chennai – 600011, Tamil Nadu.
                  </p>
                </div>
              </div>

              {/* 3. Phone 1 */}
              <div style={cardStyle}>
                <div style={iconBadge}><Phone size={20} color="var(--o)" /></div>
                <div style={{ width: '100%' }}>
                  <p style={labelStyle}>{t('call')} 1</p>
                  <a href={`tel:${adminNumbers[0]}`} style={{ display: 'block', fontSize: 15, fontWeight: 700, color: 'var(--w)', textDecoration: 'none', marginBottom: 10 }}>+91 {adminNumbers[0].slice(-10)}</a>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <a href={`tel:${adminNumbers[0]}`} style={{ flex: 1, minWidth: 90, padding: '9px 14px', background: 'var(--o)', color: '#fff', borderRadius: 9, textDecoration: 'none', fontSize: 13, fontWeight: 600, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Phone size={14} /> {t('call_now')}</a>
                    <a href={`https://wa.me/${adminNumbers[0]}`} target="_blank" rel="noreferrer" style={{ flex: 1, minWidth: 90, padding: '9px 14px', background: '#25D366', color: '#fff', borderRadius: 9, textDecoration: 'none', fontSize: 13, fontWeight: 600, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><MessageCircle size={14} /> {t('whatsapp_us')}</a>
                  </div>
                </div>
              </div>

              {/* 4. Phone 2 */}
              <div style={cardStyle}>
                <div style={iconBadge}><Phone size={20} color="var(--o)" /></div>
                <div style={{ width: '100%' }}>
                  <p style={labelStyle}>{t('call')} 2</p>
                  <a href={`tel:${adminNumbers[1]}`} style={{ display: 'block', fontSize: 15, fontWeight: 700, color: 'var(--w)', textDecoration: 'none', marginBottom: 10 }}>+91 {adminNumbers[1].slice(-10)}</a>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <a href={`tel:${adminNumbers[1]}`} style={{ flex: 1, minWidth: 90, padding: '9px 14px', background: 'var(--o)', color: '#fff', borderRadius: 9, textDecoration: 'none', fontSize: 13, fontWeight: 600, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Phone size={14} /> {t('call_now')}</a>
                    <a href={`https://wa.me/${adminNumbers[1]}`} target="_blank" rel="noreferrer" style={{ flex: 1, minWidth: 90, padding: '9px 14px', background: '#25D366', color: '#fff', borderRadius: 9, textDecoration: 'none', fontSize: 13, fontWeight: 600, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><MessageCircle size={14} /> {t('whatsapp_us')}</a>
                  </div>
                </div>
              </div>

              {/* 5. Phone 3 */}
              <div style={cardStyle}>
                <div style={iconBadge}><Phone size={20} color="var(--o)" /></div>
                <div style={{ width: '100%' }}>
                  <p style={labelStyle}>{t('call')} 3</p>
                  <a href={`tel:${adminNumbers[2]}`} style={{ display: 'block', fontSize: 15, fontWeight: 700, color: 'var(--w)', textDecoration: 'none', marginBottom: 10 }}>+91 {adminNumbers[2].slice(-10)}</a>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <a href={`tel:${adminNumbers[2]}`} style={{ flex: 1, minWidth: 90, padding: '9px 14px', background: 'var(--o)', color: '#fff', borderRadius: 9, textDecoration: 'none', fontSize: 13, fontWeight: 600, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Phone size={14} /> {t('call_now')}</a>
                    <a href={`https://wa.me/${adminNumbers[2]}`} target="_blank" rel="noreferrer" style={{ flex: 1, minWidth: 90, padding: '9px 14px', background: '#25D366', color: '#fff', borderRadius: 9, textDecoration: 'none', fontSize: 13, fontWeight: 600, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><MessageCircle size={14} /> {t('whatsapp_us')}</a>
                  </div>
                </div>
              </div>

              {/* 6. Email */}
              <div style={cardStyle}>
                <div style={iconBadge}><Mail size={20} color="var(--o)" /></div>
                <div>
                  <p style={labelStyle}>{t('email')}</p>
                  <a href="mailto:srimeenakshiglassandplywoods@gmail.com" style={{ fontSize: 13, color: 'var(--sl)', textDecoration: 'none', wordBreak: 'break-all' }}>srimeenakshiglassandplywoods@gmail.com</a>
                </div>
              </div>

              {/* 7. Hours */}
              <div style={cardStyle}>
                <div style={iconBadge}><Clock size={20} color="var(--o)" /></div>
                <div>
                  <p style={labelStyle}>{t('hours')}</p>
                  <p style={{ margin: '0 0 4px', fontSize: 14, color: 'var(--sl)' }}>{t('hours_mon_sat')}</p>
                  <p style={{ margin: 0, fontSize: 14, color: 'var(--sl)' }}>{t('hours_sun')}</p>
                </div>
              </div>

            </div>

            {/* Right: Form + Shop Image */}
            <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Form */}
              <div style={{ background: 'var(--bg2)', borderRadius: 18, border: '1px solid var(--brd)', padding: '36px 32px' }}>
                <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: 'var(--w)', lineHeight: 1.3 }}>{t('form_title')}</h2>
                <p style={{ margin: '0 0 28px', fontSize: 16, color: 'var(--o)', fontWeight: 600 }}>{t('form_subtitle')}</p>
                <form onSubmit={handleEnquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="contact-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div><label style={fieldLabelStyle}>{t('full_name')} <span style={{ color: 'var(--o)' }}>*</span></label><input name="name" className="inp" placeholder={t('ph_name')} value={formData.name} onChange={set('name')} required style={inputStyle} /></div>
                    <div><label style={fieldLabelStyle}>{t('email_address')}</label><input name="email" className="inp" placeholder={t('ph_email')} value={formData.email} onChange={set('email')} style={inputStyle} /></div>
                  </div>
                  <div className="contact-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div><label style={fieldLabelStyle}>{t('phone_number')} <span style={{ color: 'var(--o)' }}>*</span></label><input name="phone" className="inp" placeholder={t('ph_phone')} value={formData.phone} onChange={set('phone')} required style={inputStyle} /></div>
                    <div><label style={fieldLabelStyle}>{t('product_interest')}</label><input name="interest" className="inp" placeholder={t('ph_interest')} value={formData.interest} onChange={set('interest')} style={inputStyle} /></div>
                  </div>
                  <div><label style={fieldLabelStyle}>{t('your_message')} <span style={{ color: 'var(--o)' }}>*</span></label><textarea name="message" className="inp" placeholder={t('ph_message')} value={formData.message} onChange={set('message')} rows={4} required style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} /></div>
                  <button type="submit" disabled={loading} style={{ padding: '14px 24px', background: loading ? 'rgba(237,108,2,0.5)' : 'var(--o)', color: '#fff', borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'opacity 0.2s' }}>
                    <MessageCircle size={16} />{loading ? t('sending') : t('send_message')}
                  </button>
                </form>
                {statusMessage && <p style={{ marginTop: 16, fontSize: 14, color: statusMessage.startsWith('✅') ? '#4ade80' : statusMessage.startsWith('⏳') ? 'var(--o)' : '#f87171' }}>{statusMessage}</p>}
              </div>

              {/* Shop Image */}
              <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--brd)' }}>
                <img
                  src="/assets/About-Image.webp"
                  alt="Sree Meenakshi Glass and Plywoods Shop Front"
                  style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    if (!e.target.src.includes('about-image.webp')) {
                      e.target.src = "/assets/about-image.webp";
                    } else {
                      e.target.parentElement.style.display = 'none';
                    }
                  }}
                />
              </div>

            </div>
          </div>

          {/* ── BOTTOM ROW: Two Maps Side by Side ── */}
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>

            {/* Map 1 — முதல் ஷோரூம் */}
            <div style={{ flex: '1 1 340px', background: 'var(--bg2)', border: '1px solid var(--brd)', borderRadius: 16, padding: 20 }}>
              <p style={mapLabelStyle}>
                <MapPin size={15} color="var(--o)" />
                {currentLang === 'ta' ? 'எங்கள் முதல் ஷோரூம்' : 'Our First Showroom'}
              </p>
              <iframe
                src="https://maps.google.com/maps?q=Sree+Meenakshi+Glass+and+Plywoods+Tiru+Vi+Ka+Nagar+Perambur&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: 12, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="First Showroom Location"
              ></iframe>
              <a
                href="https://maps.app.goo.gl/78uYFBgwiX9KH27c8"
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, padding: '10px 16px', background: 'rgba(237,108,2,0.15)', border: '1px solid rgba(237,108,2,0.3)', borderRadius: 9, color: 'var(--o)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
              >
                <MapPin size={14} />
                {currentLang === 'ta' ? 'Google Maps-ல் திற' : 'Open in Google Maps'}
              </a>
            </div>

            {/* Map 2 — இரண்டாவது ஷோரூம் */}
            <div style={{ flex: '1 1 340px', background: 'var(--bg2)', border: '1px solid var(--brd)', borderRadius: 16, padding: 20 }}>
              <p style={mapLabelStyle}>
                <MapPin size={15} color="var(--o)" />
                {currentLang === 'ta' ? 'எங்கள் இரண்டாவது ஷோரூம்' : 'Our Second Showroom'}
              </p>
              <iframe
                src="https://maps.google.com/maps?q=Sree+Meenakshi+Glass+and+Plywoods+Sathiya+Narayanan+Street+Perambur&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: 12, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Second Showroom Location"
              ></iframe>
              <a
                href="https://maps.app.goo.gl/DsMgqTztD1HzqeSc8"
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, padding: '10px 16px', background: 'rgba(237,108,2,0.15)', border: '1px solid rgba(237,108,2,0.3)', borderRadius: 9, color: 'var(--o)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
              >
                <MapPin size={14} />
                {currentLang === 'ta' ? 'Google Maps-ல் திற' : 'Open in Google Maps'}
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 640px) {
          .contact-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}