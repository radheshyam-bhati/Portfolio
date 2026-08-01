import { motion } from 'framer-motion';
import { Code2, TrendingUp, Clock } from 'lucide-react';

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
      height: '320px',
    }}
  >
    <div
      style={{
        width: '160px',
        height: '14px',
        borderRadius: '4px',
        background: 'rgba(255,255,255,0.06)',
        marginBottom: '1.5rem',
        animation: 'shimmer 2s ease-in-out infinite',
      }}
    />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          style={{
            height: '28px',
            borderRadius: '6px',
            background: 'rgba(255,255,255,0.04)',
            animation: 'shimmer 2s ease-in-out infinite',
            animationDelay: `${i * 0.08}s`,
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
    <Code2 size={32} />
    <p style={{ fontSize: '0.9rem' }}>No language data available yet.</p>
  </div>
);

// ---------------------------------------------------------------------------
// Bar component
// ---------------------------------------------------------------------------

const MAX_BAR_WIDTH_PERCENT = 85;

/**
 * @param {{
 *   name: string,
 *   percentage: number,
 *   count: number,
 *   color: string,
 *   isTrending: boolean,
 *   isRecent: boolean,
 *   index: number,
 * }} props
 */
const LanguageBar = ({ name, percentage, count, color, isTrending, isRecent, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '6px 0',
      position: 'relative',
    }}
  >
    {/* Colour dot */}
    <div
      style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: color,
        flexShrink: 0,
        boxShadow: `0 0 8px ${color}60`,
      }}
    />

    {/* Language name */}
    <span
      style={{
        width: '110px',
        fontSize: '0.82rem',
        color: 'rgba(255,255,255,0.85)',
        fontWeight: 500,
        flexShrink: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {name}
      {(isTrending || isRecent) && (
        <span style={{ marginLeft: '6px', verticalAlign: 'middle' }}>
          {isTrending && <TrendingUp size={12} color="#10b981" style={{ verticalAlign: 'middle' }} />}
          {isRecent && <Clock size={12} color="#f59e0b" style={{ verticalAlign: 'middle', marginLeft: '2px' }} />}
        </span>
      )}
    </span>

    {/* Bar track */}
    <div
      style={{
        flex: 1,
        height: '22px',
        borderRadius: '11px',
        background: 'rgba(255,255,255,0.04)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Fill */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${Math.min(percentage, MAX_BAR_WIDTH_PERCENT)}%` }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05, duration: 0.6, ease: 'easeOut' }}
        style={{
          height: '100%',
          borderRadius: '11px',
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
          minWidth: '4px',
        }}
      />
    </div>

    {/* Count badge */}
    <div
      style={{
        minWidth: '36px',
        textAlign: 'right',
        fontSize: '0.78rem',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.5)',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {count}
    </div>

    {/* Percentage label */}
    <div
      style={{
        width: '40px',
        textAlign: 'right',
        fontSize: '0.75rem',
        fontWeight: 500,
        color: 'rgba(255,255,255,0.3)',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {percentage}%
    </div>
  </motion.div>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * @param {{
 *   languages: import('../services/dashboardService').LanguageStat[]|null,
 *   loading?: boolean,
 * }} props
 */
const LanguageChart = ({ languages, loading }) => {
  if (loading) return <SkeletonChart />;
  if (!languages || languages.length === 0) return <EmptyState />;

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
        <Code2 size={16} color="#f43f5e" />
        <h3
          style={{
            fontSize: '0.82rem',
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          Language Distribution
        </h3>
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(to right, rgba(255,255,255,0.06), transparent)',
          }}
        />
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>
          Repos
        </span>
      </div>

      {/* Bars */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {languages.map((lang, index) => (
          <LanguageBar key={lang.name} {...lang} index={index} />
        ))}
      </div>
    </div>
  );
};

export default LanguageChart;
