import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { PageBar, Loader } from '../components/ui';
import { LogIn, PlusCircle, Image, CheckCircle, LogOut, Edit, Trash2, X, ArrowLeft, Package, MessageSquare, Wand2, Loader2, BarChart2, TrendingUp, Users, ShoppingBag, Clock, CheckSquare } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// Dynamic 3-Tier Category Data Structure 
const CATEGORY_DATA = {
  Glass: {
    Interior: ["Toughened Glass", "Laminated Glass", "Frosted Glass", "Decorative / Art Glass", "Clear Glass", "Mirrors"],
    Exterior: ["Toughened Glass", "Reflective Glass", "Double Glazed Unit (DGU)", "Laminated Glass", "Tinted Glass"],
    Other: ["Custom / Other"]
  },
  Plywoods: {
    "Commercial (MR)": ["Hardwood", "Alternate Core", "Pine"],
    "Marine (BWP/BWR)": ["Gurjan", "Hardwood"],
    "Blockboards & Flush Doors": ["Pine", "Hardwood", "Solid Wood"],
    "Decorative": ["Teak Veneer", "Laminates", "MDF", "Particle Board"],
    Other: ["Custom / Other"]
  },
  UPVC: {
    "Windows": ["Sliding Window", "Casement Window", "Fixed Window", "Tilt & Turn", "Louvered"],
    "Doors": ["Sliding Door", "Casement Door", "French Door", "Slide & Fold"],
    "Profiles & Accessories": ["Frames", "Sashes", "Beading"],
    Other: ["Custom / Other"]
  },
  WPVC: {
    "Doors": ["Solid Door", "Carved / Designer Door", "Plain Door"],
    "Frames (Chaukhat)": ["Standard Frame", "Custom Frame"],
    "Boards & Panels": ["Solid Board", "Foam Board"],
    Other: ["Custom / Other"]
  },
  Aluminium: {
    "Sections & Profiles": ["Sliding Window Section", "Partition Section", "Door Section"],
    "Sheets": ["ACP Sheet", "Plain Sheet", "Chequered Plate"],
    "Mesh & Nets": ["Mosquito Net", "Stainless Steel Mesh"],
    Other: ["Custom / Other"]
  },
  Hardwares: {
    "Glass Fittings": ["Patch Fittings", "Spigots", "Hinges", "Handles", "Locks"],
    "Plywood / Door Fittings": ["Hinges", "Tower Bolts", "Handles", "Mortise Locks", "Telescopic Channels"],
    "Window Fittings": ["Rollers", "Friction Stays", "Espag Handles"],
    "Consumables": ["Silicon Sealants", "Masking Tapes", "Screws / Fasteners"],
    Other: ["Custom / Other"]
  }
};

// Image Compressor & WebP Converter Logic
const compressAndConvertToWebP = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const newFile = new File([blob], `${originalName}.webp`, { type: 'image/webp', lastModified: Date.now() });
            resolve(newFile);
          } else {
            reject(new Error("Image compression failed"));
          }
        }, 'image/webp', 0.8);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

// ✅ Analytics Dashboard Component
function AnalyticsDashboard({ productsList, enquiriesList }) {
  const totalProducts = productsList.length;
  const totalEnquiries = enquiriesList.length;
  const pendingEnquiries = enquiriesList.filter(e => e.status !== 'completed').length;
  const completedEnquiries = enquiriesList.filter(e => e.status === 'completed').length;
  const completionRate = totalEnquiries > 0 ? Math.round((completedEnquiries / totalEnquiries) * 100) : 0;

  // Category-wise product count
  const categoryCount = {};
  productsList.forEach(p => {
    const cat = p.category || 'Other';
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });
  const sortedCategories = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]);
  const maxCatCount = sortedCategories[0]?.[1] || 1;

  // Interest-wise enquiry count
  const interestCount = {};
  enquiriesList.forEach(e => {
    const interest = e.interest || 'General';
    interestCount[interest] = (interestCount[interest] || 0) + 1;
  });
  const sortedInterests = Object.entries(interestCount).sort((a, b) => b[1] - a[1]);
  const maxInterestCount = sortedInterests[0]?.[1] || 1;

  // Last 7 days enquiries
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    const count = enquiriesList.filter(e => {
      const eDate = new Date(e.created_at);
      return eDate.toDateString() === d.toDateString();
    }).length;
    last7Days.push({ date: dateStr, count });
  }
  const maxDayCount = Math.max(...last7Days.map(d => d.count), 1);

  // Recent 5 enquiries
  const recentEnquiries = enquiriesList.slice(0, 5);

  const statCard = (icon, label, value, color, sub) => (
    <div style={{ background: "var(--g)", border: `1px solid ${color}22`, borderRadius: 16, padding: 24, flex: 1, minWidth: 160 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--sl3)", marginBottom: 8, fontWeight: 600 }}>{label}</div>
          <div style={{ fontSize: 36, fontWeight: 800, color }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: "var(--sl)", marginTop: 4 }}>{sub}</div>}
        </div>
        <div style={{ background: `${color}18`, borderRadius: 12, padding: 10 }}>{icon}</div>
      </div>
    </div>
  );

  return (
    <div style={{ animation: "fadeUp .4s ease" }}>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        {statCard(<ShoppingBag size={22} color="var(--o)" />, "Total Products", totalProducts, "var(--o)", `Across ${Object.keys(categoryCount).length} categories`)}
        {statCard(<Users size={22} color="#38bdf8" />, "Total Enquiries", totalEnquiries, "#38bdf8", `${pendingEnquiries} pending`)}
        {statCard(<Clock size={22} color="#f59e0b" />, "Pending", pendingEnquiries, "#f59e0b", "Need follow-up")}
        {statCard(<CheckSquare size={22} color="#22c55e" />, "Completed", completedEnquiries, "#22c55e", `${completionRate}% rate`)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>

        {/* Last 7 Days Enquiries Bar Chart */}
        <div className="g" style={{ padding: 24, borderRadius: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <TrendingUp size={18} color="var(--o)" />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Enquiries — Last 7 Days</h3>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
            {last7Days.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 11, color: "var(--o)", fontWeight: 700 }}>{d.count > 0 ? d.count : ''}</div>
                <div style={{
                  width: "100%",
                  height: `${Math.max((d.count / maxDayCount) * 90, d.count > 0 ? 8 : 4)}px`,
                  background: d.count > 0 ? "var(--o)" : "rgba(255,255,255,0.05)",
                  borderRadius: "4px 4px 0 0",
                  transition: "height 0.3s ease"
                }} />
                <div style={{ fontSize: 10, color: "var(--sl)", textAlign: "center", lineHeight: 1.2 }}>{d.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Enquiry Status Donut */}
        <div className="g" style={{ padding: 24, borderRadius: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <BarChart2 size={18} color="#38bdf8" />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Enquiry Status</h3>
          </div>
          {totalEnquiries === 0 ? (
            <div style={{ textAlign: "center", color: "var(--sl)", padding: "30px 0" }}>No enquiries yet</div>
          ) : (
            <>
              <div style={{ position: "relative", display: "flex", justifyContent: "center", marginBottom: 16 }}>
                <svg width="120" height="120" viewBox="0 0 42 42">
                  <circle cx="21" cy="21" r="15.91" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <circle cx="21" cy="21" r="15.91" fill="none" stroke="#22c55e" strokeWidth="6"
                    strokeDasharray={`${completionRate} ${100 - completionRate}`}
                    strokeDashoffset="25" strokeLinecap="round" />
                  <text x="21" y="21" textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="7" fontWeight="800">{completionRate}%</text>
                </svg>
              </div>
              <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
                  <span style={{ color: "var(--sl3)" }}>Completed ({completedEnquiries})</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
                  <span style={{ color: "var(--sl3)" }}>Pending ({pendingEnquiries})</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>

        {/* Products by Category */}
        <div className="g" style={{ padding: 24, borderRadius: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Package size={18} color="var(--o)" />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Products by Category</h3>
          </div>
          {sortedCategories.length === 0 ? (
            <div style={{ color: "var(--sl)", textAlign: "center", padding: "20px 0" }}>No products yet</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sortedCategories.map(([cat, count]) => (
                <div key={cat}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span style={{ color: "var(--w)", fontWeight: 600 }}>{cat}</span>
                    <span style={{ color: "var(--o)", fontWeight: 700 }}>{count}</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 4, height: 6 }}>
                    <div style={{
                      width: `${(count / maxCatCount) * 100}%`,
                      background: "linear-gradient(90deg, var(--o), #f97316)",
                      borderRadius: 4, height: "100%", transition: "width 0.5s ease"
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enquiries by Interest */}
        <div className="g" style={{ padding: 24, borderRadius: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <MessageSquare size={18} color="#a855f7" />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Enquiries by Interest</h3>
          </div>
          {sortedInterests.length === 0 ? (
            <div style={{ color: "var(--sl)", textAlign: "center", padding: "20px 0" }}>No enquiries yet</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sortedInterests.map(([interest, count]) => (
                <div key={interest}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span style={{ color: "var(--w)", fontWeight: 600 }}>{interest}</span>
                    <span style={{ color: "#a855f7", fontWeight: 700 }}>{count}</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 4, height: 6 }}>
                    <div style={{
                      width: `${(count / maxInterestCount) * 100}%`,
                      background: "linear-gradient(90deg, #a855f7, #ec4899)",
                      borderRadius: 4, height: "100%", transition: "width 0.5s ease"
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Enquiries */}
      <div className="g" style={{ padding: 24, borderRadius: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <Clock size={18} color="#38bdf8" />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Enquiries</h3>
        </div>
        {recentEnquiries.length === 0 ? (
          <div style={{ color: "var(--sl)", textAlign: "center", padding: "20px 0" }}>No enquiries yet</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recentEnquiries.map(enq => (
              <div key={enq.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid var(--brd)" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "var(--o)" }}>
                    {enq.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{enq.name}</div>
                    <div style={{ fontSize: 12, color: "var(--sl3)" }}>{enq.interest || 'General'} · {enq.phone}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                    background: enq.status === 'completed' ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                    color: enq.status === 'completed' ? "#22c55e" : "#f59e0b"
                  }}>
                    {enq.status === 'completed' ? '✅ Done' : '⏳ Pending'}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--sl)" }}>{new Date(enq.created_at).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Admin({ go }) {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Glass');
  const [subcategory, setSubcategory] = useState('Interior');
  const [productType, setProductType] = useState('');
  const [brand, setBrand] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [priceUnit, setPriceUnit] = useState('Sqft');
  const [size, setSize] = useState('');
  const [thickness, setThickness] = useState('');
  const [inStock, setInStock] = useState(true);
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [customSub, setCustomSub] = useState('');
  const [customType, setCustomType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [productsList, setProductsList] = useState([]);
  const [enquiriesList, setEnquiriesList] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setStatusMessage('⏳ Optimizing Image to WebP...');
      try {
        const optimizedWebPFile = await compressAndConvertToWebP(file);
        setImageFile(optimizedWebPFile);
        setStatusMessage('✅ Image Compressed & Converted to WebP!');
        setTimeout(() => setStatusMessage(''), 3000);
      } catch (err) {
        console.error("Compression Error:", err);
        setImageFile(file);
        setStatusMessage('⚠️ Optimization failed, using original image.');
      }
    }
  };

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setCategory(newCat);
    const subs = Object.keys(CATEGORY_DATA[newCat] || {});
    const firstSub = subs.length > 0 ? subs[0] : 'Other';
    setSubcategory(firstSub);
    setCustomSub('');
    const types = CATEGORY_DATA[newCat]?.[firstSub] || [];
    setProductType(types.length > 0 ? types[0] : 'Custom / Other');
    setCustomType('');
  };

  const handleSubcategoryChange = (e) => {
    const newSub = e.target.value;
    setSubcategory(newSub);
    if (newSub !== 'Custom / Other') {
      const types = CATEGORY_DATA[category]?.[newSub] || [];
      setProductType(types.length > 0 ? types[0] : 'Custom / Other');
      setCustomType('');
    }
  };

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const { data: pData, error: pError } = await supabase.from('products').select('*').order('id', { ascending: false });
      if (pError) throw pError;
      if (pData) setProductsList(pData);
      const { data: eData, error: eError } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
      if (eError) console.error("Enquiry Error:", eError.message);
      if (eData) setEnquiriesList(eData);
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (session) fetchData();
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchData();
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoginError('');
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err) {
      setLoginError(err.message || 'Login failed.');
    }
  };

  const toPascalCase = (str) => {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => {
      if (word === 'mm' || word === 'cm') return word;
      if (word.match(/^[0-9]+(mm|cm|inch)$/)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  };

  const resetForm = () => {
    setEditingId(null); setName(''); setCategory('Glass'); setSubcategory('Interior');
    setProductType(''); setBrand(''); setPriceInput(''); setPriceUnit('Sqft');
    setSize(''); setThickness(''); setInStock(true); setDescription(''); setImageFile(null);
    setImagePreview(''); setCustomSub(''); setCustomType('');
    if (document.getElementById('imageInput')) document.getElementById('imageInput').value = '';
    setStatusMessage('');
  };

  const generateDescription = async () => {
    if (!name || !category) { setStatusMessage('❌ Please enter Product Name and Main Category!'); return; }
    setIsGenerating(true);
    setStatusMessage('⏳ AI is writing the description...');
    const finalSubcategory = subcategory === 'Custom / Other' ? customSub : subcategory;
    const finalType = productType === 'Custom / Other' ? customType : productType;
    const prompt = `You are a professional copywriter for "Sree Meenakshi Glass and Plywoods" in Perambur, Chennai. We are the leading traders of premium glass, plywood, UPVC, and interior hardware.
    Product Name: ${name}
    Category: ${category}
    Subcategory: ${finalSubcategory || 'General'}
    Type: ${finalType || 'General'}
    Task: Write a highly attractive, professional product description in exactly 2 or 3 sentences. Highlight quality, durability, and aesthetics. Mention that we are the best choice in Chennai. Include a subtle call to action like "Visit our showroom in Perambur". No emojis or hashtags. Write in simple English.`;
    try {
      const groqKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!groqKey) throw new Error("Groq key missing");
      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${groqKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }] })
      });
      if (!groqResponse.ok) throw new Error("Groq API Failed");
      const groqData = await groqResponse.json();
      setDescription(groqData.choices[0].message.content.trim());
      setStatusMessage('✅ AI Description generated successfully!');
    } catch (groqError) {
      console.warn("Groq failed, switching to Gemini...", groqError.message);
      try {
        const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!geminiKey) throw new Error("Gemini API key is missing", { cause: groqError });
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const geminiResult = await ai.models.generateContent({ model: "gemini-2.0-flash", contents: prompt });
        setDescription(geminiResult.text.trim());
        setStatusMessage('✅ AI Description generated successfully!');
      } catch (geminiError) {
        console.error("Both APIs Failed:", geminiError);
        setStatusMessage("⚠️ AI Service is temporarily busy. Please try again or type manually.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category) { setStatusMessage('❌ Product Name and Category are required!'); return; }
    try {
      setUploading(true);
      setStatusMessage('⏳ Processing...');
      let publicImageUrl = '';
      if (imageFile) {
        const fileName = `${Date.now()}_${imageFile.name}`;
        const filePath = `${category.toLowerCase().trim()}/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('products').upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(filePath);
        publicImageUrl = publicUrl;
      }
      let finalPrice = priceInput.trim();
      if (finalPrice) {
        if (/^[\d.]+$/.test(finalPrice)) finalPrice = priceUnit !== 'None' ? `₹ ${finalPrice} / ${priceUnit}` : `₹ ${finalPrice}`;
        else if (!finalPrice.includes('₹') && !finalPrice.includes('RS') && priceUnit !== 'None') finalPrice = `₹ ${finalPrice} / ${priceUnit}`;
      }
      const finalSubcategory = subcategory === 'Custom / Other' ? customSub : subcategory;
      const finalType = productType === 'Custom / Other' ? customType : productType;
      const productData = {
        name: name.trim(), category: category.trim(),
        subcategory: finalSubcategory.trim() || null, product_type: finalType.trim() || null,
        brand: toPascalCase(brand.trim()) || null, price: finalPrice || null,
        size: toPascalCase(size.trim()) || null, thickness: toPascalCase(thickness.trim()) || null,
        in_stock: inStock,
        description: description.trim() || null,
      };
      if (publicImageUrl) productData.image_url = publicImageUrl;
      if (editingId) {
        const { error: updateError } = await supabase.from('products').update(productData).eq('id', editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('products').insert([productData]);
        if (insertError) throw insertError;
      }
      resetForm(); fetchData(); setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      setStatusMessage(`❌ Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id); setName(product.name || ''); setCategory(product.category || 'Glass');
    const sub = product.subcategory || '';
    const availableSubs = Object.keys(CATEGORY_DATA[product.category || 'Glass'] || {});
    if (availableSubs.includes(sub)) { setSubcategory(sub); setCustomSub(''); }
    else { setSubcategory('Custom / Other'); setCustomSub(sub); }
    const pType = product.product_type || '';
    const availableTypes = CATEGORY_DATA[product.category || 'Glass']?.[sub] || [];
    if (availableTypes.includes(pType)) { setProductType(pType); setCustomType(''); }
    else { setProductType('Custom / Other'); setCustomType(pType); }
    setBrand(product.brand || '');
    const rawPrice = product.price || '';
    let val = '', unit = 'Sqft';
    if (rawPrice) {
      if (rawPrice.includes('/')) {
        const parts = rawPrice.split('/');
        val = parts[0].replace(/[^\d.]/g, '').trim() || parts[0].trim();
        const rawUnit = parts[1].trim().toLowerCase();
        if (rawUnit.includes('sqft') || rawUnit.includes('sq.ft')) unit = 'Sqft';
        else if (rawUnit.includes('inch')) unit = 'Inch';
        else if (rawUnit.includes('meter') && !rawUnit.includes('centi')) unit = 'Meter';
        else if (rawUnit.includes('centi') || rawUnit.includes('cm')) unit = 'Centimeter';
        else if (rawUnit.includes('piece') || rawUnit.includes('pc')) unit = 'Piece';
        else if (rawUnit.includes('kg') || rawUnit.includes('kilo')) unit = 'Kg';
        else if (rawUnit.includes('rft') || rawUnit.includes('running')) unit = 'Rft';
        else unit = 'None';
      } else { val = rawPrice.replace(/[^\d.]/g, '').trim() || rawPrice.trim(); unit = 'None'; }
    }
    setPriceInput(val); setPriceUnit(unit); setSize(product.size || '');
    setThickness(product.thickness || ''); setInStock(product.in_stock !== false); setDescription(product.description || '');
    setImagePreview(product.image_url || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) { alert("Error: " + err.message); }
  };

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const { error } = await supabase.from('enquiries').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) { alert("Error: " + err.message); }
  };

  const handleToggleStatus = async (id, currentStatus, chosenStatus = null) => {
    try {
      const newStatus = chosenStatus ? chosenStatus : (currentStatus === 'completed' ? 'pending' : 'completed');
      const { error } = await supabase.from('enquiries').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) { alert("Error updating status: " + err.message); }
  };

  if (authLoading) return <Loader done={() => {}} />;

  return (
    <div style={{ paddingTop: 72, background: "var(--bg)", minHeight: "100vh", color: "var(--w)" }}>
      <PageBar />
      <div className="wrap" style={{ padding: "40px 24px" }}>
        {!session ? (
          <div style={{ maxWidth: 400, margin: "20px auto", animation: "fadeUp .5s ease" }}>
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 24 }}>
              <button className="bw" onClick={() => go('home')} style={{ padding: "10px 16px", color: "var(--w)", borderRadius: 8, display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.03)", border: "1px solid var(--brd)" }}>
                <ArrowLeft size={16} /> Back to Website
              </button>
            </div>
            <div className="g" style={{ padding: 32, textAlign: "center", borderRadius: 20 }}>
              <LogIn size={40} color="var(--o)" style={{ marginBottom: 16 }} />
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 800, marginBottom: 24 }}>Admin Login</h2>
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16, textAlign: "left" }}>
                <div>
                  <label style={{ fontSize: 13, color: "var(--sl3)", display: "block", marginBottom: 6, fontWeight: 600 }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.03)", border: "1px solid var(--brd)", borderRadius: 8, color: "#fff" }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, color: "var(--sl3)", display: "block", marginBottom: 6, fontWeight: 600 }}>Password</label>
                  <input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.03)", border: "1px solid var(--brd)", borderRadius: 8, color: "#fff" }} />
                </div>
                {loginError && <div style={{ color: "#ef4444", fontSize: 14, fontWeight: 500 }}>{loginError}</div>}
                <button type="submit" className="bo" style={{ width: "100%", padding: 14, borderRadius: 8, marginTop: 10, fontWeight: 700 }}>Log In</button>
              </form>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 1000, margin: "0 auto", animation: "fadeUp .5s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, borderBottom: "1px solid var(--brd)", paddingBottom: 16, flexWrap: "wrap", gap: 16 }}>
              <div>
                <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 38, fontWeight: 800 }}>Welcome Admin</h1>
                <p style={{ color: "var(--sl3)", fontSize: 14 }}>Manage Sree Meenakshi Glass and Plywoods Database</p>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button className="bw" onClick={() => go('home')} style={{ padding: "10px 16px", color: "var(--w)", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <ArrowLeft size={16} /> Back to Website
                </button>
                <button className="bw" onClick={() => supabase.auth.signOut()} style={{ padding: "10px 16px", color: "#ef4444", borderColor: "rgba(239,68,68,0.2)", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>

            {/* ✅ TABS — 3 tabs now: Products, Enquiries, Analytics */}
            <div style={{ display: "flex", gap: 8, marginBottom: 32, borderBottom: "1px solid var(--brd)", paddingBottom: 16, flexWrap: "wrap" }}>
              {[
                { key: 'products', icon: <Package size={16} />, label: 'Manage Products' },
                { key: 'enquiries', icon: <MessageSquare size={16} />, label: 'Customer Enquiries', badge: enquiriesList.filter(e => e.status !== 'completed').length },
                { key: 'analytics', icon: <BarChart2 size={16} />, label: 'Analytics' },
              ].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
                  fontSize: 15, fontWeight: 600, borderRadius: 8, cursor: "pointer",
                  transition: "all 0.2s", border: "none",
                  background: activeTab === tab.key ? "var(--o)" : "transparent",
                  color: activeTab === tab.key ? "#fff" : "var(--sl)"
                }}>
                  {tab.icon} {tab.label}
                  {tab.badge > 0 && (
                    <span style={{ background: activeTab === tab.key ? "#fff" : "var(--o)", color: activeTab === tab.key ? "var(--o)" : "#fff", padding: "2px 8px", borderRadius: 20, fontSize: 12 }}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ✅ ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <AnalyticsDashboard productsList={productsList} enquiriesList={enquiriesList} />
            )}

            {activeTab === 'products' && (
              <div style={{ animation: "fadeUp .4s ease" }}>
                <form onSubmit={handleSubmit} className="g" style={{ padding: 32, borderRadius: 16, display: "flex", flexDirection: "column", gap: 20, marginBottom: 40, border: editingId ? "1px solid var(--o)" : "1px solid var(--brd)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 20, fontWeight: 700, color: "var(--o)" }}>
                      {editingId ? <Edit size={22} /> : <PlusCircle size={22} />}
                      {editingId ? "Edit Product Details" : "Add New Product"}
                    </div>
                    {editingId && (
                      <button type="button" onClick={resetForm} style={{ background: "transparent", border: "none", color: "#ef4444", display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontWeight: 600 }}><X size={16} /> Cancel</button>
                    )}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 13, color: "var(--sl3)", display: "block", marginBottom: 6, fontWeight: 600 }}>Product Name *</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.02)", border: "1px solid var(--brd)", borderRadius: 8, color: "#fff" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, color: "var(--sl3)", display: "block", marginBottom: 6, fontWeight: 600 }}>Main Category *</label>
                      <select value={category} onChange={handleCategoryChange} style={{ width: "100%", padding: 12, background: "#121214", border: "1px solid var(--brd)", borderRadius: 8, color: "#fff", outline: "none" }}>
                        {Object.keys(CATEGORY_DATA).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 13, color: "var(--sl3)", display: "block", marginBottom: 6, fontWeight: 600 }}>Sub Category</label>
                      <select value={subcategory} onChange={handleSubcategoryChange} style={{ width: "100%", padding: 12, background: "#121214", border: "1px solid var(--brd)", borderRadius: 8, color: "#fff", outline: "none", marginBottom: subcategory === 'Custom / Other' ? 10 : 0 }}>
                        {Object.keys(CATEGORY_DATA[category] || {}).map(s => <option key={s} value={s}>{s}</option>)}
                        <option value="Custom / Other">Custom / Other</option>
                      </select>
                      {subcategory === 'Custom / Other' && <input type="text" placeholder="Type custom subcategory..." value={customSub} onChange={e => setCustomSub(e.target.value)} style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.02)", border: "1px dashed var(--o)", borderRadius: 8, color: "#fff" }} />}
                    </div>
                    <div>
                      <label style={{ fontSize: 13, color: "var(--sl3)", display: "block", marginBottom: 6, fontWeight: 600 }}>Product Type / Variety</label>
                      <select value={productType} onChange={e => setProductType(e.target.value)} style={{ width: "100%", padding: 12, background: "#121214", border: "1px solid var(--brd)", borderRadius: 8, color: "#fff", outline: "none", marginBottom: productType === 'Custom / Other' ? 10 : 0 }}>
                        {(CATEGORY_DATA[category]?.[subcategory] || []).map(t => <option key={t} value={t}>{t}</option>)}
                        <option value="Custom / Other">Custom / Other</option>
                      </select>
                      {productType === 'Custom / Other' && <input type="text" placeholder="Type custom product type..." value={customType} onChange={e => setCustomType(e.target.value)} style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.02)", border: "1px dashed var(--o)", borderRadius: 8, color: "#fff" }} />}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 13, color: "var(--sl3)", display: "block", marginBottom: 6, fontWeight: 600 }}>Brand Name</label>
                      <input type="text" placeholder="e.g. Saint Gobain" value={brand} onChange={e => setBrand(e.target.value)} style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.02)", border: "1px solid var(--brd)", borderRadius: 8, color: "#fff" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, color: "var(--sl3)", display: "block", marginBottom: 6, fontWeight: 600 }}>Price</label>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input type="text" value={priceInput} onChange={e => setPriceInput(e.target.value)} placeholder="e.g. 150" style={{ flex: 1, padding: 12, background: "rgba(255,255,255,0.02)", border: "1px solid var(--brd)", borderRadius: 8, color: "#fff" }} />
                        <select value={priceUnit} onChange={e => setPriceUnit(e.target.value)} style={{ width: "115px", padding: "12px 8px", background: "#121214", border: "1px solid var(--brd)", borderRadius: 8, color: "#fff", outline: "none" }}>
                          {["Sqft","Inch","Meter","Centimeter","Piece","Kg","Rft","None"].map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 13, color: "var(--sl3)", display: "block", marginBottom: 6, fontWeight: 600 }}>Size / Dimensions</label>
                      <input type="text" value={size} onChange={e => setSize(e.target.value)} placeholder="e.g. any size" style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.02)", border: "1px solid var(--brd)", borderRadius: 8, color: "#fff" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, color: "var(--sl3)", display: "block", marginBottom: 6, fontWeight: 600 }}>Thickness</label>
                      <input type="text" value={thickness} onChange={e => setThickness(e.target.value)} placeholder="e.g. 8mm" style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.02)", border: "1px solid var(--brd)", borderRadius: 8, color: "#fff" }} />
                    </div>
                  </div>

                  {/* ✅ Stock Status Toggle */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: inStock ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)", border: `1px solid ${inStock ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`, borderRadius: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--w)", marginBottom: 2 }}>Stock Availability</div>
                      <div style={{ fontSize: 12, color: "var(--sl3)" }}>
                        {inStock ? "✅ Product is available for customers" : "❌ Product is out of stock"}
                      </div>
                    </div>
                    <div onClick={() => setInStock(!inStock)} style={{ cursor: "pointer", width: 52, height: 28, borderRadius: 14, background: inStock ? "#22c55e" : "#ef4444", position: "relative", transition: "background 0.3s ease", flexShrink: 0 }}>
                      <div style={{ position: "absolute", top: 3, left: inStock ? 27 : 3, width: 22, height: 22, borderRadius: "50%", background: "#fff", transition: "left 0.3s ease", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 13, color: "var(--sl3)", marginBottom: 6, fontWeight: 600 }}>
                      <span>Product Description</span>
                      <button type="button" onClick={generateDescription} disabled={isGenerating} style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: isGenerating ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, opacity: isGenerating ? 0.7 : 1 }}>
                        {isGenerating ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Wand2 size={14} />}
                        {isGenerating ? "AI Generating..." : "AI Auto Write"}
                      </button>
                    </label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows="3" placeholder="Type your description or click 'AI Auto Write'..." style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.02)", border: "1px solid var(--brd)", borderRadius: 8, color: "#fff", resize: "none" }} />
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.01)", border: "1px dashed var(--brd)", padding: 20, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    {imagePreview ? <img src={imagePreview} alt="Preview" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 12, border: "2px solid var(--o)" }} /> : <Image size={36} color="var(--sl3)" style={{ opacity: 0.6 }} />}
                    <div style={{ textAlign: "center" }}>
                      <label style={{ fontSize: 14, fontWeight: 600, color: "var(--w)", display: "block", marginBottom: 6, cursor: "pointer", padding: "8px 16px", background: "var(--bg2)", border: "1px solid var(--o)", borderRadius: 8 }}>
                        {editingId ? "Change Product Image" : "Choose Image (.jpg, .png, etc.)"}
                        <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                      </label>
                      <span style={{ fontSize: 11, color: "var(--sl)" }}>Images are automatically compressed & converted to .webp</span>
                    </div>
                  </div>
                  {statusMessage && <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--brd)", borderRadius: 8, fontSize: 14, fontWeight: 500, color: statusMessage.includes('❌') ? '#ef4444' : (statusMessage.includes('✅') ? '#22c55e' : 'var(--o)') }}>{statusMessage}</div>}
                  <button type="submit" disabled={uploading} className="bo" style={{ padding: "16px", fontSize: 16, borderRadius: 10, fontWeight: 700, width: "100%", marginTop: 10, display: "flex", justifyContent: "center", gap: 8, cursor: uploading ? "not-allowed" : "pointer", opacity: uploading ? 0.6 : 1 }}>
                    <CheckCircle size={20} /> {editingId ? "Update Product" : "Save & Add Product"}
                  </button>
                </form>
                <div className="g" style={{ padding: 24, borderRadius: 16 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, borderBottom: "1px solid var(--brd)", paddingBottom: 12 }}>Manage Products</h2>
                  {loadingData ? <div style={{ textAlign: "center", padding: 30, color: "var(--sl3)" }}>Loading...</div> : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid var(--brd)", color: "var(--sl3)", fontSize: 14 }}>
                            <th style={{ padding: "12px 8px" }}>Image</th>
                            <th style={{ padding: "12px 8px" }}>Name & Details</th>
                            <th style={{ padding: "12px 8px" }}>Price</th>
                            <th style={{ padding: "12px 8px", textAlign: "right" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productsList.map((p) => (
                            <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                              <td style={{ padding: "12px 8px" }}>{p.image_url ? <img src={p.image_url} alt="img" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8 }} /> : <div style={{ width: 44, height: 44, background: "var(--bg2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--sl3)" }}>N/A</div>}</td>
                              <td style={{ padding: "12px 8px", fontWeight: 600 }}>{p.name}<div style={{ fontSize: 11, color: "var(--sl)", marginTop: 4, fontWeight: 400 }}>{p.category} › {p.subcategory || '-'} › {p.product_type || '-'}</div></td>
                              <td style={{ padding: "12px 8px", color: "var(--o)" }}>{p.price || '-'}</td>
                              <td style={{ padding: "12px 8px", textAlign: "right" }}>
                                <button onClick={() => handleEdit(p)} style={{ background: "rgba(56,189,248,0.1)", color: "#38bdf8", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer", marginRight: 8 }}><Edit size={16} /></button>
                                <button onClick={() => handleDeleteProduct(p.id, p.name)} style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}><Trash2 size={16} /></button>
                              </td>
                            </tr>
                          ))}
                          {productsList.length === 0 && <tr><td colSpan="4" style={{ textAlign: "center", padding: 30, color: "var(--sl)" }}>No products found.</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'enquiries' && (
              <div className="g" style={{ padding: 24, borderRadius: 16, animation: "fadeUp .4s ease" }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, borderBottom: "1px solid var(--brd)", paddingBottom: 12 }}>Customer Enquiries</h2>
                {loadingData ? <div style={{ textAlign: "center", padding: 30, color: "var(--sl3)" }}>Loading...</div> : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--brd)", color: "var(--sl3)", fontSize: 14 }}>
                          <th style={{ padding: "12px 8px" }}>Date</th>
                          <th style={{ padding: "12px 8px" }}>Customer Info</th>
                          <th style={{ padding: "12px 8px" }}>Interest</th>
                          <th style={{ padding: "12px 8px" }}>Message</th>
                          <th style={{ padding: "12px 8px", textAlign: "center" }}>Status</th>
                          <th style={{ padding: "12px 8px", textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enquiriesList.map((enq) => (
                          <tr key={enq.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", verticalAlign: "top", opacity: enq.status === 'completed' ? 0.6 : 1, transition: "opacity 0.3s" }}>
                            <td style={{ padding: "12px 8px", fontSize: 13, color: "var(--sl)" }}>{new Date(enq.created_at).toLocaleDateString()}</td>
                            <td style={{ padding: "12px 8px" }}>
                              <div style={{ fontWeight: 600, color: "var(--w)", marginBottom: 4, textDecoration: enq.status === 'completed' ? "line-through" : "none" }}>{enq.name}</div>
                              <div style={{ fontSize: 13, color: "var(--sl3)", marginBottom: 2 }}>📞 {enq.phone}</div>
                              {enq.email && <div style={{ fontSize: 13, color: "var(--sl3)" }}>📧 {enq.email}</div>}
                            </td>
                            <td style={{ padding: "12px 8px" }}><span style={{ background: "rgba(249,115,22,0.1)", color: "var(--o)", padding: "4px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>{enq.interest || 'General'}</span></td>
                            <td style={{ padding: "12px 8px", fontSize: 13, color: "var(--sl3)", maxWidth: 250 }}>{enq.message || '-'}</td>
                            <td style={{ padding: "12px 8px", textAlign: "center" }}>
                              <select value={enq.status || 'pending'} onChange={(e) => handleToggleStatus(enq.id, enq.status, e.target.value)} style={{ background: enq.status === 'completed' ? "#14532d" : "#713f12", color: enq.status === 'completed' ? "#4ade80" : "#fef08a", border: "1px solid rgba(255,255,255,0.1)", padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, outline: "none", cursor: "pointer" }}>
                                <option value="pending" style={{ background: "#121214", color: "#fff" }}>⏳ Pending</option>
                                <option value="completed" style={{ background: "#121214", color: "#fff" }}>✅ Completed</option>
                              </select>
                            </td>
                            <td style={{ padding: "12px 8px", textAlign: "right" }}>
                              <button onClick={() => handleDeleteEnquiry(enq.id)} style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))}
                        {enquiriesList.length === 0 && <tr><td colSpan="6" style={{ padding: "60px", textAlign: "center", color: "var(--sl)" }}><MessageSquare size={32} style={{ opacity: 0.3, margin: "0 auto 10px" }} /><div>No customer enquiries yet.</div></td></tr>}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {showSuccessModal && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(8px)" }}>
                <div className="g" style={{ maxWidth: 450, width: "100%", padding: 40, borderRadius: 24, textAlign: "center", border: "1px solid var(--o)" }}>
                  <div style={{ width: 72, height: 72, background: "rgba(255,115,0,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}><CheckCircle size={40} color="var(--o)" /></div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Product Saved!</h2>
                  <p style={{ color: "var(--sl3)", fontSize: 15, marginBottom: 32 }}>Your database has been updated successfully.</p>
                  <button className="bo" onClick={() => setShowSuccessModal(false)} style={{ padding: 14, borderRadius: 10, fontWeight: 700, width: "100%" }}>Add Another Product</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}