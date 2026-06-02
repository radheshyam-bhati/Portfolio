import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { portfolioData } from '../data/portfolioData';

const TimelineDot = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-50px' });
  const shouldReduceMotion = useReducedMotion();

  return (
    <div ref={ref} style={{ position: 'absolute', left: '-2.5rem', top: '2.5rem', width: '16px', height: '16px', zIndex: 5 }}>
      {!shouldReduceMotion && inView && (
        <motion.div
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid var(--color-neon-blue)',
            zIndex: -1
          }}
        />
      )}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: 'var(--color-bg)', border: '3px solid var(--color-neon-blue)', boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }} />
    </div>
  );
};

const Education = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="education" className="section">
      <SectionHeading number="04." title="Education" />

      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        <motion.div
          initial={{ scaleY: shouldReduceMotion ? 1 : 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            position: 'absolute', top: 0, bottom: 0, left: 0, width: '2px',
            background: 'linear-gradient(to bottom, var(--color-neon-blue), transparent)',
            transformOrigin: 'top'
          }}
        />

        {portfolioData.education.map((item, idx) => (
          <motion.div
            key={`${item.institution}-${item.period}`}
            className="glass-panel"
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: shouldReduceMotion ? 0 : idx * 0.2 }}
            style={{ position: 'relative', padding: '2rem', marginBottom: '2rem' }}
          >
            <TimelineDot />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700' }}>{item.institution}</h3>
                <h4 style={{ color: 'var(--color-neon-blue)', fontSize: '1rem', fontWeight: '500' }}>{item.title}</h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                {item.status && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '2px 10px', borderRadius: '15px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-neon-blue)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    {item.status}
                  </span>
                )}
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{item.period}</span>
              </div>
            </div>

            {item.description && (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>{item.description}</p>
            )}

            {item.points && (
              <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-text-muted)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.6' }}>
                {item.points.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Education;
