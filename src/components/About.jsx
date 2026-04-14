import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
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

const About = () => {
  return (
    <section id="about" className="section">
      <SectionHeading number={<NumberTicker targetValue="1" />} title="About me" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
        <div style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
          {portfolioData.personalInfo.about.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
              <TypewriterText text={paragraph} />
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
