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
  LineChart
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import { portfolioData } from '../data/portfolioData';

const skillIcons = {
  // Programming Languages
  "Python": Code2,
  "C": Terminal,
  "C++": Braces,
  "Java": Coffee,

  // Web & Mobile Development
  "HTML5": Globe,
  "CSS": Palette,
  "JavaScript": FileCode,
  "React": Atom,
  "Node.js": Server,
  "FastAPI": Zap,
  "Firebase": Flame,

  // Databases & Infrastructure
  "PostgreSQL": Database,
  "MySQL": Database,

  // Data & Visualization
  "Power BI": BarChart3,
  "Dashboards": LayoutDashboard,
  "Reporting": FileText,
  "Data Analysis": LineChart
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
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, ...initialOffset }}
      whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: shouldReduceMotion ? 0 : customDelay,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      whileHover={{
        scale: 1.08,
        borderColor: 'rgba(220,38,38,0.7)',
        boxShadow: '0 0 16px rgba(220,38,38,0.5), 0 0 32px rgba(220,38,38,0.2)',
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      style={{
        padding: '8px 20px',
        borderRadius: '30px',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'default',
        willChange: 'transform, box-shadow'
      }}
    >
      <IconComponent size={16} color={groupColor} style={{ flexShrink: 0 }} />
      {skill}
    </motion.div>
  );
};

const Skills = () => {
  return (
    <section id="skills" className="section">
      <SectionHeading number="02." title="Technical Skills" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {portfolioData.skills.map((skillGroup, idx) => (
          <motion.div
            key={skillGroup.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: skillGroup.color, boxShadow: `0 0 10px ${skillGroup.color}` }} />
              <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', color: skillGroup.color }}>{skillGroup.category}</h3>
              <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, ${skillGroup.color}40, transparent)` }} />
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
    </section>
  );
};

export default Skills;
