import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { PageBar, Loader } from '../components/ui';
import { LogIn, PlusCircle, Image, CheckCircle, LogOut, Edit, Trash2, X, ArrowLeft, Package, MessageSquare, Wand2, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

//  Dynamic 3-Tier Category Data Structure 
const CATEGORY_DATA = {
  Glass: {
    Interior: ["Toughened Glass", "Laminated Glass", "Frosted Glass", "Decorative / Art Glass", "Clear Glass", "Mirrors"],
    Exterior: ["Toughened Glass", "Reflective Glass", "Double Glazed Unit (DGU)", "Laminated Glass", "Tinted Glass"],
    Other: ["Custom / Other"]
  },
  Plywoods: {
    "Commercial (MR)": ["Hardwood", "Alternate Core", "Pine" ],
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

// 🌟 Image Compressor & WebP Converter Logic 🌟
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

        // Max Width for Website Images (Keep quality high, reduce unnecessary massive sizes)
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

        // Convert to WebP format with 80% quality (0.8)
        canvas.toBlob((blob) => {
          if (blob) {
            // Get original file name without extension and append .webp
            const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const newFile = new File([blob], `${originalName}.webp`, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
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
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(''); // Added Preview State
  
  const [customSub, setCustomSub] = useState('');
  const [customType, setCustomType] = useState('');

  const [uploading, setUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [productsList, setProductsList] = useState([]);
  const [enquiriesList, setEnquiriesList] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 🌟 Handle Image Upload & Auto Convert to WebP 🌟
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show instant preview
      setImagePreview(URL.createObjectURL(file));
      setStatusMessage('⏳ Optimizing Image to WebP...');

      try {
        const optimizedWebPFile = await compressAndConvertToWebP(file);
        setImageFile(optimizedWebPFile);
        setStatusMessage('✅ Image Compressed & Converted to WebP!');
        setTimeout(() => setStatusMessage(''), 3000);
      } catch (err) {
        console.error("Compression Error:", err);
        setImageFile(file); // Fallback to original if conversion fails
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
    setEditingId(null);
    setName('');
    setCategory('Glass');
    setSubcategory('Interior');
    setProductType('');
    setBrand('');
    setPriceInput('');
    setPriceUnit('Sqft');
    setSize('');
    setThickness('');
    setDescription('');
    setImageFile(null);
    setImagePreview('');
    setCustomSub('');
    setCustomType('');
    if(document.getElementById('imageInput')) document.getElementById('imageInput').value = '';
    setStatusMessage('');
  };

  const fileToGenerativePart = async (file) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const generateDescription = async () => {
    if (!name || !category) {
      setStatusMessage('❌ Please enter Product Name and Main Category to generate description!');
      return;
    }

    setIsGenerating(true);
    setStatusMessage('⏳ AI is writing the description...');
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Google Gemini API Key is missing in .env");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

      const finalSubcategory = subcategory === 'Custom / Other' ? customSub : subcategory;
      const finalType = productType === 'Custom / Other' ? customType : productType;

const prompt = `
        You are a professional copywriter for "Sri Meenakshi Traders" in Perambur, Chennai. 
        We are the leading traders of premium glass, plywood, UPVC, and interior hardware.
        
        Product Name: ${name}
        Category: ${category}
        Subcategory: ${finalSubcategory || 'General'}
        Type: ${finalType || 'General'}
        
        Task: 
        1. Write a highly attractive, professional product description in exactly 2 or 3 sentences. 
        2. Highlight quality, durability, and aesthetics. 
        3. Mention that we are the best choice in Chennai for this product.
        4. Include a subtle call to action like "Visit our showroom in Perambur".
        5. Do NOT use hashtags or emojis.
        6. Write it in simple English so Indian customers can easily understand.
      `;
      let aiInput = [prompt];

      if (imageFile) {
        const imagePart = await fileToGenerativePart(imageFile);
        aiInput.push(imagePart);
      }

      const result = await model.generateContent(aiInput);
      const responseText = await result.response.text();
      
      setDescription(responseText.trim());
      setStatusMessage('✅ AI Description generated successfully!');
    } // Admin.jsx -ல் உள்ள catch பிளாக்கை இப்படி வைத்திருந்தால் இந்த பெரிய error வராது:
catch (error) {
  console.error("AI Error:", error);
  setStatusMessage("❌ AI generation failed. Please try again.");

    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category) {
      setStatusMessage('❌ Product Name and Category are required!');
      return;
    }

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
        if (/^[\d.]+$/.test(finalPrice)) {
          finalPrice = priceUnit !== 'None' ? `₹ ${finalPrice} / ${priceUnit}` : `₹ ${finalPrice}`;
        } else if (!finalPrice.includes('₹') && !finalPrice.includes('RS') && priceUnit !== 'None') {
          finalPrice = `₹ ${finalPrice} / ${priceUnit}`;
        }
      }

      const finalSubcategory = subcategory === 'Custom / Other' ? customSub : subcategory;
      const finalType = productType === 'Custom / Other' ? customType : productType;

      const productData = {
        name: name.trim(),
        category: category.trim(),
        subcategory: finalSubcategory.trim() || null,
        product_type: finalType.trim() || null,
        brand: toPascalCase(brand.trim()) || null,
        price: finalPrice || null,
        size: toPascalCase(size.trim()) || null,
        thickness: toPascalCase(thickness.trim()) || null,
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

      resetForm();
      fetchData();
      setShowSuccessModal(true); 

    } catch (err) {
      console.error(err);
      setStatusMessage(`❌ Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setName(product.name || '');
    setCategory(product.category || 'Glass');
    
    const sub = product.subcategory || '';
    const availableSubs = Object.keys(CATEGORY_DATA[product.category || 'Glass'] || {});
    if (availableSubs.includes(sub)) {
      setSubcategory(sub);
      setCustomSub('');
    } else {
      setSubcategory('Custom / Other');
      setCustomSub(sub);
    }

    const pType = product.product_type || '';
    const availableTypes = CATEGORY_DATA[product.category || 'Glass']?.[sub] || [];
    if (availableTypes.includes(pType)) {
      setProductType(pType);
      setCustomType('');
    } else {
      setProductType('Custom / Other');
      setCustomType(pType);
    }

    setBrand(product.brand || '');

    const rawPrice = product.price || '';
    let val = '';
    let unit = 'Sqft';
    
    if (rawPrice) {
      if (rawPrice.includes('/')) {
        const parts = rawPrice.split('/');
        val = parts[0].replace(/[^\d.]/g, '').trim(); 
        if (!val) val = parts[0].trim();
        const rawUnit = parts[1].trim().toLowerCase();
        if (rawUnit.includes('sqft') || rawUnit.includes('sq.ft')) unit = 'Sqft';
        else if (rawUnit.includes('inch')) unit = 'Inch';
        else if (rawUnit.includes('meter') && !rawUnit.includes('centi')) unit = 'Meter';
        else if (rawUnit.includes('centi') || rawUnit.includes('cm')) unit = 'Centimeter';
        else if (rawUnit.includes('piece') || rawUnit.includes('pc')) unit = 'Piece';
        else if (rawUnit.includes('kg') || rawUnit.includes('kilo')) unit = 'Kg';
        else if (rawUnit.includes('rft') || rawUnit.includes('running')) unit = 'Rft';
        else unit = 'None';
      } else {
        val = rawPrice.replace(/[^\d.]/g, '').trim();
        if (!val) val = rawPrice.trim();
        unit = 'None';
      }
    }

    setPriceInput(val);
    setPriceUnit(unit);
    setSize(product.size || '');
    setThickness(product.thickness || '');
    setDescription(product.description || '');
    setImagePreview(product.image_url || ''); // Set existing image preview
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id, productName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${productName}"?`);
    if (!confirmDelete) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const { error } = await supabase.from('enquiries').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      alert("Error: " + err.message);
    }
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
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.03)", border: "1px solid var(--brd)", borderRadius: 8, color: "#fff" }} />
                </div>
                {loginError && <div style={{ color: "#ef4444", fontSize: 14, fontWeight: 500 }}>{loginError}</div>}
                <button type="submit" className="bo" style={{ width: "100%", padding: 14, borderRadius: 8, marginTop: 10, fontWeight: 700 }}>Log In</button>
              </form>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 900, margin: "0 auto", animation: "fadeUp .5s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, borderBottom: "1px solid var(--brd)", paddingBottom: 16, flexWrap: "wrap", gap: 16 }}>
              <div>
                <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 38, fontWeight: 800 }}>Welcome Admin</h1>
                <p style={{ color: "var(--sl3)", fontSize: 14 }}>Manage Sri Meenakshi Glass And Plywoods Traders Database</p>
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

            {/* 🌟 TABS BUTTONS 🌟 */}
            <div style={{ display: "flex", gap: 16, marginBottom: 32, borderBottom: "1px solid var(--brd)", paddingBottom: 16 }}>
              <button 
                onClick={() => setActiveTab('products')} 
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", fontSize: 15, fontWeight: 600, borderRadius: 8, cursor: "pointer", transition: "all 0.2s", background: activeTab === 'products' ? "var(--o)" : "transparent", color: activeTab === 'products' ? "#fff" : "var(--sl)", border: "none" }}>
                <Package size={18} /> Manage Products
              </button>
              <button 
                onClick={() => setActiveTab('enquiries')} 
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", fontSize: 15, fontWeight: 600, borderRadius: 8, cursor: "pointer", transition: "all 0.2s", background: activeTab === 'enquiries' ? "var(--o)" : "transparent", color: activeTab === 'enquiries' ? "#fff" : "var(--sl)", border: "none" }}>
                <MessageSquare size={18} /> Customer Enquiries
                {enquiriesList.length > 0 && (
                  <span style={{ background: activeTab === 'enquiries' ? "#fff" : "var(--o)", color: activeTab === 'enquiries' ? "var(--o)" : "#fff", padding: "2px 8px", borderRadius: 20, fontSize: 12 }}>{enquiriesList.length}</span>
                )}
              </button>
            </div>

            {/* ================= PRODUCTS TAB ================= */}
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
                      {subcategory === 'Custom / Other' && (
                        <input type="text" placeholder="Type custom subcategory..." value={customSub} onChange={e => setCustomSub(e.target.value)} style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.02)", border: "1px dashed var(--o)", borderRadius: 8, color: "#fff" }} />
                      )}
                    </div>
                    <div>
                      <label style={{ fontSize: 13, color: "var(--sl3)", display: "block", marginBottom: 6, fontWeight: 600 }}>Product Type / Variety</label>
                      <select value={productType} onChange={e => setProductType(e.target.value)} style={{ width: "100%", padding: 12, background: "#121214", border: "1px solid var(--brd)", borderRadius: 8, color: "#fff", outline: "none", marginBottom: productType === 'Custom / Other' ? 10 : 0 }}>
                        {(CATEGORY_DATA[category]?.[subcategory] || []).map(t => <option key={t} value={t}>{t}</option>)}
                        <option value="Custom / Other">Custom / Other</option>
                      </select>
                      {productType === 'Custom / Other' && (
                        <input type="text" placeholder="Type custom product type..." value={customType} onChange={e => setCustomType(e.target.value)} style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.02)", border: "1px dashed var(--o)", borderRadius: 8, color: "#fff" }} />
                      )}
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
                          <option value="Sqft">Sqft</option>
                          <option value="Inch">Inch</option>
                          <option value="Meter">Meter</option>
                          <option value="Centimeter">Centimeter</option>
                          <option value="Piece">Piece</option>
                          <option value="Kg">Kg</option>
                          <option value="Rft">Rft</option>
                          <option value="None">None</option>
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

                  {/* 🌟 AI Description Section 🌟 */}
                  <div>
                    <label style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 13, color: "var(--sl3)", marginBottom: 6, fontWeight: 600 }}>
                      <span>Product Description</span>
                      <button 
                        type="button" 
                        onClick={generateDescription} 
                        disabled={isGenerating}
                        style={{
                          background: "linear-gradient(135deg, #a855f7, #ec4899)", color: "#fff", border: "none", 
                          padding: "6px 12px", borderRadius: "8px", cursor: isGenerating ? "not-allowed" : "pointer", 
                          display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, opacity: isGenerating ? 0.7 : 1
                        }}
                      >
                        {isGenerating ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Wand2 size={14} />}
                        {isGenerating ? "AI Generating..." : "AI Auto Write"}
                      </button>
                    </label>
                    <textarea 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      rows="3" 
                      placeholder="Type your description or click 'AI Auto Write'..."
                      style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.02)", border: "1px solid var(--brd)", borderRadius: 8, color: "#fff", resize: "none" }}
                    ></textarea>
                  </div>

                  {/* 🌟 Improved Image Upload UI with Preview 🌟 */}
                  <div style={{ background: "rgba(255,255,255,0.01)", border: "1px dashed var(--brd)", padding: 20, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 12, border: "2px solid var(--o)" }} />
                    ) : (
                      <Image size={36} color="var(--sl3)" style={{ opacity: 0.6 }} />
                    )}
                    
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
                              <td style={{ padding: "12px 8px", fontWeight: 600 }}>
                                {p.name}
                                <div style={{ fontSize: 11, color: "var(--sl)", marginTop: 4, fontWeight: 400 }}>{p.category} › {p.subcategory || '-'} › {p.product_type || '-'}</div>
                              </td>
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

            {/* ================= ENQUIRIES TAB ================= */}
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
                          <th style={{ padding: "12px 8px" }}>Service</th>
                          <th style={{ padding: "12px 8px" }}>Message</th>
                          <th style={{ padding: "12px 8px", textAlign: "right" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enquiriesList.map((enq) => (
                          <tr key={enq.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", verticalAlign: "top" }}>
                            <td style={{ padding: "12px 8px", fontSize: 13, color: "var(--sl)" }}>{new Date(enq.created_at).toLocaleDateString()}</td>
                            <td style={{ padding: "12px 8px" }}>
                              <div style={{ fontWeight: 600, color: "var(--w)", marginBottom: 4 }}>{enq.name}</div>
                              <div style={{ fontSize: 13, color: "var(--sl3)" }}>{enq.phone}</div>
                            </td>
                            <td style={{ padding: "12px 8px" }}>
                              <span style={{ background: "rgba(249,115,22,0.1)", color: "var(--o)", padding: "4px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>{enq.service}</span>
                            </td>
                            <td style={{ padding: "12px 8px", fontSize: 13, color: "var(--sl3)", maxWidth: 250 }}>{enq.message || '-'}</td>
                            <td style={{ padding: "12px 8px", textAlign: "right" }}>
                              <button onClick={() => handleDeleteEnquiry(enq.id)} style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))}
                        {enquiriesList.length === 0 && (
                          <tr><td colSpan="5" style={{ padding: "60px", textAlign: "center", color: "var(--sl)" }}><MessageSquare size={32} style={{ opacity: 0.3, margin: "0 auto 10px" }} /><div>No customer enquiries yet.</div></td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Success Modal */}
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