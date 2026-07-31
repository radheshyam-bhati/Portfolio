import { motion } from 'framer-motion';

/**
 * @typedef {import('../services/architectureService').ArchNode} ArchNode
 */

const NODE_WIDTH = 180;
const NODE_HEIGHT = 60;

const ArchitectureNode = ({ node, isSelected, isConnected, onClick }) => {
  const accentColor = isSelected
    ? 'var(--color-neon-blue)'
    : isConnected
      ? 'rgba(239,68,68,0.6)'
      : 'rgba(255,255,255,0.12)';

  const bgColor = isSelected
    ? 'rgba(239,68,68,0.15)'
    : isConnected
      ? 'rgba(239,68,68,0.06)'
      : 'rgba(255,255,255,0.03)';

  const opacity = !isSelected && !isConnected ? 0.4 : 1;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity,
        scale: isSelected ? 1.08 : 1,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        cursor: 'pointer',
        outline: 'none',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(node);
      }}
      role="button"
      tabIndex={0}
      aria-label={`Architecture node: ${node.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(node);
        }
      }}
    >
      {/* Node rectangle */}
      <motion.rect
        x={node.x}
        y={node.y}
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        rx={12}
        ry={12}
        fill={bgColor}
        stroke={accentColor}
        strokeWidth={isSelected ? 2 : 1}
        animate={{
          strokeWidth: isSelected ? 2 : 1,
          stroke: accentColor,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Glow for selected node */}
      {isSelected && (
        <rect
          x={node.x - 3}
          y={node.y - 3}
          width={NODE_WIDTH + 6}
          height={NODE_HEIGHT + 6}
          rx={15}
          ry={15}
          fill="none"
          stroke="var(--color-neon-blue)"
          strokeWidth={1}
          opacity={0.3}
        />
      )}

      {/* Title */}
      <text
        x={node.x + NODE_WIDTH / 2}
        y={node.y + NODE_HEIGHT / 2 - 3}
        textAnchor="middle"
        fill="white"
        fontSize="0.8rem"
        fontWeight={600}
        fontFamily="var(--font-main)"
      >
        {node.title.length > 20 ? node.title.slice(0, 18) + '…' : node.title}
      </text>

      {/* Description (small, below title, if present) */}
      {node.description && (
        <text
          x={node.x + NODE_WIDTH / 2}
          y={node.y + NODE_HEIGHT / 2 + 14}
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize="0.6rem"
          fontFamily="var(--font-main)"
        >
          {node.description.length > 25 ? node.description.slice(0, 23) + '…' : node.description}
        </text>
      )}
    </motion.g>
  );
};

export { NODE_WIDTH, NODE_HEIGHT };
export default ArchitectureNode;
