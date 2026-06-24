import { useState } from 'react';
import { supabase } from '../../supabase';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const tData = {
  en: {
    visit_us: "Visit Us", call: "Call", email: "Email", hours: "Hours",
    hours_mon_sat: "Mon-Sat: 8.30 AM - 9 PM", hours_sun: "Sunday: 10 AM - 5 PM",
    call_now: "Call Now", send_sms: "Send SMS", whatsapp_us: "WhatsApp Us",
    send_enquiry: "Send an Enquiry",
    form_title: "SreeMeenakshi Glass & Plywoods Traders",
    form_subtitle: "Send an Enquiry",
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
    visit_us: "முகவரி", call: "அழைக்க", email: "மின்னஞ்சல்", hours: "வேலை நேரம்",
    hours_mon_sat: "திங்கள்-சனி: காலை 8.30 - இரவு 9 மணி", hours_sun: "ஞாயிறு: காலை 10 - மாலை 5 மணி",
    call_now: "அழைக்க", send_sms: "எஸ்.எம்.எஸ்", whatsapp_us: "வாட்ஸ்அப்",
    send_enquiry: "விசாரணை அனுப்புங்கள்",
    form_title: "ஸ்ரீ மீனாக்ஷி கிளாஸ் & பிளைவுட்ஸ் டிரேடர்ஸ்",
    form_subtitle: "விசாரணை அனுப்புங்கள்",
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
  background: 'rgba(255,255,255,0.04)',
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.07)',
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
  color: 'rgba(255,255,255,0.45)',
  textTransform: 'uppercase',
  margin: 0,
  marginBottom: 6,
};

const fieldLabelStyle = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: 'rgba(255,255,255,0.5)',
  textTransform: 'uppercase',
  marginBottom: 6,
  display: 'block',
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  color: '#fff',
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>{t('send_enquiry')} | Sree Meenakshi</title></Helmet>

      <section style={{ padding: '72px 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* ── Left: Info Cards ── */}
          <div style={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Address */}
            <div style={cardStyle}>
              <div style={iconBadge}><MapPin size={20} color="var(--o)" /></div>
              <div>
                <p style={labelStyle}>{t('visit_us')}</p>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)' }}>
                  No:26/23, Sathiya Narayanan Street, Palavan Salai,<br />Perambur, Chennai – 600011
                </p>
              </div>
            </div>

            {/* Phone */}
            <div style={cardStyle}>
              <div style={iconBadge}><Phone size={20} color="var(--o)" /></div>
              <div style={{ width: '100%' }}>
                <p style={labelStyle}>{t('call')}</p>

                {/* Number 1 */}
                <a href={`tel:${adminNumbers[0]}`} style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#fff', textDecoration: 'none', marginBottom: 10 }}>
                  +91 {adminNumbers[0].slice(-10)}
                </a>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <a
                    href={`tel:${adminNumbers[0]}`}
                    style={{ flex: 1, minWidth: 90, padding: '9px 14px', background: 'var(--o)', color: '#fff', borderRadius: 9, textDecoration: 'none', fontSize: 13, fontWeight: 600, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    <Phone size={14} /> {t('call_now')}
                  </a>
                  <a
                    href={`https://wa.me/${adminNumbers[0]}`}
                    target="_blank" rel="noreferrer"
                    style={{ flex: 1, minWidth: 90, padding: '9px 14px', background: '#25D366', color: '#fff', borderRadius: 9, textDecoration: 'none', fontSize: 13, fontWeight: 600, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    <MessageCircle size={14} /> {t('whatsapp_us')}
                  </a>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '14px 0' }} />

                {/* Number 2 */}
                <a href={`tel:${adminNumbers[1]}`} style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#fff', textDecoration: 'none', marginBottom: 10 }}>
                  +91 {adminNumbers[1].slice(-10)}
                </a>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <a
                    href={`tel:${adminNumbers[1]}`}
                    style={{ flex: 1, minWidth: 90, padding: '9px 14px', background: 'var(--o)', color: '#fff', borderRadius: 9, textDecoration: 'none', fontSize: 13, fontWeight: 600, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    <Phone size={14} /> {t('call_now')}
                  </a>
                  <a
                    href={`https://wa.me/${adminNumbers[1]}`}
                    target="_blank" rel="noreferrer"
                    style={{ flex: 1, minWidth: 90, padding: '9px 14px', background: '#25D366', color: '#fff', borderRadius: 9, textDecoration: 'none', fontSize: 13, fontWeight: 600, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    <MessageCircle size={14} /> {t('whatsapp_us')}
                  </a>
                </div>

              </div>
            </div>

            {/* Email */}
            <div style={cardStyle}>
              <div style={iconBadge}><Mail size={20} color="var(--o)" /></div>
              <div>
                <p style={labelStyle}>{t('email')}</p>
                <a href="mailto:srimeenakshiglassandplywoods@gmail.com" style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', textDecoration: 'none', wordBreak: 'break-all' }}>
                  srimeenakshiglassandplywoods@gmail.com
                </a>
              </div>
            </div>

            {/* Hours */}
            <div style={cardStyle}>
              <div style={iconBadge}><Clock size={20} color="var(--o)" /></div>
              <div>
                <p style={labelStyle}>{t('hours')}</p>
                <p style={{ margin: '0 0 4px', fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>{t('hours_mon_sat')}</p>
                <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>{t('hours_sun')}</p>
              </div>
            </div>

          </div>

          {/* ── Right: Enquiry Form ── */}
          <div style={{
            flex: '1 1 500px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 18,
            border: '1px solid rgba(255,255,255,0.07)',
            padding: '36px 32px',
          }}>
            {/* Form Title */}
            <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
              {t('form_title')}
            </h2>
            <p style={{ margin: '0 0 28px', fontSize: 16, color: 'var(--o)', fontWeight: 600 }}>
              {t('form_subtitle')}
            </p>

            <form onSubmit={handleEnquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Row 1: Name + Email */}
              <div className="contact-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={fieldLabelStyle}>{t('full_name')} <span style={{ color: 'var(--o)' }}>*</span></label>
                  <input
                    name="name" placeholder={t('ph_name')} value={formData.name}
                    onChange={set('name')} required style={inputStyle}
                  />
                </div>
                <div>
                  <label style={fieldLabelStyle}>{t('email_address')}</label>
                  <input
                    name="email" placeholder={t('ph_email')} value={formData.email}
                    onChange={set('email')} style={inputStyle}
                  />
                </div>
              </div>

              {/* Row 2: Phone + Interest */}
              <div className="contact-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={fieldLabelStyle}>{t('phone_number')} <span style={{ color: 'var(--o)' }}>*</span></label>
                  <input
                    name="phone" placeholder={t('ph_phone')} value={formData.phone}
                    onChange={set('phone')} required style={inputStyle}
                  />
                </div>
                <div>
                  <label style={fieldLabelStyle}>{t('product_interest')}</label>
                  <input
                    name="interest" placeholder={t('ph_interest')} value={formData.interest}
                    onChange={set('interest')} style={inputStyle}
                  />
                </div>
              </div>

              {/* Row 3: Message */}
              <div>
                <label style={fieldLabelStyle}>{t('your_message')} <span style={{ color: 'var(--o)' }}>*</span></label>
                <textarea
                  name="message" placeholder={t('ph_message')} value={formData.message}
                  onChange={set('message')} rows={4} required
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit" disabled={loading}
                style={{
                  padding: '14px 24px',
                  background: loading ? 'rgba(237,108,2,0.5)' : 'var(--o)',
                  color: '#fff',
                  borderRadius: 12,
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: 15,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'opacity 0.2s',
                }}
              >
                <MessageCircle size={16} />
                {loading ? t('sending') : t('send_message')}
              </button>

            </form>

            {statusMessage && (
              <p style={{ marginTop: 16, fontSize: 14, color: statusMessage.startsWith('✅') ? '#4ade80' : statusMessage.startsWith('⏳') ? 'var(--o)' : '#f87171' }}>
                {statusMessage}
              </p>
            )}
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