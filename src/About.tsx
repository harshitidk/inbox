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
            Built between <br />
            <span className="italic-serif">two worlds.</span>
          </h1>
          <p className="hero-subtext">
            Packaging is the first physical touchpoint between a brand and its customer. 
            It is the moment a promise becomes tangible.
          </p>
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
            <span className="letter-date">Established 1994 / Reimagined 2026</span>
            <span className="letter-location">Bangalore, India</span>
          </div>
          <div className="letter-body">
            <p className="letter-para first-para">
              I grew up in two worlds — the manufacturing floor of my father's 30-year-old printing business, 
              <span className="highlight"> Perfect Fusion</span>, and the fast-moving world of modern startups.
            </p>

            <blockquote className="letter-quote">
              "I saw the grit of production—the smell of ink, the rhythm of the presses, the precision of a die-cut."
            </blockquote>

            <p className="letter-para">
              But I also saw the disconnect. I saw brands that poured their souls into digital products, 
              spent months on pixels and code, only to have the final physical experience feel like an afterthought. 
              The package would arrive, and the magic would vanish.
            </p>

            <p className="letter-para">
              Inbox was born to bridge that gap. We didn't want to just be another supplier. 
              We wanted to be a partner for the dreamers, the founders, and the builders who believe 
              that the unboxing experience is just as important as the product inside.
            </p>

            <div className="letter-marginalia">
              <span className="handwritten">Precision meets soul.</span>
            </div>

            <p className="letter-para">
              Today, we combine three decades of industrial manufacturing mastery with a modern, 
              design-forward approach. We understand the technicalities of a 400gsm duplex board 
              just as well as we understand the emotional weight of a brand’s color palette.
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
          <h2 className="cta-headline">Let’s create something your customers <span className="italic-serif">remember.</span></h2>
          <p className="cta-subtext">Your packaging deserves intention. We’re here to help you build it.</p>
          <button className="cta-button" onClick={onOpenQuote}>
            Start a Conversation
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
          </button>
        </div>
        <div className="cta-footer">
          <div className="footer-mark">INBOX® ARCHIVAL SERIES // 2026</div>
        </div>
      </section>
    </div>
  );
}
