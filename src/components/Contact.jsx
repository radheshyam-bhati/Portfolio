import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Linkedin, Github, Send, Loader2, Check } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { portfolioData } from '../data/portfolioData';
import {
  buildContactPayload,
  getContactFormEndpoint,
  validateContactForm,
} from '../utils/contactForm';
import './Contact.css';

const INITIAL_FORM_DATA = { name: '', email: '', message: '' };
const INITIAL_STATUS = { type: '', message: '' };

const FloatingInput = ({
  id,
  label,
  name,
  type = 'text',
  value,
  onChange,
  isTextArea = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const active = isFocused || value.length > 0;
  const InputComponent = isTextArea ? 'textarea' : 'input';
  const inputProps = isTextArea ? { rows: 5 } : { type };

  return (
    <div className="floating-input-container">
      <InputComponent
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...inputProps}
        className={`floating-input-field ${isTextArea ? 'is-textarea' : ''} ${active ? 'is-active' : ''}`}
        required
      />
      <label
        htmlFor={id}
        className={`floating-input-label ${isTextArea ? 'is-textarea' : ''} ${active ? 'is-active' : ''}`}
      >
        {label}
      </label>
    </div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [status, setStatus] = useState(INITIAL_STATUS);
  const [buttonState, setButtonState] = useState('idle');
  const statusResetTimeoutRef = useRef(0);
  const submitAbortControllerRef = useRef(null);

  const {
    email: contactEmail,
    location,
    linkedin,
    github,
  } = portfolioData.personalInfo;

  useEffect(() => {
    return () => {
      window.clearTimeout(statusResetTimeoutRef.current);
      submitAbortControllerRef.current?.abort();
    };
  }, []);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setFormData((previousFormData) => ({ ...previousFormData, [name]: value }));

    if (status.type === 'error') {
      setStatus(INITIAL_STATUS);
    }
  };

  const resetSuccessState = () => {
    window.clearTimeout(statusResetTimeoutRef.current);
    statusResetTimeoutRef.current = window.setTimeout(() => {
      setButtonState('idle');
      setStatus(INITIAL_STATUS);
    }, 4000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { errorMessage, sanitizedValues } = validateContactForm(formData);

    if (errorMessage) {
      setStatus({ type: 'error', message: errorMessage });
      return;
    }

    submitAbortControllerRef.current?.abort();
    const abortController = new AbortController();
    submitAbortControllerRef.current = abortController;
    setButtonState('submitting');
    setStatus(INITIAL_STATUS);

    try {
      const response = await fetch(getContactFormEndpoint(contactEmail), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(buildContactPayload(sanitizedValues)),
        signal: abortController.signal,
      });

      const responseBody = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(responseBody?.message || 'The message could not be sent.');
      }

      setFormData(INITIAL_FORM_DATA);
      setButtonState('success');
      setStatus({ type: 'success', message: 'Thanks for reaching out! Your message has been sent.' });

      resetSuccessState();
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }

      setStatus({
        type: 'error',
        message: error.message || 'The message could not be sent right now. Please try again later.',
      });
      setButtonState('idle');
    } finally {
      submitAbortControllerRef.current = null;
    }
  };

  return (
    <section id="contact" className="section">
      <SectionHeading number="06." title="Let's Connect" />

      <div className="contact-grid">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <p className="contact-description">
            I'm looking for internships and builder-focused opportunities where I can contribute across <span>AI, cybersecurity, full-stack development, and product execution.</span>
          </p>

          <div className="contact-links">
            <a href={`mailto:${contactEmail}`} className="contact-link-item">
              <div className="contact-icon-wrapper contact-icon-red">
                <Mail size={20} />
              </div>
              <div>
                <div className="contact-info-label">Email</div>
                <div className="contact-info-value">{contactEmail}</div>
              </div>
            </a>

            <div className="contact-link-item">
              <div className="contact-icon-wrapper contact-icon-pink">
                <MapPin size={20} />
              </div>
              <div>
                <div className="contact-info-label">Location</div>
                <div className="contact-info-value">{location}</div>
              </div>
            </div>

            <a href={linkedin} target="_blank" rel="noreferrer" className="contact-link-item">
              <div className="contact-icon-wrapper contact-icon-red">
                <Linkedin size={20} />
              </div>
              <div>
                <div className="contact-info-label">LinkedIn</div>
                <div className="contact-info-value">linkedin.com/in/radheshyam-bhati</div>
              </div>
            </a>

            <a href={github} target="_blank" rel="noreferrer" className="contact-link-item">
              <div className="contact-icon-wrapper contact-icon-darkred">
                <Github size={20} />
              </div>
              <div>
                <div className="contact-info-label">GitHub</div>
                <div className="contact-info-value">github.com/radheshyam-cod</div>
              </div>
            </a>
          </div>
        </motion.div>

        <motion.div
          className="glass-panel contact-form-panel"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="contact-form">
            {status.message && (
              <div className={`contact-status-message ${status.type === 'error' ? 'contact-status-error' : status.type === 'success' ? 'contact-status-success' : 'contact-status-default'}`}>
                {status.message}
              </div>
            )}
            
            <FloatingInput 
              id="contact-name"
              label="Your Name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
            />
            
            <FloatingInput 
              id="contact-email"
              label="Email Address" 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
            />
            
            <FloatingInput 
              id="contact-message"
              label="Message" 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              isTextArea 
            />

            <button 
              type="submit" 
              disabled={buttonState !== 'idle'}
              className="btn-primary contact-submit-btn"
            >
              <AnimatePresence mode="wait">
                {buttonState === 'idle' && (
                  <motion.div 
                    key="idle" 
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -15 }} 
                    className="contact-btn-content"
                  >
                    Send Message <Send size={18} />
                  </motion.div>
                )}
                {buttonState === 'submitting' && (
                  <motion.div 
                    key="submitting" 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.8 }} 
                    className="contact-btn-content"
                  >
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <Loader2 size={18} />
                    </motion.div>
                    Sending...
                  </motion.div>
                )}
                {buttonState === 'success' && (
                  <motion.div 
                    key="success" 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.8 }} 
                    className="contact-btn-content"
                  >
                    <Check size={18} /> Sent!
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
