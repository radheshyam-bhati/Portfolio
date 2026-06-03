import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { MousePointer2, Briefcase } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

const MagneticButton = ({ children, className, style, href }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxOffset = 8;
    const offsetX = ((e.clientX - centerX) / (rect.width / 2)) * maxOffset;
    const offsetY = ((e.clientY - centerY) / (rect.height / 2)) * maxOffset;
    x.set(offsetX);
    y.set(offsetY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Tag = href ? "a" : "button";

  return (
    <motion.div
      style={{ x: shouldReduceMotion ? 0 : springX, y: shouldReduceMotion ? 0 : springY, display: 'inline-block' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Tag
        href={href}
        type={href ? undefined : 'button'}
        className={className}
        style={{ ...style, display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        {children}
      </Tag>
    </motion.div>
  );
};

const TypewriterHeroText = ({ firstName, lastName, delayMs = 400 }) => {
  const shouldReduceMotion = useReducedMotion();

  const firstChars = firstName.split("");
  const lastChars = lastName.split("");

  return (
    <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', fontWeight: '800', lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '-2px' }}>
      <span style={{ display: 'block', minHeight: '1em' }}>
        {firstChars.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50, rotateX: shouldReduceMotion ? 0 : -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.2, 0.65, 0.3, 0.9],
              delay: shouldReduceMotion ? 0 : (delayMs / 1000) + (index * 0.05)
            }}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {char}
          </motion.span>
        ))}
      </span>
      <span style={{ color: 'var(--color-neon-blue)', display: 'block', minHeight: '1em' }}>
        {lastChars.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50, rotateX: shouldReduceMotion ? 0 : -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.2, 0.65, 0.3, 0.9],
              delay: shouldReduceMotion ? 0 : (delayMs / 1000) + ((firstChars.length + index) * 0.05)
            }}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {char}
          </motion.span>
        ))}
      </span>
    </h1>
  );
};

const Hero = () => {
  const [firstName, ...lastNameParts] = portfolioData.personalInfo.name.split(' ');
  const lastName = lastNameParts.join(' ');

  return (
    <section className="section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.4 }}
        style={{ marginBottom: '2.5rem', position: 'relative' }}
      >
        <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: 'linear-gradient(to right, rgba(239, 68, 68, 0.3), rgba(248, 113, 113, 0.1))', opacity: 0.5, filter: 'blur(10px)' }} />
        <div style={{ padding: '6px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', borderRadius: '50%', position: 'relative', zIndex: 1, boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)' }}>
          <img
            src={`${import.meta.env.BASE_URL}images/profile.png`}
            alt={portfolioData.personalInfo.name}
            style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #050505' }}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-panel"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '30px', marginBottom: '2rem', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)' }}
      >
        <MousePointer2 size={16} color="var(--color-neon-blue)" />
        {portfolioData.personalInfo.location}
      </motion.div>

      <TypewriterHeroText firstName={firstName} lastName={lastName} delayMs={400} />

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        style={{ maxWidth: '600px', fontSize: '1.15rem', color: 'var(--color-text-muted)', marginBottom: '3.5rem', lineHeight: 1.6 }}
      >
        {portfolioData.personalInfo.tagline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}
      >
        <MagneticButton href="#projects" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>
          <Briefcase size={20} /> View Work
        </MagneticButton>
        <MagneticButton href="#contact" className="btn-secondary" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>
          Contact Me
        </MagneticButton>
      </motion.div>
    </section>
  );
};

export default Hero;
