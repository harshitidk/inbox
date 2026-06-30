import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Navbar from './components/Navbar';

interface HomeProps {
  setCurrentView: (view: 'home' | 'about' | 'inspire' | 'admin') => void;
  setIsQuoteOpen: (isOpen: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  Counter: React.FC<{ value: number; duration?: number; delay?: number }>;
}

const Home: React.FC<HomeProps> = ({ 
  setCurrentView, 
  setIsQuoteOpen, 
  isMenuOpen, 
  setIsMenuOpen,
  Counter 
}) => {
  return (
    <>
      <Navbar 
        currentView="home"
        setCurrentView={setCurrentView}
        setIsQuoteOpen={setIsQuoteOpen}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <section className="hero">
        <div className="hero-video-container">
          <video 
            className="hero-video"
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="hero-video-overlay"></div>
        </div>

        <div className="hero-content">
          <motion.div 
            className="hero-text-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-stats-mobile">
              <div className="stat-item-mobile">
                <span className="stat-value-mobile"><Counter value={30} />+</span>
                <span className="stat-label-mobile">Years of exp.</span>
              </div>
              <div className="stat-divider-mobile"></div>
              <div className="stat-item-mobile">
                <span className="stat-value-mobile"><Counter value={500} />+</span>
                <span className="stat-label-mobile">Brands Served</span>
              </div>
            </div>

            <h1 className="hero-title">
              Packaging,<br />
              <span className="hero-title-accent">designed to be felt.</span>
            </h1>
            
            <div className="hero-cta-wrapper">
              <button className="hero-cta" onClick={() => setIsQuoteOpen(true)}>
                <span className="hero-cta-text">Get a Quote</span>
                <span className="hero-cta-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </span>
              </button>
              <button className="hero-cta-secondary" onClick={() => { setCurrentView('inspire'); window.scrollTo(0,0); }}>
                <span className="hero-cta-text-secondary">Find Inspirations</span>
                <span className="hero-cta-icon-secondary">
                  <Sparkles size={18} strokeWidth={2.0} />
                </span>
              </button>
            </div>
          </motion.div>

          <div className="hero-stats-desktop">
            <motion.div 
              className="stat-item"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="stat-value"><Counter value={30} />+</span>
              <span className="stat-label">Years of experience in printing & packaging</span>
            </motion.div>
            <motion.div 
              className="stat-item"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <span className="stat-value"><Counter value={500} />+</span>
              <span className="stat-label">Brands served with precision quality</span>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
