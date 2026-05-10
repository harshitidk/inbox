import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
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

export default function App() {
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

      <section id="work" style={{ height: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: '#fff', fontSize: '3rem', opacity: 0.5 }}>SCROLL TO DISCOVER</h2>
      </section>
    </main>
  );
}
