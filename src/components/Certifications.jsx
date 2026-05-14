import { motion, useReducedMotion } from 'framer-motion';
import { Award, Shield, FileText } from 'lucide-react';
import SectionHeading from './SectionHeading';
import TiltCard from './TiltCard';
import { portfolioData } from '../data/portfolioData';

const certificationIcons = {
  'Operating Systems Bootcamp': <FileText size={24} color="#ef4444" />,
  'Cybersecurity Course': <Shield size={24} color="#dc2626" />,
  'Yophoria Innovation Challenge 2025': <Award size={24} color="#fb7185" />,
};

const Certifications = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="certifications" className="section">
      <SectionHeading number="05." title="Milestones & Certifications" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', perspective: '1000px' }}>
        {portfolioData.certifications.map((cert, idx) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, rotateY: shouldReduceMotion ? 0 : 90, z: -100 }}
            whileInView={{ opacity: 1, rotateY: 0, z: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: shouldReduceMotion ? 0 : idx * 0.15, duration: 0.6, ease: "easeOut" }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <a href={cert.link} target="_blank" rel="noopener noreferrer" aria-label={`View certificate for ${cert.title}`} title={`View certificate for ${cert.title}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%', transformStyle: 'preserve-3d' }}>
              <TiltCard color={cert.color} style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <motion.div 
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: 10, 
                    filter: 'drop-shadow(0 0 12px rgba(220,38,38,0.8))' 
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    marginBottom: '1.2rem', 
                    background: `${cert.color}15`, 
                    border: `1px solid ${cert.color}40`, 
                    boxShadow: `0 0 20px ${cert.color}20`,
                    transform: 'translateZ(20px)'
                  }}
                >
                  {certificationIcons[cert.title] || <Award size={24} color={cert.color} />}
                </motion.div>
                
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', lineHeight: '1.3', transform: 'translateZ(15px)' }}>{cert.title}</h3>
                <p style={{ color: cert.color, fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', opacity: 0.9, transform: 'translateZ(10px)' }}>{cert.issuer}</p>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--color-text-muted)', transform: 'translateZ(5px)' }}>{cert.date}</div>
                
                <div style={{ marginTop: '1.5rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', color: cert.color, opacity: 0.8, fontWeight: 'bold', transform: 'translateZ(10px)' }}>
                  View Certificate
                </div>
              </TiltCard>
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Certifications;
