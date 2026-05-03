import { useState, useEffect, useMemo, useCallback } from 'react';
import { QuickSaveDeckDialog, AddToDeckDialog } from './DeckView';
import { extractTopicMap } from '../utils/turtleImport';

// ── Stats extraction ──────────────────────────────────────────────────────────
function computeStats(ttlText) {
  const parts = ttlText.split(/sh:property\s*\[/);
  const total = parts.length - 1;
  let dt = 0, obj = 0, noRange = 0, mandatory = 0, functional = 0;
  for (let i = 1; i < parts.length; i++) {
    const b = parts[i];
    const hasDt  = /sh:datatype/.test(b) || /sh:nodeKind\s+sh:Literal/.test(b);
    const hasObj = /sh:class\s/.test(b) || /sh:nodeKind\s+sh:(IRI|BlankNodeOrIRI)/.test(b);
    if (hasDt) dt++;
    else if (hasObj) obj++;
    else noRange++;
    const minM = b.match(/sh:minCount\s+(\d+)/);
    if (minM && parseInt(minM[1]) >= 1) mandatory++;
    const maxM = b.match(/sh:maxCount\s+(\d+)/);
    if (maxM && parseInt(maxM[1]) === 1) functional++;
  }
  const topicMap = extractTopicMap(ttlText);
  const topicSet = new Set(topicMap.values());
  const pathSet  = new Set();
  for (const m of ttlText.matchAll(/sh:path\s+([^\s;,\]]+)/g)) pathSet.add(m[1]);
  return { total, dt, obj, noRange, mandatory, functional, topics: topicSet.size, distinctPaths: pathSet.size || total };
}

// ── Label / colour helpers ────────────────────────────────────────────────────
const GEN_MODE_LABELS = {
  'ground-truth':      'Ground Truth',
  'shacl/global':      'LLM Global',
  'shacl/local':       'LLM Local',
  'shacl/triples':     'LLM Triples',
  'shacl_orig/global': 'LLM Global (orig)',
  'shexer':            'ShExer',
};
const GT_VARIANT_LABELS = {
  'dbpedia-aligned':  'Aligned',
  'dbpedia-complete': 'Complete',
  'dbpedia-v0':       'V0',
  'dbpedia-v1':       'V1',
  'yago':             'YAGO',
};
const MODEL_SHORT = { 'deepseek-chat': 'DeepSeek', 'gpt-4o-mini': 'GPT-4o', '': '' };

function variantLabel(e) {
  if (e.source === 'ground-truth') return GT_VARIANT_LABELS[e.variant] ?? e.variant;
  if (e.source === 'shexer')       return 'ShExer';
  if (e.source === 'kastor')       return e.variant === 'txt2kg_clean' ? 'TXT2KG Clean' : 'TXT2KG';
  const modeShort  = GEN_MODE_LABELS[e.gen_mode] ?? e.gen_mode;
  const modelShort = MODEL_SHORT[e.model] ?? e.model;
  return modelShort ? `${modeShort} · ${modelShort}` : modeShort;
}

// Card "type" → Yugioh-style colour scheme
function cardTheme(entries) {
  const hasDbo  = entries.some(e => e.kg === 'dbpedia');
  const hasYago = entries.some(e => e.kg === 'yago');
  const hasGT   = entries.some(e => e.source === 'ground-truth');
  const hasLLM  = entries.some(e => e.source === 'shapes_generated');
  const hasSX   = entries.some(e => e.source === 'shexer');
  if (hasGT && hasDbo)  return { border: '#c89b3c', glow: '#c89b3c', label: 'Ground Truth',  bg: 'linear-gradient(160deg,#2a1f00 0%,#110d00 100%)' };
  if (hasGT && hasYago) return { border: '#7c3aed', glow: '#7c3aed', label: 'Ground Truth',  bg: 'linear-gradient(160deg,#1a0a2e 0%,#0a0718 100%)' };
  if (hasLLM && hasDbo) return { border: '#d97706', glow: '#f59e0b', label: 'LLM Generated', bg: 'linear-gradient(160deg,#1f0f00 0%,#0f0800 100%)' };
  if (hasLLM && hasYago)return { border: '#0891b2', glow: '#06b6d4', label: 'LLM Generated', bg: 'linear-gradient(160deg,#001f2a 0%,#000f14 100%)' };
  if (hasSX)            return { border: '#6d28d9', glow: '#8b5cf6', label: 'ShExer',         bg: 'linear-gradient(160deg,#170a2e 0%,#0a0518 100%)' };
  const hasKastor = entries.some(e => e.source === 'kastor');
  if (hasKastor)        return { border: '#2563eb', glow: '#60a5fa', label: 'Kastor',          bg: 'linear-gradient(160deg,#001533 0%,#000a1a 100%)' };
  return                       { border: '#475569', glow: '#64748b', label: 'Unknown',        bg: 'linear-gradient(160deg,#1e293b 0%,#0f172a 100%)' };
}

// ── Card icon ─────────────────────────────────────────────────────────────────
function classIcon(name) {
  const l = name.toLowerCase();
  if (['person','politician','scientist','artist','athlete','astronaut','writer'].some(k=>l.includes(k))) return '👤';
  if (['city','building','monument','airport','university','administrativearea','region'].some(k=>l.includes(k))) return '🏛';
  if (['film','music','written','comics','book','newspaper','song'].some(k=>l.includes(k))) return '🎭';
  if (['company','organisation','organization','sportsteam','airline'].some(k=>l.includes(k))) return '🏢';
  if (['food','restaurant'].some(k=>l.includes(k))) return '🍽';
  if (['celestial','astronomical','star','planet','bodyof'].some(k=>l.includes(k))) return '🌌';
  if (['animal','species','taxon'].some(k=>l.includes(k))) return '🐾';
  if (['country','nation'].some(k=>l.includes(k))) return '🗺';
  return '◈';
}

// ── Yugioh deck card ──────────────────────────────────────────────────────────
function DeckCard({ className, entries, selected, onClick, checkedPaths, onTogglePaths, stats }) {
  const theme  = cardTheme(entries);
  const icon   = classIcon(className);
  const kgs    = [...new Set(entries.map(e => e.kg))];
  const total  = entries.length;

  const checkedCount = checkedPaths ? entries.filter(e => checkedPaths.has(e.path)).length : 0;
  const allChecked  = checkedCount === total && total > 0;
  const someChecked = checkedCount > 0 && checkedCount < total;

  // Aggregate stats across loaded entries for this class
  const loadedStats = entries.map(e => stats?.[e.path]).filter(Boolean);
  const maxProps = loadedStats.length > 0 ? Math.max(...loadedStats.map(s => s.distinctPaths ?? s.total)) : null;
  const topicCounts = loadedStats.map(s => s.topics ?? 0);
  const maxTopics = topicCounts.length > 0 ? Math.max(...topicCounts) : null;

  return (
    <div
      className={`yu-card${selected ? ' yu-selected' : ''}${checkedCount > 0 ? ' yu-checked' : ''}`}
      style={{ '--card-border': theme.border, '--card-glow': theme.glow, '--card-bg': theme.bg }}
      onClick={onClick}
      title={className}
    >
      {/* Name banner */}
      <div className="yu-name">
        <span className="yu-name-text">{className}</span>
      </div>

      {/* Artwork */}
      <div className="yu-art">
        <span className="yu-art-icon">{icon}</span>
        <div className="yu-art-shine" />
      </div>

      {/* Type bar */}
      <div className="yu-type-bar">
        <span className="yu-type-label">{theme.label}</span>
        <div className="yu-kg-dots">
          {kgs.map(kg => (
            <img key={kg} src={`/img/${kg}.png`} alt={kg} title={kg} className={`yu-kg-logo yu-kg-${kg}`} />
          ))}
        </div>
      </div>

      {/* Card stats row */}
      {maxProps !== null && (
        <div className="yu-card-stats">
          <span className="yu-card-stat" title="Max distinct properties across variants">
            <span className="yu-cs-icon">◼</span>{maxProps} props
          </span>
          {maxTopics > 0 && (
            <span className="yu-card-stat yu-card-stat-topics" title="Max topics across variants">
              <span className="yu-cs-icon">◉</span>{maxTopics} topics
            </span>
          )}
        </div>
      )}

      {/* Stats footer */}
      <div className="yu-footer">
        <span className="yu-variant-count">
          {total} variant{total !== 1 ? 's' : ''}
        </span>
        {onTogglePaths && (
          <button
            className={`yu-card-check${allChecked ? ' checked' : someChecked ? ' partial' : ''}`}
            title={allChecked ? 'Deselect all variants' : 'Select all variants'}
            onClick={e => { e.stopPropagation(); onTogglePaths(entries); }}
          >
            {allChecked ? '☑' : someChecked ? '▣' : '□'}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Filter chip ───────────────────────────────────────────────────────────────
function Chip({ label, active, onClick, color }) {
  return (
    <button
      className={`sl-chip${active ? ' active' : ''}`}
      style={active && color ? { background: color, borderColor: color, color: '#fff' } : {}}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

// ── Filter bar ────────────────────────────────────────────────────────────────
const SOURCE_COLORS = { 'ground-truth': '#c89b3c', 'shapes_generated': '#d97706', 'shexer': '#7c3aed', 'kastor': '#2563eb' };

function FilterBar({ filters, onChange, search, onSearch, counts }) {
  const { kg, source, mode, model } = filters;
  const showModeModel = source === 'all' || source === 'generated';
  return (
    <div className="sl-filters">
      <div className="sl-filter-row">
        <span className="sl-filter-label">KG</span>
        <div className="sl-chips">
          {[['all','All',null],['dbpedia','DBpedia','/img/dbpedia.png'],['yago','YAGO','/img/yago.png'],['wikidata','Wikidata','/img/wikidata.png']].map(([v,l,logo]) => (
            <Chip key={v} active={kg===v} onClick={() => onChange({...filters,kg:v})}
              label={logo
                ? <span style={{display:'flex',alignItems:'center',gap:4}}><img src={logo} alt={l} style={{height:13,width:'auto',objectFit:'contain',verticalAlign:'middle'}}/>{l}</span>
                : l}
            />
          ))}
        </div>
      </div>
      <div className="sl-filter-row">
        <span className="sl-filter-label">Source</span>
        <div className="sl-chips">
          {[
            { v:'all',          l:'All' },
            { v:'ground-truth', l:'Ground Truth',  c:'#c89b3c' },
            { v:'generated',    l:'LLM Generated', c:'#d97706' },
            { v:'shexer',       l:'ShExer',         c:'#7c3aed' },
            { v:'kastor',       l:'Kastor',          c:'#2563eb' },
          ].map(({v,l,c}) => (
            <Chip key={v} label={l} active={source===v} color={c}
              onClick={() => onChange({...filters,source:v,mode:'all',model:'all'})} />
          ))}
        </div>
      </div>
      {showModeModel && (
        <div className="sl-filter-row">
          <span className="sl-filter-label">Mode</span>
          <div className="sl-chips">
            {['all','shacl/global','shacl/local','shacl/triples','shacl_orig/global'].map(v => (
              <Chip key={v} label={v==='all'?'All':GEN_MODE_LABELS[v]??v}
                active={mode===v} onClick={() => onChange({...filters,mode:v})} />
            ))}
          </div>
        </div>
      )}
      {showModeModel && (
        <div className="sl-filter-row">
          <span className="sl-filter-label">Model</span>
          <div className="sl-chips">
            {[['all','All'],['deepseek-chat','DeepSeek'],['gpt-4o-mini','GPT-4o']].map(([v,l]) => (
              <Chip key={v} label={l} active={model===v} onClick={() => onChange({...filters,model:v})} />
            ))}
          </div>
        </div>
      )}
      <div className="sl-filter-row">
        <input className="sl-search" type="text" placeholder="Search class…"
          value={search} onChange={e => onSearch(e.target.value)} />
        {counts && <span className="sl-filter-count">{counts.shapes} shapes · {counts.classes} classes</span>}
      </div>
    </div>
  );
}

// ── Stats panel (right side) ──────────────────────────────────────────────────
function StatsPanel({ className, entries, stats, onLoad, onClone, onClose, checkedPaths, onTogglePath }) {
  if (!className) {
    return (
      <div className="yu-panel yu-panel-empty">
        <div className="yu-panel-hint">
          <span className="yu-panel-hint-icon">◈</span>
          <p>Select a shape card to inspect its variants and statistics</p>
        </div>
      </div>
    );
  }

  const icon = classIcon(className);
  return (
    <div className="yu-panel">
      <div className="yu-panel-header">
        <span className="yu-panel-icon">{icon}</span>
        <div className="yu-panel-title-block">
          <span className="yu-panel-title">{className}</span>
          <span className="yu-panel-sub">{entries.length} variant{entries.length!==1?'s':''}</span>
        </div>
        <button className="yu-panel-close" onClick={onClose}>✕</button>
      </div>

      <div className="yu-panel-body">
        <table className="yu-stats-table">
          <thead>
            <tr>
              {onTogglePath && <th className="yu-th-check" title="Add to deck selection"></th>}
              <th className="yu-th-variant">Variant</th>
              <th className="yu-th-kg">KG</th>
              <th title="Total properties">Tot.</th>
              <th title="Datatype properties">DT</th>
              <th title="Object properties">Obj</th>
              <th title="No datatype/class">No Range</th>
              <th title="sh:minCount ≥ 1">Mand.</th>
              <th title="sh:maxCount = 1">Funct.</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {entries.map(e => {
              const s = stats[e.path];
              const isChecked = checkedPaths?.has(e.path) ?? false;
              return (
                <tr key={e.path} className={`yu-stats-row${isChecked ? ' yu-row-checked' : ''}`}>
                  {onTogglePath && (
                    <td className="yu-td-check">
                      <button
                        className={`yu-row-check${isChecked ? ' checked' : ''}`}
                        onClick={() => onTogglePath(e.path)}
                        title={isChecked ? 'Remove from selection' : 'Add to selection'}
                      >
                        {isChecked ? '☑' : '□'}
                      </button>
                    </td>
                  )}
                  <td className="yu-td-variant">
                    <span className="yu-variant-pill" style={{ background: SOURCE_COLORS[e.source]??'#475569' }}>
                      {variantLabel(e)}
                    </span>
                  </td>
                  <td>
                    <span className={`yu-kg-pill yu-kg-${e.kg}`}>
                      <img src={`/img/${e.kg}.png`} alt={e.kg} style={{height:12,width:'auto',objectFit:'contain',verticalAlign:'middle'}} />
                    </span>
                  </td>
                  {s ? (
                    <>
                      <td className="yu-sc">{s.total}</td>
                      <td className="yu-sc yu-sc-dt">{s.dt}<small>{s.total>0?' '+Math.round(s.dt/s.total*100)+'%':''}</small></td>
                      <td className="yu-sc yu-sc-obj">{s.obj}<small>{s.total>0?' '+Math.round(s.obj/s.total*100)+'%':''}</small></td>
                      <td className="yu-sc yu-sc-nr">{s.noRange}</td>
                      <td className="yu-sc yu-sc-mand">{s.mandatory}<small>{s.total>0?' '+Math.round(s.mandatory/s.total*100)+'%':''}</small></td>
                      <td className="yu-sc yu-sc-func">{s.functional}<small>{s.total>0?' '+Math.round(s.functional/s.total*100)+'%':''}</small></td>
                    </>
                  ) : (
                    <td colSpan={6} className="yu-sc yu-sc-loading">loading…</td>
                  )}
                  <td className="yu-td-actions">
                    <button className="yu-act-btn yu-act-load" onClick={() => onLoad(e.path)}>Load</button>
                    <button className="yu-act-btn yu-act-clone" onClick={() => onClone(e.path)}>Clone</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Mini bar chart ────────────────────────────────────────────────────────────
function YuBarChart({ title, subtitle, bars }) {
  const max = Math.max(...bars.map(b => b.value), 1);
  return (
    <div className="yu-chart-card">
      <div className="yu-chart-card-title">{title}</div>
      {subtitle && <div className="yu-chart-card-sub">{subtitle}</div>}
      <div className="yu-chart-bars">
        {bars.map(b => (
          <div key={b.label} className="yu-bar-row">
            <div className="yu-bar-label">{b.label}</div>
            <div className="yu-bar-track">
              <div
                className="yu-bar-fill"
                style={{ width: `${(b.value / max) * 100}%`, background: b.color }}
              />
              <span className="yu-bar-val">{b.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Radar / spider chart (SVG) ────────────────────────────────────────────────
function YuRadar({ title, subtitle, axes, series }) {
  // axes: [{label}], series: [{name, color, values: [0..1, ...]}]
  const N = axes.length;
  const cx = 90, cy = 90, r = 65;
  const step = (Math.PI * 2) / N;
  const pts = (vals) => vals.map((v, i) => {
    const angle = step * i - Math.PI / 2;
    return [cx + r * v * Math.cos(angle), cy + r * v * Math.sin(angle)];
  });

  const ringLevels = [0.25, 0.5, 0.75, 1];
  return (
    <div className="yu-chart-card">
      <div className="yu-chart-card-title">{title}</div>
      {subtitle && <div className="yu-chart-card-sub">{subtitle}</div>}
      <div className="yu-radar-wrap">
        <svg viewBox="0 0 180 180" className="yu-radar-svg">
          {/* rings */}
          {ringLevels.map(lv => (
            <polygon key={lv}
              points={axes.map((_, i) => {
                const a = step * i - Math.PI / 2;
                return `${cx + r * lv * Math.cos(a)},${cy + r * lv * Math.sin(a)}`;
              }).join(' ')}
              fill="none" stroke="#1e293b" strokeWidth="1"
            />
          ))}
          {/* spokes */}
          {axes.map((_, i) => {
            const a = step * i - Math.PI / 2;
            return <line key={i} x1={cx} y1={cy}
              x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)}
              stroke="#1e293b" strokeWidth="1" />;
          })}
          {/* series polygons */}
          {series.map(s => {
            const p = pts(s.values);
            return (
              <g key={s.name}>
                <polygon
                  points={p.map(([x,y]) => `${x},${y}`).join(' ')}
                  fill={s.color + '33'} stroke={s.color} strokeWidth="1.5"
                />
                {p.map(([x,y], i) => (
                  <circle key={i} cx={x} cy={y} r="3" fill={s.color} />
                ))}
              </g>
            );
          })}
          {/* axis labels */}
          {axes.map((ax, i) => {
            const a = step * i - Math.PI / 2;
            const lx = cx + (r + 12) * Math.cos(a);
            const ly = cy + (r + 12) * Math.sin(a);
            return (
              <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                fontSize="8" fill="#64748b">{ax.label}</text>
            );
          })}
        </svg>
        {/* legend */}
        <div className="yu-radar-legend">
          {series.map(s => (
            <div key={s.name} className="yu-radar-legend-row">
              <span className="yu-radar-legend-dot" style={{ background: s.color }} />
              <span>{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Charts comparison panel ───────────────────────────────────────────────────
function ChartsPanel({ index, onClose }) {
  const bySource = useMemo(() => {
    const m = {};
    for (const e of index) m[e.source] = (m[e.source] || 0) + 1;
    return m;
  }, [index]);

  const byKg = useMemo(() => {
    const m = {};
    for (const e of index) m[e.kg] = (m[e.kg] || 0) + 1;
    return m;
  }, [index]);

  const byMode = useMemo(() => {
    const m = {};
    for (const e of index) {
      if (e.source === 'shapes_generated') {
        const k = GEN_MODE_LABELS[e.gen_mode] ?? e.gen_mode;
        m[k] = (m[k] || 0) + 1;
      }
    }
    return m;
  }, [index]);

  const byModel = useMemo(() => {
    const m = {};
    for (const e of index) {
      if (e.model) m[MODEL_SHORT[e.model] ?? e.model] = (m[MODEL_SHORT[e.model] ?? e.model] || 0) + 1;
    }
    return m;
  }, [index]);

  // Class coverage histogram: how many classes have exactly N variants
  const variantHistogram = useMemo(() => {
    const classCount = new Map();
    for (const e of index) classCount.set(e.class, (classCount.get(e.class) || 0) + 1);
    const hist = {};
    for (const n of classCount.values()) {
      const bucket = n >= 8 ? '8+' : String(n);
      hist[bucket] = (hist[bucket] || 0) + 1;
    }
    return hist;
  }, [index]);

  // Per-source unique class coverage
  const classCoverage = useMemo(() => {
    const m = { 'ground-truth': new Set(), 'shapes_generated': new Set(), 'shexer': new Set(), 'kastor': new Set() };
    for (const e of index) (m[e.source] ?? new Set()).add(e.class);
    return {
      'Ground Truth': m['ground-truth'].size,
      'LLM Generated': m['shapes_generated'].size,
      'ShExer': m['shexer'].size,
      'Kastor': m['kastor'].size,
    };
  }, [index]);

  // Top 8 classes by variant count
  const topClasses = useMemo(() => {
    const map = new Map();
    for (const e of index) map.set(e.class, (map.get(e.class) || 0) + 1);
    return [...map.entries()].sort((a,b) => b[1]-a[1]).slice(0, 8);
  }, [index]);

  // Radar: per-source property type averages (normalised 0..1 vs global max)
  // Uses only already-loaded stats from index counts as a proxy: DT%, Obj%, NoRange%, Mand%, Funct%
  // Since we don't load all stats here, approximate via shape counts only
  // (omit radar if no data)

  const sourceColors = {
    'Ground Truth': '#c89b3c',
    'LLM Generated': '#d97706',
    'ShExer': '#7c3aed',
    'Kastor': '#2563eb',
  };

  return (
    <div className="yu-panel">
      <div className="yu-panel-header">
        <span className="yu-panel-icon">📊</span>
        <div className="yu-panel-title-block">
          <span className="yu-panel-title">Shape Analysis</span>
          <span className="yu-panel-sub">{index.length} shapes · {new Set(index.map(e=>e.class)).size} classes</span>
        </div>
        <button className="yu-panel-close" onClick={onClose}>✕</button>
      </div>

      <div className="yu-panel-body yu-charts-body">
        <YuBarChart
          title="⚔ Duelist Sources"
          subtitle="Shapes by generation source"
          bars={[
            { label: 'Ground Truth',  value: bySource['ground-truth']    || 0, color: '#c89b3c' },
            { label: 'LLM Generated', value: bySource['shapes_generated'] || 0, color: '#d97706' },
            { label: 'ShExer',        value: bySource['shexer']           || 0, color: '#7c3aed' },
            { label: 'Kastor',        value: bySource['kastor']           || 0, color: '#2563eb' },
          ]}
        />

        <YuBarChart
          title="🌍 Knowledge Graph Arena"
          subtitle="Shapes by target knowledge graph"
          bars={[
            { label: 'DBpedia',   value: byKg['dbpedia']  || 0, color: '#3b82f6' },
            { label: 'YAGO',      value: byKg['yago']     || 0, color: '#a78bfa' },
            { label: 'Wikidata',  value: byKg['wikidata'] || 0, color: '#10b981' },
          ].filter(b => b.value > 0)}
        />

        <YuBarChart
          title="🏛 Class Coverage"
          subtitle="Unique classes covered per source"
          bars={Object.entries(classCoverage).map(([k,v]) => ({ label: k, value: v, color: sourceColors[k] }))}
        />

        <YuBarChart
          title="⚡ LLM Battle Modes"
          subtitle="Shapes by generation strategy"
          bars={Object.entries(byMode).sort((a,b)=>b[1]-a[1]).map(([k,v]) => ({ label: k, value: v, color: '#f59e0b' }))}
        />

        <YuBarChart
          title="🤖 AI Models"
          subtitle="Shapes by language model"
          bars={Object.entries(byModel).sort((a,b)=>b[1]-a[1]).map(([k,v]) => ({ label: k || 'n/a', value: v, color: '#34d399' }))}
        />

        <YuBarChart
          title="🃏 Variant Depth"
          subtitle="Classes by number of variant shapes"
          bars={['1','2','3','4','5','6','7','8+'].map(k => ({
            label: k + (k==='1'?' variant':' variants'),
            value: variantHistogram[k] || 0,
            color: `hsl(${Number(k.replace('+','')) * 30},70%,55%)`,
          })).filter(b => b.value > 0)}
        />

        <div className="yu-chart-card">
          <div className="yu-chart-card-title">🏆 Top Classes</div>
          <div className="yu-chart-card-sub">Most represented by variant count</div>
          <table className="yu-top-table">
            <tbody>
              {topClasses.map(([cls, n], i) => (
                <tr key={cls} className="yu-top-row">
                  <td className="yu-top-rank">#{i+1}</td>
                  <td className="yu-top-name">{cls}</td>
                  <td className="yu-top-n">{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function ShapeLibrary({ onLoad, onClone, onCreate, onNavigate }) {
  const [index, setIndex]             = useState([]);
  const [filters, setFilters]         = useState({ kg:'all', source:'all', mode:'all', model:'all' });
  const [search, setSearch]           = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [stats, setStats]             = useState({});
  const [panelTab, setPanelTab]       = useState('stats'); // 'stats' | 'charts'
  const [savingDeck, setSavingDeck]   = useState(false);
  const [selectedPaths, setSelectedPaths] = useState(() => new Set());
  const [addingToDeck, setAddingToDeck]   = useState(false);

  const toggleClassPaths = useCallback((entries) => {
    setSelectedPaths(prev => {
      const next = new Set(prev);
      const allSelected = entries.every(e => prev.has(e.path));
      if (allSelected) {
        for (const e of entries) next.delete(e.path);
      } else {
        for (const e of entries) next.add(e.path);
      }
      return next;
    });
  }, []);

  const togglePath = useCallback((path) => {
    setSelectedPaths(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path); else next.add(path);
      return next;
    });
  }, []);

  useEffect(() => {
    fetch('/shapes/index.json').then(r=>r.json()).then(setIndex).catch(()=>{});
  }, []);

  const filteredEntries = useMemo(() => index.filter(e => {
    if (filters.kg !== 'all' && e.kg !== filters.kg) return false;
    if (filters.source !== 'all') {
      if (filters.source === 'ground-truth' && e.source !== 'ground-truth') return false;
      if (filters.source === 'generated'    && e.source !== 'shapes_generated') return false;
      if (filters.source === 'shexer'       && e.source !== 'shexer') return false;
      if (filters.source === 'kastor'       && e.source !== 'kastor') return false;
    }
    if (filters.mode  !== 'all' && e.gen_mode !== filters.mode) return false;
    if (filters.model !== 'all' && e.model    !== filters.model) return false;
    if (search && !e.class.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [index, filters, search]);

  const classGroups = useMemo(() => {
    const map = new Map();
    for (const e of filteredEntries) {
      if (!map.has(e.class)) map.set(e.class, []);
      map.get(e.class).push(e);
    }
    return [...map.entries()].sort((a,b) => a[0].localeCompare(b[0]));
  }, [filteredEntries]);

  const selectedEntries = useMemo(
    () => classGroups.find(([cls]) => cls === selectedClass)?.[1] ?? [],
    [classGroups, selectedClass]
  );

  // Lazy-load stats when panel opens
  useEffect(() => {
    if (!selectedClass || selectedEntries.length === 0) return;
    const toFetch = selectedEntries.filter(e => !stats[e.path]);
    if (toFetch.length === 0) return;
    Promise.all(toFetch.map(e =>
      fetch(`/shapes/${e.path}`).then(r=>r.text())
        .then(t=>({ path:e.path, s:computeStats(t) }))
        .catch(()=>({ path:e.path, s:null }))
    )).then(results => setStats(prev => {
      const next = {...prev};
      for (const r of results) if (r.s) next[r.path] = r.s;
      return next;
    }));
  }, [selectedClass, selectedEntries]);

  // Background-load one representative entry per visible class card for card stats display
  useEffect(() => {
    let cancelled = false;
    const batches = [];
    for (const [, entries] of classGroups) {
      const rep = entries.find(e => !stats[e.path]);
      if (rep) batches.push(rep);
    }
    if (batches.length === 0) return;
    const BATCH = 6;
    let i = 0;
    const runNext = () => {
      if (cancelled || i >= batches.length) return;
      const chunk = batches.slice(i, i + BATCH);
      i += BATCH;
      Promise.all(chunk.map(e =>
        fetch(`/shapes/${e.path}`).then(r => r.text())
          .then(t => ({ path: e.path, s: computeStats(t) }))
          .catch(() => ({ path: e.path, s: null }))
      )).then(results => {
        if (cancelled) return;
        setStats(prev => {
          const next = { ...prev };
          for (const r of results) if (r.s) next[r.path] = r.s;
          return next;
        });
        setTimeout(runNext, 80);
      });
    };
    runNext();
    return () => { cancelled = true; };
  }, [classGroups]);

  const selectClass = useCallback(cls => {
    setSelectedClass(c => {
      const next = c === cls ? null : cls;
      if (next) setPanelTab('stats');
      return next;
    });
  }, []);

  const panelOpen = selectedClass !== null || panelTab === 'charts';

  return (
    <div className="yu-root">
      {savingDeck && (
        <QuickSaveDeckDialog
          filters={filters}
          index={index}
          onSaved={() => { setSavingDeck(false); onNavigate?.('decks'); }}
          onClose={() => setSavingDeck(false)}
        />
      )}
      {addingToDeck && (
        <AddToDeckDialog
          selectedPaths={selectedPaths}
          index={index}
          onSaved={() => { setAddingToDeck(false); setSelectedPaths(new Set()); onNavigate?.('decks'); }}
          onClose={() => setAddingToDeck(false)}
        />
      )}
      {/* Left pane */}
      <div className="yu-left">
        {/* Header */}
        <div className="yu-header">
          <div className="yu-header-top">
            <img src="/img/logo.png" className="app-logo-img" alt="ShapeOfTheDecks" />
            <h1 className="yu-title">ShapeOfTheDecks</h1>
            {onNavigate && (
              <div className="yu-nav-btns">
                <button className="yu-nav-btn" onClick={() => onNavigate('decks')}  title="Shape of the Deck">🃏 Decks</button>
                <button className="yu-nav-btn" onClick={() => onNavigate('fusion')} title="Shape Fusion">⚗ Fusion</button>
                <button className="yu-nav-btn" onClick={() => onNavigate('arena')}  title="Shape Arena">⚔ Arena</button>
                <button className="yu-nav-btn" onClick={() => onNavigate('report')} title="Shape Report">📋 Report</button>
                <button className="yu-nav-btn" onClick={() => onNavigate('topics')}     title="Topic Studio">◉ Topics</button>
                <button className="yu-nav-btn" onClick={() => onNavigate('namespaces')} title="Namespace Studio">⬡ Namespaces</button>
              </div>
            )}
            <button
              className={`yu-charts-btn${panelTab === 'charts' && panelOpen ? ' active' : ''}`}
              onClick={() => {
                if (panelTab === 'charts' && panelOpen) {
                  setPanelTab('stats');
                  setSelectedClass(null);
                } else {
                  setPanelTab('charts');
                }
              }}
              title="Shape Analysis Charts"
            >📊 Analysis</button>
            <button className="yu-new-btn" onClick={onCreate}>+ New</button>
          </div>
          <p className="yu-subtitle">DBpedia and YAGO shapes — ground-truth, LLM-generated, ShExer-inferred.</p>
          <FilterBar
            filters={filters} onChange={setFilters}
            search={search} onSearch={setSearch}
            counts={{ shapes: filteredEntries.length, classes: classGroups.length }}
          />
          {/* Save as Deck — visible when any filter is active */}
          {(filters.kg !== 'all' || filters.source !== 'all' || filters.mode !== 'all' || filters.model !== 'all') && (
            <div className="yu-save-deck-bar">
              <span className="yu-save-deck-hint">{filteredEntries.length} shapes selected</span>
              <button className="yu-save-deck-btn" onClick={() => setSavingDeck(true)}>
                📦 Save as Deck
              </button>
            </div>
          )}
        </div>

        {/* Deck */}
        <div className="yu-deck">
          {classGroups.length === 0 && (
            <div className="yu-deck-empty">No shapes match the current filters.</div>
          )}
          {classGroups.map(([cls, entries]) => (
            <DeckCard
              key={cls}
              className={cls}
              entries={entries}
              selected={selectedClass === cls}
              onClick={() => selectClass(cls)}
              checkedPaths={selectedPaths}
              onTogglePaths={toggleClassPaths}
              stats={stats}
            />
          ))}
        </div>

        {/* Selection bar — pinned at bottom when paths are selected */}
        {selectedPaths.size > 0 && (
          <div className="yu-sel-bar">
            <span className="yu-sel-count">
              📌 {selectedPaths.size} shape{selectedPaths.size !== 1 ? 's' : ''} selected
            </span>
            <button className="yu-sel-clear" onClick={() => setSelectedPaths(new Set())}>Clear</button>
            <button className="yu-sel-add" onClick={() => setAddingToDeck(true)}>
              Add to Deck →
            </button>
          </div>
        )}
      </div>

      {/* Right panel — tab-switched between Stats and Charts */}
      <div className={`yu-right${panelOpen ? ' open' : ''}`}>
        {/* Tab bar (shown only when both could be relevant) */}
        {selectedClass && (
          <div className="yu-panel-tabs">
            <button
              className={`yu-panel-tab${panelTab === 'stats' ? ' active' : ''}`}
              onClick={() => setPanelTab('stats')}
            >◈ Stats</button>
            <button
              className={`yu-panel-tab${panelTab === 'charts' ? ' active' : ''}`}
              onClick={() => setPanelTab('charts')}
            >📊 Analysis</button>
          </div>
        )}

        {panelTab === 'stats' || !panelOpen ? (
          <StatsPanel
            className={selectedClass}
            entries={selectedEntries}
            stats={stats}
            onLoad={onLoad}
            onClone={onClone}
            onClose={() => { setSelectedClass(null); setPanelTab('stats'); }}
            checkedPaths={selectedPaths}
            onTogglePath={togglePath}
          />
        ) : (
          <ChartsPanel
            index={filteredEntries}
            onClose={() => { setPanelTab('stats'); setSelectedClass(null); }}
          />
        )}
      </div>
    </div>
  );
}
