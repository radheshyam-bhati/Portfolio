import { motion } from 'framer-motion';
import {
  Calendar,
  FolderGit2,
  GraduationCap,
  Award,
  Zap,
  ExternalLink,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Icons per event type
// ---------------------------------------------------------------------------

/**
 * @type {Record<string, import('lucide-react').LucideIcon>}
 */
const TYPE_ICONS = {
  project: FolderGit2,
  education: GraduationCap,
  certification: Award,
  milestone: Zap,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Formats an ISO date string into a readable label — "Jan 2024" or "2023".
 *
 * @param {string} isoDate
 * @returns {string}
 */
function formatDate(isoDate) {
  const date = new Date(isoDate);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Returns a human-readable time span from the date to now.
 *
 * @param {string} isoDate
 * @returns {string}
 */
function timeAgo(isoDate) {
  const ms = Date.now() - new Date(isoDate).getTime();
  const years = Math.floor(ms / (365.25 * 24 * 60 * 60 * 1000));
  if (years > 0) return `${years}y ago`;
  const months = Math.floor(ms / (30 * 24 * 60 * 60 * 1000));
  if (months > 0) return `${months}mo ago`;
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  return `${days}d ago`;
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

const SkeletonTimeline = () => (
  <div
    style={{
      borderRadius: '14px',
      background: 'rgba(12, 12, 12, 0.7)',
      border: '1px solid rgba(255,255,255,0.06)',
      padding: '1.5rem',
    }}
  >
    <div
      style={{
        width: '140px',
        height: '14px',
        borderRadius: '4px',
        background: 'rgba(255,255,255,0.06)',
        marginBottom: '1.5rem',
        animation: 'shimmer 2s ease-in-out infinite',
      }}
    />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.04)',
              flexShrink: 0,
              animation: 'shimmer 2s ease-in-out infinite',
              animationDelay: `${i * 0.08}s`,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                width: '120px',
                height: '10px',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.04)',
                marginBottom: '6px',
                animation: 'shimmer 2s ease-in-out infinite',
                animationDelay: `${i * 0.08 + 0.05}s`,
              }}
            />
            <div
              style={{
                width: '60%',
                height: '8px',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.03)',
                animation: 'shimmer 2s ease-in-out infinite',
                animationDelay: `${i * 0.08 + 0.1}s`,
              }}
            />
          </div>
        </div>
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
    <Calendar size={32} />
    <p style={{ fontSize: '0.9rem' }}>Timeline is being built...</p>
  </div>
);

// ---------------------------------------------------------------------------
// Timeline event component
// ---------------------------------------------------------------------------

/**
 * @param {{
 *   event: import('../services/dashboardService').TimelineEvent,
 *   index: number,
 *   isLast: boolean,
 * }} props
 */
const TimelineEvent = ({ event, index, isLast }) => {
  const Icon = TYPE_ICONS[event.type] || Zap;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      style={{
        display: 'flex',
        gap: '14px',
        position: 'relative',
        paddingBottom: isLast ? '0' : '1.25rem',
      }}
    >
      {/* Vertical connector line */}
      {!isLast && (
        <div
          style={{
            position: 'absolute',
            left: '15px',
            top: '32px',
            bottom: '0',
            width: '2px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.02))',
          }}
        />
      )}

      {/* Icon dot */}
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: `${event.color}18`,
          border: `2px solid ${event.color}50`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Icon size={14} color={event.color} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, paddingTop: '4px' }}>
        {/* Date + type */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px',
          }}
        >
          <span
            style={{
              fontSize: '0.68rem',
              color: 'rgba(255,255,255,0.3)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatDate(event.date)}
          </span>
          <span
            style={{
              fontSize: '0.62rem',
              color: 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {event.type}
          </span>
          <span
            style={{
              fontSize: '0.62rem',
              color: 'rgba(255,255,255,0.15)',
              marginLeft: 'auto',
            }}
          >
            {timeAgo(event.date)}
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '2px',
          }}
        >
          {event.link ? (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'inherit',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = event.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '';
              }}
            >
              {event.title}
              <ExternalLink size={12} style={{ flexShrink: 0 }} />
            </a>
          ) : (
            event.title
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p
            style={{
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {event.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * @param {{
 *   timeline: import('../services/dashboardService').TimelineEvent[]|null,
 *   loading?: boolean,
 * }} props
 */
const Timeline = ({ timeline, loading }) => {
  if (loading) return <SkeletonTimeline />;
  if (!timeline || timeline.length === 0) return <EmptyState />;

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
        <Calendar size={16} color="#06b6d4" />
        <h3
          style={{
            fontSize: '0.82rem',
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          Engineering Timeline
        </h3>
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(to right, rgba(255,255,255,0.06), transparent)',
          }}
        />
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>
          {timeline.length} events
        </span>
      </div>

      {/* Events */}
      <div>
        {timeline.map((event, index) => (
          <TimelineEvent
            key={`${event.type}:${event.title}:${event.date}`}
            event={event}
            index={index}
            isLast={index === timeline.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;
