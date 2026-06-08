import { useState, useCallback } from 'react';
import './styles/globals.css';
import { LANG } from './constants/translations';
import { PageBar, Loader } from './components/ui';
import { Navbar, Footer, FloatWA } from './components/layout';

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
  const [history, setHistory] = useState(["home"]); // Navigation History Stack
  const [lang, setLang] = useState("en");

  const page = history[history.length - 1]; // Current page
  const t = LANG[lang];

  const go = useCallback((p) => {
    setHistory(prev => [...prev, p]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goBack = useCallback(() => {
    setHistory(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      <FloatWA t={t} />
    </div>
  );
}