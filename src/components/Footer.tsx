import { motion } from 'framer-motion';
import Logo from './Logo';

interface FooterProps {
  onAdminClick?: () => void;
}

const Footer = ({ onAdminClick }: FooterProps) => {
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
          <div className="footer-logo-wrapper">
            <Logo className="footer-logo-svg" style={{ width: '196px' }} />
          </div>
          <div className="footer-copyright" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <span>&copy; 2026 INBOX. All rights reserved.</span>
            {onAdminClick && (
              <button 
                onClick={onAdminClick}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'rgba(255, 255, 255, 0.3)', 
                  fontSize: '0.75rem', 
                  cursor: 'pointer',
                  transition: 'color 0.3s ease',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.3)'}
              >
                Admin Portal
              </button>
            )}
          </div>

        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
