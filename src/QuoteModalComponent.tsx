import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabaseClient';

export const QuoteForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    query: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([formData]);

      if (error) throw error;
      setStatus('success');
      setFormData({ name: '', phone: '', email: '', query: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Full name *</label>
          <input 
            type="text" 
            placeholder="Your name" 
            required 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={status === 'loading' || status === 'success'}
          />
        </div>
        <div className="form-group">
          <label>Phone number *</label>
          <input 
            type="tel" 
            placeholder="Your number" 
            required 
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={status === 'loading' || status === 'success'}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Email address</label>
        <input 
          type="email" 
          placeholder="Your email address" 
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={status === 'loading' || status === 'success'}
        />
      </div>
      <div className="form-group">
        <label>Query *</label>
        <textarea 
          placeholder="Write something...." 
          required 
          rows={4}
          value={formData.query}
          onChange={(e) => setFormData({ ...formData, query: e.target.value })}
          disabled={status === 'loading' || status === 'success'}
        ></textarea>
      </div>
      <button 
        type="submit" 
        className={`contact-submit ${status}`}
        disabled={status === 'loading' || status === 'success'}
      >
        {status === 'loading' ? 'Sending...' : status === 'success' ? 'Message sent!' : status === 'error' ? 'Try again' : 'Submit'}
      </button>
      {status === 'success' && <p className="form-message success">Thank you! We'll get back to you soon.</p>}
      {status === 'error' && <p className="form-message error">Something went wrong. Please try again.</p>}
    </form>
  );
};

export const QuoteModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="quote-modal-overlay"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <button className="quote-modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          <div className="contact-section modal-version">
            <div className="contact-container">
              <div className="contact-info">
                <h2 className="contact-title">Get in touch</h2>
                
                <div className="contact-details">
                  <div className="contact-item">
                    <span className="contact-label">Email:</span>
                    <span className="contact-value">hello@inboxpackaging.com</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-label">Phone:</span>
                    <span className="contact-value">+1 (800) 123-4567</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-label">Address:</span>
                    <span className="contact-value">123 Packaging Way, Design District<br/>New York, NY 10001<br/>United States</span>
                  </div>
                </div>

                <div className="contact-social">
                  <span className="contact-label">Follow us</span>
                  <div className="social-icons">
                    <a href="#" className="social-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a href="#" className="social-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <a href="#" className="social-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact-form-wrapper">
                <QuoteForm />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
