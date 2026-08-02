import { motion } from 'framer-motion';
import {
  FolderGit2,
  Star,
  GitFork,
  Code2,
  Users,
  Globe,
  Heart,
  Activity,
  Database,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Card definitions
// ---------------------------------------------------------------------------

/**
 * @param {import('../services/dashboardService').OverviewStats} stats
 * @returns {Array<{ label: string, value: string|number, icon: import('lucide-react').LucideIcon, color: string, description: string }>}
 */
function buildCards(stats) {
  return [
    {
      label: 'Projects',
      value: stats.totalProjects,
      icon: FolderGit2,
      color: '#ef4444',
      description: 'Featured portfolio projects',
    },
    {
      label: 'Stars',
      value: stats.totalStars,
      icon: Star,
      color: '#f59e0b',
      description: 'Total GitHub stars across repos',
    },
    {
      label: 'Forks',
      value: stats.totalForks,
      icon: GitFork,
      color: '#3b82f6',
      description: 'Total repository forks',
    },
    {
      label: 'Repositories',
      value: stats.totalRepos,
      icon: Database,
      color: '#8b5cf6',
      description: 'All public repositories',
    },
    {
      label: 'Years Coding',
      value: stats.yearsCoding,
      icon: Code2,
      color: '#06b6d4',
      description: 'Years since first commit',
    },
    {
      label: 'Followers',
      value: stats.followers,
      icon: Users,
      color: '#10b981',
      description: 'GitHub followers',
    },
    {
      label: 'Languages',
      value: stats.languagesUsed,
      icon: Globe,
      color: '#f43f5e',
      description: 'Programming languages used',
    },
    {
      label: 'Featured',
      value: stats.featuredProjects,
      icon: Heart,
      color: '#ec4899',
      description: 'Featured & priority projects',
    },
    {
      label: 'Maintained',
      value: stats.maintainedProjects,
      icon: Activity,
      color: '#14b8a6',
      description: 'Active in the last 3 months',
    },
  ];
}

// ---------------------------------------------------------------------------
// Individual card
// ---------------------------------------------------------------------------

/**
 * @param {{
 *   label: string,
 *   value: string|number,
 *   icon: import('lucide-react').LucideIcon,
 *   color: string,
 *   description: string,
 *   index: number,
 * }} props
 */
const StatCard = ({ label, value, icon: Icon, color, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ delay: index * 0.04, duration: 0.4, ease: 'easeOut' }}
    style={{
      padding: '1.25rem 1.5rem',
      borderRadius: '14px',
      background: 'rgba(12, 12, 12, 0.7)',
      border: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
    }}
  >
    {/* Icon container */}
    <div
      style={{
        width: '42px',
        height: '42px',
        borderRadius: '12px',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon size={20} color={color} />
    </div>

    {/* Content */}
    <div style={{ flex: 1, minWidth: 0 }}>
      <p
        style={{
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '1.2px',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '4px',
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: '1.6rem',
          fontWeight: '700',
          color: '#fff',
          lineHeight: 1.1,
          marginBottom: '4px',
        }}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p
        style={{
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.35)',
          lineHeight: 1.3,
        }}
      >
        {description}
      </p>
    </div>
  </motion.div>
);

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

const SkeletonGrid = () => (
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
          animationDelay: `${i * 0.08}s`,
        }}
      />
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * @param {{
 *   stats: import('../services/dashboardService').OverviewStats|null,
 *   loading?: boolean,
 * }} props
 */
const OverviewCards = ({ stats, loading }) => {
  if (loading || !stats) {
    return <SkeletonGrid />;
  }

  const cards = buildCards(stats);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1rem',
      }}
    >
      {cards.map((card, index) => (
        <StatCard key={card.label} {...card} index={index} />
      ))}
    </div>
  );
};

export default OverviewCards;
