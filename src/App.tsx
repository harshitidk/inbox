import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useScroll, useMotionValueEvent } from 'framer-motion';
import './App.css';

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
      title: "Complete\nUnderstanding",
      desc: "At Inbox®, we start by understanding your brand, product needs, and usage. With 30+ years of printing and packaging expertise, we align materials, finishes, and timelines before moving to production.",
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
      desc: "Every finished product undergoes strict quality checks for print accuracy, material strength, and finishing. Once approved, your orders are securely packed and delivered on schedule.",
      bg: "linear-gradient(to bottom, #008221, #003500)",
      illustration: "/images/process/quality-delivery.png",
      step: "03"
    }
  ];


  const slideXValues = [undefined, slide2X, slide3X]; // slide 1 has no transform
  const trackerLabels = ["Complete Understanding", "Design & Production", "Quality Check & Delivery"];

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
                <span className="process-label-text">HOW WE DO IT</span>
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

export default function App() {
  const servicesRef = useRef<HTMLElement>(null);
  const { scrollYProgress: servicesScroll } = useScroll({
    target: servicesRef,
    offset: ["start end", "end start"]
  });

  const yFast = useTransform(servicesScroll, [0, 1], [120, -120]);
  const ySlow = useTransform(servicesScroll, [0, 1], [60, -60]);
  const ySlower = useTransform(servicesScroll, [0, 1], [30, -30]);

  const serviceData = [
    {
      img: "/images/services/packaging-boxes.png",
      title: "Packaging Boxes",
      desc: "Customized Boxes, Storage Cartons, Paper Bags, Carry Bags",
      parallax: yFast,
      initial: { x: -80, y: 100, opacity: 0 },
      whileInView: { x: 0, y: 0, opacity: 1 },
      transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }
    },
    {
      img: "/images/services/labels-stickers.png",
      title: "Labels, Stickers & Tags",
      desc: "Product Labels, Personalised Sheet Stickers, Barcode/QR Labels, Price Tags, Hang Tags",
      parallax: ySlower,
      initial: { scale: 0.9, opacity: 0, filter: 'blur(15px)' },
      whileInView: { scale: 1, opacity: 1, filter: 'blur(0px)' },
      transition: { duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }
    },
    {
      img: "/images/services/display-signage.png",
      title: "Display & Signage",
      desc: "Flex Banners, Standees, Cut-outs, Vinyl Prints with Sunboards",
      parallax: ySlow,
      initial: { x: 100, opacity: 0 },
      whileInView: { x: 0, opacity: 1 },
      transition: { duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }
    },
    {
      img: "/images/services/marketing-collaterals.png",
      title: "Marketing Print Collaterals",
      desc: "Catalogues, Posters, Vinyl Posters, Tent Cards, Books, Calendars (Wall & Table)",
      parallax: ySlow,
      initial: { x: -50, y: 150, opacity: 0 },
      whileInView: { x: 0, y: 0, opacity: 1 },
      transition: { duration: 1.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }
    },
    {
      img: "/images/services/specialty-printing.png",
      title: "Specialty & Precision Printing",
      desc: "Vinyl Stickers, Laser Cut Paper Stickers, Laser Cut Vinyl Stickers",
      parallax: yFast,
      initial: { scale: 0.95, y: 120, opacity: 0, filter: 'blur(10px)' },
      whileInView: { scale: 1, y: 0, opacity: 1, filter: 'blur(0px)' },
      transition: { duration: 1.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }
    },
    {
      img: "/images/services/corporate-merchandise.png",
      title: "Corporate Merchandise",
      desc: "Corporate Gifts, Pens, Diaries, T-Shirts, Jackets, Laptop Bags, Sippers",
      parallax: ySlower,
      initial: { y: 180, opacity: 0 },
      whileInView: { y: 0, opacity: 1 },
      transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }
    }
  ];

  return (
    <main>
      <nav className="navbar">
        <div className="nav-logo-container">
          <div className="nav-logo">INBOX</div>
          <div className="nav-logo-subtitle">printing packaging company</div>
        </div>
        <div className="nav-links">
          <a href="#" className="nav-link">About us</a>
          <a href="#" className="nav-link">Clients</a>
          <a href="#" className="nav-link">Process</a>
          <a href="#" className="nav-link">Inspirations</a>
          <button className="nav-cta">Get a Quote</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-video-container">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="hero-video"
          >
            <source src="/Assets/inbox-short-film.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="hero-text-group">
            <h1 className="hero-title">
              Packaging<br />designed to be felt.
            </h1>
            <div className="hero-cta-wrapper">
              <button className="hero-cta">
                <span className="hero-cta-text">Get a quote</span>
                <span className="hero-cta-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </span>
              </button>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">
                <Counter value={30} />+
              </span>
              <span className="stat-label">years of experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                &gt;<Counter value={92} />%
              </span>
              <span className="stat-label">satisfaction score</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                <Counter value={270} />+
              </span>
              <span className="stat-label">clients dealt</span>
            </div>
          </div>
        </div>
      </section>

      <motion.section ref={servicesRef} className="services" id="work">
        <motion.div 
          className="services-header"
          initial={{ opacity: 0, y: 60, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="services-title">THINGS WE DO<br />FOR YOU</h2>
          <p className="services-desc">
            Packaging, printing, and gifting experiences shaped through craftsmanship, materiality, and intentional design.
          </p>
        </motion.div>
        
        <div className="services-grid">
          {serviceData.map((item, i) => (
            <motion.div key={i} style={{ y: item.parallax }} className="service-parallax-wrapper">
              <motion.div 
                className="service-card"
                initial={item.initial}
                whileInView={item.whileInView}
                viewport={{ once: true, margin: "-10%" }}
                transition={item.transition}
              >
                <div className="service-image-container">
                  <img src={item.img} alt={item.title} className="service-image" />
                </div>
                <div className="service-info">
                  <h3 className="service-name">{item.title}</h3>
                  <p className="service-desc">{item.desc}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <ProcessSection />
    </main>
  );
}
