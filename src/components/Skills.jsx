import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Code2,
  Terminal,
  Braces,
  Coffee,
  Globe,
  Palette,
  FileCode,
  Atom,
  Server,
  Zap,
  Flame,
  Database,
  BarChart3,
  LayoutDashboard,
  FileText,
  LineChart,
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import { useSkills } from '../hooks/useSkills';

const skillIcons = {
  // Programming Languages
  Python: Code2,
  C: Terminal,
  'C++': Braces,
  Java: Coffee,

  // Web & Mobile Development
  HTML5: Globe,
  CSS: Palette,
  JavaScript: FileCode,
  React: Atom,
  'Node.js': Server,
  FastAPI: Zap,
  Firebase: Flame,

  // Databases & Infrastructure
  PostgreSQL: Database,
  MySQL: Database,

  // Data & Visualization
  'Power BI': BarChart3,
  Dashboards: LayoutDashboard,
  Reporting: FileText,
  'Data Analysis': LineChart,
};

const SkillChip = ({ skill, groupColor, customDelay }) => {
  const shouldReduceMotion = useReducedMotion();
  const initialOffset = useMemo(() => {
    const isX = Math.random() > 0.5;
    const sign = Math.random() > 0.5 ? 1 : -1;
    return {
      x: isX ? sign * 60 : 0,
      y: !isX ? sign * 40 : 0,
    };
  }, []);

  const IconComponent = skillIcons[skill] || Code2;

  return (
    <motion.div
      className="glass-panel"
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.6, ...initialOffset }
      }
      whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: shouldReduceMotion ? 0 : customDelay,
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      whileHover={{
        scale: 1.08,
        borderColor: 'rgba(220,38,38,0.7)',
        boxShadow:
          '0 0 16px rgba(220,38,38,0.5), 0 0 32px rgba(220,38,38,0.2)',
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      style={{
        padding: '8px 20px',
        borderRadius: '30px',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'default',
        willChange: 'transform, box-shadow',
      }}
    >
      <IconComponent size={16} color={groupColor} style={{ flexShrink: 0 }} />
      {skill}
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Skeleton rows — matches the visual footprint of a real category section
// ---------------------------------------------------------------------------

const SkeletonCategory = () => (
  <div style={{ marginBottom: '3rem' }}>
    {/* Category header */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '1rem',
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.08)',
        }}
      />
      <div
        style={{
          width: '160px',
          height: '14px',
          borderRadius: '4px',
          background: 'rgba(255,255,255,0.06)',
          animation: 'shimmer 2s ease-in-out infinite',
        }}
      />
    </div>

    {/* Skill chips */}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: `${70 + i * 12}px`,
            height: '38px',
            borderRadius: '30px',
            background: 'rgba(255,255,255,0.04)',
            animation: 'shimmer 2s ease-in-out infinite',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Error state
// ---------------------------------------------------------------------------

const ErrorState = ({ message, onRetry }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      textAlign: 'center',
      gap: '1.25rem',
    }}
  >
    <p
      style={{
        color: 'var(--color-text-muted)',
        fontSize: '1.05rem',
        lineHeight: '1.6',
        maxWidth: '420px',
      }}
    >
      {message}
    </p>
    <button
      type="button"
      onClick={onRetry}
      className="btn-secondary"
      style={{ padding: '10px 24px', fontSize: '0.9rem' }}
    >
      Retry
    </button>
  </div>
);

// ---------------------------------------------------------------------------
// Skills section
// ---------------------------------------------------------------------------

const Skills = () => {
  const { skills, loading, error, retry } = useSkills();

  return (
    <section id="skills" className="section">
      <SectionHeading number="02." title="Technical Skills" />

      {/* --- Loading skeleton --- */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          <SkeletonCategory />
          <SkeletonCategory />
          <SkeletonCategory />
        </div>
      )}

      {/* --- Error state --- */}
      {!loading && error && (
        <ErrorState message="Unable to load skills." onRetry={retry} />
      )}

      {/* --- Empty state --- */}
      {!loading && !error && skills.length === 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: 'var(--color-text-muted)',
              fontSize: '1.05rem',
              lineHeight: '1.6',
            }}
          >
            No skills data available yet.
          </p>
        </div>
      )}

      {/* --- Skill groups --- */}
      {!loading && !error && skills.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {skills.map((skillGroup, idx) => (
            <motion.div
              key={skillGroup.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: skillGroup.color,
                    boxShadow: `0 0 10px ${skillGroup.color}`,
                  }}
                />
                <h3
                  style={{
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    color: skillGroup.color,
                  }}
                >
                  {skillGroup.category}
                </h3>
                <div
                  style={{
                    flex: 1,
                    height: '1px',
                    background: `linear-gradient(to right, ${skillGroup.color}40, transparent)`,
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {skillGroup.items.map((skill, sIdx) => (
                  <SkillChip
                    key={skill}
                    skill={skill}
                    groupColor={skillGroup.color}
                    customDelay={sIdx * 0.05}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Skills;
