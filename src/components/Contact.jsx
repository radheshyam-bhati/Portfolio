import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Linkedin, Github, Send, Loader2, Check, Copy } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { portfolioData } from '../data/portfolioData';
import {
  buildContactPayload,
  getContactFormEndpoint,
  validateContactForm,
} from '../utils/contactForm';

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
  maxLength,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const active = isFocused || value.length > 0;
  const InputComponent = isTextArea ? 'textarea' : 'input';
  const inputProps = isTextArea ? { rows: 5 } : { type };

  return (
    <div style={{ position: 'relative', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
      <InputComponent
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        maxLength={maxLength}
        {...inputProps}
        style={{
          width: '100%',
          background: 'rgba(0,0,0,0.5)',
          border: `1px solid ${active ? 'var(--color-neon-blue)' : 'rgba(255,255,255,0.1)'}`,
          padding: isTextArea ? '1.5rem 1rem 1rem' : '1.5rem 1rem 0.5rem',
          borderRadius: '12px',
          color: 'white',
          fontFamily: 'inherit',
          outline: 'none',
          resize: isTextArea ? 'vertical' : 'none',
          transition: 'border-color 0.3s',
        }}
        required
      />
      <label
        htmlFor={id}
        style={{
          position: 'absolute',
          left: '1rem',
          top: active ? '0.5rem' : isTextArea ? '1rem' : '1.1rem',
          transform: active ? 'translateY(0) scale(0.75)' : 'translateY(0) scale(1)',
          transformOrigin: 'top left',
          color: active ? 'var(--color-neon-blue)' : 'var(--color-text-muted)',
          transition: 'all 0.2s ease',
          pointerEvents: 'none',
          fontWeight: active ? 600 : 400,
        }}
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
  const [copiedEmail, setCopiedEmail] = useState(false);
  const statusResetTimeoutRef = useRef(0);
  const submitAbortControllerRef = useRef(null);

  const {
    email: contactEmail,
    location,
    linkedin,
    github,
  } = portfolioData.personalInfo;

  const handleCopyEmail = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const triggerSuccess = () => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    };

    const runFallbackCopy = () => {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = contactEmail;
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';

        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, 99999);

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
          triggerSuccess();
        } else {
          console.error('Fallback copy command was unsuccessful');
        }
      } catch (err) {
        console.error('Fallback copy failed: ', err);
      }
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(contactEmail)
        .then(triggerSuccess)
        .catch((err) => {
          console.warn('Modern clipboard API failed, trying fallback: ', err);
          runFallbackCopy();
        });
    } else {
      runFallbackCopy();
    }
  };

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.8 }}>
            I'm looking for internships and builder-focused opportunities where I can contribute across <span style={{ color: 'white', fontWeight: 500 }}>AI, cybersecurity, full-stack development, and product execution.</span>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <a href={`mailto:${contactEmail}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', flexShrink: 0 }}>
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Email</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 500, wordBreak: 'break-all' }}>{contactEmail}</div>
                </div>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                title="Copy email to clipboard"
                aria-label="Copy email"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: copiedEmail ? '#22c55e' : 'var(--color-text-muted)',
                  transition: 'all 0.2s',
                  marginLeft: '10px',
                  position: 'relative',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = copiedEmail ? '#22c55e' : 'var(--color-text-muted)'; }}
              >
                <AnimatePresence mode="wait">
                  {copiedEmail ? (
                    <motion.div key="copied" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.15 }} style={{ display: 'flex' }}>
                      <Check size={16} />
                    </motion.div>
                  ) : (
                    <motion.div key="copy" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.15 }} style={{ display: 'flex' }}>
                      <Copy size={16} />
                    </motion.div>
                  )}
                </AnimatePresence>
                {copiedEmail && (
                  <span style={{
                    position: 'absolute',
                    bottom: '120%',
                    right: '0',
                    background: '#22c55e',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                    pointerEvents: 'none'
                  }}>
                    Copied!
                  </span>
                )}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(251, 113, 133, 0.1)', border: '1px solid rgba(251, 113, 133, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb7185' }}>
                <MapPin size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Location</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{location}</div>
              </div>
            </div>

            <a href={linkedin} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                <Linkedin size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>LinkedIn</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>linkedin.com/in/radheshyam-bhati</div>
              </div>
            </a>

            <a href={github} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
                <Github size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>GitHub</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>github.com/radheshyam-cod</div>
              </div>
            </a>
          </div>
        </motion.div>

        <motion.div
          className="glass-panel"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{ padding: '2rem' }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {status.message && (
              <div style={{
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                backgroundColor: status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : status.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                color: status.type === 'error' ? '#ef4444' : status.type === 'success' ? '#22c55e' : 'white',
                border: `1px solid ${status.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : status.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.1)'}`
              }}>
                {status.message}
              </div>
            )}

            <FloatingInput
              id="contact-name"
              label="Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={100}
            />

            <FloatingInput
              id="contact-email"
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              maxLength={254}
            />

            <FloatingInput
              id="contact-message"
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              isTextArea
              maxLength={2000}
            />

            <button
              type="submit"
              disabled={buttonState !== 'idle'}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '1rem',
                fontSize: '1rem',
                filter: buttonState !== 'idle' ? 'contrast(0.8) brightness(0.9)' : 'none',
                cursor: buttonState !== 'idle' ? 'not-allowed' : 'pointer',
                height: '56px'
              }}
            >
              <AnimatePresence mode="wait">
                {buttonState === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
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
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
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
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
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
