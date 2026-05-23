import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Cpu, GitBranch, Layers } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { portfolioData } from '../data/portfolioData';

const NumberTicker = ({ targetValue, duration = 600 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState('00');
  const shouldReduceMotion = useReducedMotion();
  const numericTargetValue = Number(targetValue);

  useEffect(() => {
    if (!inView) {
      return undefined;
    }

    if (shouldReduceMotion) {
      setDisplayValue(String(numericTargetValue).padStart(2, '0'));
      return undefined;
    }

    let animationFrameId = 0;
    const startTime = performance.now();

    const updateValue = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(progress * numericTargetValue);
      setDisplayValue(String(currentValue).padStart(2, '0'));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(updateValue);
      }
    };

    animationFrameId = window.requestAnimationFrame(updateValue);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [duration, inView, numericTargetValue, shouldReduceMotion]);

  return <span ref={ref}>{displayValue}.</span>;
};

const TypewriterText = ({ text }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const shouldReduceMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!inView) {
      return undefined;
    }

    if (shouldReduceMotion) {
      setDisplayText(text);
      return undefined;
    }

    let currentIndex = 0;
    const intervalId = window.setInterval(() => {
      currentIndex += 1;
      setDisplayText(text.slice(0, currentIndex));

      if (currentIndex >= text.length) {
        window.clearInterval(intervalId);
      }
    }, 15);

    return () => window.clearInterval(intervalId);
  }, [inView, text, shouldReduceMotion]);

  return (
    <span ref={ref}>
      {displayText}
      {inView && displayText.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
          style={{ borderRight: '2px solid var(--color-neon-blue)', marginLeft: '2px' }}
        />
      )}
    </span>
  );
};

const dnaPillars = [
  {
    title: "Systems Thinking",
    description: "Designing software as connected feedback loops. I focus on high predictability, clear data flow, and highly modular architecture.",
    icon: GitBranch,
    color: "#ef4444",
  },
  {
    title: "AI Product Engineering",
    description: "Orchestrating autonomous agents and structured outputs. Obsessed with building deterministic frameworks around probabilistic models.",
    icon: Cpu,
    color: "#dc2626",
  },
  {
    title: "Full-Stack Autonomy",
    description: "Fluent across frontend and backend environments. Building fast APIs, schemas, and clean, micro-animated interfaces.",
    icon: Layers,
    color: "#fb7185",
  }
];

const About = () => {
  return (
    <section id="about" className="section">
      <SectionHeading number={<NumberTicker targetValue="1" />} title="About me" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'start' }}>
        <div style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
          {portfolioData.personalInfo.about.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
              <TypewriterText text={paragraph} />
            </p>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-neon-blue)', marginBottom: '0.5rem', fontWeight: 700 }}>
            Developer DNA
          </h3>
          
          {dnaPillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                className="glass-panel"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                whileHover={{
                  x: 8,
                  borderColor: `${pillar.color}40`,
                  boxShadow: `0 8px 30px rgba(0,0,0,0.4), 0 0 15px ${pillar.color}15`,
                }}
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  background: 'var(--color-card-bg)',
                  cursor: 'default',
                }}
              >
                <div
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    background: `${pillar.color}15`,
                    color: pillar.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${pillar.color}30`,
                    boxShadow: `0 0 10px ${pillar.color}10`,
                  }}
                >
                  <IconComponent size={20} />
                </div>
                <div>
                  <h4 style={{ color: 'white', fontSize: '1.05rem', fontWeight: '600', marginBottom: '4px' }}>
                    {pillar.title}
                  </h4>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
