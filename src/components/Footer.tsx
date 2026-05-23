import { motion } from 'framer-motion';

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
          <div className="footer-subtitle">The Printing Packaging Company</div>
          <div className="footer-title-wrapper">
            <h1 className="footer-title">INBOX</h1>
          </div>
          <div className="footer-copyright">
            &copy; 2026 INBOX. All rights reserved.
          </div>

        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
