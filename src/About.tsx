import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface AboutProps {
  onOpenQuote: () => void;
}

export default function About({ onOpenQuote }: AboutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const letterY = useTransform(scrollYProgress, [0, 0.3], [100, 0]);

  return (
    <div 
      className="about-page"
      ref={containerRef}
    >
      {/* Dynamic Background Elements */}
      <div className="about-bg-elements">
        <div className="paper-texture-overlay"></div>
        <motion.div 
          className="floating-asset asset-1"
          style={{ rotate: -5, x: -100, y: 50 }}
          animate={{ y: [50, 70, 50], rotate: [-5, -3, -5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src="/assets/blueprint-fragment.png" alt="" />
        </motion.div>
        <motion.div 
          className="floating-asset asset-2"
          style={{ rotate: 12, right: -50, top: '20%' }}
          animate={{ y: [0, -20, 0], rotate: [12, 15, 12] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="archival-stamp">APPROVED / ARCHIVAL SERIES</div>
        </motion.div>
      </div>


      {/* Hero Spacer to create the scroll depth for the reveal */}
      <div className="about-hero-spacer"></div>

      {/* Hero Section - Fixed background */}
      <motion.section 
        className="about-hero"
        style={{ 
          y: useTransform(scrollYProgress, [0, 0.2, 1], [0, 0, -4000])
        }}
      >
        <div className="hero-inner">
          <span className="hero-label">
            Founder’s Note
          </span>
          <h1 className="hero-headline">
            <span className="cta-yellow">Built</span> between <br />
            <span className="italic-serif">two worlds.</span>
          </h1>
          <p className="hero-subtext">
            Packaging is the first physical touchpoint between a brand and its customer. 
            It is the moment a promise becomes tangible.
          </p>
        </div>
        
        <div className="hero-polaroids-wrapper">
          <motion.div 
            className="polaroid-frame polaroid-left"
            initial={{ rotate: -8, y: 30, opacity: 0 }}
            animate={{ rotate: -5, y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          >
            <motion.div
               animate={{ y: [-2, 2, -2], rotate: [-0.5, 0.5, -0.5] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="polaroid-inner"
            >
              <div className="tape tape-top"></div>
              <div className="polaroid-image-container">
                <img src="/Assets/founder1.jpg" alt="Founder 1" />
                <div className="polaroid-overlay"></div>
              </div>
              <div className="polaroid-caption">
                <span className="handwritten">Vision</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="polaroid-frame polaroid-right"
            initial={{ rotate: 8, y: 50, opacity: 0 }}
            animate={{ rotate: 6, y: 20, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
          >
            <motion.div
               animate={{ y: [2, -2, 2], rotate: [0.5, -0.5, 0.5] }}
               transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="polaroid-inner"
            >
              <div className="tape tape-top-right"></div>
              <div className="polaroid-image-container">
                <img src="/Assets/founder2.jpg" alt="Founder 2" />
                <div className="polaroid-overlay"></div>
              </div>
              <div className="polaroid-caption">
                <span className="handwritten">Execution</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Decorative accents */}
          <motion.div 
            className="polaroid-accent-text"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            <span className="handwritten-large">Precision meets soul.</span>
            <svg className="accent-doodle" viewBox="0 0 100 100" fill="none">
              <path d="M10 50 Q 30 10 50 50 T 90 50" stroke="#0065b7" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>

        <div className="scroll-indicator">
          <div className="mouse"></div>
          <span>Scroll to read</span>
        </div>
      </motion.section>

      {/* The Letter Section */}
      <section className="letter-section">
        <motion.div 
          className="letter-container"
          style={{ y: letterY }}
        >
          <div className="letter-header">
            <span className="letter-date">
              Established 1994<br />Reimagined 2026
            </span>
            <span className="letter-location">
              Delhi,<br />India
            </span>
          </div>
          <div className="letter-body">
            <p className="letter-para first-para">
              I grew up in two worlds: the manufacturing floor of my father's 30-year-old printing business,{' '}
              <span className="highlight">Perfect Fusion</span>, and the fast-moving world of modern startups by today's new generation.
            </p>

            <p className="letter-para">
              In my time balancing both, I saw brands that poured their souls into digital products, 
              spent months on pixels and code, only to have the final physical experience feel like an 'eh'. 
              The package would arrive, and the magic would vanish.
            </p>

            <p className="letter-para">
              <strong>
                <span className="highlight-yellow">
                  Inbox was born to bridge that gap. We aren't just anyone, we are a partner for the dreamers, the founders, and the builders who believe in their vision, because so do we.
                </span>
              </strong>
            </p>
            <p className="letter-para">
              Today, we understand the technicalities of a 400gsm duplex board just as well as we understand the emotional weight of a brand’s color palette.
            </p>

            <p className="letter-para">
              So, if you've come here, know that you're in the best hands!
            </p>
          </div>

          <div className="letter-footer">
            <p>With intention,</p>
            <div className="founder-signature">
              <span className="handwritten-sig">Vidit, Founder of Inbox</span>
            </div>
          </div>
        </motion.div>
      </section>



      {/* Final CTA */}
      <section className="about-cta">
        <div className="cta-content">
          <h2 className="cta-headline">
            Let’s <span className="cta-yellow">create</span> something <br />
            <span className="italic-serif">your customers remember.</span>
          </h2>
          <button className="cta-button" onClick={onOpenQuote}>
            Start a Conversation
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
          </button>
        </div>
        <div className="cta-footer">
          <div className="footer-mark">INBOX ARCHIVAL SERIES // 2026</div>
        </div>
      </section>
    </div>
  );
}
