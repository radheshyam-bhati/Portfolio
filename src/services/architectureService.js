/**
 * @typedef {object} ArchNode
 * @property {string}  id
 * @property {string}  title
 * @property {string}  [description]
 * @property {string[]} [technologies]
 * @property {string[]} [responsibilities]
 * @property {string[]} [pros]
 * @property {string[]} [cons]
 * @property {number}  x  – Computed SVG position
 * @property {number}  y  – Computed SVG position
 */

/**
 * @typedef {object} ArchEdge
 * @property {string} from
 * @property {string} to
 * @property {string} [label]
 * @property {'arrow'|'dashed'|'bidirectional'} [type]
 */

/**
 * @typedef {object} SystemArchitecture
 * @property {string}    title
 * @property {ArchNode[]} nodes
 * @property {ArchEdge[]} edges
 */

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------

const NODE_WIDTH = 180;
const NODE_HEIGHT = 60;
const LAYER_GAP_X = 260;
const LAYER_GAP_Y = 90;
const PADDING = 60;

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Validates that a raw portfolio.json `systemArchitecture` value is
 * structurally sound.  Returns `true` when the object can be rendered.
 *
 * @param {unknown} raw
 * @returns {raw is SystemArchitecture}
 */
function isValid(raw) {
  if (!raw || typeof raw !== 'object') return false;
  const obj = /** @type {Record<string, unknown>} */ (raw);

  if (typeof obj.title !== 'string') return false;
  if (!Array.isArray(obj.nodes) || obj.nodes.length === 0) return false;
  if (!Array.isArray(obj.edges)) return false;

  // Validate every node has at minimum an id and title
  for (const node of obj.nodes) {
    if (!node || typeof node !== 'object') return false;
    const n = /** @type {Record<string, unknown>} */ (node);
    if (typeof n.id !== 'string' || typeof n.title !== 'string') return false;
  }

  // Validate edges reference existing nodes
  const nodeIds = new Set(obj.nodes.map((n) => n.id));
  for (const edge of obj.edges) {
    if (!edge || typeof edge !== 'object') return false;
    const e = /** @type {Record<string, unknown>} */ (edge);
    if (typeof e.from !== 'string' || typeof e.to !== 'string') return false;
    if (!nodeIds.has(e.from) || !nodeIds.has(e.to)) return false;
  }

  return true;
}

// ---------------------------------------------------------------------------
// Layout algorithm — layered (topological) layout
// ---------------------------------------------------------------------------

/**
 * Assigns (x, y) positions to nodes using a layered graph layout.
 *
 * 1. Assign each node to a layer based on its longest path from a source
 *    (node with no incoming edges).
 * 2. Within each layer, stack nodes vertically with `LAYER_GAP_Y` spacing.
 * 3. Space layers horizontally with `LAYER_GAP_X`.
 *
 * Nodes with no incoming edges (sources) start at layer 0.  When a node
 * has multiple predecessors, it goes to the deepest layer + 1.
 *
 * @param {ArchNode[]} nodes
 * @param {ArchEdge[]} edges
 * @returns {ArchNode[]}  Nodes with x/y populated
 */
function computeLayout(nodes, edges) {
  // Build adjacency
  /** @type {Map<string, string[]>} */
  const incoming = new Map();
  nodes.forEach((n) => incoming.set(n.id, []));
  for (const e of edges) {
    const list = incoming.get(e.to);
    if (list) list.push(e.from);
  }

  // Assign layers: topological order via Kahn's algorithm
  const indegree = new Map(nodes.map((n) => [n.id, (incoming.get(n.id) || []).length]));
  const queue = nodes.filter((n) => indegree.get(n.id) === 0).map((n) => n.id);

  // Assign layer depth based on longest path
  const depth = new Map(nodes.map((n) => [n.id, 0]));

  while (queue.length > 0) {
    const id = queue.shift();
    const currentDepth = depth.get(id) || 0;

    // Find all nodes that depend on this one
    for (const edge of edges) {
      if (edge.from === id) {
        const targetDepth = depth.get(edge.to) || 0;
        if (currentDepth + 1 > targetDepth) {
          depth.set(edge.to, currentDepth + 1);
        }
        indegree.set(edge.to, (indegree.get(edge.to) || 1) - 1);
        if (indegree.get(edge.to) === 0) {
          queue.push(edge.to);
        }
      }
    }
  }

  // Group nodes by layer depth
  /** @type {Map<number, string[]>} */
  const layers = new Map();
  for (const [id, d] of depth) {
    const list = layers.get(d) || [];
    list.push(id);
    layers.set(d, list);
  }

  // Compute positions
  const result = nodes.map((node) => {
    const d = depth.get(node.id) || 0;
    const layerNodes = layers.get(d) || [];
    const index = layerNodes.indexOf(node.id);
    const layerWidth = layerNodes.length * LAYER_GAP_Y;

    return {
      ...node,
      x: PADDING + d * LAYER_GAP_X,
      y: PADDING + index * LAYER_GAP_Y - layerWidth / 2 + LAYER_GAP_Y / 2,
    };
  });

  return result;
}

// ---------------------------------------------------------------------------
// Normalisation
// ---------------------------------------------------------------------------

/**
 * Normalises a raw systemArchitecture value into a clean SystemArchitecture
 * object with computed positions.
 *
 * @param {unknown} raw
 * @returns {SystemArchitecture|null}
 */
function normalise(raw) {
  if (!isValid(raw)) return null;

  // Copy node fields, discarding unknown keys
  const nodes = raw.nodes.map((n) => ({
    id: n.id,
    title: n.title,
    description: n.description,
    technologies: Array.isArray(n.technologies) ? n.technologies.filter((t) => typeof t === 'string') : [],
    responsibilities: Array.isArray(n.responsibilities) ? n.responsibilities.filter((r) => typeof r === 'string') : [],
    pros: Array.isArray(n.pros) ? n.pros.filter((p) => typeof p === 'string') : [],
    cons: Array.isArray(n.cons) ? n.cons.filter((c) => typeof c === 'string') : [],
  }));

  // Copy edges, defaulting type
  const edges = raw.edges.map((e) => ({
    from: e.from,
    to: e.to,
    label: e.label,
    type: e.type || 'arrow',
  }));

  const positioned = computeLayout(nodes, edges);

  return {
    title: raw.title,
    nodes: positioned,
    edges,
  };
}

// ---------------------------------------------------------------------------
// ViewBox computation
// ---------------------------------------------------------------------------

/**
 * Computes an SVG viewBox string that encompasses all positioned nodes.
 *
 * @param {ArchNode[]} nodes
 * @returns {string} "minX minY width height"
 */
export function computeViewBox(nodes) {
  if (nodes.length === 0) return '0 0 400 300';

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  for (const n of nodes) {
    if (n.x < minX) minX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.x + NODE_WIDTH > maxX) maxX = n.x + NODE_WIDTH;
    if (n.y + NODE_HEIGHT > maxY) maxY = n.y + NODE_HEIGHT;
  }

  const pad = PADDING;
  return `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Loads and normalises the systemArchitecture from portfolio.json metadata.
 *
 * Returns `null` when the metadata has no valid `systemArchitecture` field.
 *
 * @param {import('./repositoryMetadataService').PortfolioMetadata|null} metadata
 * @returns {SystemArchitecture|null}
 */
export function getSystemArchitecture(metadata) {
  if (!metadata || !('systemArchitecture' in metadata)) return null;
  return normalise(metadata.systemArchitecture);
}

export { NODE_WIDTH, NODE_HEIGHT };
