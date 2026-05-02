import { useState, useEffect, useMemo, useCallback } from 'react';

const SHORT_CLASS = iri => iri.split(/[/#]/).pop().replace(/Shape$/, '');

// Extract sh:path values from a Turtle property block
function extractPaths(ttl) {
  const paths = new Map(); // path -> full block text
  const blocks = ttl.split(/sh:property\s*\[/);
  for (let i = 1; i < blocks.length; i++) {
    const b = blocks[i];
    const m = b.match(/sh:path\s+(\S+)/);
    if (m) paths.set(m[1], b);
  }
  return paths;
}

function extractPrefixes(ttl) {
  const prefixes = [];
  for (const m of ttl.matchAll(/^@prefix\s+\S+\s+<[^>]+>\s*\./gm)) {
    prefixes.push(m[0]);
  }
  return prefixes.join('\n');
}

function extractShapeIRI(ttl) {
  const m = ttl.match(/(\S+)\s+(?:a|rdf:type)\s+sh:NodeShape/);
  return m ? m[1] : ':FusedShape';
}

function extractTargetClass(ttl) {
  const m = ttl.match(/sh:targetClass\s+(\S+)/);
  return m ? m[1] : null;
}

function buildFusedTurtle(ttlA, ttlB, strategy, fusedName) {
  const pathsA = extractPaths(ttlA);
  const pathsB = extractPaths(ttlB);
  const prefA = extractPrefixes(ttlA);
  const prefB = extractPrefixes(ttlB);

  // Merge prefix lines (deduplicate)
  const prefLines = new Set([...prefA.split('\n'), ...prefB.split('\n')].filter(l => l.trim()));
  const prefixes = [...prefLines].join('\n');

  let paths;
  if (strategy === 'union') {
    paths = new Map([...pathsA, ...pathsB]); // B wins on conflict
    for (const [k, v] of pathsA) if (!paths.has(k)) paths.set(k, v);
  } else if (strategy === 'intersection') {
    paths = new Map();
    for (const [k, v] of pathsA) if (pathsB.has(k)) paths.set(k, v);
  } else { // gt-priority: A wins
    paths = new Map(pathsA);
    for (const [k, v] of pathsB) if (!paths.has(k)) paths.set(k, v);
  }

  const tc = extractTargetClass(ttlA) ?? extractTargetClass(ttlB) ?? 'owl:Thing';
  const iri = fusedName ? `:${fusedName}Shape` : ':FusedShape';

  const propBlocks = [...paths.values()].map(b => {
    // Clean up the block: remove trailing ] . or ] ; from the original
    const clean = b.replace(/\]\s*[.;]?\s*$/, '').trim();
    return `  sh:property [\n    ${clean.split('\n').join('\n    ')}\n  ]`;
  });

  return `${prefixes}

${iri}
  a sh:NodeShape ;
  sh:targetClass ${tc} ;
${propBlocks.join(' ;\n')} .
`;
}

// ── Shape picker ──────────────────────────────────────────────────────────────
function ShapePicker({ index, value, onChange, label, color }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return index.filter(e => !q || e.class.toLowerCase().includes(q)).slice(0, 60);
  }, [index, search]);

  const selected = value ? index.find(e => e.path === value) : null;

  return (
    <div className="sf-picker" style={{ '--pk-color': color }}>
      <div className="sf-picker-label">{label}</div>
      {selected ? (
        <div className="sf-picked">
          <span className="sf-picked-name">{selected.class}</span>
          <span className="sf-picked-meta">{selected.source} · {selected.kg}</span>
          <button className="sf-picked-clear" onClick={() => onChange(null)}>✕</button>
        </div>
      ) : (
        <>
          <input
            className="sf-search"
            placeholder="Search class…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="sf-list">
            {filtered.map(e => (
              <button key={e.path} className="sf-list-item" onClick={() => onChange(e.path)}>
                <span className="sf-li-class">{e.class}</span>
                <span className="sf-li-meta">{e.source.replace('shapes_generated', 'llm')} · {e.kg}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Diff preview ──────────────────────────────────────────────────────────────
function DiffPreview({ pathsA, pathsB, strategy, labelA, labelB }) {
  const { onlyA, both, onlyB } = useMemo(() => {
    const oA = [], oBoth = [], oB = [];
    const allKeys = new Set([...pathsA.keys(), ...pathsB.keys()]);
    for (const k of [...allKeys].sort()) {
      const inA = pathsA.has(k), inB = pathsB.has(k);
      if (inA && inB) oBoth.push(k);
      else if (inA) oA.push(k);
      else oB.push(k);
    }
    return { onlyA: oA, both: oBoth, onlyB: oB };
  }, [pathsA, pathsB]);

  const included = (key) => {
    if (strategy === 'union') return true;
    if (strategy === 'intersection') return both.includes(key);
    return pathsA.has(key); // gt-priority: A or shared
  };

  const rows = [...onlyA.map(k => ({ k, side: 'A' })),
               ...both.map(k => ({ k, side: 'both' })),
               ...onlyB.map(k => ({ k, side: 'B' }))];

  return (
    <div className="sf-diff">
      <div className="sf-diff-legend">
        <span className="sf-dl-item sf-dl-a">Only in {labelA}</span>
        <span className="sf-dl-item sf-dl-both">In both</span>
        <span className="sf-dl-item sf-dl-b">Only in {labelB}</span>
        <span className="sf-dl-item sf-dl-exc">Excluded</span>
      </div>
      <div className="sf-diff-table">
        {rows.map(({ k, side }) => {
          const inc = included(k);
          return (
            <div key={k}
              className={`sf-diff-row sf-diff-${side}${inc ? '' : ' sf-diff-excluded'}`}>
              <span className="sf-diff-path">{k}</span>
              <span className="sf-diff-tag">
                {side === 'both' ? 'shared' : side === 'A' ? labelA : labelB}
                {!inc ? ' ✕' : ''}
              </span>
            </div>
          );
        })}
      </div>
      <div className="sf-diff-counts">
        <span>A only: {onlyA.length}</span>
        <span>Shared: {both.length}</span>
        <span>B only: {onlyB.length}</span>
        <span className="sf-total">
          → {strategy === 'union' ? onlyA.length + both.length + onlyB.length
            : strategy === 'intersection' ? both.length
            : onlyA.length + both.length} properties in fusion
        </span>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function ShapeFusion({ onBack, onLoad }) {
  const [shapeIndex, setShapeIndex] = useState([]);
  const [pathA, setPathA] = useState(null);
  const [pathB, setPathB] = useState(null);
  const [ttlA, setTtlA] = useState(null);
  const [ttlB, setTtlB] = useState(null);
  const [strategy, setStrategy] = useState('union');
  const [fusedName, setFusedName] = useState('Fused');
  const [preview, setPreview] = useState(false);
  const [fusedTtl, setFusedTtl] = useState('');

  useEffect(() => {
    fetch('/shapes/index.json').then(r => r.json()).then(setShapeIndex).catch(() => {});
  }, []);

  useEffect(() => {
    if (!pathA) { setTtlA(null); return; }
    fetch(`/shapes/${pathA}`).then(r => r.text()).then(setTtlA).catch(() => setTtlA(null));
  }, [pathA]);

  useEffect(() => {
    if (!pathB) { setTtlB(null); return; }
    fetch(`/shapes/${pathB}`).then(r => r.text()).then(setTtlB).catch(() => setTtlB(null));
  }, [pathB]);

  const pathsA = useMemo(() => ttlA ? extractPaths(ttlA) : new Map(), [ttlA]);
  const pathsB = useMemo(() => ttlB ? extractPaths(ttlB) : new Map(), [ttlB]);

  const entryA = pathA ? shapeIndex.find(e => e.path === pathA) : null;
  const entryB = pathB ? shapeIndex.find(e => e.path === pathB) : null;

  const canFuse = ttlA && ttlB;

  const fuse = useCallback(() => {
    if (!canFuse) return;
    const ttl = buildFusedTurtle(ttlA, ttlB, strategy, fusedName);
    setFusedTtl(ttl);
    setPreview(true);
  }, [ttlA, ttlB, strategy, fusedName, canFuse]);

  const openInEditor = useCallback(() => {
    if (fusedTtl) onLoad({ ttl: fusedTtl, name: `${fusedName}Shape` });
  }, [fusedTtl, fusedName, onLoad]);

  return (
    <div className="sf-root">
      <div className="sf-header">
        <button className="ar-back-btn" onClick={onBack}>← Library</button>
        <span className="sf-logo">⚗</span>
        <h1 className="sf-title">Shape Fusion</h1>
      </div>

      <div className="sf-body">
        {/* Step 1: pick shapes */}
        <div className="sf-step">
          <div className="sf-step-label">① Select two shapes to fuse</div>
          <div className="sf-pickers">
            <ShapePicker
              index={shapeIndex}
              value={pathA}
              onChange={setPathA}
              label="Shape A (base)"
              color="#c89b3c"
            />
            <div className="sf-plus">+</div>
            <ShapePicker
              index={shapeIndex}
              value={pathB}
              onChange={setPathB}
              label="Shape B (merger)"
              color="#d97706"
            />
          </div>
        </div>

        {/* Step 2: strategy */}
        <div className="sf-step">
          <div className="sf-step-label">② Fusion strategy</div>
          <div className="sf-strategies">
            {[
              { id: 'union',        icon: '∪', label: 'Union',        desc: 'All properties from A and B' },
              { id: 'intersection', icon: '∩', label: 'Intersection', desc: 'Only properties shared by both' },
              { id: 'gt-priority',  icon: 'A+', label: 'A-Priority',   desc: 'A wins on conflict; adds unique B props' },
            ].map(s => (
              <button
                key={s.id}
                className={`sf-strategy-btn${strategy === s.id ? ' active' : ''}`}
                onClick={() => setStrategy(s.id)}
              >
                <span className="sf-strat-icon">{s.icon}</span>
                <span className="sf-strat-label">{s.label}</span>
                <span className="sf-strat-desc">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: name + preview */}
        <div className="sf-step">
          <div className="sf-step-label">③ Name and preview</div>
          <div className="sf-name-row">
            <input
              className="sf-name-input"
              placeholder="FusedClassName"
              value={fusedName}
              onChange={e => setFusedName(e.target.value)}
            />
            <button
              className={`sf-fuse-btn${canFuse ? '' : ' disabled'}`}
              onClick={fuse}
              disabled={!canFuse}
            >
              ⚗ Fuse
            </button>
          </div>
        </div>

        {/* Diff preview */}
        {canFuse && !preview && (
          <div className="sf-step">
            <div className="sf-step-label">Property diff preview</div>
            <DiffPreview
              pathsA={pathsA}
              pathsB={pathsB}
              strategy={strategy}
              labelA={entryA?.class ?? 'A'}
              labelB={entryB?.class ?? 'B'}
            />
          </div>
        )}

        {/* Fused Turtle output */}
        {preview && fusedTtl && (
          <div className="sf-step">
            <div className="sf-step-label">Fused shape Turtle</div>
            <div className="sf-output-header">
              <span className="sf-output-info">
                {pathsA.size} + {pathsB.size} → {extractPaths(fusedTtl).size} properties
              </span>
              <button className="sf-open-btn" onClick={openInEditor}>
                ⬡ Open in Editor
              </button>
              <button className="sf-back-edit-btn" onClick={() => setPreview(false)}>
                ← Edit
              </button>
            </div>
            <pre className="sf-turtle-preview">{fusedTtl}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
