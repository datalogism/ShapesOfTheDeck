import { useState, useEffect, useMemo } from 'react';

const SHORT_CLASS = iri => iri.split(/[/#]/).pop().replace(/Shape$/, '');
const PCT = v => v == null ? '—' : `${(v * 100).toFixed(1)}%`;

const RUN_COLORS = {
  'ground-truth': '#c89b3c',
  'llm':          '#d97706',
  'shexer':       '#7c3aed',
};

const COMP_COLORS = {
  mincount: '#fbbf24', maxcount: '#fb923c', datatype: '#60a5fa',
  class: '#34d399', or: '#a78bfa', nodekind: '#f472b6',
  pattern: '#6ee7b7', mininclusive: '#fdba74', node: '#93c5fd', in: '#c084fc',
};

function StatCard({ label, value, sub, color }) {
  return (
    <div className="rp-stat-card" style={{ '--sc-accent': color }}>
      <div className="rp-stat-val">{value}</div>
      <div className="rp-stat-label">{label}</div>
      {sub && <div className="rp-stat-sub">{sub}</div>}
    </div>
  );
}

function CompBreakdown({ shapes }) {
  const totals = useMemo(() => {
    const m = {};
    for (const s of shapes) {
      for (const [k, v] of Object.entries(s.violations_by_component)) {
        m[k] = (m[k] || 0) + v;
      }
    }
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [shapes]);

  const max = totals[0]?.[1] ?? 1;
  return (
    <div className="rp-comp-chart">
      {totals.map(([comp, val]) => (
        <div key={comp} className="rp-comp-row">
          <div className="rp-comp-label">sh:{comp}</div>
          <div className="rp-comp-track">
            <div
              className="rp-comp-fill"
              style={{ width: `${(val / max) * 100}%`, background: COMP_COLORS[comp] ?? '#475569' }}
            />
            <span className="rp-comp-val">{val.toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ShapeRow({ s }) {
  const pc = s.per_class[0];
  const trust = pc?.trust ?? null;
  const accepted = pc?.acceptability_wilson === 'accepted';
  const cls = SHORT_CLASS(s.target_classes?.[0] ?? s.shape_iri);
  const pct = v => v == null ? '—' : `${(v * 100).toFixed(0)}%`;

  if (s.reach === 0) {
    return (
      <tr className="rp-row rp-row-na">
        <td className="rp-td-cls">{cls}</td>
        <td colSpan={7} className="rp-td-na">no sampled nodes</td>
      </tr>
    );
  }

  const trustColor = trust == null ? '#475569' : accepted ? '#22c55e' : trust >= 0.3 ? '#f59e0b' : '#ef4444';
  const domComp = s.dominant_component;

  return (
    <tr className="rp-row">
      <td className="rp-td-cls">{cls}</td>
      <td className="rp-td-num" style={{ color: trustColor, fontWeight: 700 }}>{pct(trust)}</td>
      <td className="rp-td-num">{pct(s.property_coverage)}</td>
      <td className="rp-td-num">{pct(s.generality_estimate)}</td>
      <td className="rp-td-num">{s.total_result_count.toLocaleString()}</td>
      <td className="rp-td-num">{s.violations_per_failing_node ?? '—'}</td>
      <td>
        {domComp && (
          <span className="rp-comp-pill"
            style={{ background: COMP_COLORS[domComp] ?? '#475569' }}>
            sh:{domComp}
          </span>
        )}
      </td>
      <td>
        <span className={`rp-accept-badge rp-accept-${accepted ? 'yes' : 'no'}`}>
          {pc?.acceptability_wilson ?? '—'}
        </span>
      </td>
    </tr>
  );
}

// Cross-comparison table: all 6 runs, matching classes
function CrossTable({ allRuns, evalIndex }) {
  const classMap = useMemo(() => {
    const map = new Map();
    for (const { id, data } of allRuns) {
      for (const s of data.shapes) {
        const cls = SHORT_CLASS(s.target_classes?.[0] ?? s.shape_iri);
        if (!map.has(cls)) map.set(cls, {});
        map.get(cls)[id] = s;
      }
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [allRuns]);

  const runIds = allRuns.map(r => r.id);

  const pct = v => v == null ? '—' : `${Math.round(v * 100)}%`;
  const color = (s) => {
    if (!s || s.reach === 0) return '#334155';
    const trust = s.per_class[0]?.trust;
    if (trust == null) return '#475569';
    const accepted = s.per_class[0]?.acceptability_wilson === 'accepted';
    return accepted ? '#22c55e' : trust >= 0.3 ? '#f59e0b' : '#ef4444';
  };

  return (
    <div className="rp-cross-wrap">
      <table className="rp-cross-table">
        <thead>
          <tr>
            <th rowSpan={2} className="rp-cross-th-cls">Class</th>
            {['dbpedia', 'yago'].map(kg => {
              const cols = allRuns.filter(r => r.kg === kg);
              return (
                <th key={kg} colSpan={cols.length} className="rp-cross-th-kg"
                  style={{ borderBottom: `2px solid ${kg === 'dbpedia' ? '#3b82f6' : '#a78bfa'}` }}>
                  <img src={`/img/${kg}.png`} alt={kg} style={{height:14,width:'auto',objectFit:'contain',verticalAlign:'middle',marginRight:4}} />
                  {kg === 'dbpedia' ? 'DBpedia' : 'YAGO'}
                </th>
              );
            })}
          </tr>
          <tr>
            {allRuns.map(r => (
              <th key={r.id} className="rp-cross-th-run"
                style={{ color: RUN_COLORS[r.source] }}>
                {evalIndex.find(e => e.id === r.id)?.label.split(' · ')[1] ?? r.id}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {classMap.map(([cls, shapes]) => (
            <tr key={cls} className="rp-cross-row">
              <td className="rp-cross-td-cls">{cls}</td>
              {allRuns.map(r => {
                const s = shapes[r.id];
                if (!s || s.reach === 0) return <td key={r.id} className="rp-cross-td-na">—</td>;
                const pc = s.per_class[0];
                return (
                  <td key={r.id} className="rp-cross-td" style={{ color: color(s) }}>
                    {pct(pc?.trust)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ShapeReport({ onBack }) {
  const [evalIndex, setEvalIndex] = useState([]);
  const [runData, setRunData] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [tab, setTab] = useState('overview'); // 'overview' | 'shapes' | 'cross'
  const [crossData, setCrossData] = useState([]);
  const [crossLoading, setCrossLoading] = useState(false);

  useEffect(() => {
    fetch('/eval/index.json').then(r => r.json()).then(data => {
      setEvalIndex(data);
      setSelectedId(data[0]?.id ?? null);
    }).catch(() => {});
  }, []);

  // Load selected run
  useEffect(() => {
    if (!selectedId || runData[selectedId]) return;
    const entry = evalIndex.find(e => e.id === selectedId);
    if (!entry) return;
    fetch(`/${entry.path}`).then(r => r.json()).then(d => {
      setRunData(prev => ({ ...prev, [selectedId]: d }));
    }).catch(() => {});
  }, [selectedId, evalIndex]);

  // Load all runs for cross tab
  useEffect(() => {
    if (tab !== 'cross' || crossData.length > 0) return;
    setCrossLoading(true);
    Promise.all(evalIndex.map(e =>
      fetch(`/${e.path}`).then(r => r.json()).then(d => ({ id: e.id, kg: e.kg, source: e.source, data: d })).catch(() => null)
    )).then(res => {
      setCrossData(res.filter(Boolean));
      setCrossLoading(false);
    });
  }, [tab, evalIndex, crossData.length]);

  const current = selectedId ? runData[selectedId] : null;

  const acceptedShapes = useMemo(() => {
    if (!current) return 0;
    return current.shapes.filter(s => s.per_class[0]?.acceptability_wilson === 'accepted').length;
  }, [current]);

  const avgCov = useMemo(() => {
    if (!current) return 0;
    const reached = current.shapes.filter(s => s.reach > 0);
    return reached.reduce((a, s) => a + s.property_coverage, 0) / (reached.length || 1);
  }, [current]);

  const reachedShapes = current?.shapes.filter(s => s.reach > 0) ?? [];

  return (
    <div className="rp-root">
      <div className="rp-header">
        <button className="ar-back-btn" onClick={onBack}>← Library</button>
        <img src="/img/logo.png" className="app-logo-img" alt="ShapeOfTheDecks" />
        <h1 className="rp-title">Shape Report</h1>

        <select
          className="rp-run-select"
          value={selectedId ?? ''}
          onChange={e => { setSelectedId(e.target.value); setTab('overview'); }}
        >
          {evalIndex.map(e => (
            <option key={e.id} value={e.id}>{e.label}</option>
          ))}
        </select>
      </div>

      <div className="rp-tabs">
        {['overview', 'shapes', 'cross'].map(t => (
          <button key={t} className={`rp-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'overview' ? '📊 Overview' : t === 'shapes' ? '◈ Per-Shape' : '🔀 Cross-Run'}
          </button>
        ))}
      </div>

      <div className="rp-body">
        {tab === 'overview' && current && (
          <>
            <div className="rp-stats-row">
              <StatCard label="Total Violations" value={current.global.total_violations.toLocaleString()} color="#ef4444" />
              <StatCard label="Accepted Shapes" value={`${acceptedShapes}/${current.global.total_shapes}`} color="#22c55e" />
              <StatCard label="Violated Paths" value={`${current.global.violated_paths}/${current.global.total_paths}`}
                sub={PCT(current.global.violated_paths_rate)} color="#f59e0b" />
              <StatCard label="Avg Prop. Coverage" value={PCT(avgCov)} color="#60a5fa" />
              <StatCard label="Most Violated" value={current.global.most_violated_component ?? '—'}
                sub={`sh:component`} color="#a78bfa" />
              <StatCard label="Sample Size" value={current.run.sample_size.toLocaleString()}
                sub={`seed ${current.run.random_seed}`} color="#64748b" />
            </div>

            <div className="rp-section">
              <h3 className="rp-section-title">⚡ Violations by Constraint Component</h3>
              <CompBreakdown shapes={current.shapes} />
            </div>

            <div className="rp-section">
              <h3 className="rp-section-title">🏛 Run Parameters</h3>
              <table className="rp-params-table">
                <tbody>
                  {[
                    ['Timestamp', current.run.timestamp],
                    ['Baseline violation rate', current.run.baseline_violation_rate],
                    ['Tolerated error rate', current.run.tolerated_error_rate],
                    ['Significance level', current.run.significance_level],
                    ['Budget per class', current.run.budget_per_class],
                    ['Data size (subjects)', current.run.data_size?.toLocaleString()],
                  ].map(([k, v]) => (
                    <tr key={k}><td className="rp-param-key">{k}</td><td className="rp-param-val">{v}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'shapes' && current && (
          <div className="rp-table-wrap">
            <table className="rp-shapes-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th title="Proportion of conforming nodes">Trust</th>
                  <th title="Properties covered vs total in shape">PropCov</th>
                  <th title="Fraction of KG nodes that match target">Generality</th>
                  <th>Violations</th>
                  <th>Viol/node</th>
                  <th>Dom. Component</th>
                  <th>Accept?</th>
                </tr>
              </thead>
              <tbody>
                {[...current.shapes].sort((a, b) => {
                  const ta = a.per_class[0]?.trust ?? -1;
                  const tb = b.per_class[0]?.trust ?? -1;
                  return tb - ta;
                }).map(s => <ShapeRow key={s.shape_iri} s={s} />)}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'cross' && (
          crossLoading
            ? <div className="rp-loading">Loading all runs…</div>
            : crossData.length > 0
              ? <CrossTable allRuns={crossData} evalIndex={evalIndex} />
              : <div className="rp-loading">No data</div>
        )}
      </div>
    </div>
  );
}
