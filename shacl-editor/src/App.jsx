import { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { NodeShapeNode } from './components/nodes/NodeShapeNode';
import { PropertyShapeNode } from './components/nodes/PropertyShapeNode';
import { LogicNode } from './components/nodes/LogicNode';
import { PropertyEdge } from './components/edges/PropertyEdge';
import { ConstraintPanel } from './components/ConstraintPanel';
import { ShapeListView } from './components/ShapeListView';
import { CodeEditorView } from './components/CodeEditorView';
import { ConfigPanel } from './components/ConfigPanel';
import { ShapeLibrary } from './components/ShapeLibrary';
import { ShapeArena } from './components/ShapeArena';
import { ShapeReport } from './components/ShapeReport';
import { ShapeFusion } from './components/ShapeFusion';
import { DeckView } from './components/DeckView';
import { LOGIC_OPERATORS } from './data/shaclConstraints';
import { INITIAL_PREFIXES } from './data/commonPrefixes';
import { importFromTurtle } from './utils/turtleImport';
import { exportToTurtle } from './utils/turtleExport';
import { topicColor } from './utils/topicColors';
import { computeLayout } from './utils/graphLayout';
import { shacl2shex, shex2shacl, checkTranslatorHealth } from './utils/translator';
import { useTheme } from './utils/useTheme';
import './App.css';

// ── Inner component: lives inside <ReactFlow> so it can use useReactFlow ─────
// Handles dagre re-layout + fitView whenever the topic filter or graph mode changes.
function LayoutAndFitEffect({ activeTopics, graphMode, nodes, edges, setNodes, shapeKey }) {
  const { fitView } = useReactFlow();
  // Saved positions let us restore the user's original layout when the filter is cleared.
  const savedPositions = useRef(null);
  const prevShapeKey = useRef(shapeKey);

  useEffect(() => {
    // New shape loaded — discard any saved positions from the old shape
    if (shapeKey !== prevShapeKey.current) {
      savedPositions.current = null;
      prevShapeKey.current = shapeKey;
    }

    const embeddingTypes = new Set(['nodeShape', 'logicNode']);
    const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));

    if (activeTopics === null) {
      // ── Filter cleared ──
      if (savedPositions.current) {
        // Restore original positions
        setNodes(nds => nds.map(n => {
          const orig = savedPositions.current?.get(n.id);
          return orig ? { ...n, position: orig } : n;
        }));
        savedPositions.current = null;
      }
      const t = setTimeout(() => fitView({ padding: 0.15, duration: 500 }), 60);
      return () => clearTimeout(t);
    }

    // ── Filter active ──
    // Save current positions before the first layout
    if (!savedPositions.current) {
      savedPositions.current = new Map(nodes.map(n => [n.id, { ...n.position }]));
    }

    // Determine hidden ids
    const hiddenIds = new Set(
      nodes.filter(n => {
        if (n.type !== 'propertyShape') return false;
        const isOwned = graphMode === 'uml' && edges.some(
          e => embeddingTypes.has(nodeById[e.source]?.type) && e.target === n.id
        );
        if (isOwned) return true;
        return n.data.topic && !activeTopics.has(n.data.topic);
      }).map(n => n.id)
    );

    const laid = computeLayout(nodes, edges, hiddenIds, 'TB');
    setNodes(laid);

    const t = setTimeout(() => fitView({ padding: 0.15, duration: 500 }), 80);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTopics, graphMode, shapeKey]);
}

const nodeTypes = {
  nodeShape: NodeShapeNode,
  propertyShape: PropertyShapeNode,
  logicNode: LogicNode,
};

const edgeTypes = {
  propertyEdge: PropertyEdge,
};

const defaultEdgeOptions = {
  type: 'propertyEdge',
  markerEnd: { type: MarkerType.ArrowClosed, color: '#555' },
};

let nodeIdCounter = 10;
const nextId = () => `n${++nodeIdCounter}`;

const initialNodes = [
  {
    id: 'ns1',
    type: 'nodeShape',
    position: { x: 300, y: 40 },
    data: { label: 'PersonShape', targetClass: 'foaf:Person', constraints: {} },
  },
  {
    id: 'ps1',
    type: 'propertyShape',
    position: { x: 60, y: 240 },
    data: {
      path: 'foaf:name',
      constraints: { 'sh:datatype': 'xsd:string', 'sh:minCount': '1', 'sh:maxCount': '1' },
    },
  },
  {
    id: 'ps2',
    type: 'propertyShape',
    position: { x: 320, y: 240 },
    data: {
      path: 'foaf:age',
      constraints: { 'sh:datatype': 'xsd:integer', 'sh:minInclusive': '0', 'sh:maxInclusive': '150' },
    },
  },
  {
    id: 'ps3',
    type: 'propertyShape',
    position: { x: 580, y: 240 },
    data: {
      path: 'foaf:mbox',
      constraints: { 'sh:pattern': '^[^@]+@[^@]+\\.[^@]+$', 'sh:maxCount': '3' },
    },
  },
];

const initialEdges = [
  { id: 'e1', source: 'ns1', target: 'ps1', ...defaultEdgeOptions },
  { id: 'e2', source: 'ns1', target: 'ps2', ...defaultEdgeOptions },
  { id: 'e3', source: 'ns1', target: 'ps3', ...defaultEdgeOptions },
];

const MAX_HISTORY = 50;

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const [activeMode, setActiveMode] = useState('library'); // 'library' | 'editor'
  const [activeShapeName, setActiveShapeName] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [viewMode, setViewMode] = useState('graph');
  const [graphMode, setGraphMode] = useState('uml'); // 'uml' | 'vowl'
  const [prefixes, setPrefixes] = useState(INITIAL_PREFIXES);
  const [ontologies, setOntologies] = useState([]);
  const [activeTopics, setActiveTopics] = useState(null); // null = all, Set = visible topics
  const [topicFilterOpen, setTopicFilterOpen] = useState(false);
  const [shapeKey, setShapeKey] = useState(0); // increments on each shape load to reset layout state

  // ── Translator state ─────────────────────────────────
  const [translatorOnline, setTranslatorOnline] = useState(null); // null=unknown, true, false
  const [translating, setTranslating] = useState(false);
  const [translatorError, setTranslatorError] = useState(null);
  const shexImportRef = useRef(null);

  useEffect(() => {
    checkTranslatorHealth().then(ok => setTranslatorOnline(ok));
  }, []);

  // ── Undo / Redo ──────────────────────────────────────
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  const pushToHistory = useCallback((currentNodes, currentEdges) => {
    setPast(p => [...p.slice(-(MAX_HISTORY - 1)), { nodes: currentNodes, edges: currentEdges }]);
    setFuture([]);
  }, []);

  const undo = useCallback(() => {
    setPast(p => {
      if (p.length === 0) return p;
      const prev = p[p.length - 1];
      setFuture(f => [{ nodes, edges }, ...f.slice(0, MAX_HISTORY - 1)]);
      setNodes(prev.nodes);
      setEdges(prev.edges);
      return p.slice(0, -1);
    });
  }, [nodes, edges, setNodes, setEdges]);

  const redo = useCallback(() => {
    setFuture(f => {
      if (f.length === 0) return f;
      const next = f[0];
      setPast(p => [...p.slice(-(MAX_HISTORY - 1)), { nodes, edges }]);
      setNodes(next.nodes);
      setEdges(next.edges);
      return f.slice(1);
    });
  }, [nodes, edges, setNodes, setEdges]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo]);

  // ── Derived state ─────────────────────────────────────
  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

  // All unique non-empty topics in the current graph
  const allTopics = useMemo(() => {
    const seen = new Set();
    const ordered = [];
    for (const n of nodes) {
      if (n.type === 'propertyShape' && n.data.topic) {
        if (!seen.has(n.data.topic)) { seen.add(n.data.topic); ordered.push(n.data.topic); }
      }
    }
    return ordered;
  }, [nodes]);

  // Reset filter when topics disappear (e.g. new shape loaded)
  useEffect(() => {
    if (allTopics.length === 0) setActiveTopics(null);
  }, [allTopics]);

  const toggleTopic = useCallback((topic) => {
    setActiveTopics(prev => {
      const all = new Set(allTopics);
      const current = prev ?? all;
      const next = new Set(current);
      next.has(topic) ? next.delete(topic) : next.add(topic);
      if (next.size === 0 || next.size === all.size) return null;
      return next;
    });
  }, [allTopics]);

  const handleSelectProperty = useCallback((nodeId) => {
    setSelectedNodeId(nodeId);
  }, []);

  // In UML mode: NodeShapes and LogicNodes embed their PropertyShape children.
  // In VOWL mode: all nodes/edges are shown as-is.
  const displayNodes = useMemo(() => {
    const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));
    const embeddingTypes = new Set(['nodeShape', 'logicNode']);
    const ownedByParent = graphMode === 'uml'
      ? new Set(
          edges
            .filter(e => embeddingTypes.has(nodeById[e.source]?.type) && nodeById[e.target]?.type === 'propertyShape')
            .map(e => e.target)
        )
      : new Set();

    return nodes.map(n => {
      if (n.type === 'nodeShape' || n.type === 'logicNode') {
        return {
          ...n,
          data: {
            ...n.data,
            graphMode,
            onSelectProperty: handleSelectProperty,
            selectedPropertyId: selectedNodeId,
            activeTopics,
          },
        };
      }
      if (n.type === 'propertyShape') {
        // In VOWL mode, hide topic-filtered nodes (nodes with no topic are always shown)
        const filtered = graphMode === 'vowl' && activeTopics !== null && n.data.topic && !activeTopics.has(n.data.topic);
        if (ownedByParent.has(n.id) || filtered) return { ...n, hidden: true };
        return n;
      }
      return n;
    });
  }, [nodes, edges, graphMode, handleSelectProperty, selectedNodeId, activeTopics]);

  // In UML mode hide parent→PropertyShape edges.
  // In VOWL mode hide edges to topic-filtered nodes.
  const displayEdges = useMemo(() => {
    const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));
    const embeddingTypes = new Set(['nodeShape', 'logicNode']);
    return edges.map(e => {
      const target = nodeById[e.target];
      // UML: hide edges embedded in parent table
      if (graphMode === 'uml' && embeddingTypes.has(nodeById[e.source]?.type) && target?.type === 'propertyShape') {
        return { ...e, hidden: true };
      }
      // VOWL: hide edges to topic-filtered property nodes
      if (graphMode === 'vowl' && activeTopics !== null && target?.type === 'propertyShape' && target.data.topic && !activeTopics.has(target.data.topic)) {
        return { ...e, hidden: true };
      }
      return e;
    });
  }, [nodes, edges, graphMode, activeTopics]);

  // ── Graph callbacks ───────────────────────────────────
  const onConnect = useCallback(
    (params) => {
      pushToHistory(nodes, edges);
      setEdges(eds => addEdge({ ...params, ...defaultEdgeOptions }, eds));
    },
    [nodes, edges, pushToHistory, setEdges]
  );

  const onNodeClick = useCallback((_, node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const onNodeDragStop = useCallback(() => {
    pushToHistory(nodes, edges);
  }, [nodes, edges, pushToHistory]);

  const updateNodeData = useCallback((id, patch) => {
    setNodes(nds =>
      nds.map(n => n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)
    );
  }, [setNodes]);

  // ── Mutations (each pushes history first) ─────────────
  const addNodeShape = () => {
    pushToHistory(nodes, edges);
    const id = nextId();
    setNodes(nds => [...nds, {
      id,
      type: 'nodeShape',
      position: { x: 100 + Math.random() * 300, y: 50 + Math.random() * 100 },
      data: { label: 'NewShape', targetClass: '', constraints: {} },
    }]);
    setSelectedNodeId(id);
  };

  const addPropertyShape = (parentNodeShapeId = null) => {
    pushToHistory(nodes, edges);
    const psId = nextId();
    setNodes(nds => [...nds, {
      id: psId,
      type: 'propertyShape',
      position: { x: 100 + Math.random() * 400, y: 250 + Math.random() * 150 },
      data: { path: '', constraints: {} },
    }]);
    if (parentNodeShapeId) {
      setEdges(eds => [...eds, {
        id: nextId(),
        source: parentNodeShapeId,
        target: psId,
        ...defaultEdgeOptions,
      }]);
    }
    setSelectedNodeId(psId);
  };

  const addLogicNode = (operatorId) => {
    pushToHistory(nodes, edges);
    const id = nextId();
    setNodes(nds => [...nds, {
      id,
      type: 'logicNode',
      position: { x: 150 + Math.random() * 350, y: 420 + Math.random() * 100 },
      data: { operator: operatorId },
    }]);
    setSelectedNodeId(id);
  };

  const addLogicToShape = useCallback((nodeShapeId, operatorId) => {
    pushToHistory(nodes, edges);
    const lgId = nextId();
    setNodes(nds => [...nds, {
      id: lgId,
      type: 'logicNode',
      position: { x: 150 + Math.random() * 350, y: 450 + Math.random() * 80 },
      data: { operator: operatorId },
    }]);
    setEdges(eds => [...eds, {
      id: nextId(),
      source: nodeShapeId,
      target: lgId,
      ...defaultEdgeOptions,
    }]);
    setSelectedNodeId(lgId);
  }, [nodes, edges, pushToHistory, setNodes, setEdges]);

  const addPropertyToLogic = useCallback((logicNodeId) => {
    pushToHistory(nodes, edges);
    const psId = nextId();
    setNodes(nds => [...nds, {
      id: psId,
      type: 'propertyShape',
      position: { x: 100 + Math.random() * 400, y: 600 + Math.random() * 100 },
      data: { path: '', constraints: {} },
    }]);
    setEdges(eds => [...eds, {
      id: nextId(),
      source: logicNodeId,
      target: psId,
      ...defaultEdgeOptions,
    }]);
    setSelectedNodeId(psId);
  }, [nodes, edges, pushToHistory, setNodes, setEdges]);

  const handleCodeApply = useCallback(({ nodes: importedNodes, edges: importedEdges }) => {
    pushToHistory(nodes, edges);
    setNodes(importedNodes);
    setEdges(importedEdges);
    setSelectedNodeId(null);
  }, [nodes, edges, pushToHistory, setNodes, setEdges]);

  // ── Library handlers ──────────────────────────────────
  const loadShapeFile = useCallback(async (filename, isClone = false) => {
    try {
      const resp = await fetch(`/shapes/${filename}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const turtle = await resp.text();
      const { nodes: importedNodes, edges: importedEdges } = await importFromTurtle(turtle);
      setPast([]);
      setFuture([]);
      setNodes(importedNodes);
      setEdges(importedEdges);
      setSelectedNodeId(null);
      setActiveShapeName(isClone ? `${filename.replace(/\.ttl$/, '')} (clone)` : filename.replace(/\.ttl$/, ''));
      setActiveTopics(null);
      setShapeKey(k => k + 1);
      setActiveMode('editor');
      setViewMode('graph');
    } catch (e) {
      alert(`Failed to load ${filename}: ${e.message}`);
    }
  }, [setNodes, setEdges]);

  const handleLibraryLoad = useCallback((filename) => loadShapeFile(filename, false), [loadShapeFile]);
  const handleLibraryClone = useCallback((filename) => loadShapeFile(filename, true), [loadShapeFile]);
  const handleLibraryCreate = useCallback(() => {
    setPast([]);
    setFuture([]);
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setActiveShapeName('Untitled');
    setActiveTopics(null);
    setShapeKey(k => k + 1);
    setActiveMode('editor');
    setViewMode('code');
  }, [setNodes, setEdges]);

  const handleFusionLoad = useCallback(async ({ ttl, name }) => {
    const { nodes: importedNodes, edges: importedEdges } = await importFromTurtle(ttl);
    setPast([]);
    setFuture([]);
    setNodes(importedNodes);
    setEdges(importedEdges);
    setSelectedNodeId(null);
    setActiveShapeName(name ?? 'FusedShape');
    setActiveTopics(null);
    setShapeKey(k => k + 1);
    setActiveMode('editor');
    setViewMode('graph');
  }, [setNodes, setEdges]);

  const deleteSelected = useCallback(() => {
    if (!selectedNodeId) return;
    pushToHistory(nodes, edges);
    setNodes(nds => nds.filter(n => n.id !== selectedNodeId));
    setEdges(eds => eds.filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId));
    setSelectedNodeId(null);
  }, [selectedNodeId, nodes, edges, pushToHistory, setNodes, setEdges]);

  // ── Translator handlers ───────────────────────────────
  const handleExportShEx = useCallback(async () => {
    setTranslatorError(null);
    setTranslating(true);
    try {
      const turtle = exportToTurtle(nodes, edges, prefixes);
      const shex   = await shacl2shex(turtle);
      const blob   = new Blob([shex], { type: 'text/plain' });
      const url    = URL.createObjectURL(blob);
      const a      = document.createElement('a');
      a.href       = url;
      a.download   = `${activeShapeName || 'shape'}.shex`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setTranslatorError(`ShEx export failed: ${e.message}`);
    } finally {
      setTranslating(false);
    }
  }, [nodes, edges, prefixes, activeShapeName]);

  const handleImportShEx = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setTranslatorError(null);
    setTranslating(true);
    try {
      const shex   = await file.text();
      const turtle = await shex2shacl(shex);
      const { nodes: n, edges: ed } = await importFromTurtle(turtle);
      setPast([]);
      setFuture([]);
      setNodes(n);
      setEdges(ed);
      setSelectedNodeId(null);
      setActiveShapeName(file.name.replace(/\.shex$/i, ''));
      setActiveTopics(null);
      setShapeKey(k => k + 1);
      setViewMode('graph');
    } catch (e) {
      setTranslatorError(`ShEx import failed: ${e.message}`);
    } finally {
      setTranslating(false);
    }
  }, [setNodes, setEdges]);

  const themeBtn = (
    <button className="theme-toggle" onClick={toggleTheme} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      {isDark ? '☀' : '🌙'}
    </button>
  );

  if (activeMode === 'library') {
    return (<>
      <ShapeLibrary
        onLoad={handleLibraryLoad}
        onClone={handleLibraryClone}
        onCreate={handleLibraryCreate}
        onNavigate={setActiveMode}
      />
      {themeBtn}
    </>);
  }

  if (activeMode === 'arena') {
    return (<><ShapeArena onBack={() => setActiveMode('library')} />{themeBtn}</>);
  }

  if (activeMode === 'report') {
    return (<><ShapeReport onBack={() => setActiveMode('library')} />{themeBtn}</>);
  }

  if (activeMode === 'fusion') {
    return (<>
      <ShapeFusion
        onBack={() => setActiveMode('library')}
        onLoad={handleFusionLoad}
      />
      {themeBtn}
    </>);
  }

  if (activeMode === 'decks') {
    return (<>
      <DeckView
        onLoad={handleLibraryLoad}
        onBack={() => setActiveMode('library')}
      />
      {themeBtn}
    </>);
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-title">
          <button className="btn-back-library" onClick={() => setActiveMode('library')} title="Back to library">
            ← Library
          </button>
          <span className="app-logo">◈</span>
          {activeShapeName ? (
            <span className="app-shape-name">{activeShapeName}</span>
          ) : (
            'SHACL Shape Editor'
          )}
        </div>
        <div className="toolbar">
          <div className="toolbar-group toolbar-right">
            <button
              className="btn-toolbar btn-undo"
              onClick={undo}
              disabled={past.length === 0}
              title="Undo (Ctrl+Z)"
            >
              ↩ Undo
            </button>
            <button
              className="btn-toolbar btn-redo"
              onClick={redo}
              disabled={future.length === 0}
              title="Redo (Ctrl+Y)"
            >
              ↪ Redo
            </button>
            {selectedNodeId && (
              <button className="btn-toolbar btn-danger" onClick={deleteSelected}>
                Delete
              </button>
            )}
            {viewMode === 'graph' && (
              <div className="view-toggle" title="Graph rendering mode">
                <button
                  className={`toggle-btn${graphMode === 'uml' ? ' active' : ''}`}
                  onClick={() => setGraphMode('uml')}
                  title="UML class-diagram style"
                >
                  UML
                </button>
                <button
                  className={`toggle-btn${graphMode === 'vowl' ? ' active' : ''}`}
                  onClick={() => setGraphMode('vowl')}
                  title="ShapeVOWL style"
                >
                  VOWL
                </button>
              </div>
            )}
            <div className="view-toggle">
              <button
                className={`toggle-btn${viewMode === 'graph' ? ' active' : ''}`}
                onClick={() => setViewMode('graph')}
                title="Graph view"
              >
                ⬡ Graph
              </button>
              <button
                className={`toggle-btn${viewMode === 'list' ? ' active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List view"
              >
                ☰ List
              </button>
              <button
                className={`toggle-btn${viewMode === 'code' ? ' active' : ''}`}
                onClick={() => setViewMode('code')}
                title="Turtle code view"
              >
                ⌨ Code
              </button>
            </div>
            {/* ShEx translator buttons */}
            <div className="translator-group">
              <span
                className={`translator-status ${translatorOnline === true ? 'online' : translatorOnline === false ? 'offline' : 'unknown'}`}
                title={translatorOnline === true ? 'ShapeTranslator online' : translatorOnline === false ? 'ShapeTranslator offline — run translator_server.py' : 'Checking…'}
              />
              <button
                className="btn-toolbar btn-shex-export"
                onClick={handleExportShEx}
                disabled={translating || !translatorOnline}
                title={translatorOnline ? 'Export current shape as ShEx' : 'Start translator_server.py to enable'}
              >
                {translating ? '…' : '→ ShEx'}
              </button>
              <button
                className="btn-toolbar btn-shex-import"
                onClick={() => shexImportRef.current?.click()}
                disabled={translating || !translatorOnline}
                title={translatorOnline ? 'Import a .shex file and convert to SHACL' : 'Start translator_server.py to enable'}
              >
                ← ShEx
              </button>
              <input
                ref={shexImportRef}
                type="file"
                accept=".shex,.shexc"
                style={{ display: 'none' }}
                onChange={handleImportShEx}
              />
            </div>
            <button className="btn-toolbar btn-config" onClick={() => setShowConfig(true)}>
              ⚙ Config
            </button>
          </div>
        </div>
      </header>

      {/* Translator error toast */}
      {translatorError && (
        <div className="translator-error-toast">
          <span>{translatorError}</span>
          <button onClick={() => setTranslatorError(null)}>✕</button>
        </div>
      )}

      <div className="app-body">
        <div className={`canvas-area${selectedNode && viewMode !== 'code' ? ' with-panel' : ''}`}>
          {viewMode === 'graph' && (
            <ReactFlow
              nodes={displayNodes}
              edges={displayEdges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onNodeDragStop={onNodeDragStop}
              defaultEdgeOptions={defaultEdgeOptions}
              fitView
            >
              <Background color="#e0e7ef" gap={20} />
              <Controls />
              <MiniMap nodeStrokeWidth={3} zoomable pannable />
              <LayoutAndFitEffect
                activeTopics={activeTopics}
                graphMode={graphMode}
                nodes={nodes}
                edges={edges}
                setNodes={setNodes}
                shapeKey={shapeKey}
              />
              {allTopics.length > 0 && (
                <Panel position="top-right">
                  <div className="topic-filter-panel">
                    <button
                      className={`tfp-toggle${topicFilterOpen ? ' open' : ''}`}
                      onClick={() => setTopicFilterOpen(o => !o)}
                    >
                      <span className="tfp-icon">◉</span>
                      Topics
                      {activeTopics !== null && (
                        <span className="tfp-active-count">{activeTopics.size}/{allTopics.length}</span>
                      )}
                      <span className="tfp-chevron">{topicFilterOpen ? '▴' : '▾'}</span>
                    </button>
                    {topicFilterOpen && (
                      <div className="tfp-body">
                        <div className="tfp-actions">
                          <button
                            className={`tfp-all-btn${activeTopics === null ? ' active' : ''}`}
                            onClick={() => setActiveTopics(null)}
                          >
                            All
                          </button>
                          <button
                            className="tfp-none-btn"
                            onClick={() => setActiveTopics(new Set())}
                          >
                            None
                          </button>
                        </div>
                        <div className="tfp-topics">
                          {allTopics.map(t => {
                            const isActive = activeTopics === null || activeTopics.has(t);
                            const color = topicColor(t);
                            return (
                              <button
                                key={t}
                                className={`tfp-topic-btn${isActive ? ' active' : ''}`}
                                style={{
                                  borderColor: color,
                                  color: isActive ? '#fff' : color,
                                  background: isActive ? color : 'transparent',
                                }}
                                onClick={() => toggleTopic(t)}
                                title={t}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </Panel>
              )}
              <Panel position="bottom-left">
                <div className="canvas-add-panel">
                  <div className="cap-section-title">Add</div>
                  <button className="cap-btn cap-nodeshape" onClick={addNodeShape}>
                    ◈ NodeShape
                  </button>
                  <button className="cap-btn cap-propshape" onClick={() => addPropertyShape(null)}>
                    ○ PropertyShape
                  </button>
                  <div className="cap-divider" />
                  <div className="cap-section-title">Logic</div>
                  {LOGIC_OPERATORS.map(op => (
                    <button
                      key={op.id}
                      className="cap-btn cap-logic"
                      style={{ borderLeftColor: op.color, color: op.color }}
                      onClick={() => addLogicNode(op.id)}
                      title={op.description}
                    >
                      {op.label}
                      <span className="cap-logic-desc">{op.description}</span>
                    </button>
                  ))}
                </div>
              </Panel>
            </ReactFlow>
          )}

          {viewMode === 'list' && (
            <ShapeListView
              nodes={nodes}
              edges={edges}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              onAddProperty={addPropertyShape}
              onAddLogicToShape={addLogicToShape}
              onAddPropertyToLogic={addPropertyToLogic}
            />
          )}

          {viewMode === 'code' && (
            <CodeEditorView
              nodes={nodes}
              edges={edges}
              prefixes={prefixes}
              past={past}
              future={future}
              onApply={handleCodeApply}
            />
          )}
        </div>

        {selectedNode && viewMode !== 'code' && (
          <aside className="side-panel">
            <ConstraintPanel
              node={selectedNode}
              onUpdate={updateNodeData}
              onClose={() => setSelectedNodeId(null)}
              prefixes={prefixes}
              ontologies={ontologies}
            />
          </aside>
        )}
      </div>

      {showConfig && (
        <ConfigPanel
          prefixes={prefixes}
          onPrefixesChange={setPrefixes}
          ontologies={ontologies}
          onOntologiesChange={setOntologies}
          onClose={() => setShowConfig(false)}
        />
      )}
      {themeBtn}
    </div>
  );
}
