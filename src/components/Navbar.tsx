import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

type View = 'home' | 'about' | 'inspire' | 'admin';

interface NavbarProps {
  currentView: View;
  setCurrentView: (view: View, anchorId?: string) => void;
  setIsQuoteOpen: (isOpen: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  setIsQuoteOpen,
  isMenuOpen,
  setIsMenuOpen
}) => {
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMenuOpen]);

  return (
    <>
      <nav className={`navbar ${currentView === 'about' ? 'about-nav' : ''} ${currentView === 'inspire' ? 'inspire-nav' : ''}`}>
        <div className="nav-logo-container" onClick={() => { setCurrentView('home'); setIsMenuOpen(false); window.scrollTo(0,0); }} style={{ cursor: 'pointer' }}>
          <Logo className="nav-logo-svg" style={{ width: '161px' }} />
        </div>
        <div className="nav-right-group">
          <div className="nav-links">
            <button className={`nav-link ${currentView === 'home' ? 'active' : ''}`} onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</button>
            <button className={`nav-link ${currentView === 'about' ? 'active' : ''}`} onClick={() => { setCurrentView('about'); window.scrollTo(0,0); }}>About</button>
            <button className="nav-link" onClick={() => setCurrentView('home', 'clients')}>Clients</button>
            <button className={`nav-link ${currentView === 'inspire' ? 'active' : ''}`} onClick={() => { setCurrentView('inspire'); window.scrollTo(0,0); }}>Inspirations</button>
          </div>
          <button className="nav-cta" onClick={() => setIsQuoteOpen(true)}>Get a Quote</button>
        </div>

        {/* Hamburger Toggle */}
        <button 
          className={`nav-burger ${isMenuOpen ? 'active' : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="mobile-menu-overlay"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <button className="mobile-menu-close" onClick={() => setIsMenuOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="mobile-menu-content">
              <div className="mobile-menu-links">
                <button className="mobile-menu-link" onClick={() => { setIsMenuOpen(false); setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  <span className="menu-num">01</span>
                  <span className="menu-text">Home</span>
                </button>
                <button className="mobile-menu-link" onClick={() => { setIsMenuOpen(false); setCurrentView('about'); window.scrollTo(0,0); }}>
                  <span className="menu-num">02</span>
                  <span className="menu-text">About</span>
                </button>
                <button className="mobile-menu-link" onClick={() => { setIsMenuOpen(false); setCurrentView('home', 'clients'); }}>
                  <span className="menu-num">03</span>
                  <span className="menu-text">Clients</span>
                </button>
                <button className="mobile-menu-link" onClick={() => { setIsMenuOpen(false); setCurrentView('inspire'); window.scrollTo(0,0); }}>
                  <span className="menu-num">04</span>
                  <span className="menu-text">Inspirations</span>
                </button>
              </div>

              <div className="mobile-menu-footer">
                <button className="mobile-menu-cta" onClick={() => { setIsMenuOpen(false); setIsQuoteOpen(true); }}>
                  Get a quote
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
