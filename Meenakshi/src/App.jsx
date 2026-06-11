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

// --- Page Wrappers ---
const AboutPage   = ({  t }) => <div style={{ paddingTop: 72 }}><PageBar /><About t={t} /></div>;
const ServicesPage= ({ t }) => <div style={{ paddingTop: 72 }}><PageBar /><Services t={t} /></div>;

// மாற்றம் 1: ContactPage-ல் lang-ஐ வாங்கியுள்ளேன்
const ContactPage = ({ t, lang }) => <div style={{ paddingTop: 72 }}><PageBar /><Contact t={t} currentLang={lang} /></div>;

// மாற்றம் 2: HomePage-ல் lang-ஐ வாங்கியுள்ளேன்
const HomePage    = ({ go, t, lang }) => (
  <>
    <Hero go={go} t={t} />
    <About t={t} />
    <Services t={t} />
    <GalleryPreview go={go} t={t} />
    <Testimonials t={t} />
    <Contact t={t} currentLang={lang} />
  </>
);

export default function App() {
  const [loading, setLoading] = useState(true);
  
  // Namma custom stack history theva illa, ippo window.history use panrom
  const [page, setPage] = useState('home'); 
  const [lang, setLang] = useState("en");

  const t = LANG[lang];

  // 🌟 PUTHUSA ADD PANNA VENDIYA KODE (Browser Back Button Support) 🌟
  useEffect(() => {
    const handleBackButton = (event) => {
      // Browser back button amukkumbothu history-la enna page iruko anga pogum
      if (event.state && event.state.page) {
        setPage(event.state.page);
      } else {
        setPage('home'); // ethuvum illana home
      }
    };

    window.addEventListener('popstate', handleBackButton);

    // Initial load appo current page-ah history la vachikiraom
    if (!window.history.state) {
      window.history.replaceState({ page: 'home' }, '');
    }

    return () => window.removeEventListener('popstate', handleBackButton);
  }, []);

  const go = useCallback((newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    // Namma React page maarumbothu Browser history-laiyum update panrom
    window.history.pushState({ page: newPage }, ''); 
  }, []);

  const goBack = useCallback(() => {
    // Ippo goBack() function direct ah browser oda native back function ah koopidum
    window.history.back(); 
  }, []);

  const noChrome = ["login", "signup", "admin"].includes(page);

  const renderPage = () => {
    // மாற்றம் 3: lang-ஐ HomePage மற்றும் ContactPage-க்கு அனுப்புகிறோம்
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
      
      <a 
        href="https://wa.me/919940504234" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: '#25D366',
          color: 'white',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 9999,
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        aria-label="Chat with us on WhatsApp"
      >
        <MessageCircle size={32} />
      </a>
    </div>
  );
}