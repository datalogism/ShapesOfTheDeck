import dagre from '@dagrejs/dagre';

// Node size estimates used by dagre
const NODE_SIZES = {
  nodeShape: { w: 260, h: 200 },   // varies with row count — dagre uses this as a minimum
  propertyShape: { w: 130, h: 60 },
  logicNode: { w: 160, h: 120 },
  default: { w: 160, h: 80 },
};

// Measure actual rendered size where possible via React Flow's internal dimensions,
// otherwise fall back to estimates.
function nodeSize(node) {
  const measured = node.measured;
  if (measured?.width && measured?.height) {
    return { w: measured.width, h: measured.height };
  }
  return NODE_SIZES[node.type] ?? NODE_SIZES.default;
}

/**
 * Compute a dagre TB layout for the given nodes/edges.
 * Only nodes NOT in `hiddenIds` are laid out; hidden nodes keep their
 * current position so they snap back correctly when revealed.
 *
 * Returns a new nodes array with updated positions.
 */
export function computeLayout(nodes, edges, hiddenIds = new Set(), direction = 'TB') {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep: 60, ranksep: 80, marginx: 40, marginy: 40 });

  const visibleNodes = nodes.filter(n => !hiddenIds.has(n.id) && !n.hidden);
  const visibleIds = new Set(visibleNodes.map(n => n.id));

  for (const n of visibleNodes) {
    const { w, h } = nodeSize(n);
    g.setNode(n.id, { width: w, height: h });
  }

  for (const e of edges) {
    if (visibleIds.has(e.source) && visibleIds.has(e.target)) {
      g.setEdge(e.source, e.target);
    }
  }

  dagre.layout(g);

  return nodes.map(n => {
    if (!visibleIds.has(n.id)) return n;
    const pos = g.node(n.id);
    if (!pos) return n;
    const { w, h } = nodeSize(n);
    return {
      ...n,
      position: {
        x: pos.x - w / 2,
        y: pos.y - h / 2,
      },
    };
  });
}
