import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue, AnimatePresence, useMotionTemplate, useInView } from 'framer-motion';
import './App.css';

function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <motion.div
      className="custom-cursor"
      animate={{
        x: mousePosition.x - 20,
        y: mousePosition.y - 20,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 28,
        mass: 0.5
      }}
    />
  );
}

function Word({ children, progress, range }: { children: React.ReactNode, progress: MotionValue<number>, range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.35, 1], { clamp: true });
  const color = useTransform(progress, range, ["#A0A0A0", "#0069b9"], { clamp: true });
  
  return (
    <motion.span className="word-span" style={{ opacity, color }}>
      {children}
    </motion.span>
  );
}

function BackgroundGrid({ progress }: { progress: MotionValue<number> }) {
  // Mechanical shifts and recalibration scaling
  const yShift1 = useTransform(progress, [0, 1], [0, 120]);
  const yShift2 = useTransform(progress, [0, 1], [0, -80]);
  const yShift3 = useTransform(progress, [0, 1], [0, 60]);

  const scaleX1 = useTransform(progress, [0, 0.5, 1], [0.98, 1, 0.98]);
  const scaleX2 = useTransform(progress, [0, 0.5, 1], [1, 0.96, 1]);

  const opacity1 = useTransform(progress, [0, 0.3, 0.6, 1], [0.3, 0.8, 0.3, 0.8]);
  const opacity2 = useTransform(progress, [0, 0.5, 1], [0.8, 0.2, 0.8]);

  return (
    <motion.div 
      className="bg-grid-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0, 1] }}
      transition={{ duration: 2.3, times: [0, 0.13, 0.35], ease: "easeIn" }}
    >
      {/* Structural Vertical Lines */}
      <div className="grid-v-line" style={{ left: '16.66%' }}></div>
      <div className="grid-v-line" style={{ left: '33.33%' }}></div>
      <div className="grid-v-line center-line" style={{ left: '50%' }}></div>
      <div className="grid-v-line" style={{ left: '66.66%' }}></div>
      <div className="grid-v-line" style={{ left: '83.33%' }}></div>

      {/* Evolving Horizontal Lines */}
      <motion.div className="grid-h-line" style={{ top: '25%', y: yShift1, scaleX: scaleX1, opacity: opacity1 }}></motion.div>
      <motion.div className="grid-h-line" style={{ top: '50%', y: yShift2, opacity: 0.5 }}></motion.div>
      <motion.div className="grid-h-line" style={{ top: '75%', y: yShift3, scaleX: scaleX2, opacity: opacity2 }}></motion.div>

      {/* Registration Marks / Crosshairs */}
      <motion.div className="grid-crosshair" style={{ left: '33.33%', top: '25%', y: yShift1, opacity: opacity1 }}>
         <div className="ch-v" />
         <div className="ch-h" />
      </motion.div>
      
      <motion.div className="grid-crosshair" style={{ left: '66.66%', top: '75%', y: yShift3, opacity: opacity2 }}>
         <div className="ch-v" />
         <div className="ch-h" />
      </motion.div>

      {/* Precision Measurements / Ticks */}
      <motion.div className="grid-ruler" style={{ top: '50%', left: '50%', y: yShift2 }}>
        <div className="ruler-tick" />
        <div className="ruler-tick" />
        <div className="ruler-tick" />
        <div className="ruler-tick" />
        <div className="ruler-tick" />
      </motion.div>

      {/* Technical Labels */}
      <motion.div className="grid-label" style={{ top: '25%', left: '16.66%', y: yShift1 }}>
        CAL-01
      </motion.div>
      <motion.div className="grid-label" style={{ top: '75%', left: '83.33%', y: yShift3 }}>
        REF-B
      </motion.div>
    </motion.div>
  );
}

/**
 * Hook to detect if the nav bar is over a dark section
 */

function SystemNoise() {
  return (
    <>
      <div className="sys-noise sys-flicker" />
      <div className="sys-scanline sys-drift" />
    </>
  );
}

function SysOverlayHero() {
  return (
    <div className="sys-overlay-container">
      <div className="sys-microtext" style={{ top: '3%', left: '3%' }}>NAS-001 // SYS BOOT</div>
      <div className="sys-microtext" style={{ top: '3%', right: '3%' }}>VER 1.0.4</div>
      <div className="sys-barcode" style={{ bottom: '20%', left: '4%' }} />
      <div className="sys-microtext" style={{ bottom: '18%', left: '4%' }}>L-9920</div>
    </div>
  );
}

function SysOverlayMid() {
  return (
    <div className="sys-overlay-container">
      <div className="sys-microtext" style={{ top: '5%', left: '3%' }}>MODULE_ACTIVE</div>
      <div className="sys-barcode" style={{ top: '5%', right: '3%' }} />
      <div className="sys-microtext" style={{ top: '10%', right: '3%' }}>REF 11-5110</div>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '10%', width: '1px', borderLeft: '1px dashed rgba(0,0,0,0.1)' }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: '10%', width: '1px', borderRight: '1px dashed rgba(0,0,0,0.1)' }} />
      <div className="sys-microtext" style={{ bottom: '5%', right: '3%' }}>COORDS: 28.6139° N, 77.2090° E</div>
    </div>
  );
}

function SysOverlayFooter() {
  return (
    <div className="sys-overlay-container" style={{ position: 'fixed', pointerEvents: 'none' }}>
      <div className="sys-microtext" style={{ bottom: '60px', left: '40px' }}>SYS DUMP // RUNNING...</div>
      <div className="sys-barcode" style={{ bottom: '60px', left: '200px', width: '150px' }} />
      <div className="sys-microtext" style={{ bottom: '60px', right: '40px' }}>STATUS: NOMINAL</div>
      <div className="sys-barcode" style={{ bottom: '80px', right: '40px', width: '60px' }} />
    </div>
  );
}

/* -----------------------------------------------
   Service Card — scroll-linked slide-in wrapper
----------------------------------------------- */
function ServiceCard({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: React.ReactNode;
}) {
  // Slide up from 300px below — deep, dramatic entrance
  const y = useTransform(progress, [range[0], range[1]], [300, 0], { clamp: true });
  const scale = useTransform(progress, [range[0], range[1]], [0.92, 1], { clamp: true });
  // No opacity animation — overflow:hidden on the wrapper hides cards until they slide up.
  // This guarantees cards are ALWAYS fully visible once in position.

  return (
    <motion.div className="service-card" style={{ y, scale }}>
      {children}
    </motion.div>
  );
}

/* -----------------------------------------------
   Services Section — sticky scroll reveal
----------------------------------------------- */
function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Title: scroll 0 → 0.08 (y + blur only, always full opacity)
  const titleY = useTransform(scrollYProgress, [0, 0.08], [40, 0], { clamp: true });
  const titleBlur = useTransform(scrollYProgress, [0, 0.08], [4, 0], { clamp: true });
  const titleFilter = useTransform(titleBlur, (v) => `blur(${v}px)`);

  return (
    <section className="services-section" ref={ref} data-theme="dark">
      <div className="services-sticky-wrapper">
        <motion.h2
          className="services-title"
          style={{ y: titleY, filter: titleFilter }}
        >
          <span className="sys-heading-meta">SYS-SRV-LIST | 01</span>
          we offer you
        </motion.h2>
        <div className="services-grid">
          {/* Card 01 — scroll 0.1 → 0.3 */}
          <ServiceCard progress={scrollYProgress} range={[0.1, 0.3]}>
            <div className="service-card-header">
              <span className="service-id">[ 01 ]</span>
            </div>
            <div className="service-image-container">
              <h3 className="service-label">printing systems</h3>
              <div className="service-image-wrapper">
                <img src="/service-1.png" alt="Printing Systems" className="service-image" />
              </div>
              <div className="service-overlay">
                <div className="service-overlay-content">
                  <h3>Printing Systems</h3>
                  <ul>
                    <li>Offset Printing</li>
                    <li>Digital Printing</li>
                    <li>Large Format</li>
                    <li>Specialty Finishes</li>
                  </ul>
                </div>
              </div>
            </div>
          </ServiceCard>

          {/* Card 02 — scroll 0.3 → 0.5 */}
          <ServiceCard progress={scrollYProgress} range={[0.3, 0.5]}>
            <div className="service-card-header">
              <span className="service-id">[ 02 ]</span>
            </div>
            <div className="service-image-container">
              <h3 className="service-label">branding & assets</h3>
              <div className="service-image-wrapper">
                <img src="/service-2.png" alt="Branding & Print Assets" className="service-image" />
              </div>
              <div className="service-overlay">
                <div className="service-overlay-content">
                  <h3>Packaging Systems</h3>
                  <ul>
                    <li>Packaging Boxes</li>
                    <li>Structural Packaging</li>
                    <li>Inserts</li>
                    <li>Labels & Tags</li>
                  </ul>
                </div>
              </div>
            </div>
          </ServiceCard>

          {/* Card 03 — scroll 0.5 → 0.7 */}
          <ServiceCard progress={scrollYProgress} range={[0.5, 0.7]}>
            <div className="service-card-header">
              <span className="service-id">[ 03 ]</span>
            </div>
            <div className="service-image-container">
              <h3 className="service-label">display & experience</h3>
              <div className="service-image-wrapper">
                <img src="/display_experience_service_1777743175048.png" alt="Display & Experience" className="service-image" />
              </div>
              <div className="service-overlay">
                <div className="service-overlay-content">
                  <h3>Display & Experience</h3>
                  <ul>
                    <li>Retail Displays</li>
                    <li>Exhibition Stands</li>
                    <li>Signage</li>
                    <li>Event Materials</li>
                  </ul>
                </div>
              </div>
            </div>
          </ServiceCard>

          {/* Card 04 — scroll 0.7 → 0.9 */}
          <ServiceCard progress={scrollYProgress} range={[0.7, 0.9]}>
            <div className="service-card-header">
              <span className="service-id">[ 04 ]</span>
            </div>
            <div className="service-image-container">
              <h3 className="service-label">custom & scale</h3>
              <div className="service-image-wrapper">
                <img src="/custom_scale_production_1777743195201.png" alt="Custom & Scale" className="service-image" />
              </div>
              <div className="service-overlay">
                <div className="service-overlay-content">
                  <h3>Custom & Scale</h3>
                  <ul>
                    <li>Prototyping</li>
                    <li>Mass Production</li>
                    <li>Quality Control</li>
                    <li>Global Shipping</li>
                  </ul>
                </div>
              </div>
            </div>
          </ServiceCard>
        </div>
      </div>
    </section>
  );
}

/* -----------------------------------------------
   Process Section — circular scroll-driven reveal
----------------------------------------------- */
const PROCESS_STEPS = [
  {
    label: '01 / INIT',
    headline: 'Complete Understanding',
    subtext: 'We begin by mapping every variable — material specs, brand guidelines, structural tolerances, and delivery constraints. Nothing is assumed.',
  },
  {
    label: '02 / PROCESS',
    headline: 'Design & Production',
    subtext: 'From die-line engineering to press calibration, every element is built with repeatable precision. We produce at the intersection of craft and system.',
  },
  {
    label: '03 / VERIFIED',
    headline: 'Quality Check & Delivery',
    subtext: 'Each unit is inspected against specification. Color accuracy, structural integrity, finishing quality — verified before it leaves the facility.',
  },
];

// Positions for the 3 nodes on the circle (in degrees, 0 = top)
// Top = 270°, Right = 30°, Bottom-left = 150° (in standard math coords)
const NODE_ANGLES = [270, 30, 150]; // degrees

function getPointOnCircle(angleDeg: number, radius: number, cx: number, cy: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

/* -----------------------------------------------
   Clients Section — Precision Grid
----------------------------------------------- */
function ClientsSection() {
  const allClients = [
    { name: 'Faber', logo: '/logos/faber.png' },
    { name: 'Venu Eye Hospital', logo: '/logos/venu.png' },
    { name: 'HCL', logo: '/logos/hcl.png' },
    { name: 'Sun Pharma', logo: '/logos/sun_pharma.png' },
    { name: 'Croma', logo: '/logos/croma.png' },
    { name: 'India TV', logo: '/logos/india_tv.png' },
    { name: 'SOS Organics', logo: '/logos/sos_organics.png' },
    { name: 'D\'Chica', logo: '/logos/d_chica.png' },
    { name: 'Milton', logo: '/logos/milton.png' },
    { name: 'Gulf', logo: '/logos/gulf.png' },
    { name: 'Faber (Group)', logo: '/logos/faber.png' },
    { name: 'Croma (Group)', logo: '/logos/croma.png' },
  ];

  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-15% 0px -15% 0px" });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end center", "end start"]
  });
  
  // Fade and scale down slightly when scrolling past
  const opacityExit = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const scaleExit = useTransform(scrollYProgress, [0, 1], [1, 0.98]);

  return (
    <section className="clients-section" id="clients" ref={ref} data-theme="dark">
      <motion.div 
        className="clients-container"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{ opacity: opacityExit, scale: scaleExit }}
      >
        {/* Background Activation Panel */}
        <motion.div 
          className="clients-bg-panel"
          variants={{
            hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
            visible: { clipPath: "inset(0 0 0% 0)", opacity: 1, transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } }
          }}
        />
        
        {/* Horizontal Scanline */}
        <motion.div 
          className="clients-scanline"
          variants={{
            hidden: { top: "0%", opacity: 0 },
            visible: { top: "100%", opacity: [0, 0.4, 0], transition: { duration: 2.5, ease: "linear" } }
          }}
        />

        <div className="clients-section-label">
          <motion.span 
            className="clients-section-tag"
            variants={{
              hidden: { opacity: 0, y: 4 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3 } }
            }}
          >
            PARTNERS
          </motion.span>
          <motion.h2 
            className="clients-section-title"
            variants={{
              hidden: { opacity: 0.05, y: 4, filter: "blur(4px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] } }
            }}
          >
            trusted by the best
          </motion.h2>
        </div>
        
        <motion.div 
          className="clients-grid"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.9 }
            }
          }}
        >
          {allClients.map((client, i) => (
            <motion.div 
              key={i} 
              className="client-box sys-box"
              variants={{
                hidden: { opacity: 0, scale: 0.96, borderColor: "rgba(238,232,219,0)" },
                visible: { 
                  opacity: 1, 
                  scale: 1, 
                  borderColor: "rgba(238,232,219,0.15)",
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
                }
              }}
            >
              <div className="sys-crop-tl"/><div className="sys-crop-tr"/><div className="sys-crop-bl"/><div className="sys-crop-br"/>
              <div className="client-content">
                <span className="client-id">{`C-${(i + 1).toString().padStart(2, '0')}`}</span>
                {client.logo ? (
                  <motion.img 
                    src={client.logo} 
                    alt={client.name} 
                    className="client-logo" 
                    variants={{
                      hidden: { opacity: 0, filter: "grayscale(1) invert(1) brightness(2) blur(4px)" },
                      visible: { opacity: 0.5, filter: "grayscale(1) invert(1) brightness(2) blur(0px)", transition: { duration: 0.8, delay: 0.15, ease: "easeOut" } }
                    }}
                  />
                ) : (
                  <div className="client-logo-dummy" />
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="clients-sys-meta"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 0.5, transition: { duration: 1.5, delay: 2.2 } }
          }}
        >
          <div className="sys-barcode" style={{ position: 'relative', height: '12px', width: '80px' }} />
          <span className="sys-meta-text">SYS DUMP / RUNNING...</span>
        </motion.div>
        
      </motion.div>
    </section>
  );
}


function ProcessSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // --- Circle ring visibility (only the ring fades in, not the text) ---
  const ringOpacity = useTransform(scrollYProgress, [0.02, 0.10], [0, 1], { clamp: true });

  // --- Grid intensity (subtle background detail) ---
  const gridIntensity = useTransform(scrollYProgress, [0, 0.15, 0.5, 0.9, 1], [0.3, 0.7, 0.8, 0.7, 0.4], { clamp: true });

  // --- Title scroll animation ---
  const titleY = useTransform(scrollYProgress, [0, 0.12], [40, 0], { clamp: true });
  const titleScale = useTransform(scrollYProgress, [0, 0.12], [0.95, 1], { clamp: true });


  // --- Blue progress circle (strokeDashoffset draws the arc) ---
  const circleCircumference = 2 * Math.PI * 220; // circleR = 220
  const progressOffset = useTransform(
    scrollYProgress,
    [0.10, 0.35, 0.65, 0.92],
    [circleCircumference, circleCircumference * 0.66, circleCircumference * 0.33, 0],
    { clamp: true }
  );

  // --- Active step index (0, 1, 2) ---
  const activeStep = useTransform(scrollYProgress, (v) => {
    if (v < 0.15) return -1;       // entry
    if (v < 0.35) return 0;        // step 01
    if (v < 0.65) return 1;        // step 02
    if (v < 0.9) return 2;         // step 03
    return 3;                      // completion
  });

  const [currentStep, setCurrentStep] = useState(-1);
  useEffect(() => {
    const unsubscribe = activeStep.on('change', (v) => setCurrentStep(v));
    return () => unsubscribe();
  }, [activeStep]);

  // --- Indicator dot angle along the circle ---
  const dotAngle = useTransform(scrollYProgress, [0.15, 0.35, 0.65, 0.9], [270, 390, 510, 630], { clamp: true });

  // --- Center content Y translations only (NO opacity animation) ---
  const centerY0 = useTransform(scrollYProgress, [0.15, 0.20], [30, 0], { clamp: true });
  const centerY1 = useTransform(scrollYProgress, [0.35, 0.40], [30, 0], { clamp: true });
  const centerY2 = useTransform(scrollYProgress, [0.65, 0.70], [30, 0], { clamp: true });

  // Circle dimensions
  const circleR = 220;
  const cx = 300;
  const cy = 300;

  return (
    <section className="process-section" ref={ref} data-theme="light">
      <div className="process-sticky-wrapper">
        <div className="process-container">
          {/* Section title — scroll-animated */}
          <div className="process-section-label">
            <motion.h2 
              className="process-section-title" 
              style={{ y: titleY, scale: titleScale, opacity: 1 }}
            >
              <span className="sys-heading-meta">PRC-SEQ | 02</span>
              our process
            </motion.h2>
          </div>

          {/* Process visualization area */}
          <div className="process-visual">
            {/* Background measurement grid */}
            <motion.div className="process-grid-overlay" style={{ opacity: gridIntensity }}>
              <div className="pg-line pg-h" style={{ top: '25%' }} />
              <div className="pg-line pg-h" style={{ top: '50%' }} />
              <div className="pg-line pg-h" style={{ top: '75%' }} />
              <div className="pg-line pg-v" style={{ left: '25%' }} />
              <div className="pg-line pg-v" style={{ left: '50%' }} />
              <div className="pg-line pg-v" style={{ left: '75%' }} />
              {/* Calculation marks */}
              <div className="pg-calc" style={{ top: '18%', left: '12%' }}>δ = 0.02</div>
              <div className="pg-calc" style={{ top: '78%', right: '10%' }}>σ = 1.04</div>
              <div className="pg-calc" style={{ bottom: '8%', left: '18%' }}>μ = 0.98</div>
            </motion.div>

            {/* SVG Circle System */}
            <svg className="process-svg" viewBox="0 0 600 600">
              {/* Dotted circular path (background track) */}
              <motion.circle
                cx={cx}
                cy={cy}
                r={circleR}
                fill="none"
                stroke="rgba(0,0,0,0.12)"
                strokeWidth="1.5"
                strokeDasharray="6 10"
                style={{ opacity: ringOpacity }}
              />

              {/* Blue progress circle — draws as you scroll */}
              <motion.circle
                cx={cx}
                cy={cy}
                r={circleR}
                fill="none"
                stroke="#0069b9"
                strokeWidth="3"
                strokeLinecap="round"
                style={{
                  strokeDasharray: circleCircumference,
                  strokeDashoffset: progressOffset,
                  opacity: ringOpacity,
                  transformOrigin: '50% 50%',
                  transform: 'rotate(-90deg)',
                }}
              />

              {/* Node points — always full opacity once visible */}
              {NODE_ANGLES.map((angle, i) => {
                const pos = getPointOnCircle(angle, circleR, cx, cy);
                const isActive = currentStep >= i;
                return (
                  <g key={i} opacity={isActive ? 1 : 0.4}>
                    {/* Outer ring */}
                    <circle cx={pos.x} cy={pos.y} r="18" fill="none" stroke={isActive ? "rgba(0, 105, 185, 0.6)" : "rgba(0, 105, 185, 0.3)"} strokeWidth="1.5" />
                    {/* Inner dot */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="6"
                      fill={isActive ? '#0069b9' : 'rgba(0, 105, 185, 0.2)'}
                    />
                    {/* Tick marks */}
                    <line x1={pos.x - 26} y1={pos.y} x2={pos.x - 20} y2={pos.y} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                    <line x1={pos.x + 20} y1={pos.y} x2={pos.x + 26} y2={pos.y} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                    <line x1={pos.x} y1={pos.y - 26} x2={pos.x} y2={pos.y - 20} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                    <line x1={pos.x} y1={pos.y + 20} x2={pos.x} y2={pos.y + 26} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                  </g>
                );
              })}

              {/* Traveling indicator dot */}
              <motion.circle
                cx={cx}
                cy={cy}
                r="5"
                fill="#0069b9"
                className="process-indicator-dot"
                style={{
                  cx: useTransform(dotAngle, (a) => getPointOnCircle(a, circleR, cx, cy).x),
                  cy: useTransform(dotAngle, (a) => getPointOnCircle(a, circleR, cx, cy).y),
                  opacity: currentStep >= 0 && currentStep < 3 ? 1 : 0,
                }}
              />
              {/* Indicator glow */}
              <motion.circle
                cx={cx}
                cy={cy}
                r="12"
                fill="rgba(0, 105, 185, 0.2)"
                style={{
                  cx: useTransform(dotAngle, (a) => getPointOnCircle(a, circleR, cx, cy).x),
                  cy: useTransform(dotAngle, (a) => getPointOnCircle(a, circleR, cx, cy).y),
                  opacity: currentStep >= 0 && currentStep < 3 ? 1 : 0,
                }}
              />
            </svg>

            {/* Node labels — full opacity, color toggles on active */}
            {PROCESS_STEPS.map((step, i) => {
              const angle = NODE_ANGLES[i];
              const labelPos = getPointOnCircle(angle, circleR + 45, cx, cy);
              const pct = { x: (labelPos.x / 600) * 100, y: (labelPos.y / 600) * 100 };

              return (
                <div
                  key={i}
                  className={`process-node-label ${currentStep >= i ? 'active' : ''}`}
                  style={{
                    left: `${pct.x}%`,
                    top: `${pct.y}%`,
                    opacity: 1,
                  }}
                >
                  {step.label}
                </div>
              );
            })}

            {/* Center content — ALWAYS full opacity, only y-translate animates */}
            <div className="process-center-content">
              {PROCESS_STEPS.map((step, i) => {
                const y = [centerY0, centerY1, centerY2][i];
                const isVisible = currentStep === i;
                return (
                  <motion.div
                    key={i}
                    className="process-center-step"
                    style={{
                      y: isVisible ? y : 0,
                      opacity: isVisible ? 1 : 0,
                      display: isVisible ? 'flex' : 'none',
                    }}
                  >
                    <span className="process-step-number">0{i + 1}</span>
                    <h3 className="process-headline">{step.headline}</h3>
                    <p className="process-subtext">{step.subtext}</p>
                  </motion.div>
                );
              })}

              {/* Completion state — full opacity */}
              <div
                className="process-center-step"
                style={{
                  opacity: currentStep === 3 ? 1 : 0,
                  display: currentStep === 3 ? 'flex' : 'none',
                }}
              >
                <span className="process-step-number">✓</span>
                <h3 className="process-headline">System Complete</h3>
                <p className="process-subtext">Every step verified. Every variable accounted for. Your packaging is engineered — not guessed.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  // Dynamic real-time clock for Delhi (DEL)
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  }).toUpperCase();

  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = ['home', 'services', 'process', 'clients'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const { scrollYProgress: globalScroll } = useScroll();


  // Camera snap effect for chevrons
  const chevronScale = useTransform(scrollYProgress, [0, 0.05, 0.1], [1.5, 0.95, 1], { clamp: true }); 

  // Words reveal until 0.8, then hold until 1.0
  const words = "Inbox is a packaging partner that makes sure what you design is exactly what gets delivered".split(" ");

  return (
    <>
      <SystemNoise />
      <SysOverlayFooter />
      <CustomCursor />
      <BackgroundGrid progress={globalScroll} />
      
      {/* Hero Section */}
      <section id="home">
        <motion.div 
          className="home-container"
          data-theme="light"
          initial={{ scale: 0.99, filter: "contrast(0.95)" }}
          animate={{ 
            scale: [0.99, 0.99, 0.99, 1.0],
            filter: ["contrast(0.95)", "contrast(0.95)", "contrast(0.95)", "contrast(1)"]
          }}
          transition={{ duration: 2.3, times: [0, 0.70, 0.87, 1.0], ease: "easeOut" }}
        >

          <SysOverlayHero />



          {/* Main content */}
          <div className="main-content">
            <motion.h1 
              className="hero-title"
              initial={{ clipPath: "inset(-20% -20% 100% -20%)", opacity: 0.8, x: -2 }}
              animate={{ 
                clipPath: ["inset(-20% -20% 100% -20%)", "inset(-20% -20% 100% -20%)", "inset(-20% -20% -20% -20%)", "inset(-20% -20% -20% -20%)", "inset(-20% -20% -20% -20%)"], 
                opacity: [0.8, 0.8, 1, 1, 1],
                x: [-2, -2, -2, 0, 0]
              }}
              transition={{ duration: 2.3, times: [0, 0.35, 0.70, 0.87, 1.0], ease: "easeOut" }}
            >
              <span className="sys-heading-meta">REF 11-5110 | REV 0 | AUG 2025</span>
              the best <span className="italic">printing</span><br />company
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle"
              initial={{ clipPath: "inset(-20% -20% 100% -20%)", opacity: 0, x: -2 }}
              animate={{ 
                clipPath: ["inset(-20% -20% 100% -20%)", "inset(-20% -20% 100% -20%)", "inset(-20% -20% -20% -20%)", "inset(-20% -20% -20% -20%)", "inset(-20% -20% -20% -20%)"],
                opacity: [0, 0, 1, 1, 1],
                x: [-2, -2, -2, 0, 0]
              }}
              transition={{ duration: 2.3, times: [0, 0.40, 0.75, 0.87, 1.0], ease: "easeOut" }}
            >
              <span className="medium">when it comes to serving</span> <span className="bold">new age brands</span>
            </motion.p>
          </div>

          {/* Blue Stats Bar (Tape) */}
          <motion.div 
            className="hero-stats-bar-wrapper"
            initial={{ opacity: 0, y: 15 }}
            animate={{ 
              opacity: [0, 0, 1, 1, 1],
              y: [15, 15, 2, 0, 0]
            }}
            transition={{ duration: 2.3, times: [0, 0.40, 0.75, 0.87, 1.0], ease: "easeOut" }}
          >
            <div className="hero-stats-bar">
              <div className="stat-item">
                <span className="stat-num">30+</span>
                <span className="stat-text">years of experience</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">270+</span>
                <span className="stat-text">clients experience</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">{">"}92%</span>
                <span className="stat-text">satisfaction score</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="secondary-section" ref={sectionRef} data-theme="dark">
        <SysOverlayMid />
        <div className="sticky-wrapper">
          <motion.div 
            className="frame-container"
            style={{ scale: chevronScale }}
          >
            {/* Brackets */}
            <div className="corner-bracket bracket-tl"></div>
            <div className="corner-bracket bracket-tr"></div>
            <div className="corner-bracket bracket-bl"></div>
            <div className="corner-bracket bracket-br"></div>

            <div className="scroll-text-container">
              <p className="secondary-title">
                {words.map((word, i) => {
                  const start = 0.1 + (i / words.length) * 0.7; // 0.1 to 0.8 range
                  const end = start + (0.7 / words.length);
                  return <Word key={i} progress={scrollYProgress} range={[start, end]}>{word}</Word>;
                })}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <div id="services">
        <ServicesSection />
      </div>

      {/* Process Section */}
      <div id="process">
        <ProcessSection />
      </div>

      {/* Clients Section */}
      <ClientsSection />


      {/* Bottom bar */}
      <div className="bottom-bar">

        <div className="nav-items">
          <a href="#home" className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}>HOME</a>
          <a href="#clients" className={`nav-link ${activeSection === 'clients' ? 'active' : ''}`}>CLIENTS</a>
          <a href="#services" className={`nav-link ${activeSection === 'services' ? 'active' : ''}`}>SERVICES</a>
          <a href="#quote" className="quote-btn">
            <span className="quote-btn-prefix">{">"}_01</span>
            GET A QUOTE
          </a>
        </div>

      </div>
    </>
  );
}
