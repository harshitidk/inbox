import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INSPIRATION_DATA } from './inspirationData';

export default function FindInspire() {
  const industries = Object.keys(INSPIRATION_DATA).sort();
  const [activeIndustry, setActiveIndustry] = useState(industries[0]);
  const [images, setImages] = useState<string[]>([]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setImages(INSPIRATION_DATA[activeIndustry] || []);
  }, [activeIndustry]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Disable smooth scroll on html to fix first-scroll lag
    document.documentElement.classList.add('inspire-page-active');
    
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }

    return () => {
      document.documentElement.classList.remove('inspire-page-active');
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [selectedImage]);

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
            <motion.h1 
              key={`title-${activeIndustry}`}
              initial={isMobile ? { opacity: 1 } : { y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: isMobile ? 0 : 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="inspire-title"
            >
              {activeIndustry}
            </motion.h1>
            <motion.p 
              initial={isMobile ? { opacity: 1 } : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: isMobile ? 0 : 0.2, duration: 1 }}
              className="inspire-subtitle"
            >
              A curated collection of design-forward packaging inspiration for your {activeIndustry === 'PR' ? activeIndustry : activeIndustry.toLowerCase()} brand.
            </motion.p>
          </header>

          <motion.div 
            key={activeIndustry}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="masonry-feed"
          >
            {images.map((src, index) => (
              <motion.div 
                key={`${activeIndustry}-${src}`}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: isMobile ? Math.min(index * 0.015, 0.15) : Math.min(index * 0.03, 0.3),
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="masonry-item"
                onClick={() => setSelectedImage(src)}
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
                      <span className="image-action">View</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {images.length === 0 && (
            <div className="no-images">
              <p>Coming soon...</p>
            </div>
          )}
        </main>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              className="lightbox-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <img src={selectedImage} alt="Large view" className="lightbox-image" />
              <div className="lightbox-info">
                <span className="lightbox-category">{activeIndustry}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

