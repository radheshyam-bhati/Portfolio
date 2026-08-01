import { motion } from 'framer-motion';
import { Box, Layers } from 'lucide-react';

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

const SkeletonChart = () => (
  <div
    style={{
      borderRadius: '14px',
      background: 'rgba(12, 12, 12, 0.7)',
      border: '1px solid rgba(255,255,255,0.06)',
      padding: '1.5rem',
      height: '340px',
    }}
  >
    <div
      style={{
        width: '180px',
        height: '14px',
        borderRadius: '4px',
        background: 'rgba(255,255,255,0.06)',
        marginBottom: '1.5rem',
        animation: 'shimmer 2s ease-in-out infinite',
      }}
    />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            height: '36px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.04)',
            animation: 'shimmer 2s ease-in-out infinite',
            animationDelay: `${i * 0.06}s`,
          }}
        />
      ))}
    </div>
  </div>
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
    <Box size={32} />
    <p style={{ fontSize: '0.9rem' }}>No technology data available.</p>
  </div>
);

// ---------------------------------------------------------------------------
// Category section
// ---------------------------------------------------------------------------

/**
 * @param {{
 *   name: string,
 *   count: number,
 *   color: string,
 *   percentage: number,
 *   index: number,
 * }} props
 */
const CategorySection = ({ name, count, color, percentage, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.06, duration: 0.35 }}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 12px',
      borderRadius: '10px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.04)',
      transition: 'background 0.2s',
      cursor: 'default',
    }}
    whileHover={{ background: 'rgba(255,255,255,0.05)' }}
  >
    {/* Colour indicator */}
    <div
      style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: color,
        flexShrink: 0,
      }}
    />

    {/* Name + percentage */}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontSize: '0.78rem',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.8)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.3)',
        }}
      >
        {percentage}%
      </div>
    </div>

    {/* Count badge */}
    <div
      style={{
        fontSize: '0.75rem',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.5)',
        fontVariantNumeric: 'tabular-nums',
        background: 'rgba(255,255,255,0.05)',
        padding: '2px 8px',
        borderRadius: '8px',
      }}
    >
      {count}
    </div>
  </motion.div>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * @param {{
 *   categories: import('../services/dashboardService').CategoryStat[]|null,
 *   loading?: boolean,
 * }} props
 */
const TechnologyChart = ({ categories, loading }) => {
  if (loading) return <SkeletonChart />;
  if (!categories || categories.length === 0) return <EmptyState />;

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
        <Layers size={16} color="#8b5cf6" />
        <h3
          style={{
            fontSize: '0.82rem',
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          Technology Stack Breakdown
        </h3>
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(to right, rgba(255,255,255,0.06), transparent)',
          }}
        />
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>
          Count
        </span>
      </div>

      {/* Category grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '8px',
        }}
      >
        {categories.map((cat, index) => (
          <CategorySection key={cat.name} {...cat} index={index} />
        ))}
      </div>
    </div>
  );
};

export default TechnologyChart;
