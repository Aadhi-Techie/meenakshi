import { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async'; // ✅ Helmet import செய்யப்பட்டுள்ளது
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
import { PROD_LIST as PL } from './constants/data';
import BulkOrder from './pages/BulkOrder';

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

// ✅ FIX 1: SSG Build-ல் crash ஆகாமல் இருக்க window check சேர்க்கப்பட்டுள்ளது
const getInitialPage = () => {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.replace(/^\/+/, '');
  return path ? path : 'home';
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(getInitialPage());
  const [lang, setLang]       = useState("en");

  const t = LANG[lang];

  useEffect(() => {
    const handleBackButton = (event) => {
      if (event.state && event.state.page) {
        setPage(event.state.page);
      } else {
        setPage(getInitialPage());
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handleBackButton);
      if (!window.history.state) {
        window.history.replaceState({ page: getInitialPage() }, '');
      }
    }

    return () => {
      if (typeof window !== 'undefined') window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  const go = useCallback((newPage) => {
    setPage(newPage);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const urlPath = newPage === 'home' ? '/' : `/${newPage}`;
      window.history.pushState({ page: newPage }, '', urlPath);
    }
  }, []);

  const goBack = useCallback(() => {
    if (typeof window !== 'undefined') window.history.back();
  }, []);

  const noChrome = ["login", "signup", "admin"].includes(page);

  // ✅ FIX 2: useEffect-ல் இருந்து Titles-ஐ எடுத்து நேரடியாக Helmet-க்கு மாற்றுவதற்கான Logic
  const getPageSEO = () => {
    const titles = {
      en: {
        home:    "SreeMeenakshi Glass & Plywoods | Wholesale Dealers in Chennai",
        about:   "About Us | Sree Meenakshi Glass and Plywoods",
        services:"Our Services | Glass, Plywood & UPVC Experts in Chennai",
        contact: "Contact Us | Sree Meenakshi Glass & Plywoods – Perambur",
        gallery: "Gallery | Sree Meenakshi Glass & Plywoods",
        admin:   "Admin Dashboard | Sree Meenakshi Glass & Plywoods",
        privacy: "Privacy Policy | Sree Meenakshi Glass & Plywoods",
        terms:   "Terms of Service | Sree Meenakshi Glass & Plywoods",
      },
      ta: {
        home:    "ஸ்ரீ மீனாட்சி கிளாஸ் & பிளைவுட்ஸ் | சென்னையில் மொத்த விற்பனையாளர்",
        about:   "எங்களைப் பற்றி | ஸ்ரீ மீனாட்சி கிளாஸ் & பிளைவுட்ஸ்",
        services:"எங்கள் சேவைகள் | கண்ணாடி, பிளைவுட் நிபுணர்கள்",
        contact: "தொடர்பு கொள்ளுங்கள் | ஸ்ரீ மீனாட்சி கிளாஸ் & பிளைவுட்ஸ்",
        gallery: "கேலரி | ஸ்ரீ மீனாட்சி கிளாஸ் & பிளைவுட்ஸ்",
        admin:   "நிர்வாக டாஷ்போர்டு | ஸ்ரீ மீனாட்சி கிளாஸ் & பிளைவுட்ஸ்",
        privacy: "தனியுரிமை கொள்கை | ஸ்ரீ மீனாட்சி கிளாஸ் & பிளைவுட்ஸ்",
        terms:   "சேவை விதிமுறைகள் | ஸ்ரீ மீனாட்சி கிளாஸ் & பிளைவுட்ஸ்",
      }
    };

    const isTamil    = lang === "ta";
    const langTitles = titles[lang] || titles.en;
    let currentTitle = langTitles[page] || "Sree Meenakshi Glass & Plywoods";

    if (page.startsWith("category-")) {
      const catId   = page.slice(9);
      const product = PL.find(p => p.id === catId);
      const name    = isTamil && product?.tn ? product.tn : (product?.name || catId);
      currentTitle  = `${name} | SreeMeenakshi Glass & Plywoods`;
    } else if (page.startsWith("product-")) {
      currentTitle = isTamil ? "தயாரிப்பு விவரங்கள் | ஸ்ரீ மீனாட்சி கிளாஸ் & பிளைவுட்ஸ்" : "Product Details | Sree Meenakshi Glass & Plywoods";
    } else if (page.startsWith("gallery-")) {
      currentTitle = isTamil ? "கேலரி | ஸ்ரீ மீனாட்சி கிளாஸ் & பிளைவுட்ஸ்" : "Gallery | Sree Meenakshi Glass & Plywoods";
    } else if (page.startsWith("search-")) {
      currentTitle = isTamil ? "தேடல் முடிவுகள் | ஸ்ரீ மீனாட்சி கிளாஸ் & பிளைவுட்ஸ்" : "Search Results | SreeMeenakshi Glass & Plywoods";
    }

    const urlPath = page === 'home' ? '/' : `/${page}`;
    const canonicalUrl = `https://srimeenakshiglassandply.in${urlPath}`;

    return { currentTitle, canonicalUrl };
  };

  const { currentTitle, canonicalUrl } = getPageSEO();

  const renderPage = () => {
    if (page === "home")     return <HomePage go={go} t={t} lang={lang} />;
    if (page === "about")    return <AboutPage go={go} t={t} />;
    if (page === "services") return <ServicesPage t={t} />;
    if (page === "contact")  return <ContactPage t={t} lang={lang} />;
    if (page === "login")    return <LoginPage go={go} isSignup={false} />;
    if (page === "signup")   return <LoginPage go={go} isSignup={true} />;
    if (page === "admin")    return <Admin go={go} />;
    if (page === "bulk-order") return <BulkOrder go={go} t={t} lang={lang} />;
    if (page === "privacy")  return <div style={{ paddingTop: 72 }}><PageBar /><div className="wrap" style={{ padding: "40px 24px", color: "var(--w)" }}><h1>Privacy Policy</h1><p style={{ color: "var(--sl3)" }}>Privacy policy content here.</p></div></div>;
    if (page === "terms")    return <div style={{ paddingTop: 72 }}><PageBar /><div className="wrap" style={{ padding: "40px 24px", color: "var(--w)" }}><h1>Terms of Service</h1><p style={{ color: "var(--sl3)" }}>Terms of service content here.</p></div></div>;

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
      {/* ✅ FIX 2: Helmet மூலமாக Static HTML-ல் Title & Canonical Tag-ஐ செலுத்துகிறோம் */}
      <Helmet>
        <title>{currentTitle}</title>
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      {!noChrome && <Navbar page={page} go={go} lang={lang} setLang={setLang} t={t} />}
      <main>{renderPage()}</main>
      {!noChrome && <Footer go={go} t={t} />}

      <a
        href="https://wa.me/919790923750"
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