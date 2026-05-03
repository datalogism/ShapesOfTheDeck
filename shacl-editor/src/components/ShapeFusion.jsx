import { useState, useEffect, useMemo, useCallback } from 'react';

const SHORT_CLASS = iri => iri.split(/[/#]/).pop().replace(/Shape$/, '');

// Source/model badge: text + CSS class
function sourceBadge(e) {
  if (e.source === 'ground-truth') return { label: 'GT', cls: 'sf-badge-gt' };
  if (e.model === 'deepseek-chat')  return { label: 'DeepSeek', cls: 'sf-badge-ds' };
  if (e.model === 'gpt-4o-mini')   return { label: 'GPT-4o-mini', cls: 'sf-badge-gpt' };
  if (e.source === 'kastor')        return { label: 'Kastor', cls: 'sf-badge-kastor' };
  return { label: e.model || e.source, cls: 'sf-badge-other' };
}

// Short meta line: model/source · kg [· variant hint]
function shortMeta(e) {
  const badge = sourceBadge(e);
  const variant = e.variant?.split('/').pop();
  const showVariant = variant && !badge.label.toLowerCase().includes(variant.toLowerCase())
    && variant !== e.kg && variant !== e.source;
  return { badge, kg: e.kg, variant: showVariant ? variant : null };
}

// Extract sh:path values from all top-level [...] blocks in a Turtle shape.
// Handles both repeated-keyword format (sh:property []; sh:property [])
// AND comma-separated shorthand (sh:property [], [], []) used by most shape files.
function extractPaths(ttl) {
  const paths = new Map();
  let depth = 0;
  let start = -1;
  for (let i = 0; i < ttl.length; i++) {
    if (ttl[i] === '[') {
      if (depth === 0) start = i + 1;
      depth++;
    } else if (ttl[i] === ']') {
      depth--;
      if (depth === 0 && start >= 0) {
        const block = ttl.slice(start, i);
        // Match simple prefixed paths (dbo:name, schema:age) — skip complex [ sh:alternativePath ]
        const m = block.match(/sh:path\s+([^\s\[\],;()]+)/);
        if (m) paths.set(m[1], block);
        start = -1;
      }
    }
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

  // Always include sh: and the shapes: base prefix so the generated IRI resolves
  const REQUIRED = [
    '@prefix sh: <http://www.w3.org/ns/shacl#> .',
    '@prefix shapes: <http://shaclshapes.org/> .',
  ];
  const prefLines = new Set([
    ...REQUIRED,
    ...prefA.split('\n'),
    ...prefB.split('\n'),
  ].filter(l => l.trim()));
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
  // Use the declared shapes: prefix — bare ':' is undefined in most parsers
  const iri = `shapes:${fusedName ? fusedName : 'Fused'}Shape`;

  const propBlocks = [...paths.values()].map(b => {
    const clean = b.trim(); // block is content-only (no outer brackets)
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
    return index.filter(e => !q ||
      e.class.toLowerCase().includes(q) ||
      (e.model && e.model.toLowerCase().includes(q)) ||
      e.kg.toLowerCase().includes(q) ||
      e.source.toLowerCase().includes(q)
    ).slice(0, 60);
  }, [index, search]);

  const selected = value ? index.find(e => e.path === value) : null;

  return (
    <div className="sf-picker" style={{ '--pk-color': color }}>
      <div className="sf-picker-label">{label}</div>
      {selected ? (
        <div className="sf-picked">
          <span className="sf-picked-name">{selected.class}</span>
          {(() => { const { badge, kg, variant } = shortMeta(selected); return (
            <span className="sf-picked-meta">
              <span className={`sf-badge ${badge.cls}`}>{badge.label}</span>
              {' '}{kg}{variant ? <> · <em>{variant}</em></> : null}
            </span>
          ); })()}
          <button className="sf-picked-clear" onClick={() => onChange(null)}>✕</button>
        </div>
      ) : (
        <>
          <input
            className="sf-search"
            placeholder="Search class, model, kg…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="sf-list">
            {filtered.map(e => {
              const { badge, kg, variant } = shortMeta(e);
              return (
                <button key={e.path} className="sf-list-item" onClick={() => onChange(e.path)}>
                  <span className="sf-li-class">{e.class}</span>
                  <span className="sf-li-meta">
                    <span className={`sf-badge ${badge.cls}`}>{badge.label}</span>
                    {' '}{kg}{variant ? ` · ${variant}` : ''}
                  </span>
                </button>
              );
            })}
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

// ── Colored Turtle preview ───────────────────────────────────────────────────
function ColoredFusionPreview({ fusedTtl, pathsA, pathsB, labelA, labelB }) {
  const [showRaw, setShowRaw] = useState(false);

  const segments = useMemo(() => {
    const propIdx = fusedTtl.search(/sh:property\s*\[/);
    if (propIdx < 0) return [{ type: 'header', text: fusedTtl }];

    const header = fusedTtl.slice(0, propIdx);
    const rest   = fusedTtl.slice(propIdx);
    // Split on each "sh:property [" — parts[0] is '' since rest starts with it
    const parts  = rest.split(/sh:property\s*\[/);

    const blocks = parts.slice(1).map(content => {
      const pathMatch = content.match(/sh:path\s+(\S+)/);
      const path = pathMatch?.[1] ?? null;
      const inA  = path ? pathsA.has(path) : false;
      const inB  = path ? pathsB.has(path) : false;
      const origin = inA && inB ? 'both' : inA ? 'A' : 'B';
      return { type: 'block', path, origin, raw: 'sh:property [' + content };
    });

    return [{ type: 'header', text: header }, ...blocks];
  }, [fusedTtl, pathsA, pathsB]);

  return (
    <div className="sf-cp-root">
      <div className="sf-cp-toolbar">
        <div className="sf-cp-legend">
          <span className="sf-cp-leg sf-cp-leg-A">■ {labelA} (A)</span>
          <span className="sf-cp-leg sf-cp-leg-B">■ {labelB} (B)</span>
          <span className="sf-cp-leg sf-cp-leg-both">■ Shared</span>
        </div>
        <button
          className={`sf-cp-raw-btn${showRaw ? ' active' : ''}`}
          onClick={() => setShowRaw(r => !r)}
        >
          {showRaw ? '◐ Colored' : '⌨ Raw'}
        </button>
      </div>

      {showRaw ? (
        <pre className="sf-turtle-preview">{fusedTtl}</pre>
      ) : (
        <div className="sf-cp-blocks">
          {segments.map((seg, i) =>
            seg.type === 'header' ? (
              <pre key={i} className="sf-cp-header">{seg.text}</pre>
            ) : (
              <div key={i} className={`sf-cp-block sf-cp-${seg.origin}`}>
                <span className={`sf-cp-tag sf-cp-tag-${seg.origin}`}>
                  {seg.origin === 'A' ? labelA : seg.origin === 'B' ? labelB : 'shared'}
                </span>
                <pre className="sf-cp-pre">{seg.raw}</pre>
              </div>
            )
          )}
        </div>
      )}
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
    if (!fusedTtl) return;
    const key = `shacl_load_${Date.now()}`;
    localStorage.setItem(key, JSON.stringify({ ttl: fusedTtl, name: `${fusedName}Shape` }));
    window.open(`${window.location.origin}${window.location.pathname}?load=${key}`, '_blank');
  }, [fusedTtl, fusedName]);

  return (
    <div className="sf-root">
      <div className="sf-header">
        <button className="ar-back-btn" onClick={onBack}>← Library</button>
        <img src="/img/logo.png" className="app-logo-img" alt="ShapeOfTheDecks" />
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
            <ColoredFusionPreview
              fusedTtl={fusedTtl}
              pathsA={pathsA}
              pathsB={pathsB}
              labelA={entryA?.class ?? 'A'}
              labelB={entryB?.class ?? 'B'}
            />
          </div>
        )}
      </div>
    </div>
  );
}
