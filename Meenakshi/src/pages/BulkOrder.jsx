import { useState } from 'react';
import { supabase } from '../supabase';
import { Plus, Trash2, Send, User, Building, Phone, MapPin, Package, CheckCircle, ArrowLeft } from 'lucide-react';

export default function BulkOrder({ go }) {
  const [formData, setFormData] = useState({
    contractorName: '',
    companyName: '',
    phone: '',
    deliveryLocation: ''
  });
  
  // Dynamic Items Array
  const [items, setItems] = useState([{ id:1 , name: '', qty: '' }]);
  const [status, setStatus] = useState(null); // 'loading', 'success', null
  const [errorMsg, setErrorMsg] = useState('');

  // 🔴 இங்கே உங்கள் கடையின் WhatsApp நம்பரை மாற்றுங்கள் (Country code-உடன், + இல்லாமல்)
  const WHATSAPP_NUMBER = "919790923750"; 

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: '', qty: '' }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation: குறைந்தது ஒரு பொருளாவது சரியாக உள்ளதா என சரிபார்த்தல்
    const validItems = items.filter(item => item.name.trim() !== '' && item.qty.trim() !== '');
    if (validItems.length === 0) {
      setErrorMsg('தயவுசெய்து குறைந்தது ஒரு பொருளையாவது சேர்க்கவும் (Add at least 1 item).');
      return;
    }
    
    setStatus('loading');
    setErrorMsg('');

    try {
      // 1. Supabase-ல் Save செய்வது
      const { error } = await supabase.from('bulk_orders').insert([{
        contractor_name: formData.contractorName,
        company_name: formData.companyName || null,
        phone: formData.phone,
        delivery_location: formData.deliveryLocation,
        items: validItems
      }]);

      if (error) throw error;

      // 2. WhatsApp Message Format செய்வது
      let msg = `*New Bulk Order Request* 📦\n\n`;
      msg += `*Name:* ${formData.contractorName}\n`;
      if (formData.companyName) msg += `*Company:* ${formData.companyName}\n`;
      msg += `*Phone:* ${formData.phone}\n`;
      msg += `*Delivery Location:* ${formData.deliveryLocation}\n\n`;
      msg += `*Order Items:*\n`;
      
      validItems.forEach((item, index) => {
        msg += `${index + 1}. ${item.name} - ${item.qty}\n`;
      });

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      
      setStatus('success');
      
      // 3. WhatsApp-ஐ புதிய Tab-ல் திறப்பது
      window.open(waUrl, '_blank');
      
      // 4. Form-ஐ Reset செய்வது
      setFormData({ contractorName: '', companyName: '', phone: '', deliveryLocation: '' });
      setItems([{ id: Date.now(), name: '', qty: '' }]);
      
    } catch (err) {
      console.error(err);
      setStatus(null);
      setErrorMsg(err.message);
    }
  };

  const inpStyle = { width: "100%", padding: "12px 16px 12px 42px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--brd)", borderRadius: 8, color: "#fff", outline: "none", fontSize: 15 };
  const iconStyle = { position: "absolute", left: 14, top: 14, color: "var(--sl3)" };

  return (
    <div style={{ paddingTop: 90, paddingBottom: 60, background: "var(--bg)", minHeight: "100vh", color: "var(--w)" }}>
      <div className="wrap" style={{ maxWidth: 800 }}>
        
        {/* Back Button */}
        <button onClick={() => go('home')} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", color: "var(--sl3)", cursor: "pointer", marginBottom: 24, fontSize: 15, fontWeight: 600 }}>
          <ArrowLeft size={18} /> Back to Home
        </button>

        <div className="g" style={{ padding: "40px", borderRadius: 24, border: "1px solid var(--brd)" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--o)", marginBottom: 8, fontFamily: "'Cormorant Garamond', serif" }}>Bulk Order Request</h1>
            <p style={{ color: "var(--sl3)", fontSize: 15 }}>For Contractors, Architects & Builders. Quick orders directly to our WhatsApp.</p>
          </div>

          {status === 'success' ? (
            <div style={{ textAlign: "center", padding: "40px 20px", background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 16 }}>
              <CheckCircle size={50} color="#22c55e" style={{ margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Order Submitted Successfully!</h3>
              <p style={{ color: "var(--sl3)", marginBottom: 24 }}>Your order details have been saved and sent to our WhatsApp.</p>
              <button onClick={() => setStatus(null)} className="bo" style={{ padding: "10px 24px", borderRadius: 8, fontWeight: 600 }}>Submit Another Order</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              
              {/* Contractor Details */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
                <div style={{ position: "relative" }}>
                  <User size={18} style={iconStyle} />
                  <input type="text" name="contractorName" value={formData.contractorName} onChange={handleFormChange} placeholder="Your Name / Contractor Name *" required style={inpStyle} />
                </div>
                <div style={{ position: "relative" }}>
                  <Building size={18} style={iconStyle} />
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleFormChange} placeholder="Company Name (Optional)" style={inpStyle} />
                </div>
                <div style={{ position: "relative" }}>
                  <Phone size={18} style={iconStyle} />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="Phone Number *" required style={inpStyle} />
                </div>
                <div style={{ position: "relative" }}>
                  <MapPin size={18} style={iconStyle} />
                  <input type="text" name="deliveryLocation" value={formData.deliveryLocation} onChange={handleFormChange} placeholder="Delivery Location / Site Address *" required style={inpStyle} />
                </div>
              </div>

              <hr style={{ border: 0, borderTop: "1px solid var(--brd)", margin: "8px 0" }} />

              {/* Items Section */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}><Package size={20} color="var(--o)" /> Order Items</h3>
                  <button type="button" onClick={addItem} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(249,115,22,0.1)", color: "var(--o)", border: "none", padding: "8px 14px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
                    <Plus size={16} /> Add Item
                  </button>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {items.map((item, index) => (
                    <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center", animation: "fadeIn 0.3s ease" }}>
                      <span style={{ color: "var(--sl3)", fontWeight: 700, width: 20 }}>{index + 1}.</span>
                      <input 
                        type="text" 
                        placeholder="Product Name & Details (e.g. 12mm Toughened Glass)" 
                        value={item.name} 
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} 
                        style={{ ...inpStyle, paddingLeft: 16, flex: 2 }} 
                        required 
                      />
                      <input 
                        type="text" 
                        placeholder="Qty (e.g. 150 Sqft)" 
                        value={item.qty} 
                        onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)} 
                        style={{ ...inpStyle, paddingLeft: 16, flex: 1 }} 
                        required 
                      />
                      <button 
                        type="button" 
                        onClick={() => removeItem(item.id)} 
                        disabled={items.length === 1}
                        style={{ background: items.length === 1 ? "rgba(255,255,255,0.05)" : "rgba(239,68,68,0.1)", color: items.length === 1 ? "var(--sl)" : "#ef4444", border: "none", padding: 12, borderRadius: 8, cursor: items.length === 1 ? "not-allowed" : "pointer", transition: "all 0.2s" }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {errorMsg && <div style={{ color: "#ef4444", fontSize: 14, fontWeight: 600, background: "rgba(239,68,68,0.1)", padding: 12, borderRadius: 8 }}>{errorMsg}</div>}

              <button type="submit" disabled={status === 'loading'} className="bo" style={{ padding: "16px", fontSize: 16, borderRadius: 10, fontWeight: 700, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, cursor: status === 'loading' ? "not-allowed" : "pointer", opacity: status === 'loading' ? 0.7 : 1, marginTop: 10 }}>
                {status === 'loading' ? 'Processing...' : (
                  <>Send Order via WhatsApp <Send size={18} /></>
                )}
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}