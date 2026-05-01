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
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [10, 0]);
  return (
    <motion.span className="word-span" style={{ opacity, y }}>
      {children}
    </motion.span>
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

  // Camera snap effect for chevrons
  const chevronOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const chevronScale = useTransform(scrollYProgress, [0, 0.1, 0.15], [1.5, 0.95, 1]); 

  const words = "Inbox is a packaging partner that makes sure what you design is exactly what gets delivered".split(" ");
  
  const ctaOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.8, 0.9], [20, 0]);

  return (
    <>
      <CustomCursor />
      
      <div className="home-container">
        {/* Top logo */}
        <motion.div 
          className="logo-ellipse"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -5, 0] // Subtle floating motion
          }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <span>inbox</span>
        </motion.div>

        {/* Main content */}
        <div className="main-content">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ 
              opacity: 1, 
              y: [0, -10, 0] // Ambient movement
            }}
            transition={{ 
              duration: 1, 
              ease: "easeOut", 
              delay: 0.2,
              y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }
            }}
          >
            the best <span className="italic">printing</span><br />company
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          >
            <span className="medium">when it comes to serving</span> <span className="bold">new age brands</span>
          </motion.p>
        </div>
      </div>

      <section className="secondary-section" ref={sectionRef}>
        <div className="sticky-wrapper">
          <motion.div 
            className="frame-container"
            style={{ opacity: chevronOpacity, scale: chevronScale }}
          >
            {/* Brackets */}
            <div className="corner-bracket bracket-tl"></div>
            <div className="corner-bracket bracket-tr"></div>
            <div className="corner-bracket bracket-bl"></div>
            <div className="corner-bracket bracket-br"></div>

            <div className="scroll-text-container">
              <p className="secondary-title">
                {words.map((word, i) => {
                  const start = 0.15 + (i / words.length) * 0.6;
                  const end = start + (0.6 / words.length);
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
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
