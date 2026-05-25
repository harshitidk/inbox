import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, useScroll, useMotionValueEvent, AnimatePresence, useAnimationFrame } from 'framer-motion';
import { Sparkles, Star, StarHalf } from 'lucide-react';
import './App.css';
import FindInspire from './FindInspire';
import About from './About';
import { QuoteModal, QuoteForm } from './QuoteModalComponent';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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

  // Slide 1 stays put. Slide 2 covers slide 1. Slide 3 covers slide 2.
  // We align these with the snap points at 0, 0.33, 0.66
  const slide2X = useTransform(scrollYProgress, [0.1, 0.33], ['100%', '0%']);
  const slide3X = useTransform(scrollYProgress, [0.43, 0.66], ['100%', '0%']);

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
      title: "Complete\nUnderstanding",
      desc: "At Inbox, we start by understanding your brand, product needs, and usage. With 30+ years of printing and packaging expertise, we align materials, finishes, and timelines before moving to production.",
      bg: "linear-gradient(to bottom, #0065b7, #004981)",
      illustration: "/images/process/complete-understanding.png",
      step: "01"
    },
    {
      title: "Design &\nProduction",
      desc: "Our in-house team prepares print-ready files and executes precision manufacturing using advanced technology and high-quality materials.",
      bg: "linear-gradient(to bottom, #dca100, #b17300)",
      illustration: "/images/process/design-production.png",
      step: "02"
    },
    {
      title: "Quality Check\n& Delivery",
      desc: "Every finished product undergoes strict quality checks for print accuracy, material strength, and finishing.\nOnce approved, your orders are securely packed and delivered on schedule.",
      bg: "linear-gradient(to bottom, #008221, #003500)",
      illustration: "/Assets/process/quality-delivery-v4.png?v=4",
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
                <span className="process-label-text">How We <span className="cta-yellow">Do It</span></span>
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
                        [i === 0 ? 0.1 : 0.43, i === 0 ? 0.33 : 0.66],
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

const MarqueeRow = ({ logos, direction = 'left', baseSpeed = 40 }: { logos: string[], direction?: 'left' | 'right', baseSpeed?: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContainerWidth(contentRef.current.offsetWidth / 2);
    }
  }, [logos]);

  useAnimationFrame((_, delta) => {
    if (!containerWidth) return;

    const speed = isHovered ? baseSpeed * 0.4 : baseSpeed;
    const moveBy = (delta / 1000) * speed;

    let newX = x.get();
    if (direction === 'left') {
      newX -= moveBy;
      if (newX <= -containerWidth) newX = 0;
    } else {
      newX += moveBy;
      if (newX >= 0) newX = -containerWidth;
    }

    x.set(newX);
  });

  return (
    <div
      className="marquee-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ overflow: 'hidden' }}
    >
      <motion.div
        ref={contentRef}
        className="marquee-content"
        style={{ x, display: 'flex', gap: '80px', width: 'max-content' }}
      >
        {[...logos, ...logos].map((logo, i) => (
          <div key={i} className={`client-logo-card ${logo.includes('d_chica') ? 'card-d-chica' : ''} ${logo.includes('sun_pharma') ? 'card-sun-pharma' : ''} ${logo.includes('holyland') ? 'card-holyland' : ''}`}>
            <img
              src={logo}
              alt="Client Logo"
              className={`client-logo ${logo.includes('d_chica') ? 'logo-d-chica' : ''} ${logo.includes('holyland') ? 'logo-holyland' : ''}`}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const ClientSection = () => {
  const row1Logos = [
    '/logos/croma.png', '/logos/d_chica.png', '/logos/faber.png', '/logos/gulf.png', '/logos/hcl.png'
  ];

  const row2Logos = [
    '/logos/india_tv.png', '/logos/milton.png', '/logos/sos_organics.png', '/logos/sun_pharma.png', '/logos/venu.png', '/logos/holyland.png'
  ];

  const testimonials = [
    {
      text: "We've done multiple bulk orders with Inbox & the output has been just perfect every time. The Team has always been flexible & quick to adapt, which makes working with them really easy.",
      name: "Prateek Arora",
      company: "NSF",
      rating: 5
    },
    {
      text: "We've been working with Inbox for a long time now, & honestly, the biggest relief is not having to worry. The quality is consistent & deadlines are met without constant follow-ups.",
      name: "Amrita Chengappa",
      company: "SOS Organics",
      rating: 4
    },
    {
      text: "Finding a print partner you can trust long-term is rare. They have supported our brand across multiple product lines with consistent quality & clear communication!",
      name: "Yogesh Chaddha",
      company: "GenPure Zheng Filters",
      rating: 5
    }
  ];

  return (
    <section className="client-section" id="clients">
      <div className="client-header">
        <h2 className="client-title"><span className="cta-yellow">Trusted by</span> Industry Leaders</h2>
        <p className="client-subtitle">Delivering precision and quality to brands across industries.</p>
      </div>

      <div className="marquee-wrapper">
        <MarqueeRow logos={row1Logos} direction="left" baseSpeed={78} />
        <MarqueeRow logos={row2Logos} direction="right" baseSpeed={78} />
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
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    if (t.rating >= ratingValue) {
                      return <Star key={index} size={14} fill="#ffd100" stroke="#ffd100" />;
                    } else if (t.rating >= ratingValue - 0.5) {
                      return <StarHalf key={index} size={14} fill="#ffd100" stroke="#ffd100" />;
                    } else {
                      return <Star key={index} size={14} color="#333" />;
                    }
                  })}
                </div>
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

const ContactSection = ({ prefilledQuery }: { prefilledQuery?: string }) => {
  return (
    <section className="contact-section" id="contact">
      <motion.div
        className="contact-container"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="contact-info">
          <h2 className="contact-title"><span className="cta-yellow">Get In</span> Touch</h2>

          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-label">Email:</span>
              <span className="contact-value">contact@inbox.net.in</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Phone:</span>
              <span className="contact-value">+91 9599445699</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Address:</span>
              <span className="contact-value">W-22, Okhla Phase-2,<br />New Delhi, 110020</span>
            </div>
          </div>

          <div className="contact-social">
            <span className="contact-label">Follow Our Journey</span>
            <div className="social-icons">
              <a href="https://www.instagram.com/inbox.it" target="_blank" rel="noopener noreferrer" className="social-pill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                <span>Instagram</span>
              </a>

              <a href="https://www.linkedin.com/company/inboxprints/" target="_blank" rel="noopener noreferrer" className="social-pill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        <div className="contact-form-wrapper">
          <QuoteForm initialQuery={prefilledQuery} />
        </div>
      </motion.div>
    </section>
  );
};



const ServicesSection = ({ onServiceClick }: { onServiceClick: (service: any) => void }) => {
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
      img: "/Assets/services/1st.jpg",
      title: "Packaging",
      desc: "Premium packaging solutions designed to elevate your product presentation and brand experience.",
      products: [
        "Customised Boxes",
        "Corrugated Boxes",
        "Rigid Gift Boxes / Hampers",
        "Paper Bags",
        "Wrapping Sheets"
      ],
      parallax: yFast,
      initial: { x: -80, y: 100, opacity: 0 },
      whileInView: { x: 0, y: 0, opacity: 1 },
      transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] as any, delay: 0.1 }
    },
    {
      img: "/Assets/services/2nd.png",
      title: "Printing",
      desc: "Print essentials that make your brand look sharp, polished, and impossible to ignore.",
      products: [
        "Labels and Stickers",
        "Business Cards",
        "Price and Hang Tags",
        "Flex Banners / Standees",
        "Catalogues and Brochures",
        "Greeting Cards & Envelopes"
      ],
      parallax: ySlower,
      initial: { scale: 0.9, opacity: 0, filter: 'blur(15px)' },
      whileInView: { scale: 1, opacity: 1, filter: 'blur(0px)' },
      transition: { duration: 2, ease: [0.16, 1, 0.3, 1] as any, delay: 0.3 }
    },
    {
      img: "/Assets/services/3rd.JPG",
      title: "Packaging Strategy & Consulting",
      desc: "Smart packaging decisions that make your brand look better, feel premium, and work harder.",
      products: [
        "Material Selection",
        "Size Optimisation",
        "Cost Optimisation",
        "Packaging Innovation",
        "Packaging Re-designing",
        "Unboxing Experience"
      ],
      parallax: ySlow,
      initial: { x: 100, opacity: 0 },
      whileInView: { x: 0, opacity: 1 },
      transition: { duration: 1.8, ease: [0.16, 1, 0.3, 1] as any, delay: 0.2 }
    },
    {
      img: "/Assets/services/4th.jpg",
      title: "PR & Influencer Packaging Solutions",
      desc: "Impactful packaging experiences created specifically for influencer marketing, PR campaigns, and brand launches.",
      products: [
        "Custom PR & Influencer Boxes",
        "Magnetic Lid Rigid Boxes",
        "Drawer-Style Premium Packaging",
        "Limited Edition Campaign Packaging",
        "Unboxing Experience Design",
        "Brand Storytelling Through Packaging"
      ],
      parallax: ySlow,
      initial: { x: -50, y: 150, opacity: 0 },
      whileInView: { x: 0, y: 0, opacity: 1 },
      transition: { duration: 1.7, ease: [0.16, 1, 0.3, 1] as any, delay: 0.2 }
    },
    {
      img: "/Assets/services/5th.png",
      title: "Corporate Gifting & Merchandise",
      desc: "Customized gifting and merchandise solutions that strengthen brand presence and corporate relationships.",
      products: [
        "Employee Welcome Kits",
        "Festive Gift Hampers",
        "Conference Kits",
        "Custom Merchandise",
        "Diaries, Notepads, Pens, Mugs, Bottles, T-Shirts & More"
      ],
      parallax: yFast,
      initial: { scale: 0.95, y: 120, opacity: 0, filter: 'blur(10px)' },
      whileInView: { scale: 1, y: 0, opacity: 1, filter: 'blur(0px)' },
      transition: { duration: 1.9, ease: [0.16, 1, 0.3, 1] as any, delay: 0.4 }
    },
    {
      img: "/Assets/services/6th.JPG",
      title: "Sustainable Packaging Solutions",
      desc: "Better-for-the-planet packaging without compromising on looks or quality.",
      products: [
        "Sustainable Packaging Consulting",
        "Eco-Friendly Material Selection",
        "Recyclable & Reusable Packaging Solutions",
        "Plastic Reduction Strategies",
        "Minimal & Low-Waste Packaging Design",
        "Sustainable Sourcing & Production Guidance"
      ],
      parallax: ySlower,
      initial: { y: 180, opacity: 0 },
      whileInView: { y: 0, opacity: 1 },
      transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] as any, delay: 0.1 }
    }
  ];

  return (
    <section className="services" ref={servicesRef}>
      <div className="paper-texture-overlay"></div>
      <div className="services-header">
        <h2 className="services-title">Things We Do <br /> <span className="cta-yellow">For You</span></h2>
        <p className="services-desc">From concept to production, we deliver precision in every print.</p>
      </div>
      <div className="services-grid">
        {serviceData.map((service, index) => (
          <motion.div
            key={index}
            className="service-parallax-wrapper"
          >
            <motion.div
              className="service-card"
              initial={service.initial}
              whileInView={service.whileInView}
              viewport={{ once: true, margin: "-10%" }}
              transition={service.transition}
              onClick={() => onServiceClick(service)}
            >
              <div className="service-image-container">
                <img src={service.img} alt={service.title} className="service-image" />
              </div>
              <div className="service-info">
                <h3 className="service-name">{service.title}</h3>
                <p className="service-desc">{service.desc}</p>
                <div className="service-readmore">
                  <span>READ MORE</span>
                  <svg className="readmore-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
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
  const [selectedService, setSelectedService] = useState<{ img: string; title: string; desc: string; products: string[] } | null>(null);
  const [prefilledQuery, setPrefilledQuery] = useState('');

  const handleGetInTouch = (serviceTitle: string, subServicesList: string) => {
    const query = `Hi Inbox team, I am interested in your services for "${serviceTitle}", specifically regarding: ${subServicesList}. Please get in touch with me to discuss my requirements.`;
    setPrefilledQuery(query);
    setSelectedService(null);
    setCurrentView('home');
    
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        setIsQuoteOpen={setIsQuoteOpen}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

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
                  <source src="/Assets/inbox-short-film.mp4?v=2" type="video/mp4" />
                </video>
                <div className="hero-overlay"></div>
              </div>
              <div className="hero-content">
                <h1 className="hero-title">Packaging<br />designed to be felt.</h1>

                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-value"><Counter value={30} />+</span>
                    <span className="stat-label">years of exp.</span>
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
                    <span className="hero-cta-text">Get a Quote</span>
                    <span className="hero-cta-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </span>
                  </button>
                  <button className="hero-cta-secondary" onClick={() => { setCurrentView('inspire'); window.scrollTo(0, 0); }}>
                    <span className="hero-cta-text">Find Inspirations</span>
                    <span className="hero-cta-icon-secondary">
                      <Sparkles size={18} strokeWidth={2.0} />
                    </span>
                  </button>
                </div>
              </div>
            </section>

            <ServicesSection onServiceClick={(service) => setSelectedService(service)} />
            <ProcessSection />
            <ClientSection />
            <ContactSection prefilledQuery={prefilledQuery} />

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
        {isQuoteOpen && <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} initialQuery={prefilledQuery} />}
      </AnimatePresence>

      <AnimatePresence>
        {selectedService && (
          <ServiceModal
            isOpen={!!selectedService}
            service={selectedService}
            onClose={() => setSelectedService(null)}
            onGetInTouch={handleGetInTouch}
          />
        )}
      </AnimatePresence>

      {currentView !== 'about' && currentView !== 'inspire' && <Footer />}
    </>
  );
}

/* ── Service Details Modal Component ── */
interface ServiceModalProps {
  isOpen: boolean;
  service: { img: string; title: string; desc: string; products: string[] } | null;
  onClose: () => void;
  onGetInTouch: (serviceTitle: string, subServicesList: string) => void;
}

function ServiceModal({ isOpen, service, onClose, onGetInTouch }: ServiceModalProps) {
  useEffect(() => {
    if (isOpen && service) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, service]);

  if (!service) return null;

  const subServices = service.products;

  return (
    <motion.div
      className="service-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="service-modal-content"
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="service-modal-close" onClick={onClose} aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="service-modal-grid">
          <div className="service-modal-image-wrapper">
            <img src={service.img} alt={service.title} className="service-modal-img" />
            <div className="service-modal-image-overlay"></div>
          </div>

          <div className="service-modal-details">
            <div className="service-modal-category">OUR EXPERTISE</div>
            <h2 className="service-modal-title">{service.title}</h2>
            <p className="service-modal-intro">
              Explore our premium, customized solutions engineered with exceptional precision and luxury craftsmanship:
            </p>

            <div className="sub-services-grid">
              {subServices.map((sub, index) => (
                <motion.div
                  key={index}
                  className="sub-service-card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + index * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="sub-service-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="sub-service-name">{sub}</span>
                </motion.div>
              ))}
            </div>

            <div className="service-modal-actions">
              <button 
                className="service-modal-cta" 
                onClick={() => onGetInTouch(service.title, service.products.join(', '))}
              >
                <span className="service-modal-cta-text">Get in touch</span>
                <span className="service-modal-cta-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
