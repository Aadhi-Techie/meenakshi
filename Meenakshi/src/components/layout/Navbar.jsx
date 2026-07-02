import { useState, useEffect, useMemo, useRef } from 'react';
import { Menu, X, Search, Globe, MapPin, ChevronDown, MessageCircle, Sun, Moon } from "lucide-react";
import useScrolled from '../../hooks/useScrolled';
import { PROD_LIST as PL } from '../../constants/data';
import { WA, MAPS } from '../../constants/config';
import useTheme from '../../hooks/useTheme';

export default function Navbar({ page, go, lang, setLang, t }) {
  const scrolled = useScrolled();
  const [mob, setMob]         = useState(false);
  const [mobProd, setMobProd] = useState(false);
  const [q, setQ]             = useState("");
  const [qFocus, setQFocus]   = useState(false);
  const qRef                  = useRef();

  const isTamil = lang === "ta";

  useEffect(() => {
    const timer = setTimeout(() => { setMob(false); setMobProd(false); }, 0);
    return () => clearTimeout(timer);
  }, [page]);

  const res = useMemo(() =>
    q.length > 0 ? PL.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      (p.tn && p.tn.includes(q)) ||
      p.tag.toLowerCase().includes(q.toLowerCase()) ||
      p.id.toLowerCase().includes(q.toLowerCase())
    ) : [],
    [q]
  );

  const { theme, toggleTheme } = useTheme();
  const NAV_H = 72;

  const handleWhatsAppClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag('event', 'whatsapp_click', {
        'event_category': 'Engagement',
        'event_label': 'WhatsApp Chat Initiated',
        'value': 1
      });
    }
  };

  return (
    <>
      <header>
        <nav role="navigation" aria-label="Main Navigation" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 900, padding: "0 24px", transition: "all .4s", background: scrolled ? (theme === 'light' ? "rgba(255,255,255,0.95)" : "rgba(3,9,24,.93)") : "transparent", backdropFilter: scrolled ? "blur(26px)" : "none", borderBottom: scrolled ? (theme === 'light' ? "1px solid rgba(0,0,0,0.08)" : "1px solid var(--brd)") : "none", boxShadow: scrolled ? (theme === 'light' ? "0 4px 30px rgba(0,0,0,0.05)" : "0 4px 40px rgba(0,0,0,.45)") : "none" }}>

          <div style={{ maxWidth: 1280, margin: "0 auto", height: NAV_H, display: "flex", alignItems: "center", gap: 18 }}>

            {/* Logo */}
            <a href="/" onClick={(e) => { e.preventDefault(); go("home"); }} style={{ cursor: "pointer", display: "flex", alignItems: "center", flexShrink: 0, textDecoration: "none" }} aria-label="Sree Meenakshi Glass and Plywoods - Home" title="Sree Meenakshi Glass and Plywoods - Home">
              <img src="/apple-touch-icon.webp" alt="Sree Meenakshi Glass and Plywoods" style={{ height: 65, width: "auto", objectFit: "contain", borderRadius: 8 }} />
            </a>

            {/* Desktop Nav */}
            <div className="xl" style={{ flex: 1, display: "flex", alignItems: "center", gap: 26, justifyContent: "center" }}>

              <a href="/" className={`nl ${page === "home" ? "on" : ""}`} onClick={(e) => { e.preventDefault(); go("home"); }} style={{ textDecoration: "none" }}>
                {t.nav.home}
              </a>

              {/* ✅ FIX WARN 2: span → button for keyboard accessibility */}
              <div className="dd">
                <button className={`nl ${page.startsWith("category-") ? "on" : ""}`} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit" }}>
                  {t.nav.prods} <ChevronDown size={13} />
                </button>
                <div className="ddm gd">
                  {PL.map(p => (
                    <a key={p.id} href={`/category-${p.id}`} className="ddi" onClick={(e) => { e.preventDefault(); go(`category-${p.id}`); }} style={{ textDecoration: "none" }}>
                      <span style={{ fontSize: 17 }}>{p.icon}</span>
                      <div>
                        <div style={{ color: "var(--w)", fontWeight: 600, fontSize: 13 }}>{isTamil && p.tn ? p.tn : p.name}</div>
                        <div style={{ fontSize: 10.5, color: "var(--sl3)" }}>{p.tag}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <a href="/services" className={`nl ${page === "services" ? "on" : ""}`} onClick={(e) => { e.preventDefault(); go("services"); }} style={{ textDecoration: "none" }}>
                {t.nav.services}
              </a>

              <a href="/gallery" className={`nl ${page === "gallery" ? "on" : ""}`} onClick={(e) => { e.preventDefault(); go("gallery"); }} style={{ textDecoration: "none" }}>
                {t.nav.gallery}
              </a>

              <a href="/about" className={`nl ${page === "about" ? "on" : ""}`} onClick={(e) => { e.preventDefault(); go("about"); }} style={{ textDecoration: "none" }}>
                {t.nav.about}
              </a>

              <a href="/contact" className={`nl ${page === "contact" ? "on" : ""}`} onClick={(e) => { e.preventDefault(); go("contact"); }} style={{ textDecoration: "none" }}>
                {t.nav.contact}
              </a>
              {/* Bulk Order Link */}
              <a href="/bulk-order" className={`nl ${page === "bulk-order" ? "on" : ""}`} onClick={(e) => { e.preventDefault(); go("bulk-order"); }} style={{ textDecoration: "none", color: "var(--o)", fontWeight: 700 }}>
                 Bulk Order
              </a>

              <a href={MAPS} target="_blank" rel="noopener noreferrer" className="nl" style={{ display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }} title="View on Google Maps">
                <MapPin size={14} color="var(--o)" /> {t.nav.location}
              </a>
            </div>

            {/* Desktop Right Side */}
            <div className="xl" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>

              {/* Desktop Search */}
              <div ref={qRef} style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.06)", border: `1px solid ${qFocus ? "var(--o)" : "rgba(255,255,255,.09)"}`, borderRadius: 9, padding: "7px 12px", transition: "border-color .25s" }}>
                  <Search size={13} color="var(--sl2)" />
                  <input
                    className="inp"
                    value={q}
                    placeholder={isTamil ? "தேடுங்கள்..." : "Search products..."}
                    onFocus={() => setQFocus(true)}
                    onBlur={() => setTimeout(() => setQFocus(false), 200)}
                    onChange={e => setQ(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && q.trim() !== "") { go(`search-${encodeURIComponent(q.trim())}`); setQ(""); setQFocus(false); } }}
                    style={{ width: 130, fontSize: 13, padding: 0, border: "none", background: "none", boxShadow: "none" }}
                  />
                  {q && <button onClick={() => setQ("")} aria-label="Clear Search" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sl2)", padding: 0 }}><X size={11} /></button>}
                </div>

                {qFocus && (
                  <div className="gd" style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, borderRadius: 12, overflow: "hidden", zIndex: 700, background: "var(--bg)", border: "1px solid var(--brd)" }}>
                    {res.length > 0 ? res.map(p => (
                      // ✅ FIX FAIL 1: onKeyDown Enter added for keyboard accessibility
                      <a key={p.id} href={`/category-${p.id}`}
                        onMouseDown={(e) => { e.preventDefault(); go(`category-${p.id}`); setQ(""); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { go(`category-${p.id}`); setQ(""); setQFocus(false); } }}
                        tabIndex={0}
                        style={{ textDecoration: "none", padding: "10px 15px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontSize: 13, transition: "background .18s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(249,115,22,.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <span style={{ fontSize: 18 }}>{p.icon}</span>
                        <div>
                          <div style={{ color: "var(--w)", fontWeight: 600 }}>{isTamil && p.tn ? p.tn : p.name}</div>
                          <div style={{ fontSize: 11, color: "var(--sl3)" }}>{p.tag}</div>
                        </div>
                      </a>
                    )) : <div style={{ padding: "15px", textAlign: "center", fontSize: 13, color: "var(--sl3)" }}>{isTamil ? "எதுவும் இல்லை" : "No results found"}</div>}
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button onClick={toggleTheme} aria-label="Toggle Theme" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.09)", color: "var(--sl)", borderRadius: 9, cursor: "pointer" }}>
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* Language Toggle */}
              <button onClick={() => setLang(l => l === "en" ? "ta" : "en")} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.09)", color: "var(--sl)", padding: "7px 12px", borderRadius: 9, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                <Globe size={12} />{t.langBtn}
              </button>

              {/* WhatsApp Button */}
              <a href={WA} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Us" onClick={handleWhatsAppClick} style={{ width: 37, height: 37, borderRadius: 9, background: "linear-gradient(135deg,#25d366,#128c7e)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--w)", textDecoration: "none" }}>
                <MessageCircle size={17} />
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMob(!mob)} className="mob" aria-label={mob ? "Close Menu" : "Open Menu"} aria-expanded={mob} aria-controls="mobile-menu" style={{ marginLeft: "auto", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.09)", color: "var(--w)", padding: 9, borderRadius: 9, cursor: "pointer" }}>
              {mob ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* ✅ FIX FAIL 2: aria-hidden on backdrop */}
      <div className={`mmo ${mob ? "open" : ""}`} onClick={() => setMob(false)} aria-hidden="true" />

      {/* Mobile Menu ➡️ ✅ 🌟 திருத்தப்பட்ட பகுதி: display மற்றும் inert இணைக்கப்பட்டுள்ளது */}
      <div 
        id="mobile-menu" 
        className={`mm gd ${mob ? "open" : ""}`} 
        aria-hidden={!mob}
        inert={!mob}
        style={{ display: mob ? 'block' : 'none' }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 22px", borderBottom: "1px solid var(--brd)" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 18, color: "var(--w)" }}>SreeMeenakshi</div>
          <button onClick={() => setMob(false)} aria-label="Close Mobile Menu" style={{ background: "rgba(255,255,255,.07)", border: "1px solid var(--brd)", color: "var(--w)", padding: 7, borderRadius: 8, cursor: "pointer" }}><X size={16} /></button>
        </div>

        {/* Mobile Search */}
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--brd)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 9, padding: "10px 14px" }}>
            <Search size={14} color="var(--sl2)" />
            <input
              className="inp"
              value={q}
              placeholder={isTamil ? "தேடு…" : "Search products…"}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && q.trim() !== "") { go(`search-${encodeURIComponent(q.trim())}`); setQ(""); setMob(false); } }}
              style={{ flex: 1, fontSize: 14, padding: 0, border: "none", background: "none" }}
            />
          </div>
          {q.length > 0 && (
            <div style={{ marginTop: 8, background: "rgba(255,255,255,.04)", borderRadius: 10, overflow: "hidden", border: "1px solid var(--brd)" }}>
              {res.length > 0 ? res.map(p => (
                <a key={p.id} href={`/category-${p.id}`}
                  onClick={(e) => { e.preventDefault(); go(`category-${p.id}`); setQ(""); setMob(false); }}
                  style={{ textDecoration: "none", padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 9, fontSize: 13, borderBottom: "1px solid var(--brd)" }}
                >
                  <span style={{ fontSize: 18 }}>{p.icon}</span>
                  <span style={{ color: "var(--w)", fontWeight: 600 }}>{isTamil && p.tn ? p.tn : p.name}</span>
                </a>
              )) : <div style={{ padding: "15px", textAlign: "center", fontSize: 13, color: "var(--sl3)" }}>{isTamil ? "எதுவும் இல்லை" : "No results found"}</div>}
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>

          <a href="/" onClick={(e) => { e.preventDefault(); go("home"); setMob(false); }} style={{ textDecoration: "none", display: "block", padding: "14px 22px", borderBottom: "1px solid var(--brd)", cursor: "pointer", color: page === "home" ? "var(--o)" : "var(--sl)", fontSize: 15, fontWeight: 500 }}>
            {t.nav.home}
          </a>

          {/* ✅ FIX WARN 3: div → button for mobile accordion */}
          <div>
            <button onClick={() => setMobProd(!mobProd)} aria-expanded={mobProd} style={{ width: "100%", padding: "14px 22px", borderTop: "none", borderLeft: "none", borderRight: "none", borderBottom: "1px solid var(--brd)", cursor: "pointer", color: page.startsWith("category-") ? "var(--o)" : "var(--sl)", fontSize: 15, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", textAlign: "left" }}>
              <span>{t.nav.prods}</span>
              <div style={{ transition: "transform .28s", transform: mobProd ? "rotate(180deg)" : "rotate(0)" }}><ChevronDown size={16} /></div>
            </button>
            {mobProd && (
              <div style={{ background: "rgba(0,0,0,.25)", animation: "fadeIn .2s ease" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "12px 16px" }}>
                  {PL.map(p => (
                    <a key={p.id} href={`/category-${p.id}`}
                      onClick={(e) => { e.preventDefault(); go(`category-${p.id}`); setMob(false); }}
                      style={{ textDecoration: "none", padding: "10px 12px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, display: "flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 13, color: "var(--sl)" }}
                    >
                      <span style={{ fontSize: 16 }}>{p.icon}</span>
                      <span style={{ fontWeight: 600 }}>{isTamil && p.tn ? p.tn : p.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <a href="/services" onClick={(e) => { e.preventDefault(); go("services"); setMob(false); }} style={{ textDecoration: "none", display: "block", padding: "14px 22px", borderBottom: "1px solid var(--brd)", cursor: "pointer", color: page === "services" ? "var(--o)" : "var(--sl)", fontSize: 15, fontWeight: 500 }}>
            {t.nav.services}
          </a>

          <a href="/gallery" onClick={(e) => { e.preventDefault(); go("gallery"); setMob(false); }} style={{ textDecoration: "none", display: "block", padding: "14px 22px", borderBottom: "1px solid var(--brd)", cursor: "pointer", color: page === "gallery" ? "var(--o)" : "var(--sl)", fontSize: 15, fontWeight: 500 }}>
            {t.nav.gallery}
          </a>

          <a href="/about" onClick={(e) => { e.preventDefault(); go("about"); setMob(false); }} style={{ textDecoration: "none", display: "block", padding: "14px 22px", borderBottom: "1px solid var(--brd)", cursor: "pointer", color: page === "about" ? "var(--o)" : "var(--sl)", fontSize: 15, fontWeight: 500 }}>
            {t.nav.about}
          </a>

          <a href="/contact" onClick={(e) => { e.preventDefault(); go("contact"); setMob(false); }} style={{ textDecoration: "none", display: "block", padding: "14px 22px", borderBottom: "1px solid var(--brd)", cursor: "pointer", color: page === "contact" ? "var(--o)" : "var(--sl)", fontSize: 15, fontWeight: 500 }}>
            {t.nav.contact}
          </a>
          {/* Bulk Order Mobile */}
          <a href="/bulk-order" onClick={(e) => { e.preventDefault(); go("bulk-order"); setMob(false); }} style={{ textDecoration: "none", display: "block", padding: "14px 22px", borderBottom: "1px solid var(--brd)", cursor: "pointer", color: page === "bulk-order" ? "var(--o)" : "var(--sl)", fontSize: 15, fontWeight: 700 }}>
            Bulk Order
          </a>

          <a href={MAPS} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "flex", padding: "14px 22px", borderBottom: "1px solid var(--brd)", cursor: "pointer", color: "var(--o)", fontSize: 15, fontWeight: 500, alignItems: "center", gap: 8 }}>
            <MapPin size={16} /> {t.nav.location}
          </a>
        </div>

        {/* Mobile Bottom Buttons */}
        <div style={{ padding: "18px 22px", borderTop: "1px solid var(--brd)", display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={toggleTheme} aria-label="Toggle Theme" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "rgba(255,255,255,.05)", border: "1px solid var(--brd)", color: "var(--sl)", padding: 11, borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />} {theme === 'dark' ? "Light Mode" : "Dark Mode"}
          </button>
          <button onClick={() => setLang(l => l === "en" ? "ta" : "en")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "rgba(255,255,255,.05)", border: "1px solid var(--brd)", color: "var(--sl)", padding: 11, borderRadius: 9, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
            <Globe size={14} />{t.langBtn}
          </button>
          <a href={WA} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: "linear-gradient(135deg,#25d366,#128c7e)", color: "var(--w)", padding: 12, borderRadius: 9, fontWeight: 800, fontSize: 14, textDecoration: "none" }}>
            <MessageCircle size={17} />{t.wa}
          </a>
        </div>
      </div>
    </>
  );
}