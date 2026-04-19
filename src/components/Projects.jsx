import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import SectionHeading from './SectionHeading';
import TiltCard from './TiltCard';
import { portfolioData } from '../data/portfolioData';

const Projects = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="projects" className="section">
      <SectionHeading number="03." title="Featured Projects" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {portfolioData.projects.map((project, idx) => {
          const isEven = idx % 2 === 0;
          const xOffset = isEven ? -80 : 80;

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : xOffset }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ 
                duration: 0.7, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: shouldReduceMotion ? 0 : 0.1 
              }}
            >
              <TiltCard
                color={project.color}
                style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', transformStyle: 'preserve-3d' }}>
                  <div style={{ transform: 'translateZ(20px)' }}>
                    <span className="badge" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px', background: `${project.color}20`, color: project.color, border: `1px solid ${project.color}40`, display: 'inline-block' }}>
                      {project.tag}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', transform: 'translateZ(10px)' }}>
                    {project.links.github && (
                      <a href={project.links.github} aria-label={`${project.title} GitHub repository`} target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-muted)', transition: 'color 0.2s' }}>
                        <Github size={20} />
                      </a>
                    )}
                    {project.links.live && (
                      <a href={project.links.live} aria-label={`${project.title} live demo`} target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-muted)', transition: 'color 0.2s' }}>
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', transform: 'translateZ(15px)' }}>{project.title}</h3>
                
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1, transform: 'translateZ(5px)' }}>
                  {project.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', transform: 'translateZ(10px)' }}>
                  {project.technologies.map(tech => (
                    <span key={tech} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
