import { useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Github, RefreshCw, Star, GitFork, Code2, Calendar } from 'lucide-react';
import SectionHeading from './SectionHeading';
import TiltCard from './TiltCard';
import ProjectModal from './ProjectModal';
import { useProjects } from '../hooks/useProjects';
import { clearCache } from '../services/githubService';
import { clearMetadataCache } from '../services/repositoryMetadataService';

// ---------------------------------------------------------------------------
// Skeleton card
// ---------------------------------------------------------------------------

const SkeletonCard = () => (
  <div
    style={{
      padding: '2.5rem',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'rgba(12, 12, 12, 0.9)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(20px)',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
      <div style={{ width: '120px', height: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.06)', animation: 'shimmer 2s ease-in-out infinite' }} />
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
      </div>
    </div>
    <div style={{ width: '75%', height: '22px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', marginBottom: '1rem', animation: 'shimmer 2s ease-in-out infinite', animationDelay: '0.1s' }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
      <div style={{ width: '100%', height: '14px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', animation: 'shimmer 2s ease-in-out infinite', animationDelay: '0.2s' }} />
      <div style={{ width: '90%', height: '14px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', animation: 'shimmer 2s ease-in-out infinite', animationDelay: '0.3s' }} />
      <div style={{ width: '60%', height: '14px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', animation: 'shimmer 2s ease-in-out infinite', animationDelay: '0.4s' }} />
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{ width: `${60 + i * 10}px`, height: '26px', borderRadius: '15px', background: 'rgba(255,255,255,0.04)', animation: 'shimmer 2s ease-in-out infinite', animationDelay: `${0.3 + i * 0.1}s` }} />
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Error state
// ---------------------------------------------------------------------------

const ErrorState = ({ message, onRetry }) => (
  <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', gap: '1.25rem' }}>
    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.6', maxWidth: '420px' }}>{message}</p>
    <button type="button" onClick={onRetry} className="btn-secondary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
      <RefreshCw size={16} />
      Retry
    </button>
  </div>
);

// ---------------------------------------------------------------------------
// Project card stats row
// ---------------------------------------------------------------------------

const StatsRow = ({ language, color, stars, forks, updatedAt }) => {
  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    : null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '0.75rem' }}>
      {language && (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <Code2 size={12} color={color} />
          {language}
        </span>
      )}
      {stars > 0 && (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <Star size={12} />
          {stars}
        </span>
      )}
      {forks > 0 && (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <GitFork size={12} />
          {forks}
        </span>
      )}
      {formattedDate && (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <Calendar size={12} />
          {formattedDate}
        </span>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Projects section
// ---------------------------------------------------------------------------

const Projects = () => {
  const { projects, loading, error, retry } = useProjects();
  const shouldReduceMotion = useReducedMotion();
  const [selectedProject, setSelectedProject] = useState(null);
  // Dedicated flag so the refresh icon only spins on manual refresh,
  // not during the initial page-load skeleton.
  const [refreshing, setRefreshing] = useState(false);

  // Manual refresh (FR-010/SC-006): invalidate the GitHub repo + metadata
  // caches, then re-fetch immediately. The dashboard cache is intentionally
  // left untouched — it refreshes on its own 30-min TTL.
  const handleRefresh = useCallback(() => {
    clearCache();
    clearMetadataCache();
    setRefreshing(true);
    retry();
  }, [retry]);

  // Clear the spinner once the manual refresh finishes.
  useEffect(() => {
    if (refreshing && !loading) {
      setRefreshing(false);
    }
  }, [refreshing, loading]);

  return (
    <section id="projects" className="section">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <SectionHeading number="03." title="Featured Projects" />
        <motion.button
          type="button"
          onClick={handleRefresh}
          aria-label="Refresh projects from GitHub"
          title="Refresh from GitHub"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '42px',
            height: '42px',
            marginTop: '0.35rem',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-neon-blue)';
            e.currentTarget.style.color = 'var(--color-neon-blue)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = 'var(--color-text-muted)';
          }}
        >
          <motion.span
            animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
            transition={refreshing ? { repeat: Infinity, duration: 1, ease: 'linear' } : { duration: 0.2 }}
            style={{ display: 'flex' }}
          >
            <RefreshCw size={18} />
          </motion.span>
        </motion.button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!loading && error && <ErrorState message="Unable to load projects." onRetry={retry} />}

        {!loading && !error && projects.length === 0 && (
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.6', maxWidth: '420px' }}>
              No featured projects yet. Check back soon!
            </p>
          </div>
        )}

        {!loading && !error && projects.map((project, idx) => {
          const isEven = idx % 2 === 0;
          const xOffset = isEven ? -80 : 80;

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : xOffset }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: shouldReduceMotion ? 0 : 0.1 }}
            >
              <TiltCard
                color={project.color}
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}
                onClick={() => setSelectedProject(project)}
              >
                {/* Preview image (when available) */}
                {project.previewImage && (
                  <div
                    style={{
                      width: '100%',
                      height: '120px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      marginBottom: '1rem',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      transform: 'translateZ(5px)',
                    }}
                  >
                    <img
                      src={project.previewImage}
                      alt={`${project.title} preview`}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Badge + icon row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', transformStyle: 'preserve-3d' }}>
                  <div style={{ transform: 'translateZ(20px)' }}>
                    <span
                      className="badge"
                      style={{
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontWeight: 'bold',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        background: `${project.color}20`,
                        color: project.color,
                        border: `1px solid ${project.color}40`,
                        display: 'inline-block',
                      }}
                    >
                      {project.tag}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', transform: 'translateZ(10px)' }}>
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-muted)', transition: 'color 0.2s' }} onClick={(e) => e.stopPropagation()}>
                        <Github size={18} />
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-muted)', transition: 'color 0.2s' }} onClick={(e) => e.stopPropagation()}>
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Stats row */}
                <StatsRow
                  language={project.language}
                  color={project.color}
                  stars={project.stars}
                  forks={project.forks}
                  updatedAt={project.updatedAt}
                />

                {/* Title */}
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.75rem', transform: 'translateZ(15px)' }}>
                  {project.title}
                </h3>

                {/* Summary (preferred) or fallback description */}
                <p
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: '0.9rem',
                    marginBottom: '1rem',
                    flex: 1,
                    transform: 'translateZ(5px)',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {project.summary || project.description}
                </p>

                {/* Tech tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', transform: 'translateZ(10px)' }}>
                  {project.technologies.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      style={{
                        fontSize: '0.7rem',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.6)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 5 && (
                    <span style={{ fontSize: '0.7rem', padding: '3px 8px', color: 'var(--color-text-muted)' }}>
                      +{project.technologies.length - 5}
                    </span>
                  )}
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>

      {/* --- Project detail modal --- */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
};

export default Projects;
