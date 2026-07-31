import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, RefreshCw, Star, GitFork, Calendar, Clock, ExternalLink } from 'lucide-react';
import SectionHeading from './SectionHeading';
import OverviewCards from './OverviewCards';
import LanguageChart from './LanguageChart';
import TechnologyChart from './TechnologyChart';
import Timeline from './Timeline';
import InsightsPanel from './InsightsPanel';
import { useDashboard } from '../hooks/useDashboard';

// ---------------------------------------------------------------------------
// Skeleton — full section loading skeleton
// ---------------------------------------------------------------------------

const SkeletonSection = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    {/* Overview skeleton */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1rem',
      }}
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          style={{
            padding: '1.25rem 1.5rem',
            borderRadius: '14px',
            background: 'rgba(12, 12, 12, 0.7)',
            border: '1px solid rgba(255,255,255,0.06)',
            height: '120px',
            animation: 'shimmer 2s ease-in-out infinite',
            animationDelay: `${i * 0.06}s`,
          }}
        />
      ))}
    </div>

    {/* Charts skeleton */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
      }}
    >
      <div
        style={{
          borderRadius: '14px',
          background: 'rgba(12, 12, 12, 0.7)',
          border: '1px solid rgba(255,255,255,0.06)',
          height: '320px',
          animation: 'shimmer 2s ease-in-out infinite',
          animationDelay: '0.2s',
        }}
      />
      <div
        style={{
          borderRadius: '14px',
          background: 'rgba(12, 12, 12, 0.7)',
          border: '1px solid rgba(255,255,255,0.06)',
          height: '320px',
          animation: 'shimmer 2s ease-in-out infinite',
          animationDelay: '0.3s',
        }}
      />
    </div>

    {/* Bottom row skeleton */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
      }}
    >
      <div
        style={{
          borderRadius: '14px',
          background: 'rgba(12, 12, 12, 0.7)',
          border: '1px solid rgba(255,255,255,0.06)',
          height: '360px',
          animation: 'shimmer 2s ease-in-out infinite',
          animationDelay: '0.35s',
        }}
      />
      <div
        style={{
          borderRadius: '14px',
          background: 'rgba(12, 12, 12, 0.7)',
          border: '1px solid rgba(255,255,255,0.06)',
          height: '360px',
          animation: 'shimmer 2s ease-in-out infinite',
          animationDelay: '0.4s',
        }}
      />
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
      borderRadius: '14px',
      background: 'rgba(12, 12, 12, 0.7)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}
  >
    <BarChart3 size={36} color="rgba(255,255,255,0.15)" />
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
      style={{ padding: '10px 24px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
    >
      <RefreshCw size={16} />
      Retry
    </button>
  </div>
);

// ---------------------------------------------------------------------------
// Leader card — mini metric display for repository highlights
// ---------------------------------------------------------------------------

/**
 * @param {{
 *   icon: import('lucide-react').LucideIcon,
 *   iconColor: string,
 *   label: string,
 *   project: import('../services/projectService').Project,
 * }} props
 */
const LeaderCard = ({ icon: Icon, iconColor, label, project }) => (
  <div
    style={{
      padding: '1rem 1.25rem',
      borderRadius: '14px',
      background: 'rgba(12, 12, 12, 0.7)',
      border: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}
  >
    <div
      style={{
        width: '38px',
        height: '38px',
        borderRadius: '10px',
        background: `${iconColor}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon size={18} color={iconColor} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p
        style={{
          fontSize: '0.65rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: 'rgba(255,255,255,0.35)',
          marginBottom: '2px',
        }}
      >
        {label}
      </p>
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.85)',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = iconColor; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}
      >
        {project.title}
        <ExternalLink size={10} />
      </a>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const DashboardSection = () => {
  const sectionRef = useRef(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  // Lazy-load: fetch only when the section scrolls into view — saves GitHub
  // API calls on every page load.
  const { dashboard, loading, error, retry } = useDashboard({ lazy: true });

  // IntersectionObserver triggers the first fetch when the section approaches
  // the viewport, then disconnects so it fires exactly once.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || hasTriggered) return;

    // Fallback for very old browsers without IntersectionObserver.
    if (typeof IntersectionObserver === 'undefined') {
      setHasTriggered(true);
      retry();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHasTriggered(true);
          retry();
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px', threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasTriggered, retry]);

  // Show the skeleton until the first fetch has been triggered AND resolved.
  const pending = !hasTriggered || loading;

  // Memoize sub-data so child components don't cause re-renders of the whole section
  const overview = useMemo(() => dashboard?.overview ?? null, [dashboard]);
  const metrics = useMemo(() => dashboard?.repositoryMetrics ?? null, [dashboard]);
  const languages = useMemo(() => dashboard?.languages ?? null, [dashboard]);
  const categories = useMemo(() => dashboard?.categories ?? null, [dashboard]);
  const timeline = useMemo(() => dashboard?.timeline ?? null, [dashboard]);
  const insights = useMemo(() => dashboard?.insights ?? null, [dashboard]);

  return (
    <section ref={sectionRef} id="dashboard" className="section">
      <SectionHeading number="04." title="Engineering Dashboard" />

      {/* Skeleton — shown until scrolled into view, then while fetching */}
      {pending && <SkeletonSection />}

      {/* Error state */}
      {!pending && error && <ErrorState message="Unable to load dashboard data." onRetry={retry} />}

      {/* Dashboard content */}
      {!pending && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {/* Overview cards */}
          <OverviewCards stats={overview} loading={false} />

          {/* Project leaders — repository metrics */}
          {metrics && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
              }}
            >
              {metrics.mostStarred && (
                <LeaderCard
                  icon={Star}
                  iconColor="#f59e0b"
                  label="Most Starred"
                  project={metrics.mostStarred}
                />
              )}
              {metrics.mostForked && (
                <LeaderCard
                  icon={GitFork}
                  iconColor="#3b82f6"
                  label="Most Forked"
                  project={metrics.mostForked}
                />
              )}
              {metrics.recentlyUpdated && (
                <LeaderCard
                  icon={Clock}
                  iconColor="#10b981"
                  label="Recently Updated"
                  project={metrics.recentlyUpdated}
                />
              )}
              {metrics.oldestProject && (
                <LeaderCard
                  icon={Calendar}
                  iconColor="#8b5cf6"
                  label="Oldest Project"
                  project={metrics.oldestProject}
                />
              )}
            </div>
          )}

          {/* Language + Technology charts */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              gap: '1rem',
            }}
          >
            <LanguageChart languages={languages} loading={false} />
            <TechnologyChart categories={categories} loading={false} />
          </div>

          {/* Timeline + Insights */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              gap: '1rem',
            }}
          >
            <Timeline timeline={timeline} loading={false} />
            <InsightsPanel insights={insights} loading={false} />
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default DashboardSection;
