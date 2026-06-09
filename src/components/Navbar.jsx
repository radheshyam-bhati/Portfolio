import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

const navigationLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Education', href: '#education' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 60);
  });

  const toggleMenu = () => setIsOpen((previousValue) => !previousValue);

  return (
    <>
      <motion.header
        className="navbar-wrapper"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, padding: scrolled ? '8px 16px' : '16px 16px' }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.nav
          className="navbar"
          animate={{
            backdropFilter: scrolled ? 'blur(20px)' : 'blur(12px)',
            background: scrolled ? 'rgba(10, 10, 10, 0.85)' : 'rgba(20, 20, 20, 0.6)',
            borderColor: scrolled ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
            boxShadow: scrolled ? '0 0 40px rgba(220, 38, 38, 0.08)' : '0 10px 30px rgba(0,0,0,0.2)',
          }}
          transition={{ duration: 0.3 }}
          style={{
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '1024px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 20px'
          }}
        >
          <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); window.scrollTo(0,0); setIsOpen(false); }}>
            <div className="icon">
              &lt;/&gt;
            </div>
            <span>Radheshyam Bhati</span>
          </a>

          <ul className="nav-links desktop-only">
            {navigationLinks.map(link => (
              <li key={link.name}>
                <a href={link.href} className="nav-link">{link.name}</a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <a href={`${import.meta.env.BASE_URL}docs/Resume.pdf`} target="_blank" rel="noreferrer" className="btn-primary desktop-only" style={{ padding: '8px 20px', fontSize: '0.9rem', borderRadius: '10px' }}>
              Resume
            </a>

            <button
              className={`menu-btn mobile-only ${isOpen ? 'open' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <span className="menu-line"></span>
              <span className="menu-line"></span>
            </button>
          </div>
        </motion.nav>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-nav glass-panel"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="mobile-nav-links">
              {navigationLinks.map(link => (
                <li key={link.name}>
                  <a href={link.href} className="mobile-nav-link" onClick={() => setIsOpen(false)}>
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <a href={`${import.meta.env.BASE_URL}docs/Resume.pdf`} target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }} onClick={() => setIsOpen(false)}>
                  Resume
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
