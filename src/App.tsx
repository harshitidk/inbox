import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import './App.css';
import FindInspire from './FindInspire';
import About from './About';
import { QuoteModal, QuoteForm } from './QuoteModalComponent';

type View = 'home' | 'inspire' | 'about';

function Counter({ value, duration = 2, delay = 0.9 }: { value: number; duration?: number; delay?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { 
      duration, 
      delay,
      ease: [0.16, 1, 0.3, 1] 
    });
    return controls.stop;
  }, [count, value, duration, delay]);

  return <motion.span>{rounded}</motion.span>;
}

/* ── Process Section (Pinned Scroll Storytelling) ── */
function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Simple cover transitions: each slide slides in from the right to cover the previous.
  // Slide 1 stays put. Slide 2 covers slide 1. Slide 3 covers slide 2.
  const slide2X = useTransform(scrollYProgress, [0.15, 0.45], ['100%', '0%']);
  const slide3X = useTransform(scrollYProgress, [0.5, 0.8], ['100%', '0%']);

  // Progress tracker
  const activeSlide = useTransform(scrollYProgress, (v) => {
    if (v < 0.33) return 0;
    if (v < 0.66) return 1;
    return 2;
  });

  const trackerRef = useRef<HTMLDivElement>(null);
  useMotionValueEvent(activeSlide, "change", (latest) => {
    if (!trackerRef.current) return;
    const steps = trackerRef.current.querySelectorAll('.process-tracker-step');
    steps.forEach((step, i) => {
      (step as HTMLElement).dataset.active = i === latest ? 'true' : 'false';
    });
  });

  const slides = [
    {
      title: "Complete\nunderstanding",
      desc: "At Inbox®, we start by understanding your brand, product needs, and usage. With 30+ years of printing and packaging expertise, we align materials, finishes, and timelines before moving to production.",
      bg: "linear-gradient(to bottom, #0065b7, #004981)",
      illustration: "/images/process/complete-understanding.png",
      step: "01"
    },
    {
      title: "Design &\nproduction",
      desc: "Our in-house team prepares print-ready files and executes precision manufacturing using advanced technology and high-quality materials.",
      bg: "linear-gradient(to bottom, #dca100, #b17300)",
      illustration: "/images/process/design-production.png",
      step: "02"
    },
    {
      title: "Quality check\n& delivery",
      desc: "Every finished product undergoes strict quality checks for print accuracy, material strength, and finishing. Once approved, your orders are securely packed and delivered on schedule.",
      bg: "linear-gradient(to bottom, #008221, #003500)",
      illustration: "/images/process/quality-delivery-v2.png",
      step: "03"
    }
  ];


  const slideXValues = [undefined, slide2X, slide3X]; // slide 1 has no transform
  const trackerLabels = ["Complete understanding", "Design & production", "Quality check & delivery"];

  return (
    <div className="process-scroll-container" ref={containerRef}>
      <div className="process-sticky-viewport">
        {slides.map((slide, i) => (
          <motion.div
            key={i}
            className="process-slide"
            style={{
              background: slide.bg,
              x: slideXValues[i],
              zIndex: i + 1,
            }}
          >
            <div className="process-illustration">
              <img src={slide.illustration} alt="" className="process-illustration-img" />
            </div>

            {/* "HOW WE DO IT" only on the first slide */}
            {i === 0 && (
              <motion.div
                className="process-section-label"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="process-label-text">How we do it</span>
              </motion.div>
            )}

            <div className="process-slide-content">
              <div className="process-step-number">{slide.step}</div>
              <h3 className="process-slide-title">{slide.title}</h3>
              <p className="process-slide-desc">{slide.desc}</p>
            </div>
          </motion.div>
        ))}

        {/* Progress Tracker */}
        <div className="process-tracker" ref={trackerRef}>
          {trackerLabels.map((label, i) => (
            <div key={i} className="process-tracker-step" data-active={i === 0 ? 'true' : 'false'}>
              <div className="process-tracker-content">
                <span className="process-tracker-label">{label}</span>
                <div className="process-tracker-node">
                  <span className="process-tracker-number">0{i + 1}</span>
                </div>
              </div>
              {i < trackerLabels.length - 1 && (
                <div className="process-tracker-segment">
                  <motion.div
                    className="process-tracker-segment-fill"
                    style={{
                      scaleY: useTransform(
                        scrollYProgress,
                        [i * 0.33, (i + 1) * 0.33],
                        [0, 1]
                      )
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const ClientSection = () => {
  const row1Logos = [
    '/logos/croma.png', '/logos/d_chica.png', '/logos/faber.png', '/logos/gulf.png', '/logos/hcl.png'
  ];
  
  const row2Logos = [
    '/logos/india_tv.png', '/logos/milton.png', '/logos/sos_organics.png', '/logos/sun_pharma.png', '/logos/venu.png'
  ];

  const testimonials = [
    {
      text: "We've been working with Inbox for a long time now, & honestly, the biggest relief is not having to worry. The quality is consistent & deadlines are met without constant follow-ups.",
      name: "Amrita Chengappa",
      company: "SOS Organics"
    },
    {
      text: "We've done multiple bulk orders with Inbox & the output has been just perfect every time. Inbox has always been flexible & quick to adapt, which makes working with them really easy.",
      name: "Prateek Arora",
      company: "NSF"
    },
    {
      text: "Finding a print partner you can trust long-term is rare. Inbox has supported our brand across multiple product lines with consistent quality & clear communication!",
      name: "Yogesh Chaddha",
      company: "GenPure Zheng Filters"
    }
  ];

  return (
    <section className="client-section">
      <div className="client-header">
        <h2 className="client-title">Trusted by industry leaders</h2>
        <p className="client-subtitle">Delivering precision and quality to the brands you love.</p>
      </div>
      
      <div className="marquee-wrapper">
        <div className="marquee-container">
          <div className="marquee-content row-1">
            {[...row1Logos, ...row1Logos, ...row1Logos].map((logo, i) => (
              <div key={i} className="client-logo-card">
                <img src={logo} alt="Client Logo" className="client-logo" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="marquee-container" style={{ marginTop: '20px' }}>
          <div className="marquee-content row-2">
            {[...row2Logos, ...row2Logos, ...row2Logos].map((logo, i) => (
              <div key={i} className="client-logo-card">
                <img src={logo} alt="Client Logo" className="client-logo" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="minimal-testimonials-wrapper">
        <div className="minimal-testimonials-grid">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i} 
              className="minimal-testimonial"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="minimal-testimonial-bubble">
                <p className="minimal-testimonial-text">"{t.text}"</p>
              </div>
              <div className="minimal-testimonial-author">
                <span className="minimal-testimonial-name">{t.name}</span>
                <span className="minimal-testimonial-company">{t.company}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section className="contact-section">
      <motion.div 
        className="contact-container"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="contact-info">
          <h2 className="contact-title">Get in touch</h2>
          
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-label">Email:</span>
              <span className="contact-value">hello@inboxpackaging.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Phone:</span>
              <span className="contact-value">+1 (800) 123-4567</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Address:</span>
              <span className="contact-value">123 Packaging Way, Design District<br/>New York, NY 10001<br/>United States</span>
            </div>
          </div>

          <div className="contact-social">
            <span className="contact-label">Follow us</span>
            <div className="social-icons">
              <a href="#" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="contact-form-wrapper">
          <QuoteForm />
        </div>
      </motion.div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-glass-container">
        <motion.div 
          className="footer-content"
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "0%" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="footer-subtitle">The printing packaging company</div>
          <div className="footer-title-wrapper">
            <h1 className="footer-title">INBOX</h1>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

const ServicesSection = () => {
  const servicesRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: servicesRef,
    offset: ["start end", "end start"]
  });

  const yFast = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const ySlow = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const ySlower = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const serviceData = [
    {
      img: "/images/services/packaging-boxes.png",
      title: "Packaging Boxes",
      desc: "Customized Boxes, Storage Cartons, Paper Bags, Carry Bags",
      parallax: yFast,
      initial: { x: -80, y: 100, opacity: 0 },
      whileInView: { x: 0, y: 0, opacity: 1 },
      transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] as any, delay: 0.1 }
    },
    {
      img: "/images/services/labels-stickers.png",
      title: "Labels, Stickers & Tags",
      desc: "Product Labels, Personalised Sheet Stickers, Barcode/QR Labels, Price Tags, Hang Tags",
      parallax: ySlower,
      initial: { scale: 0.9, opacity: 0, filter: 'blur(15px)' },
      whileInView: { scale: 1, opacity: 1, filter: 'blur(0px)' },
      transition: { duration: 2, ease: [0.16, 1, 0.3, 1] as any, delay: 0.3 }
    },
    {
      img: "/images/services/display-signage.png",
      title: "Display & Signage",
      desc: "Flex Banners, Standees, Cut-outs, Vinyl Prints with Sunboards",
      parallax: ySlow,
      initial: { x: 100, opacity: 0 },
      whileInView: { x: 0, opacity: 1 },
      transition: { duration: 1.8, ease: [0.16, 1, 0.3, 1] as any, delay: 0.2 }
    },
    {
      img: "/images/services/marketing-collaterals.png",
      title: "Marketing Print Collaterals",
      desc: "Catalogues, Posters, Vinyl Posters, Tent Cards, Books, Calendars (Wall & Table)",
      parallax: ySlow,
      initial: { x: -50, y: 150, opacity: 0 },
      whileInView: { x: 0, y: 0, opacity: 1 },
      transition: { duration: 1.7, ease: [0.16, 1, 0.3, 1] as any, delay: 0.2 }
    },
    {
      img: "/images/services/specialty-printing.png",
      title: "Specialty & Precision Printing",
      desc: "Vinyl Stickers, Laser Cut Paper Stickers, Laser Cut Vinyl Stickers",
      parallax: yFast,
      initial: { scale: 0.95, y: 120, opacity: 0, filter: 'blur(10px)' },
      whileInView: { scale: 1, y: 0, opacity: 1, filter: 'blur(0px)' },
      transition: { duration: 1.9, ease: [0.16, 1, 0.3, 1] as any, delay: 0.4 }
    },
    {
      img: "/images/services/corporate-merchandise.png",
      title: "Corporate Merchandise",
      desc: "Corporate Gifts, Pens, Diaries, T-Shirts, Jackets, Laptop Bags, Sippers",
      parallax: ySlower,
      initial: { y: 180, opacity: 0 },
      whileInView: { y: 0, opacity: 1 },
      transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] as any, delay: 0.1 }
    }
  ];

  return (
    <section className="services" ref={servicesRef}>
      <div className="services-header">
        <h2 className="services-title">Things We Do <br /> For You</h2>
        <p className="services-desc">From concept to production, we deliver precision in every print.</p>
      </div>
      <div className="services-grid">
        {serviceData.map((service, index) => (
          <motion.div 
            key={index} 
            className="service-parallax-wrapper"
            style={{ y: service.parallax }}
          >
            <motion.div 
              className="service-card"
              initial={service.initial}
              whileInView={service.whileInView}
              viewport={{ once: true, margin: "-10%" }}
              transition={service.transition}
            >
              <div className="service-image-container">
                <img src={service.img} alt={service.title} className="service-image" />
              </div>
              <div className="service-info">
                <h3 className="service-name">{service.title}</h3>
                <p className="service-desc">{service.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className={`navbar ${currentView === 'about' ? 'about-nav' : ''} ${currentView === 'inspire' ? 'inspire-nav' : ''}`}>
        <div className="nav-logo-container" onClick={() => { setCurrentView('home'); setIsMenuOpen(false); window.scrollTo(0,0); }} style={{ cursor: 'pointer' }}>
          <div className="nav-logo">INBOX</div>
          <div className="nav-logo-subtitle">Printing packaging company</div>
        </div>
        <div className="nav-links">
          <button className={`nav-link ${currentView === 'home' ? 'active' : ''}`} onClick={() => { setCurrentView('home'); window.scrollTo(0,0); }}>Home</button>
          <button className={`nav-link ${currentView === 'inspire' ? 'active' : ''}`} onClick={() => { setCurrentView('inspire'); window.scrollTo(0,0); }}>Inspirations</button>
          <button className={`nav-link ${currentView === 'about' ? 'active' : ''}`} onClick={() => { setCurrentView('about'); window.scrollTo(0,0); }}>About</button>
          <button className="nav-cta" onClick={() => setIsQuoteOpen(true)}>Get a quote</button>
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
                <button className="mobile-menu-link" onClick={() => { setIsMenuOpen(false); setCurrentView('home'); window.scrollTo(0,0); }}>
                  <span className="menu-num">01</span>
                  <span className="menu-text">Home</span>
                </button>
                <button className="mobile-menu-link" onClick={() => { setIsMenuOpen(false); setCurrentView('inspire'); window.scrollTo(0,0); }}>
                  <span className="menu-num">02</span>
                  <span className="menu-text">Inspirations</span>
                </button>
                <button className="mobile-menu-link" onClick={() => { setIsMenuOpen(false); setCurrentView('about'); window.scrollTo(0,0); }}>
                  <span className="menu-num">03</span>
                  <span className="menu-text">About</span>
                </button>
              </div>
              <button className="mobile-menu-cta" onClick={() => { setIsMenuOpen(false); setIsQuoteOpen(true); }}>Get a quote</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {currentView === 'home' ? (
          <motion.main 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <section className="hero">
              <div className="hero-video-container">
                <video autoPlay muted loop playsInline className="hero-video">
                  <source src="/Assets/inbox-short-film.mp4" type="video/mp4" />
                </video>
                <div className="hero-overlay"></div>
              </div>
              <div className="hero-content">
                <h1 className="hero-title">Packaging<br />designed to be felt.</h1>
                
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-value"><Counter value={30} />+</span>
                    <span className="stat-label">years of experience</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">&gt;<Counter value={92} />%</span>
                    <span className="stat-label">satisfaction score</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value"><Counter value={270} />+</span>
                    <span className="stat-label">clients dealt</span>
                  </div>
                </div>

                <div className="hero-cta-wrapper">
                  <button className="hero-cta" onClick={() => setIsQuoteOpen(true)}>
                    <span className="hero-cta-text">Get a quote</span>
                    <span className="hero-cta-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </span>
                  </button>
                  <button className="hero-cta-secondary" onClick={() => { setCurrentView('inspire'); window.scrollTo(0,0); }}>
                    Find inspirations
                  </button>
                </div>
              </div>
            </section>

            <ServicesSection />
            <ProcessSection />
            <ClientSection />
            <ContactSection />
            <Footer />
          </motion.main>
        ) : currentView === 'inspire' ? (
          <FindInspire 
            key="inspire" 
          />
        ) : (
          <About 
            key="about"
            onOpenQuote={() => setIsQuoteOpen(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isQuoteOpen && <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
