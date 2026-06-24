import { useState } from 'react'; // ✅ Fix #1: useMemo removed
import { supabase } from '../../supabase';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'; // Send removed (unused)
import { Helmet } from 'react-helmet-async';

const tData = {
  en: {
    visit_us: "Visit Us", call: "Call", email: "Email", hours: "Hours",
    hours_mon_sat: "Mon-Sat: 8.30 AM - 9 PM", hours_sun: "Sunday: 10 AM - 5 PM",
    call_now: "Call Now", send_sms: "Send SMS", whatsapp_us: "WhatsApp Us",
    send_enquiry: "Send an Enquiry", full_name: "Full Name", email_address: "Email Address",
    phone_number: "Phone Number", product_interest: "Product Interest", your_message: "Your Message",
    send_message: "Send Message", sending: "Sending...", error_required: "❌ Name, Phone and Message are required!",
    error_phone_invalid: "❌ Please enter a valid 10-digit phone number!",
    error_email_invalid: "❌ Please enter a valid email address!",
    status_sending: "⏳ Sending...", status_success: "✅ Enquiry Sent!",
    error_failed: "❌ Error occurred", ph_name: "e.g. Raj Kumar", ph_email: "e.g. raj@gmail.com",
    ph_phone: "e.g. 9876543210", ph_interest: "e.g. Toughened Glass", ph_message: "Tell us your requirement..."
  },
  ta: {
    visit_us: "முகவரி", call: "அழைக்க", email: "மின்னஞ்சல்", hours: "வேலை நேரம்",
    hours_mon_sat: "திங்கள்-சனி: காலை 8.30 - இரவு 9 மணி", hours_sun: "ஞாயிறு: காலை 10 - மாலை 5 மணி",
    call_now: "அழைக்க", send_sms: "எஸ்.எம்.எஸ்", whatsapp_us: "வாட்ஸ்அப்",
    send_enquiry: "விசாரணை அனுப்புங்கள்", full_name: "முழு பெயர்", email_address: "மின்னஞ்சல்",
    phone_number: "தொலைபேசி எண்", product_interest: "தேவைப்படும் பொருள்", your_message: "உங்கள் கருத்து",
    send_message: "அனுப்பவும்", sending: "அனுப்பப்படுகிறது...", error_required: "❌ பெயர், போன் மற்றும் கருத்து தேவை!",
    error_phone_invalid: "❌ சரியான 10-இலக்க எண்!", error_email_invalid: "❌ சரியான மின்னஞ்சல்!",
    status_sending: "⏳ அனுப்பப்படுகிறது...", status_success: "✅ அனுப்பப்பட்டது!",
    error_failed: "❌ பிழை ஏற்பட்டது", ph_name: "உதா: ராஜ் குமார்", ph_email: "உதா: raj@gmail.com",
    ph_phone: "உதா: 9876543210", ph_interest: "உதா: கிளாஸ், பிளைவுட்", ph_message: "உங்கள் தேவையை இங்கே எழுதவும்..."
  }
};

export default function Contact({ currentLang = 'ta' }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', interest: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const [adminNumbers] = useState(["919790923750", "919884822999", "919940504234"]);
  const mainNum = adminNumbers[0]; // 9790923750 — முதன்மை நம்பர்

  const t = (key) => tData[currentLang]?.[key] || tData['en']?.[key] || key;

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
      window.open(`https://wa.me/${mainNum}?text=${encodeURIComponent(msg)}`, '_blank');
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
      <section style={{ padding: "80px 24px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 40, flexWrap: "wrap" }}>

          {/* Info Cards */}
          <div style={{ flex: "1 1 350px", display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Address */}
            <div style={{ padding: 24, background: "rgba(255,255,255,0.03)", borderRadius: 16 }}>
              <MapPin size={20} />
              <h4>{t('visit_us')}</h4>
              <p>No:26/23, Sathiya Narayanan Street, Palavan Salai, Perambur, Chennai - 600011</p>
            </div>

            {/* Phone */}
            <div style={{ padding: 24, background: "rgba(255,255,255,0.03)", borderRadius: 16 }}>
              <Phone size={20} />
              <h4>{t('call')}</h4>
              <a href={`tel:${mainNum}`} style={{ display: 'block', fontSize: 18, fontWeight: 700 }}>
                +91 {mainNum.slice(-10)}
              </a>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <a href={`tel:${mainNum}`} style={{ padding: '8px 14px', background: 'var(--o)', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>
                  {t('call_now')}
                </a>
                <a href={`https://wa.me/${mainNum}`} target="_blank" rel="noreferrer" style={{ padding: '8px 14px', background: '#25D366', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>
                  <MessageCircle size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  {t('whatsapp_us')}
                </a>
              </div>
            </div>

            {/* Email */}
            <div style={{ padding: 24, background: "rgba(255,255,255,0.03)", borderRadius: 16 }}>
              <Mail size={20} />
              <h4>{t('email')}</h4>
              <a href="mailto:srimeenakshiglassandplywoods@gmail.com" style={{ fontSize: 14 }}>
                srimeenakshiglassandplywoods@gmail.com
              </a>
            </div>

            {/* Hours */}
            <div style={{ padding: 24, background: "rgba(255,255,255,0.03)", borderRadius: 16 }}>
              <Clock size={20} />
              <h4>{t('hours')}</h4>
              <p style={{ margin: '4px 0' }}>{t('hours_mon_sat')}</p>
              <p style={{ margin: '4px 0' }}>{t('hours_sun')}</p>
            </div>

          </div>

          {/* Enquiry Form */}
          <div style={{ flex: "1 1 500px" }}>
            <form onSubmit={handleEnquirySubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <input name="name" placeholder={t('ph_name')} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={{ padding: 14, borderRadius: 12 }} />
              <input name="email" placeholder={t('ph_email')} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ padding: 14, borderRadius: 12 }} />
              <input name="phone" placeholder={t('ph_phone')} value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required style={{ padding: 14, borderRadius: 12 }} />
              <input name="interest" placeholder={t('ph_interest')} value={formData.interest} onChange={e => setFormData({ ...formData, interest: e.target.value })} style={{ padding: 14, borderRadius: 12 }} />
              <textarea name="message" placeholder={t('ph_message')} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} rows="4" required style={{ padding: 14, borderRadius: 12 }} />
              <button type="submit" disabled={loading} style={{ padding: 16, background: "var(--o)", color: "#fff", borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? t('sending') : t('send_message')}
              </button>
            </form>
            {statusMessage && <p style={{ marginTop: 20, color: "var(--o)" }}>{statusMessage}</p>}
          </div>

        </div>
      </section>
    </>
  );
}