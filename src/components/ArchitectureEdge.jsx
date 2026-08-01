import { useMemo } from 'react';

/**
 * @typedef {import('../services/architectureService').ArchEdge} ArchEdge
 * @typedef {import('../services/architectureService').ArchNode} ArchNode
 */

// ---------------------------------------------------------------------------
// Path computation
// ---------------------------------------------------------------------------

/**
 * Computes an SVG path from the right edge of `fromNode` to the left edge
 * of `toNode`, with a cubic bezier curve for a smooth arrow look.
 *
 * @param {ArchNode} fromNode
 * @param {ArchNode} toNode
 * @returns {string} SVG path `d` attribute
 */
function computePath(fromNode, toNode) {
  const NODE_HEIGHT = 60;
  const x1 = fromNode.x + 180; // right edge of source
  const y1 = fromNode.y + NODE_HEIGHT / 2;
  const x2 = toNode.x;         // left edge of target
  const y2 = toNode.y + NODE_HEIGHT / 2;

  const dx = Math.abs(x2 - x1);
  const controlOffset = Math.max(dx * 0.4, 40);

  // Use a cubic bezier for a smooth S-curve
  return `M ${x1} ${y1} C ${x1 + controlOffset} ${y1}, ${x2 - controlOffset} ${y2}, ${x2} ${y2}`;
}

// ---------------------------------------------------------------------------
// Edge component
// ---------------------------------------------------------------------------

const ArchitectureEdge = ({ edge, nodeMap, selectedId, onEdgeClick }) => {
  const fromNode = nodeMap.get(edge.from);
  const toNode = nodeMap.get(edge.to);

  const path = useMemo(() => {
    if (!fromNode || !toNode) return '';
    return computePath(fromNode, toNode);
  }, [fromNode, toNode]);

  if (!fromNode || !toNode) return null;

  const isHighlighted = !selectedId || selectedId === edge.from || selectedId === edge.to;
  const isDashed = edge.type === 'dashed';
  const isBidirectional = edge.type === 'bidirectional';

  return (
    <g>
      {/* Invisible wider path for easier click targeting */}
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth={16}
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation();
          if (onEdgeClick) onEdgeClick(edge);
        }}
      />

      {/* Visible path */}
      <path
        d={path}
        fill="none"
        stroke={isHighlighted ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'}
        strokeWidth={isHighlighted ? 2 : 1.5}
        strokeDasharray={isDashed ? '6 4' : 'none'}
        style={{
          transition: 'stroke 0.3s, stroke-width 0.3s',
          cursor: 'pointer',
        }}
        markerEnd={isBidirectional ? 'url(#arrowBoth)' : 'url(#arrowEnd)'}
        markerStart={isBidirectional ? 'url(#arrowStart)' : undefined}
        onClick={(e) => {
          e.stopPropagation();
          if (onEdgeClick) onEdgeClick(edge);
        }}
      />

      {/* Label at midpoint */}
      {edge.label && (
        <text
          x={(fromNode.x + 180 + toNode.x) / 2}
          y={(fromNode.y + 30 + toNode.y + 30) / 2 - 8}
          textAnchor="middle"
          fill="rgba(255,255,255,0.35)"
          fontSize="0.65rem"
          fontFamily="var(--font-main)"
        >
          {edge.label}
        </text>
      )}
    </g>
  );
};

export default ArchitectureEdge;
