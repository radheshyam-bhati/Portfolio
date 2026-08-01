import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  Github,
  X,
  Star,
  GitFork,
  Calendar,
  Tag,
  Code2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Target,
  Squirrel,
  Award,
  ArrowRight,
  ImageIcon,
  LayoutGrid,
} from 'lucide-react';
import { useCaseStudy } from '../hooks/useCaseStudy';
import { useProjectLanguages } from '../hooks/useProjectLanguages';
import { mergeExtraLanguages } from '../utils/githubMapper';
import ArchitectureExplorer from './ArchitectureExplorer';

// ---------------------------------------------------------------------------
// Section heading component (reused across the modal)
// ---------------------------------------------------------------------------

const SectionTitle = ({ icon: Icon, children }) => (
  <h3
    style={{
      fontSize: '0.85rem',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      color: 'var(--color-neon-blue)',
      marginBottom: '0.75rem',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}
  >
    {Icon && <Icon size={16} />}
    {children}
  </h3>
);

const SectionBody = ({ children, noGap }) => (
  <div
    style={{
      marginBottom: noGap ? '0' : '1.5rem',
    }}
  >
    {children}
  </div>
);

const Paragraph = ({ children }) => (
  <p
    style={{
      color: 'var(--color-text-muted)',
      fontSize: '0.95rem',
      lineHeight: '1.7',
    }}
  >
    {children}
  </p>
);

const List = ({ items }) => (
  <ul
    style={{
      paddingLeft: '1.2rem',
      color: 'var(--color-text-muted)',
      fontSize: '0.9rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      lineHeight: '1.6',
    }}
  >
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

const TechChip = ({ name }) => (
  <span
    style={{
      fontSize: '0.8rem',
      padding: '4px 12px',
      borderRadius: '15px',
      background: 'rgba(255,255,255,0.05)',
      color: 'rgba(255,255,255,0.7)',
      border: '1px solid rgba(255,255,255,0.1)',
    }}
  >
    {name}
  </span>
);

// Language chip with percentage + accent dot (US2).
// `percentage` may be null for curated extras (Figma, MySQL, …) — those
// render as plain chips without a percentage, never removing detected ones.
const LanguageChip = ({ language }) => (
  <span
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '0.8rem',
      padding: '4px 12px',
      borderRadius: '15px',
      background: 'rgba(255,255,255,0.05)',
      color: 'rgba(255,255,255,0.8)',
      border: '1px solid rgba(255,255,255,0.1)',
    }}
  >
    <span
      style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: language.color,
        flexShrink: 0,
      }}
    />
    {language.name}
    {language.percentage != null && (
      <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>
        {language.percentage}%
      </span>
    )}
  </span>
);

// ---------------------------------------------------------------------------
// Screenshots carousel
// ---------------------------------------------------------------------------

const ScreenshotsCarousel = ({ screenshots, projectTitle }) => {
  const [current, setCurrent] = useState(0);
  const carouselRef = useRef(null);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % screenshots.length);
  }, [screenshots.length]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  }, [screenshots.length]);

  // Keyboard navigation: arrow keys for carousel
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    },
    [goNext, goPrev],
  );

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.addEventListener('keydown', handleKeyDown);
    return () => el.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!screenshots.length) return null;

  return (
    <SectionBody>
      <SectionTitle icon={ImageIcon}>Screenshots</SectionTitle>
      <div
        ref={carouselRef}
        tabIndex={0}
        role="region"
        aria-label="Screenshots carousel"
        aria-roledescription="carousel"
        style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '300px',
            position: 'relative',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={screenshots[current]}
              alt={`${projectTitle} screenshot ${current + 1}`}
              loading="lazy"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </AnimatePresence>
        </div>

        {/* Navigation arrows */}
        {screenshots.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous screenshot"
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                zIndex: 2,
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next screenshot"
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                zIndex: 2,
              }}
            >
              <ChevronRight size={18} />
            </button>

            {/* Dots indicator */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '6px',
                zIndex: 2,
              }}
            >
              {screenshots.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to screenshot ${i + 1}`}
                  style={{
                    width: i === current ? '20px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: i === current ? 'var(--color-neon-blue)' : 'rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </SectionBody>
  );
};

// ---------------------------------------------------------------------------
// Focus trap hook
// ---------------------------------------------------------------------------

function useFocusTrap(modalRef, isOpen) {
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;

    // Focus the first focusable element
    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length > 0) {
      focusable[0].focus();
    }

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleKeyDown);
    return () => modal.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

const LoadingState = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '4rem 2rem',
      color: 'var(--color-text-muted)',
      fontSize: '0.9rem',
    }}
  >
    {/* Image skeleton */}
    <div
      style={{
        width: '100%',
        height: '200px',
        borderRadius: '12px 12px 0 0',
        background: 'rgba(255,255,255,0.04)',
        animation: 'shimmer 2s ease-in-out infinite',
      }}
    />
    <div style={{ padding: '2rem', width: '100%' }}>
      <div
        style={{
          width: '60%',
          height: '28px',
          borderRadius: '6px',
          background: 'rgba(255,255,255,0.06)',
          marginBottom: '1rem',
          animation: 'shimmer 2s ease-in-out infinite',
        }}
      />
      <div
        style={{
          width: '40%',
          height: '16px',
          borderRadius: '4px',
          background: 'rgba(255,255,255,0.04)',
          marginBottom: '1.5rem',
          animation: 'shimmer 2s ease-in-out infinite',
        }}
      />
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            width: '100%',
            height: '12px',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.03)',
            marginBottom: '8px',
            animation: 'shimmer 2s ease-in-out infinite',
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Project Modal
// ---------------------------------------------------------------------------

const ProjectModal = ({ project, onClose }) => {
  // Lazy-load the full case study when modal opens
  const { caseStudy, loading, error } = useCaseStudy(project, true);

  // Lazy-load the top-5 language breakdown when the modal opens (US2).
  // The hook does NOT fetch on mount — `load()` triggers the fetch here,
  // keeping API usage within the unauthenticated rate limit (research D2).
  const { languages, loading: languagesLoading, load: loadLanguages } =
    useProjectLanguages(project.repoName);

  // Append curated extras (e.g. Figma, MySQL, UI/UX) to the GitHub-detected
  // breakdown WITHOUT removing any detected language (user request).
  const mergedLanguages = useMemo(
    () => mergeExtraLanguages(languages, project.extraLanguages),
    [languages, project.extraLanguages],
  );

  useEffect(() => {
    loadLanguages();
  }, [loadLanguages]);

  // Use discovered image, fall back to portfolio-specified image
  const heroImage = project.previewImage || project.image;

  const modalContentRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Focus trap
  useFocusTrap(modalContentRef, true);

  // Escape to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  // Format date
  const formattedDate = project.updatedAt
    ? new Date(project.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <AnimatePresence>
      <motion.div
        key="cs-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-label={`Case study: ${project.title}`}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          overflowY: 'auto',
        }}
      >
        <motion.div
          ref={modalContentRef}
          key="cs-content"
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            backgroundColor: 'rgba(12, 12, 12, 0.98)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            position: 'relative',
            backdropFilter: 'blur(24px)',
            outline: 'none',
          }}
        >
          {/* --- Close button --- */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close case study"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              zIndex: 10,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.6)';
              e.currentTarget.style.color = 'white';
            }}
          >
            <X size={18} />
          </button>

          {/* --- Loading state --- */}
          {loading && <LoadingState />}

          {/* --- Error state --- */}
          {error && !loading && (
            <div
              style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
              }}
            >
              <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>
                Unable to load case study details.
              </p>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                onClick={onClose}
              >
                Close
              </button>
            </div>
          )}

          {/* --- Content (loaded) --- */}
          {!loading && !error && (
            <>
              {/* Hero image */}
              {heroImage && (
                <div
                  style={{
                    width: '100%',
                    height: '300px',
                    borderRadius: '20px 20px 0 0',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    position: 'relative',
                  }}
                >
                  {!imageLoaded && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.3)',
                      }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      >
                        <Loader2 size={24} />
                      </motion.div>
                    </div>
                  )}
                  <img
                    src={heroImage}
                    alt={`${project.title} hero image`}
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      // Hide the loading spinner when the image fails too
                      setImageLoaded(true);
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: imageLoaded ? 1 : 0,
                      transition: 'opacity 0.3s',
                    }}
                  />
                  {/* Gradient overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '80px',
                      background: 'linear-gradient(to top, rgba(12,12,12,1), transparent)',
                    }}
                  />
                </div>
              )}

              {/* --- Scrollable content --- */}
              <div style={{ padding: '2rem' }}>
                {/* Title */}
                <h2
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: '700',
                    marginBottom: '0.75rem',
                    color: 'white',
                  }}
                >
                  {project.title}
                </h2>

                {/* Meta badges */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '1.5rem',
                  }}
                >
                  {project.language && (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      <Code2 size={14} color={project.color} />
                      {project.language}
                    </span>
                  )}
                  {project.stars > 0 && (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      <Star size={14} />
                      {project.stars}
                    </span>
                  )}
                  {project.forks > 0 && (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      <GitFork size={14} />
                      {project.forks}
                    </span>
                  )}
                  {formattedDate && (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      <Calendar size={14} />
                      {formattedDate}
                    </span>
                  )}
                  {project.category && (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      <Tag size={14} />
                      {project.category}
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '2rem' }}>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                  >
                    <Github size={16} />
                    View Source
                  </a>
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  )}
                </div>

                {/* --- Description (US3 / FR-006) --- */}
                {/* The description renders here (once) — only when real text
                    exists, never filler. The Live Demo link itself is the
                    "Live Demo" button above. */}
                {(caseStudy?.summary || project.summary || project.description) && (
                  <SectionBody>
                    <SectionTitle>Summary</SectionTitle>
                    <Paragraph>{caseStudy?.summary || project.summary || project.description}</Paragraph>
                  </SectionBody>
                )}

                {/* --- Tech Stack --- */}
                {(caseStudy?.techStack?.length > 0 || project.technologies.length > 0) && (
                  <SectionBody>
                    <SectionTitle icon={Code2}>Tech Stack</SectionTitle>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(caseStudy?.techStack?.length > 0
                        ? caseStudy.techStack
                        : project.technologies
                      ).map((tech) => (
                        <TechChip key={tech} name={tech} />
                      ))}
                    </div>
                  </SectionBody>
                )}

                {/* --- Language breakdown (US2 / FR-003) --- */}
                {(mergedLanguages.length > 0 || languagesLoading) && (
                  <SectionBody>
                    <SectionTitle icon={Code2}>Languages</SectionTitle>
                    {languagesLoading && mergedLanguages.length === 0 ? (
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                        Loading language breakdown…
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {mergedLanguages.map((lang) => (
                          <LanguageChip key={lang.name} language={lang} />
                        ))}
                      </div>
                    )}
                  </SectionBody>
                )}

                {/* --- Problem --- */}
                {caseStudy?.problem && (
                  <SectionBody>
                    <SectionTitle icon={Target}>Problem</SectionTitle>
                    <Paragraph>{caseStudy.problem}</Paragraph>
                  </SectionBody>
                )}

                {/* --- Solution --- */}
                {caseStudy?.solution && (
                  <SectionBody>
                    <SectionTitle icon={Lightbulb}>Solution</SectionTitle>
                    <Paragraph>{caseStudy.solution}</Paragraph>
                  </SectionBody>
                )}

                {/* --- Architecture (text) --- */}
                {caseStudy?.architecture && (
                  <SectionBody>
                    <SectionTitle icon={Squirrel}>Architecture</SectionTitle>
                    <Paragraph>{caseStudy.architecture}</Paragraph>
                  </SectionBody>
                )}

                {/* --- Architecture diagram --- */}
                {caseStudy?.architectureDiagram && (
                  <SectionBody>
                    <SectionTitle icon={Squirrel}>Architecture Diagram</SectionTitle>
                    <div
                      style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                      }}
                    >
                      <img
                        src={caseStudy.architectureDiagram}
                        alt={`${project.title} architecture diagram`}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block',
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </SectionBody>
                )}

                {/* --- Interactive architecture explorer --- */}
                {caseStudy?.systemArchitecture && (
                  <SectionBody>
                    <SectionTitle icon={LayoutGrid}>System Architecture</SectionTitle>
                    <ArchitectureExplorer graph={caseStudy.systemArchitecture} />
                  </SectionBody>
                )}

                {/* --- Features --- */}
                {caseStudy?.features?.length > 0 && (
                  <SectionBody>
                    <SectionTitle>Features</SectionTitle>
                    <List items={caseStudy.features} />
                  </SectionBody>
                )}

                {/* --- Challenges --- */}
                {caseStudy?.challenges?.length > 0 && (
                  <SectionBody>
                    <SectionTitle icon={Award}>Challenges</SectionTitle>
                    <List items={caseStudy.challenges} />
                  </SectionBody>
                )}

                {/* --- Lessons Learned --- */}
                {caseStudy?.lessons?.length > 0 && (
                  <SectionBody>
                    <SectionTitle icon={Lightbulb}>Lessons Learned</SectionTitle>
                    <List items={caseStudy.lessons} />
                  </SectionBody>
                )}

                {/* --- Future Improvements --- */}
                {caseStudy?.futureImprovements?.length > 0 && (
                  <SectionBody>
                    <SectionTitle icon={ArrowRight}>Future Improvements</SectionTitle>
                    <List items={caseStudy.futureImprovements} />
                  </SectionBody>
                )}

                {/* --- Screenshots carousel --- */}
                <ScreenshotsCarousel
                  screenshots={caseStudy?.screenshots || []}
                  projectTitle={project.title}
                />

                {/* --- Demo GIF --- */}
                {caseStudy?.demoGif && (
                  <SectionBody>
                    <SectionTitle icon={ExternalLink}>Demo</SectionTitle>
                    <div
                      style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                      }}
                    >
                      <img
                        src={caseStudy.demoGif}
                        alt={`${project.title} demo`}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block',
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </SectionBody>
                )}

                {/* Bottom action buttons */}
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    marginTop: '1rem',
                  }}
                >
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                  >
                    <Github size={16} />
                    View Source
                  </a>
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectModal;
