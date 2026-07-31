import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, ArrowRightCircle, Code2, ListTodo } from 'lucide-react';

/**
 * @typedef {import('../services/architectureService').ArchNode} ArchNode
 */

// ---------------------------------------------------------------------------
// Small sub-components
// ---------------------------------------------------------------------------

const BadgeList = ({ items, icon: Icon, color, label }) => {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginBottom: '1rem' }}>
      <p
        style={{
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          color: 'var(--color-text-muted)',
          marginBottom: '0.5rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {Icon && <Icon size={12} />}
        {label}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {items.map((item) => (
          <span
            key={item}
            style={{
              fontSize: '0.7rem',
              padding: '3px 8px',
              borderRadius: '8px',
              background: `${color || 'rgba(255,255,255,0.05)'}`,
              color: 'rgba(255,255,255,0.7)',
              border: `1px solid ${color || 'rgba(255,255,255,0.08)'}`,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const ProConList = ({ items, type }) => {
  if (!items || items.length === 0) return null;
  const isPro = type === 'pros';
  const Icon = isPro ? CheckCircle2 : AlertCircle;
  const label = isPro ? 'Pros' : 'Cons';

  return (
    <div style={{ marginBottom: '1rem' }}>
      <p
        style={{
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          color: 'var(--color-text-muted)',
          marginBottom: '0.5rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {Icon && <Icon size={12} />}
        {label}
      </p>
      <ul style={{ paddingLeft: '1rem', margin: 0 }}>
        {items.map((item, i) => (
          <li
            key={i}
            style={{
              fontSize: '0.78rem',
              color: 'var(--color-text-muted)',
              marginBottom: '4px',
              lineHeight: '1.4',
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Sidebar main component
// ---------------------------------------------------------------------------

const ArchitectureSidebar = ({ node, relatedNodes, onClose }) => {
  // Escape to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!node) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="sidebar"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 280, opacity: 1 }}
        exit={{ width: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        style={{
          overflow: 'hidden',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: '0 12px 12px 0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '1rem', flex: 1, overflowY: 'auto', minWidth: 280 }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '0.75rem',
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'white',
                  margin: 0,
                }}
              >
                {node.title}
              </h4>
              {node.description && (
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    margin: '4px 0 0',
                    lineHeight: '1.4',
                  }}
                >
                  {node.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close node details"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
                flexShrink: 0,
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Technologies */}
          <BadgeList items={node.technologies} icon={Code2} color="rgba(239,68,68,0.15)" label="Technologies" />

          {/* Responsibilities */}
          <BadgeList items={node.responsibilities} icon={ListTodo} color="rgba(59,130,246,0.15)" label="Responsibilities" />

          {/* Pros */}
          <ProConList items={node.pros} type="pros" />

          {/* Cons */}
          <ProConList items={node.cons} type="cons" />

          {/* Related components */}
          {relatedNodes && relatedNodes.length > 0 && (
            <div>
              <p
                style={{
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  color: 'var(--color-text-muted)',
                  marginBottom: '0.5rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <ArrowRightCircle size={12} />
                Connected to
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {relatedNodes.map((name) => (
                  <span
                    key={name}
                    style={{
                      fontSize: '0.7rem',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      background: 'rgba(239,68,68,0.08)',
                      color: 'rgba(255,255,255,0.65)',
                      border: '1px solid rgba(239,68,68,0.15)',
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ArchitectureSidebar;
