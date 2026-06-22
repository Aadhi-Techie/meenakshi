import { useState, useCallback, useEffect } from 'react';
import './styles/globals.css';
import { LANG } from './constants/translations';
import { PageBar, Loader } from './components/ui';
import { Navbar, Footer } from './components/layout';

import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Services from './components/sections/Services';
import GalleryPreview from './components/sections/GalleryPreview';
import Testimonials from './components/sections/Testimonials';
import Contact from './components/sections/Contact';

import CategoryPage from './pages/CategoryPage';
import GalleryCategoryPage from './pages/GalleryCategoryPage';
import LoginPage from './pages/LoginPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import Admin from './pages/Admin';
import { MessageCircle } from 'lucide-react';
import BrandSlider from './components/BrandSlider';
import { PROD_LIST as PL } from './constants/data'; // Category titles ku

// --- Page Wrappers ---
const AboutPage    = ({ go, t })       => <div style={{ paddingTop: 72 }}><PageBar /><About go={go} t={t} /></div>;
const ServicesPage = ({ t })           => <div style={{ paddingTop: 72 }}><PageBar /><Services t={t} /></div>;
const ContactPage  = ({ t, lang })     => <div style={{ paddingTop: 72 }}><PageBar /><Contact t={t} currentLang={lang} /></div>;

const HomePage = ({ go, t, lang }) => (
  <>
    <Hero go={go} t={t} />
    <BrandSlider t={t} />
    <About go={go} t={t} />
    <Services t={t} />
    <GalleryPreview go={go} t={t} />
    <Testimonials t={t} />
    <Contact go={go} t={t} currentLang={lang} />
  </>
);

const getInitialPage = () => {
  const path = window.location.pathname.replace(/^\/+/, '');
  return path ? path : 'home';
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(getInitialPage());
  const [lang, setLang]       = useState("en");

  const t = LANG[lang];

  // ✅ FIX 1: Browser Back / Forward button support
  useEffect(() => {
    const handleBackButton = (event) => {
      if (event.state && event.state.page) {
        setPage(event.state.page);
      } else {
        setPage(getInitialPage());
      }
    };

    window.addEventListener('popstate', handleBackButton);

    // First load: history state set pannunga
    if (!window.history.state) {
      window.history.replaceState({ page: getInitialPage() }, '');
    }

    return () => window.removeEventListener('popstate', handleBackButton);
  }, []);

  // ✅ FIX 2: Dynamic Page Title + Canonical Tag (per-page SEO)
  useEffect(() => {
    // Static pages titles
    const titles = {
      home:    "Sri Meenakshi Glass & Plywoods | Wholesale Dealers in Chennai",
      about:   "About Us | Sri Meenakshi Glass & Plywoods Traders",
      services:"Our Services | Glass, Plywood & UPVC Experts in Chennai",
      contact: "Contact Us | Sri Meenakshi Glass & Plywoods – Perambur",
      gallery: "Gallery | Sri Meenakshi Glass & Plywoods",
      admin:   "Admin Dashboard | Sri Meenakshi Glass & Plywoods",
    };

    let currentTitle = titles[page] || "Sri Meenakshi Glass & Plywoods";

    // Dynamic pages titles
    if (page.startsWith("category-")) {
      const catId   = page.slice(9);
      const product = PL.find(p => p.id === catId);
      currentTitle  = `${product?.name || catId} | Sri Meenakshi Glass & Plywoods`;
    } else if (page.startsWith("product-")) {
      currentTitle = `Product Details | Sri Meenakshi Glass & Plywoods`;
    } else if (page.startsWith("gallery-")) {
      currentTitle = `Gallery | Sri Meenakshi Glass & Plywoods`;
    } else if (page.startsWith("search-")) {
      currentTitle = `Search Results | Sri Meenakshi Glass & Plywoods`;
    }

    document.title = currentTitle;

    // Canonical tag – duplicate content thadukka
    const urlPath      = page === 'home' ? '/' : `/${page}`;
    const canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.href = `https://www.srimeenakshiglassandply.in${urlPath}`;
    }
  }, [page]);

  // ✅ FIX 3: URL address bar update (pushState with 3rd param)
  const go = useCallback((newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const urlPath = newPage === 'home' ? '/' : `/${newPage}`;
    window.history.pushState({ page: newPage }, '', urlPath);
  }, []);

  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  const noChrome = ["login", "signup", "admin"].includes(page);

  const renderPage = () => {
    if (page === "home")     return <HomePage go={go} t={t} lang={lang} />;
    if (page === "about")    return <AboutPage go={go} t={t} />;
    if (page === "services") return <ServicesPage t={t} />;
    if (page === "contact")  return <ContactPage t={t} lang={lang} />;
    if (page === "login")    return <LoginPage go={go} />;
    if (page === "signup")   return <LoginPage go={go} />;
    if (page === "admin")    return <Admin go={go} />;

    if (page.startsWith("product-")) {
      const id = page.slice(8);
      return <ProductDetailsPage id={id} go={go} goBack={goBack} t={t} />;
    }
    if (page.startsWith("search-")) {
      const query = page.slice(7);
      return <SearchResultsPage query={query} go={go} goBack={goBack} t={t} />;
    }
    if (page === "gallery" || page.startsWith("gallery-")) {
      const id = page === "gallery" ? "all" : page.slice(8);
      return <GalleryCategoryPage id={id} go={go} goBack={goBack} t={t} />;
    }
    if (page.startsWith("category-")) {
      const id = page.slice(9);
      return <CategoryPage id={id} go={go} goBack={goBack} t={t} />;
    }

    return <HomePage go={go} t={t} lang={lang} />;
  };

  if (loading) return <Loader done={() => setLoading(false)} />;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Outfit',sans-serif" }}>
      {!noChrome && <Navbar page={page} go={go} lang={lang} setLang={setLang} t={t} />}
      <main>{renderPage()}</main>
      {!noChrome && <Footer go={go} t={t} />}

      {/* WhatsApp Floating Button */}
      <a
        href="https://api.whatsapp.com/send?phone=919790923750"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        style={{
          position: 'fixed', bottom: '30px', right: '30px',
          backgroundColor: '#25D366', color: 'white',
          width: '60px', height: '60px', borderRadius: '50%',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 9999, transition: 'transform 0.3s ease',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageCircle size={32} />
      </a>
    </div>
  );
}
