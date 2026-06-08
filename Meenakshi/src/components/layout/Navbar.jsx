import { useState, useEffect, useMemo, useRef } from 'react';
import { Menu, X, Search, Globe, MapPin, ChevronDown, MessageCircle, Sun, Moon } from "lucide-react";
import useScrolled from '../../hooks/useScrolled';
import { PROD_LIST as PL } from '../../constants/data';
import { WA, MAPS } from '../../constants/config';
import useTheme from '../../hooks/useTheme';

export default function Navbar({ page, go, lang, setLang, t }) {
  const scrolled = useScrolled();
  const [mob, setMob] = useState(false);
  const [mobProd, setMobProd] = useState(false);
  const [q, setQ] = useState("");
  const [qFocus, setQFocus] = useState(false);
  const qRef = useRef();

  // மொழி தமிழ் தானா என்பதைக் கண்டறியும் லாஜிக்
  const isTamil = lang === "ta";

  useEffect(() => {
    const timer = setTimeout(() => { setMob(false); setMobProd(false); }, 0);
    return () => clearTimeout(timer);
  }, [page]);

  const res = useMemo(() =>
    q.length > 1 ? PL.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || (p.tn && p.tn.includes(q)) || p.tag.toLowerCase().includes(q.toLowerCase())) : [],
    [q]
  );
  
  const { theme, toggleTheme } = useTheme();
  
  const NAV_H = 72;

  return (
    <>
      {/* SEO Optimized Header & Nav */}
      <header>
        <nav 
          role="navigation" 
          aria-label="Main Navigation"
          style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 900, padding: "0 24px",
            transition: "all .4s",
            background: scrolled ? (theme === 'light' ? "rgba(255, 255, 255, 0.95)" : "rgba(3,9,24,.93)") : "transparent",
            backdropFilter: scrolled ? "blur(26px)" : "none",
            borderBottom: scrolled ? (theme === 'light' ? "1px solid rgba(0,0,0,0.08)" : "1px solid var(--brd)") : "none",
            boxShadow: scrolled ? (theme === 'light' ? "0 4px 30px rgba(0,0,0,0.05)" : "0 4px 40px rgba(0,0,0,.45)") : "none",
        }}>
          
          <div style={{ maxWidth: 1280, margin: "0 auto", height: NAV_H, display: "flex", alignItems: "center", gap: 18 }}>
            
            {/* Logo with SEO Alt Text */}
            <div onClick={() => go("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", flexShrink: 0 }} title="Sri Meenakshi Traders - Home">
              <img 
                src="/logo.png" 
                alt="Sri Meenakshi Traders - Best Glass, Plywood & Aluminium Dealers in Chennai" 
                style={{ height: 65, width: "auto", objectFit: "contain", borderRadius: 8 }} 
              />
            </div>
          
            <div className="xl" style={{ flex: 1, display: "flex", alignItems: "center", gap: 26, justifyContent: "center" }}>
              <span className={`nl ${page === "home" ? "on" : ""}`} onClick={() => go("home")}>{t.nav.home}</span>
              
              <div className="dd">
                <span className={`nl ${page.startsWith("category-") ? "on" : ""}`} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {t.nav.prods} <ChevronDown size={13} />
                </span>
                <div className="ddm gd">
                  {PL.map(p => (
                    <div key={p.id} className="ddi" onClick={() => go(`category-${p.id}`)}>
                      <span style={{ fontSize: 17 }}>{p.icon}</span>
                      <div>
                        {/* 👈 தமிழ் பெயர்களைக் காட்டும் லாஜிக் */}
                        <div style={{ color: "var(--w)", fontWeight: 600, fontSize: 13 }}>{isTamil && p.tn ? p.tn : p.name}</div>
                        <div style={{ fontSize: 10.5, color: "var(--sl3)" }}>{p.tag}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <span className={`nl ${page === "services" ? "on" : ""}`} onClick={() => go("services")}>{t.nav.services}</span>
              <span className={`nl ${page === "gallery" ? "on" : ""}`} onClick={() => go("gallery")}>{t.nav.gallery}</span>
              <span className={`nl ${page === "about" ? "on" : ""}`} onClick={() => go("about")}>{t.nav.about}</span>
              <span className={`nl ${page === "contact" ? "on" : ""}`} onClick={() => go("contact")}>{t.nav.contact}</span>

              <span className="nl" onClick={() => window.open(MAPS, "_blank")} style={{ display: "flex", alignItems: "center", gap: 4 }} title="View on Google Maps">
                <MapPin size={14} color="var(--o)" /> {t.nav.location}
              </span>
            </div>

            <div className="xl" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              {/* Search Form */}
              <div ref={qRef} style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.06)", border: `1px solid ${qFocus ? "var(--o)" : "rgba(255,255,255,.09)"}`, borderRadius: 9, padding: "7px 12px", transition: "border-color .25s" }}>
                  <Search size={13} color="var(--sl2)" />
                  <input 
                    className="inp" 
                    value={q} 
                    placeholder={isTamil ? "தேடு…" : "Search…"}
                    aria-label="Search Products"
                    onFocus={() => setQFocus(true)} 
                    onBlur={() => setTimeout(() => setQFocus(false), 200)}
                    onChange={e => setQ(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && q.trim() !== "") {
                        go(`search-${encodeURIComponent(q.trim())}`);
                        setQ("");
                        setQFocus(false);
                      }
                    }}
                    style={{ width: 130, fontSize: 13, padding: 0, border: "none", background: "none", boxShadow: "none" }} 
                  />
                  {q && <button aria-label="Clear search" onClick={() => setQ("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sl2)", lineHeight: 0, padding: 0 }}><X size={11} /></button>}
                </div>
                
                {qFocus && res.length > 0 && (
                  <div className="gd" style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, borderRadius: 12, overflow: "hidden", zIndex: 700 }}>
                    {res.map(p => (
                      <div key={p.id} onMouseDown={() => { go(`category-${p.id}`); setQ(""); }}
                        style={{ padding: "10px 15px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, transition: "background .18s", fontSize: 13 }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(249,115,22,.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <span style={{ fontSize: 18 }}>{p.icon}</span>
                        <div>
                          {/* 👈 தேடல் முடிவுகளிலும் தமிழ் பெயர் */}
                          <div style={{ color: "var(--w)", fontWeight: 600 }}>{isTamil && p.tn ? p.tn : p.name}</div>
                          <div style={{ fontSize: 11, color: "var(--sl3)" }}>{p.tag}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* THEME TOGGLE BUTTON - DESKTOP */}
              <button 
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.09)", color: "var(--sl)", borderRadius: 9, cursor: "pointer", transition: "all .22s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--o)"; e.currentTarget.style.color = "var(--o)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.09)"; e.currentTarget.style.color = "var(--sl)"; }}>
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* LANGUAGE TOGGLE */}
              <button 
                onClick={() => setLang(l => l === "en" ? "ta" : "en")}
                aria-label="Change Language"
                style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.09)", color: "var(--sl)", padding: "7px 12px", borderRadius: 9, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "'Outfit',sans-serif", transition: "all .22s", whiteSpace: "nowrap" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--o)"; e.currentTarget.style.color = "var(--o)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.09)"; e.currentTarget.style.color = "var(--sl)"; }}>
                <Globe size={12} />{t.langBtn}
              </button>
              
              {/* WhatsApp Button */}
              <a 
                href={WA} target="_blank" rel="noopener noreferrer"
                aria-label="Chat with Sri Meenakshi Traders on WhatsApp"
                style={{ width: 37, height: 37, borderRadius: 9, background: "linear-gradient(135deg,#25d366,#128c7e)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--w)", flexShrink: 0 }}>
                <MessageCircle size={17} />
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMob(!mob)} 
              className="mob"
              aria-label="Toggle Mobile Menu"
              aria-expanded={mob}
              style={{ marginLeft: "auto", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.09)", color: "var(--w)", padding: 9, borderRadius: 9, cursor: "pointer", lineHeight: 0 }}>
              {mob ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mmo ${mob ? "open" : ""}`} onClick={() => setMob(false)} />

      <div className={`mm gd ${mob ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Mobile Navigation">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 22px", borderBottom: "1px solid var(--brd)" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 18, color: "var(--w)" }}>Sri Meenakshi</div>
          <button aria-label="Close Menu" onClick={() => setMob(false)} style={{ background: "rgba(255,255,255,.07)", border: "1px solid var(--brd)", color: "var(--w)", padding: 7, borderRadius: 8, cursor: "pointer", lineHeight: 0 }}><X size={16} /></button>
        </div>

        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--brd)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 9, padding: "10px 14px" }}>
            <Search size={14} color="var(--sl2)" />
            <input 
              className="inp" 
              value={q} 
              placeholder={isTamil ? "தயாரிப்பு தேடு…" : "Search products…"}
              aria-label="Search Mobile"
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && q.trim() !== "") {
                  go(`search-${encodeURIComponent(q.trim())}`);
                  setQ("");
                  setMob(false);
                }
              }}
              style={{ flex: 1, fontSize: 14, padding: 0, border: "none", background: "none", boxShadow: "none" }} 
            />
          </div>
          {res.length > 0 && (
            <div style={{ marginTop: 8, background: "rgba(255,255,255,.04)", borderRadius: 10, overflow: "hidden", border: "1px solid var(--brd)" }}>
              {res.map(p => (
                <div key={p.id} onClick={() => { go(`category-${p.id}`); setQ(""); }}
                  style={{ padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 9, fontSize: 13, borderBottom: "1px solid var(--brd)" }}>
                  <span style={{ fontSize: 18 }}>{p.icon}</span>
                  {/* 👈 மொபைல் தேடல் முடிவுகளிலும் தமிழ் பெயர் */}
                  <span style={{ color: "var(--w)", fontWeight: 600 }}>{isTamil && p.tn ? p.tn : p.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          <div onClick={() => { go("home"); setMob(false); }} style={{ padding: "14px 22px", borderBottom: "1px solid var(--brd)", cursor: "pointer", color: page === "home" ? "var(--o)" : "var(--sl)", fontSize: 15, fontWeight: 500 }}>{t.nav.home}</div>
          
          <div>
            <div onClick={() => setMobProd(!mobProd)}
              style={{ padding: "14px 22px", borderBottom: "1px solid var(--brd)", cursor: "pointer", color: page.startsWith("category-") ? "var(--o)" : "var(--sl)", fontSize: 15, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>{t.nav.prods}</span>
              <div style={{ transition: "transform .28s", transform: mobProd ? "rotate(180deg)" : "rotate(0)" }}>
                <ChevronDown size={16} />
              </div>
            </div>
            {mobProd && (
              <div style={{ background: "rgba(0,0,0,.25)", animation: "fadeIn .2s ease" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "12px 16px" }}>
                  {PL.map(p => (
                    <div key={p.id} onClick={() => { go(`category-${p.id}`); setMob(false); }}
                      style={{ padding: "10px 12px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, display: "flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 13, color: "var(--sl)", transition: "all .2s" }}>
                      <span style={{ fontSize: 16 }}>{p.icon}</span>
                      {/* 👈 மொபைல் தயாரிப்புகள் பட்டியலிலும் தமிழ் பெயர் */}
                      <span style={{ fontWeight: 600 }}>{isTamil && p.tn ? p.tn : p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div onClick={() => { go("services"); setMob(false); }} style={{ padding: "14px 22px", borderBottom: "1px solid var(--brd)", cursor: "pointer", color: page === "services" ? "var(--o)" : "var(--sl)", fontSize: 15, fontWeight: 500 }}>{t.nav.services}</div>
          <div onClick={() => { go("gallery"); setMob(false); }} style={{ padding: "14px 22px", borderBottom: "1px solid var(--brd)", cursor: "pointer", color: page === "gallery" ? "var(--o)" : "var(--sl)", fontSize: 15, fontWeight: 500 }}>{t.nav.gallery}</div>
          <div onClick={() => { go("about"); setMob(false); }} style={{ padding: "14px 22px", borderBottom: "1px solid var(--brd)", cursor: "pointer", color: page === "about" ? "var(--o)" : "var(--sl)", fontSize: 15, fontWeight: 500 }}>{t.nav.about}</div>
          <div onClick={() => { go("contact"); setMob(false); }} style={{ padding: "14px 22px", borderBottom: "1px solid var(--brd)", cursor: "pointer", color: page === "contact" ? "var(--o)" : "var(--sl)", fontSize: 15, fontWeight: 500 }}>{t.nav.contact}</div>
          
          <div onClick={() => window.open(MAPS, "_blank")} style={{ padding: "14px 22px", borderBottom: "1px solid var(--brd)", cursor: "pointer", color: "var(--o)", fontSize: 15, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
            <MapPin size={16} /> {t.nav.location}
          </div>
        </div>

        <div style={{ padding: "18px 22px", borderTop: "1px solid var(--brd)", display: "flex", flexDirection: "column", gap: 10 }}>
          
          {/* THEME TOGGLE BUTTON - MOBILE */}
          <button 
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "rgba(255,255,255,.05)", border: "1px solid var(--brd)", color: "var(--sl)", padding: 11, borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />} 
            {theme === 'dark' ? "Light Mode" : "Dark Mode"}
          </button>

          {/* LANGUAGE TOGGLE - MOBILE */}
          <button 
            onClick={() => setLang(l => l === "en" ? "ta" : "en")}
            aria-label="Change Language"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "rgba(255,255,255,.05)", border: "1px solid var(--brd)", color: "var(--sl)", padding: 11, borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>
            <Globe size={14} />{t.langBtn}
          </button>

          {/* WA Link Mobile */}
          <a href={WA} target="_blank" rel="noopener noreferrer"
            aria-label="Chat with Us on WhatsApp"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: "linear-gradient(135deg,#25d366,#128c7e)", color: "var(--w)", padding: 12, borderRadius: 9, fontWeight: 800, fontSize: 14, fontFamily: "'Outfit',sans-serif", textDecoration: "none" }}>
            <MessageCircle size={17} />{t.wa}
          </a>
        </div>
      </div>
    </>
  );
}