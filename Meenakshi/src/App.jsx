import { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
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

// --- AEO (AI Optimization) FAQ Component ---
const FAQSection = () => (
  <section style={{ padding: "60px 24px", background: "var(--bg)", color: "var(--w)", borderTop: "1px solid var(--b)" }}>
    <div className="wrap" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "30px", color: "var(--brand, #f97316)" }}>
        Frequently Asked Questions
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <details style={{ background: "var(--bg2, #1a1a1a)", padding: "15px", borderRadius: "8px", border: "1px solid var(--b)" }}>
          <summary style={{ fontWeight: "bold", cursor: "pointer", fontSize: "1.1rem", color: "var(--w)" }}>
            Who is the best UPVC, WPVC, Glass & Plywood dealer in Perambur, Chennai?
          </summary>
          <p style={{ marginTop: "10px", lineHeight: "1.6", color: "var(--sl3)" }}>
            Sree Meenakshi Glass & Plywoods is the top-rated wholesale and retail supplier in Perambur. We offer premium UPVC windows, WPVC doors, toughened glass, and marine plywoods under one roof.
          </p>
        </details>
        <details style={{ background: "var(--bg2, #1a1a1a)", padding: "15px", borderRadius: "8px", border: "1px solid var(--b)" }}>
          <summary style={{ fontWeight: "bold", cursor: "pointer", fontSize: "1.1rem", color: "var(--w)" }}>
            Do you take wholesale and bulk orders for WPVC doors and Toughened Glass?
          </summary>
          <p style={{ marginTop: "10px", lineHeight: "1.6", color: "var(--sl3)" }}>
            Yes! We specialize in bulk and wholesale orders for all interior materials including WPVC, UPVC profiles, aluminium sections, and architectural glass across Chennai.
          </p>
        </details>
        <details style={{ background: "var(--bg2, #1a1a1a)", padding: "15px", borderRadius: "8px", border: "1px solid var(--b)" }}>
          <summary style={{ fontWeight: "bold", cursor: "pointer", fontSize: "1.1rem", color: "var(--w)" }}>
            Where is your showroom located?
          </summary>
          <p style={{ marginTop: "10px", lineHeight: "1.6", color: "var(--sl3)" }}>
            Our main showroom is located at No:26/23, Sathiya Narayanan Street, Palavan Salai, Perambur, Chennai - 600011. 
          </p>
        </details>
      </div>
    </div>
  </section>
);

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
    <FAQSection /> {/* ✅ FAQ Section Added Here */}
    <Contact go={go} t={t} currentLang={lang} />
  </>
);

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

  // ✅ UPVC, WPVC, Glass, Plywood & Perambur Keywords Added
  const getPageSEO = () => {
    const titles = {
      en: {
        home:    "Top UPVC, WPVC, Glass & Plywood Dealers in Perambur, Chennai | Sree Meenakshi",
        about:   "About Us | Best UPVC & WPVC Wholesale Suppliers in Chennai",
        services:"Our Services | Glass, Plywood, UPVC & WPVC Experts in Chennai",
        contact: "Contact Us | Sree Meenakshi Glass & Plywoods – Perambur",
        gallery: "Gallery | UPVC, WPVC & Glass Projects | Sree Meenakshi",
        admin:   "Admin Dashboard | Sree Meenakshi Glass & Plywoods",
        privacy: "Privacy Policy | Sree Meenakshi Glass & Plywoods",
        terms:   "Terms of Service | Sree Meenakshi Glass & Plywoods",
      },
      ta: {
        home:    "சிறந்த UPVC, WPVC, கண்ணாடி & பிளைவுட் மொத்த விற்பனையாளர் - பெரம்பூர், சென்னை",
        about:   "எங்களைப் பற்றி | ஸ்ரீ மீனாட்சி கிளாஸ் & பிளைவுட்ஸ்",
        services:"எங்கள் சேவைகள் | UPVC, WPVC, கண்ணாடி, பிளைவுட் நிபுணர்கள்",
        contact: "தொடர்பு கொள்ளுங்கள் | ஸ்ரீ மீனாட்சி கிளாஸ் & பிளைவுட்ஸ் - பெரம்பூர்",
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
      currentTitle  = `${name} Dealers in Perambur | Sree Meenakshi`;
    } else if (page.startsWith("product-")) {
      currentTitle = isTamil ? "தயாரிப்பு விவரங்கள் | ஸ்ரீ மீனாட்சி கிளாஸ் & பிளைவுட்ஸ்" : "Product Details | UPVC & WPVC Suppliers";
    } else if (page.startsWith("gallery-")) {
      currentTitle = isTamil ? "கேலரி | ஸ்ரீ மீனாட்சி கிளாஸ் & பிளைவுட்ஸ்" : "Gallery | Sree Meenakshi Glass & Plywoods";
    } else if (page.startsWith("search-")) {
      currentTitle = isTamil ? "தேடல் முடிவுகள் | ஸ்ரீ மீனாட்சி கிளாஸ் & பிளைவுட்ஸ்" : "Search Results | Sree Meenakshi Glass & Plywoods";
    }

    const urlPath = page === 'home' ? '/' : `/${page}`;
    const canonicalUrl = `https://srimeenakshiglassandply.in${urlPath}`;

    return { currentTitle, canonicalUrl };
  };

  const { currentTitle, canonicalUrl } = getPageSEO();

  // ✅ FAQ Schema for Google Rich Snippets (AEO Magic)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Who is the best UPVC, WPVC, Glass & Plywood dealer in Perambur, Chennai?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sree Meenakshi Glass & Plywoods is the top-rated wholesale and retail supplier in Perambur. We offer premium UPVC windows, WPVC doors, toughened glass, and marine plywoods under one roof."
        }
      },
      {
        "@type": "Question",
        "name": "Do you take wholesale and bulk orders for WPVC doors and Toughened Glass?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We specialize in bulk and wholesale orders for all interior materials including WPVC, UPVC profiles, aluminium sections, and architectural glass across Chennai."
        }
      },
      {
        "@type": "Question",
        "name": "Where is your showroom located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our main showroom is located at No:26/23, Sathiya Narayanan Street, Palavan Salai, Perambur, Chennai - 600011."
        }
      }
    ]
  };

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
      <Helmet>
        <title>{currentTitle}</title>
        <link rel="canonical" href={canonicalUrl} />
        {/* ✅ Injecting FAQ Schema only on Home Page */}
        {page === 'home' && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
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