import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INSPIRATION_DATA } from './inspirationData';

export default function FindInspire() {
  const industries = Object.keys(INSPIRATION_DATA).sort();
  const [activeIndustry, setActiveIndustry] = useState(industries[0]);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    setImages(INSPIRATION_DATA[activeIndustry] || []);
  }, [activeIndustry]);

  useEffect(() => {
    // Disable smooth scroll on html to fix first-scroll lag
    document.documentElement.classList.add('inspire-page-active');
    return () => {
      document.documentElement.classList.remove('inspire-page-active');
    };
  }, []);

  return (
    <motion.div 
      className="inspire-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="inspire-orb orb-1"></div>
      <div className="inspire-orb orb-2"></div>


      <div className="inspire-layout">
        {/* Left Sidebar: Sticky Industry Navigation */}
        <aside className="inspire-sidebar">
          <div className="sidebar-inner">
            <h2 className="sidebar-label">Industries</h2>
            <ul className="industry-list">
              {industries.map((industry) => (
                <li key={industry}>
                  <button 
                    className={`industry-item ${activeIndustry === industry ? 'active' : ''}`}
                    onClick={() => setActiveIndustry(industry)}
                  >
                    <span className="industry-name">{industry}</span>
                    <span className="industry-count">{INSPIRATION_DATA[industry]?.length || 0}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Right Content: Editorial Feed */}
        <main className="inspire-main">
          <header className="inspire-hero">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inspire-breadcrumb"
            >
              Editorial Archive / {activeIndustry}
            </motion.div>
            <motion.h1 
              key={`title-${activeIndustry}`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="inspire-title"
            >
              {activeIndustry}
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="inspire-subtitle"
            >
              A curated collection of design-forward packaging solutions for the {activeIndustry.toLowerCase()} sector.
            </motion.p>
          </header>

          <div className="masonry-feed">
            <AnimatePresence mode="popLayout">
              {images.map((src, index) => (
                <motion.div 
                  key={src}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: (index % 12) * 0.04,
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className="masonry-item"
                >
                  <div className="image-wrapper">
                    <img 
                      src={src} 
                      alt={`${activeIndustry} Inspiration`} 
                      loading="lazy"
                    />
                    <div className="image-overlay">
                      <div className="overlay-content">
                        <span className="image-category">{activeIndustry}</span>
                        <div className="overlay-line"></div>
                        <span className="image-action">View Project</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {images.length === 0 && (
            <div className="no-images">
              <p>Coming soon...</p>
            </div>
          )}
        </main>
      </div>
    </motion.div>
  );
}
