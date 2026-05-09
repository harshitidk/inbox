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

      <section id="work" style={{ height: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: '#fff', fontSize: '3rem', opacity: 0.5 }}>SCROLL TO DISCOVER</h2>
      </section>
    </main>
  );
}
