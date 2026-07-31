import { motion } from 'framer-motion';
import {
  Lightbulb,
  Code2,
  Clock,
  Sparkles,
  Star,
  TrendingUp,
  Layers,
  BarChart3,
  Box,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

const SkeletonPanel = () => (
  <div
    style={{
      borderRadius: '14px',
      background: 'rgba(12, 12, 12, 0.7)',
      border: '1px solid rgba(255,255,255,0.06)',
      padding: '1.5rem',
      height: '280px',
    }}
  >
    <div
      style={{
        width: '120px',
        height: '14px',
        borderRadius: '4px',
        background: 'rgba(255,255,255,0.06)',
        marginBottom: '1.5rem',
        animation: 'shimmer 2s ease-in-out infinite',
      }}
    />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          style={{
            padding: '12px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.02)',
            animation: 'shimmer 2s ease-in-out infinite',
            animationDelay: `${i * 0.06}s`,
          }}
        />
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Insight item definitions
// ---------------------------------------------------------------------------

/**
 * @param {import('../services/dashboardService').Insights} insights
 * @returns {Array<{ label: string, value: string, icon: import('lucide-react').LucideIcon, color: string }>}
 */
function buildInsightItems(insights) {
  return [
    {
      label: 'Most Used Technology',
      value: insights.mostUsedTech,
      icon: Code2,
      color: '#ef4444',
    },
    {
      label: 'Longest Maintained',
      value: insights.longestMaintained,
      icon: Clock,
      color: '#f59e0b',
    },
    {
      label: 'Newest Project',
      value: insights.newestProject,
      icon: Sparkles,
      color: '#10b981',
    },
    {
      label: 'Oldest Project',
      value: insights.oldestProject,
      icon: BarChart3,
      color: '#3b82f6',
    },
    {
      label: 'Most Starred',
      value: insights.mostStarredProject,
      icon: Star,
      color: '#f59e0b',
    },
    {
      label: 'Most Active Technology',
      value: insights.mostActiveTech,
      icon: TrendingUp,
      color: '#8b5cf6',
    },
    {
      label: 'Largest Project',
      value: insights.largestProject,
      icon: Box,
      color: '#14b8a6',
    },
    {
      label: 'Most Common Stack',
      value: insights.mostCommonStack,
      icon: Layers,
      color: '#06b6d4',
    },
  ];
}

// ---------------------------------------------------------------------------
// Single insight metric
// ---------------------------------------------------------------------------

/**
 * @param {{
 *   label: string,
 *   value: string,
 *   icon: import('lucide-react').LucideIcon,
 *   color: string,
 *   index: number,
 * }} props
 */
const InsightMetric = ({ label, value, icon: Icon, color, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.04, duration: 0.3 }}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 12px',
      borderRadius: '10px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.04)',
      transition: 'background 0.2s',
      cursor: 'default',
    }}
    whileHover={{ background: 'rgba(255,255,255,0.05)' }}
  >
    {/* Icon */}
    <div
      style={{
        width: '34px',
        height: '34px',
        borderRadius: '10px',
        background: `${color}12`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon size={16} color={color} />
    </div>

    {/* Text */}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          marginBottom: '1px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.85)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </div>
    </div>
  </motion.div>
);

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

const EmptyState = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 2rem',
      color: 'rgba(255,255,255,0.3)',
      gap: '0.75rem',
    }}
  >
    <Lightbulb size={32} />
    <p style={{ fontSize: '0.9rem' }}>Insights are being computed...</p>
  </div>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * @param {{
 *   insights: import('../services/dashboardService').Insights|null,
 *   loading?: boolean,
 * }} props
 */
const InsightsPanel = ({ insights, loading }) => {
  if (loading) return <SkeletonPanel />;
  if (!insights) return <EmptyState />;

  const items = buildInsightItems(insights);

  return (
    <div
      style={{
        borderRadius: '14px',
        background: 'rgba(12, 12, 12, 0.7)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)',
        padding: '1.5rem',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '1.25rem',
        }}
      >
        <Lightbulb size={16} color="#f59e0b" />
        <h3
          style={{
            fontSize: '0.82rem',
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          Engineering Insights
        </h3>
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(to right, rgba(255,255,255,0.06), transparent)',
          }}
        />
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '8px',
        }}
      >
        {items.map((item, index) => (
          <InsightMetric key={item.label} {...item} index={index} />
        ))}
      </div>
    </div>
  );
};

export default InsightsPanel;
