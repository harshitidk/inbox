import { motion } from 'framer-motion';
import './App.css';

export default function App() {
  return (
    <main>
      <nav className="navbar">
        <div className="nav-logo">INBOX</div>
        <div className="nav-links">
          <a href="#" className="nav-link">Work</a>
          <a href="#" className="nav-link">Process</a>
          <a href="#" className="nav-link">Contact</a>
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
          <h1 className="hero-title">
            Packaging,<br />
            designed to be felt.
          </h1>
        </div>
      </section>

      <section className="info-section">
        <div className="container">
          <motion.h2 
            className="info-text"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            Inbox is a packaging partner that makes sure what you design is exactly what gets delivered
          </motion.h2>
          
          <motion.div 
            className="info-divider"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            viewport={{ once: true }}
          />
        </div>
      </section>

      <section id="work" style={{ height: '80vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', opacity: 0.3, letterSpacing: '0.3em' }}>SCROLL TO DISCOVER</h2>
      </section>
    </main>
  );
}
