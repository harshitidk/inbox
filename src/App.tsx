import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
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
  const opacity = useTransform(progress, range, [0.3, 1], { clamp: true });
  const y = useTransform(progress, range, [10, 0], { clamp: true });
  return (
    <motion.span className="word-span" style={{ opacity, y }}>
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

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const { scrollYProgress: globalScroll } = useScroll();

  // Camera snap effect for chevrons
  const chevronOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1], { clamp: true });
  const chevronScale = useTransform(scrollYProgress, [0, 0.05, 0.1], [1.5, 0.95, 1], { clamp: true }); 

  const words = "Inbox is a packaging partner that makes sure what you design is exactly what gets delivered".split(" ");
  
  const ctaOpacity = useTransform(scrollYProgress, [0.55, 0.65], [0, 1], { clamp: true });
  const ctaY = useTransform(scrollYProgress, [0.55, 0.65], [20, 0], { clamp: true });

  return (
    <>
      <CustomCursor />
      <BackgroundGrid progress={globalScroll} />
      
      <motion.div 
        className="home-container"
        initial={{ scale: 0.99, filter: "contrast(0.95)" }}
        animate={{ 
          scale: [0.99, 0.99, 0.99, 1.0],
          filter: ["contrast(0.95)", "contrast(0.95)", "contrast(0.95)", "contrast(1)"]
        }}
        transition={{ duration: 2.3, times: [0, 0.70, 0.87, 1.0], ease: "easeOut" }}
      >
        {/* Top logo */}
        <motion.div 
          className="logo-ellipse"
          initial={{ opacity: 0, x: -2 }}
          animate={{ 
            opacity: [0, 0, 1, 1, 1], 
            x: [-2, -2, -2, 0, 0]
          }}
          transition={{ duration: 2.3, times: [0, 0.35, 0.70, 0.87, 1.0], ease: "easeOut" }}
        >
          <span>inbox</span>
        </motion.div>

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

        {/* Blue Stats Bar */}
        <motion.div 
          className="hero-stats-bar"
          initial={{ opacity: 0, y: 15, x: 2 }}
          animate={{ 
            opacity: [0, 0, 1, 1, 1],
            y: [15, 15, 2, 0, 0],
            x: [2, 2, 2, 0, 0]
          }}
          transition={{ duration: 2.3, times: [0, 0.40, 0.75, 0.87, 1.0], ease: "easeOut" }}
        >
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
        </motion.div>
      </motion.div>

      <section className="secondary-section" ref={sectionRef}>
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
                  const start = 0.1 + (i / words.length) * 0.4; // 0.1 to 0.5 range
                  const end = start + (0.4 / words.length);
                  return <Word key={i} progress={scrollYProgress} range={[start, end]}>{word}</Word>;
                })}
              </p>
              
              <motion.a 
                href="#quote" 
                className="secondary-cta"
                style={{ opacity: ctaOpacity, y: ctaY }}
              >
                get a quote 
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom bar */}
      <motion.div 
        className="bottom-bar"
        initial={{ opacity: 0, y: 15, x: -2 }}
        animate={{ 
          opacity: [0, 0, 1, 1, 1],
          y: [15, 15, 2, 0, 0],
          x: [-2, -2, -2, 0, 0]
        }}
        transition={{ duration: 2.3, times: [0, 0.35, 0.70, 0.87, 1.0], ease: "easeOut" }}
      >
        <div className="location-time">DEL - {formattedTime}</div>
        <div className="nav-items">
          <a href="#home" className="nav-link active">HOME</a>
          <a href="#clients" className="nav-link">CLIENTS</a>
          <a href="#services" className="nav-link">SERVICES</a>
          <a href="#quote" className="quote-btn">GET A QUOTE</a>
        </div>
        <div className="location-country">INDIA</div>
      </motion.div>
    </>
  );
}
