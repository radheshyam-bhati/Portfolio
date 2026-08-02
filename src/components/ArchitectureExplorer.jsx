import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';
import ArchitectureNode from './ArchitectureNode';
import ArchitectureEdge from './ArchitectureEdge';
import ArchitectureSidebar from './ArchitectureSidebar';
import { computeViewBox } from '../services/architectureService';

/**
 * @typedef {import('../services/architectureService').SystemArchitecture} SystemArchitecture
 * @typedef {import('../services/architectureService').ArchNode} ArchNode
 * @typedef {import('../services/architectureService').ArchEdge} ArchEdge
 */

// ---------------------------------------------------------------------------
// Zoom / Pan controls
// ---------------------------------------------------------------------------

const ZoomControls = ({ onZoomIn, onZoomOut, onFit, onReset }) => (
  <div
    style={{
      position: 'absolute',
      top: '12px',
      right: '12px',
      display: 'flex',
      gap: '4px',
      zIndex: 5,
    }}
  >
    {[
      { icon: ZoomIn, label: 'Zoom in', onClick: onZoomIn },
      { icon: ZoomOut, label: 'Zoom out', onClick: onZoomOut },
      { icon: Maximize2, label: 'Fit to screen', onClick: onFit },
      { icon: RotateCcw, label: 'Reset view', onClick: onReset },
    ].map(({ icon: Icon, label, onClick }) => (
      <button
        key={label}
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.7)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(239,68,68,0.2)';
          e.currentTarget.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
        }}
      >
        <Icon size={14} />
      </button>
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Architecture Explorer
// ---------------------------------------------------------------------------

const ArchitectureExplorer = ({ graph }) => {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [viewTransform, setViewTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const svgRef = useRef(null);
  const containerRef = useRef(null);

  // Memoize the viewBox so it doesn't recompute on every render
  const viewBox = useMemo(() => computeViewBox(graph.nodes), [graph.nodes]);

  // Build a node map for edge rendering
  const nodeMap = useMemo(() => {
    const map = new Map();
    for (const node of graph.nodes) {
      map.set(node.id, node);
    }
    return map;
  }, [graph.nodes]);

  // Find connected node IDs for highlighting
  const connectedNodeIds = useMemo(() => {
    if (!selectedNodeId) return new Set();
    const set = new Set();
    set.add(selectedNodeId);
    for (const edge of graph.edges) {
      if (edge.from === selectedNodeId) set.add(edge.to);
      if (edge.to === selectedNodeId) set.add(edge.from);
    }
    return set;
  }, [selectedNodeId, graph.edges]);

  // Find related node titles for the sidebar
  const relatedNodeTitles = useMemo(() => {
    if (!selectedNodeId) return [];
    const titles = [];
    for (const edge of graph.edges) {
      if (edge.from === selectedNodeId) {
        const n = nodeMap.get(edge.to);
        if (n) titles.push(n.title);
      }
      if (edge.to === selectedNodeId) {
        const n = nodeMap.get(edge.from);
        if (n) titles.push(n.title);
      }
    }
    return titles;
  }, [selectedNodeId, graph.edges, nodeMap]);

  const selectedNode = selectedNodeId ? nodeMap.get(selectedNodeId) : null;

  // Handle node click
  const handleNodeClick = useCallback(
    (node) => {
      if (selectedNodeId === node.id) {
        // Deselect
        setSelectedNodeId(null);
        setSidebarOpen(false);
      } else {
        setSelectedNodeId(node.id);
        setSidebarOpen(true);
      }
    },
    [selectedNodeId],
  );

  // Handle pan
  const handleMouseDown = useCallback(
    (e) => {
      if (e.target === svgRef.current || e.target === containerRef.current) {
        setIsPanning(true);
        setPanStart({ x: e.clientX - viewTransform.x, y: e.clientY - viewTransform.y });
      }
    },
    [viewTransform],
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isPanning) return;
      setViewTransform((prev) => ({
        ...prev,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      }));
    },
    [isPanning, panStart],
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setViewTransform((prev) => ({
      ...prev,
      scale: Math.max(0.3, Math.min(3, prev.scale * delta)),
    }));
  }, []);

  const zoomIn = useCallback(() => {
    setViewTransform((prev) => ({
      ...prev,
      scale: Math.min(3, prev.scale * 1.25),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setViewTransform((prev) => ({
      ...prev,
      scale: Math.max(0.3, prev.scale * 0.8),
    }));
  }, []);

  const fitToScreen = useCallback(() => {
    if (!svgRef.current) return;
    const container = containerRef.current;
    if (!container) return;
    const cw = container.clientWidth || 600;
    const ch = container.clientHeight || 300;
    const vb = viewBox.split(' ').map(Number);
    const vbw = vb[2] || 400;
    const vbh = vb[3] || 300;
    const scale = Math.min((cw - 40) / vbw, (ch - 40) / vbh, 1.5);
    setViewTransform({ x: 20, y: 20, scale: Math.max(0.3, scale) });
  }, [viewBox]);

  const resetView = useCallback(() => {
    setViewTransform({ x: 0, y: 0, scale: 1 });
    setSelectedNodeId(null);
    setSidebarOpen(false);
  }, []);

  // Click on background to deselect
  const handleBackgroundClick = useCallback(() => {
    setSelectedNodeId(null);
    setSidebarOpen(false);
  }, []);

  // Escape while sidebar is open
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSelectedNodeId(null);
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  // Keyboard: arrow keys to navigate between nodes when one is selected
  useEffect(() => {
    if (!selectedNodeId || graph.nodes.length === 0) return;

    const handleArrowKeys = (e) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      e.preventDefault();

      const currentIdx = graph.nodes.findIndex((n) => n.id === selectedNodeId);
      if (currentIdx === -1) return;

      let nextIdx;
      if (e.key === 'ArrowDown') nextIdx = (currentIdx + 1) % graph.nodes.length;
      else if (e.key === 'ArrowUp') nextIdx = (currentIdx - 1 + graph.nodes.length) % graph.nodes.length;
      else if (e.key === 'ArrowRight') {
        // Next node in the same or next layer
        nextIdx = Math.min(currentIdx + 1, graph.nodes.length - 1);
      } else {
        // ArrowLeft: previous node
        nextIdx = Math.max(currentIdx - 1, 0);
      }

      const nextNode = graph.nodes[nextIdx];
      if (nextNode) {
        setSelectedNodeId(nextNode.id);
        setSidebarOpen(true);
      }
    };

    window.addEventListener('keydown', handleArrowKeys);
    return () => window.removeEventListener('keydown', handleArrowKeys);
  }, [selectedNodeId, graph.nodes]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.25)',
        border: '1px solid rgba(255,255,255,0.06)',
        cursor: isPanning ? 'grabbing' : 'grab',
        display: 'flex',
        minHeight: '300px',
      }}
    >
      {/* SVG canvas */}
      <svg
        ref={svgRef}
        viewBox={viewBox}
        style={{
          flex: 1,
          minHeight: '300px',
          userSelect: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* SVG definitions for arrow markers */}
        <defs>
          <marker id="arrowEnd" markerWidth={10} markerHeight={8} refX={10} refY={4} orient="auto">
            <path d="M0,0 L10,4 L0,8" fill="rgba(255,255,255,0.35)" />
          </marker>
          <marker id="arrowStart" markerWidth={10} markerHeight={8} refX={0} refY={4} orient="auto">
            <path d="M10,0 L0,4 L10,8" fill="rgba(255,255,255,0.35)" />
          </marker>
          <marker id="arrowBoth" markerWidth={10} markerHeight={8} refX={10} refY={4} orient="auto">
            <path d="M0,0 L10,4 L0,8" fill="rgba(255,255,255,0.35)" />
          </marker>
        </defs>

        {/* Background click to deselect */}
        <rect
          width="100%"
          height="100%"
          fill="transparent"
          onClick={handleBackgroundClick}
        />

        {/* Apply transform group for zoom/pan */}
        <g
          transform={`translate(${viewTransform.x}, ${viewTransform.y}) scale(${viewTransform.scale})`}
        >
          {/* Edges */}
          {graph.edges.map((edge, idx) => (
            <ArchitectureEdge
              key={`${edge.from}-${edge.to}-${idx}`}
              edge={edge}
              nodeMap={nodeMap}
              selectedId={selectedNodeId}
            />
          ))}

          {/* Nodes */}
          {graph.nodes.map((node) => (
            <ArchitectureNode
              key={node.id}
              node={node}
              isSelected={node.id === selectedNodeId}
              isConnected={connectedNodeIds.has(node.id) && node.id !== selectedNodeId}
              onClick={handleNodeClick}
            />
          ))}
        </g>
      </svg>

      {/* Sidebar */}
      {sidebarOpen && selectedNode && (
        <ArchitectureSidebar
          node={selectedNode}
          relatedNodes={relatedNodeTitles}
          onClose={() => {
            setSelectedNodeId(null);
            setSidebarOpen(false);
          }}
        />
      )}

      {/* Zoom controls */}
      <ZoomControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFit={fitToScreen}
        onReset={resetView}
      />
    </div>
  );
};

export default ArchitectureExplorer;
