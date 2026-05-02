import { useState, useEffect, useMemo } from 'react';

// ── Model colour palette ──────────────────────────────────────────────────────
const MODEL_COLOR = {
  'DeepSeek-V3':        '#06b6d4',
  'GPT-4o mini':        '#a78bfa',
  'sheXer':             '#f59e0b',
  'rdfshapeinduction':  '#64748b',
};
function modelColor(name) {
  for (const [k, c] of Object.entries(MODEL_COLOR)) if (name.startsWith(k)) return c;
  return '#475569';
}

const SETTING_ICON = { local: '🏠', triples: '⚡', global: '🌐', '-': '◈' };

// ── Shared helpers ────────────────────────────────────────────────────────────
const fmt2 = v => v == null ? '—' : v.toFixed(3);
const pct  = v => v == null ? '—' : `${(v * 100).toFixed(1)}%`;

function HBar({ value, max, color, label, sub }) {
  const w = max > 0 ? Math.max((value / max) * 100, 2) : 0;
  return (
    <div className="ar-hbar-row">
      <div className="ar-hbar-label" title={label}>{label}</div>
      <div className="ar-hbar-track">
        <div className="ar-hbar-fill" style={{ width: `${w}%`, background: color }} />
        <span className="ar-hbar-val">{sub}</span>
      </div>
    </div>
  );
}

// ── Tab: Main results (T3) ────────────────────────────────────────────────────
function TabMain({ data, kg }) {
  const [metric, setMetric] = useState('f1'); // f1 | precision | recall | nged | ged

  const rows = useMemo(() => {
    const prefix = kg === 'dbpedia' ? 'dbp_' : 'yag_';
    return data
      .filter(r => r[`${prefix}f1`] != null)
      .map(r => ({
        label: r.setting !== '-' ? `${r.model} · ${r.setting}` : r.model,
        model: r.model,
        setting: r.setting,
        f1:        r[`${prefix}f1`],
        precision: r[`${prefix}p`],
        recall:    r[`${prefix}r`],
        ged:       r[`${prefix}ged`],
        nged:      r[`${prefix}nged`],
        parse_err: r[`${prefix}parse_err`],
      }))
      .sort((a, b) => {
        if (metric === 'ged' || metric === 'nged') return a[metric] - b[metric]; // lower is better
        return b[metric] - a[metric]; // higher is better
      });
  }, [data, kg, metric]);

  const isDistance = metric === 'ged' || metric === 'nged';
  const maxVal = Math.max(...rows.map(r => r[metric] ?? 0), 1);
  const medals = ['🥇','🥈','🥉'];

  const metricLabel = { f1:'F1 Score', precision:'Precision', recall:'Recall', nged:'NGED (↓)', ged:'GED (↓)' };

  return (
    <div className="ar-tab-content">
      {/* Metric toggle */}
      <div className="ar-metric-toggle">
        {['f1','precision','recall','nged','ged'].map(m => (
          <button key={m}
            className={`ar-metric-btn${metric===m?' active':''}`}
            onClick={() => setMetric(m)}>
            {metricLabel[m]}
          </button>
        ))}
      </div>

      <div className="ar-section-title">
        {isDistance ? '↓ lower is better' : '↑ higher is better'} — {metricLabel[metric]} (Exact matching)
      </div>

      {/* Leaderboard */}
      <div className="ar-leaderboard">
        {rows.map((r, i) => {
          const color = modelColor(r.model);
          const w = Math.max((r[metric] / maxVal) * 100, 2);
          return (
            <div key={r.label} className="ar-lb-row">
              <div className="ar-lb-rank">{medals[i] ?? `#${i+1}`}</div>
              <div className="ar-lb-info">
                <div className="ar-lb-name">
                  <span className="ar-lb-model" style={{ color }}>{r.model}</span>
                  {r.setting !== '-' && (
                    <span className="ar-lb-setting">
                      {SETTING_ICON[r.setting]} {r.setting}
                    </span>
                  )}
                  {r.parse_err > 0 && (
                    <span className="ar-lb-err" title={`${r.parse_err} parse errors`}>⚠ {r.parse_err}</span>
                  )}
                </div>
                <div className="ar-lb-bar-track">
                  <div className="ar-lb-bar-fill" style={{ width: `${w}%`, background: color }} />
                </div>
              </div>
              <div className="ar-lb-metrics">
                <span className="ar-lb-main" style={{ color }}>{fmt2(r[metric])}</span>
                {metric !== 'f1' && <span className="ar-lb-sub">F1 {fmt2(r.f1)}</span>}
                {metric === 'f1' && <span className="ar-lb-sub">P {fmt2(r.precision)} R {fmt2(r.recall)}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* PRF cluster chart */}
      <div className="ar-section-title" style={{ marginTop: 24 }}>P / R / F1 side-by-side</div>
      <div className="ar-prf-grid">
        {rows.map(r => {
          const color = modelColor(r.model);
          return (
            <div key={r.label} className="ar-prf-card" style={{ '--mc': color }}>
              <div className="ar-prf-name">{r.model}</div>
              {r.setting !== '-' && <div className="ar-prf-setting">{SETTING_ICON[r.setting]} {r.setting}</div>}
              <div className="ar-prf-bars">
                {[['P', r.precision], ['R', r.recall], ['F1', r.f1]].map(([lbl, val]) => (
                  <div key={lbl} className="ar-prf-bar-row">
                    <span className="ar-prf-lbl">{lbl}</span>
                    <div className="ar-prf-track">
                      <div className="ar-prf-fill" style={{ width: `${(val ?? 0) * 100}%`, background: color }} />
                    </div>
                    <span className="ar-prf-val">{fmt2(val)}</span>
                  </div>
                ))}
              </div>
              <div className="ar-prf-dist">
                <span className="ar-prf-dist-lbl">NGED</span>
                <span className="ar-prf-dist-val" style={{ color: r.nged < 0.5 ? '#22c55e' : r.nged < 0.8 ? '#f59e0b' : '#ef4444' }}>
                  {fmt2(r.nged)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tab: Matching criteria (T4/T8) ───────────────────────────────────────────
function TabCriteria({ data }) {
  const [nodeConstraint, setNodeConstraint] = useState('Exact');
  const [cardinality,    setCardinality]    = useState('Exact');
  const [metric, setMetric] = useState('f1');

  const filtered = useMemo(() =>
    data.filter(r => r.node_constraint === nodeConstraint && r.cardinality === cardinality),
    [data, nodeConstraint, cardinality]
  );

  const sorted = useMemo(() =>
    [...filtered].sort((a, b) => b[metric] - a[metric]),
    [filtered, metric]
  );

  const maxVal = Math.max(...sorted.map(r => r[metric] ?? 0), 1);

  return (
    <div className="ar-tab-content">
      <div className="ar-criteria-filters">
        <div className="ar-cf-group">
          <span className="ar-cf-label">Node Constraint</span>
          <div className="ar-cf-chips">
            {['Exact','Subclass','Datatype'].map(v => (
              <button key={v} className={`ar-cf-chip${nodeConstraint===v?' active':''}`}
                onClick={() => setNodeConstraint(v)}>{v}</button>
            ))}
          </div>
        </div>
        <div className="ar-cf-group">
          <span className="ar-cf-label">Cardinality</span>
          <div className="ar-cf-chips">
            {['Exact','Loosened'].map(v => (
              <button key={v} className={`ar-cf-chip${cardinality===v?' active':''}`}
                onClick={() => setCardinality(v)}>{v}</button>
            ))}
          </div>
        </div>
        <div className="ar-cf-group">
          <span className="ar-cf-label">Metric</span>
          <div className="ar-cf-chips">
            {['f1','p','r'].map(v => (
              <button key={v} className={`ar-cf-chip${metric===v?' active':''}`}
                onClick={() => setMetric(v)}>{v.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="ar-leaderboard">
        {sorted.map((r, i) => {
          const color = modelColor(r.model);
          const w = Math.max((r[metric] / maxVal) * 100, 2);
          const medals = ['🥇','🥈','🥉'];
          return (
            <div key={`${r.model}-${r.setting}`} className="ar-lb-row">
              <div className="ar-lb-rank">{medals[i] ?? `#${i+1}`}</div>
              <div className="ar-lb-info">
                <div className="ar-lb-name">
                  <span className="ar-lb-model" style={{ color }}>{r.model}</span>
                  <span className="ar-lb-setting">{SETTING_ICON[r.setting]} {r.setting}</span>
                </div>
                <div className="ar-lb-bar-track">
                  <div className="ar-lb-bar-fill" style={{ width: `${w}%`, background: color }} />
                </div>
              </div>
              <div className="ar-lb-metrics">
                <span className="ar-lb-main" style={{ color }}>{fmt2(r[metric])}</span>
                <span className="ar-lb-sub">P {fmt2(r.p)} R {fmt2(r.r)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Heatmap: F1 by setting × node constraint */}
      <div className="ar-section-title" style={{ marginTop: 24 }}>F1 heat map — all criteria</div>
      <CriteriaHeatmap data={data} />
    </div>
  );
}

function CriteriaHeatmap({ data }) {
  const models = [...new Set(data.map(r => `${r.model}|${r.setting}`))];
  const criteria = [...new Set(data.map(r => `${r.node_constraint}/${r.cardinality}`))];

  const lookup = useMemo(() => {
    const m = {};
    for (const r of data) m[`${r.model}|${r.setting}||${r.node_constraint}/${r.cardinality}`] = r.f1;
    return m;
  }, [data]);

  const allF1 = data.map(r => r.f1).filter(Boolean);
  const minF1 = Math.min(...allF1), maxF1 = Math.max(...allF1, 0.001);

  const cellColor = (f1) => {
    if (f1 == null) return '#0a0e17';
    const t = (f1 - minF1) / (maxF1 - minF1);
    const r = Math.round(t * 6 + (1-t) * 139);
    const g = Math.round(t * 197 + (1-t) * 92);
    const b = Math.round(t * 89 + (1-t) * 246);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className="ar-heatmap-wrap">
      <table className="ar-heatmap">
        <thead>
          <tr>
            <th className="ar-hm-th-model"></th>
            {criteria.map(c => <th key={c} className="ar-hm-th-crit">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {models.map(mk => {
            const [model, setting] = mk.split('|');
            const color = modelColor(model);
            return (
              <tr key={mk}>
                <td className="ar-hm-td-model">
                  <span style={{ color }}>{model}</span>
                  <span className="ar-hm-setting">{SETTING_ICON[setting]} {setting}</span>
                </td>
                {criteria.map(c => {
                  const f1 = lookup[`${mk}||${c}`];
                  return (
                    <td key={c} className="ar-hm-cell"
                      style={{ background: cellColor(f1), color: f1 > (maxF1*0.6) ? '#000' : '#fff' }}>
                      {f1 != null ? f1.toFixed(2) : '—'}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Tab: Cardinality (T5/T9) ─────────────────────────────────────────────────
function TabCardinality({ data }) {
  const valid = data.filter(r => r.acc != null).sort((a, b) => b.acc - a.acc);
  const max = Math.max(...valid.map(r => r.acc), 0.001);
  const medals = ['🥇','🥈','🥉'];

  return (
    <div className="ar-tab-content">
      <div className="ar-section-title">Overall Cardinality Accuracy (↑ higher is better)</div>
      <div className="ar-leaderboard">
        {valid.map((r, i) => {
          const color = modelColor(r.model);
          const w = Math.max((r.acc / max) * 100, 2);
          return (
            <div key={r.model} className="ar-lb-row">
              <div className="ar-lb-rank">{medals[i] ?? `#${i+1}`}</div>
              <div className="ar-lb-info">
                <div className="ar-lb-name">
                  <span className="ar-lb-model" style={{ color }}>{r.model}</span>
                </div>
                <div className="ar-lb-bar-track">
                  <div className="ar-lb-bar-fill" style={{ width: `${w}%`, background: color }} />
                </div>
              </div>
              <div className="ar-lb-metrics">
                <span className="ar-lb-main" style={{ color }}>{pct(r.acc)}</span>
                <span className="ar-lb-sub">min {pct(r.acc_min)} max {pct(r.acc_max)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="ar-section-title" style={{ marginTop: 24 }}>Min / Max cardinality accuracy breakdown</div>
      <div className="ar-card-grid">
        {valid.map(r => {
          const color = modelColor(r.model);
          return (
            <div key={r.model} className="ar-card-mini" style={{ '--mc': color }}>
              <div className="ar-cm-name">{r.model}</div>
              {[['Overall', r.acc],['Min acc', r.acc_min],['Max acc', r.acc_max]].map(([lbl, val]) => (
                <div key={lbl} className="ar-cm-row">
                  <span className="ar-cm-lbl">{lbl}</span>
                  <div className="ar-cm-track">
                    <div className="ar-cm-fill" style={{ width: `${(val??0)*100}%`, background: lbl==='Overall' ? color : color+'88' }} />
                  </div>
                  <span className="ar-cm-val">{pct(val)}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tab: Distance (GED/NGED from T3) ─────────────────────────────────────────
function TabDistance({ data, kg }) {
  const prefix = kg === 'dbpedia' ? 'dbp_' : 'yag_';

  const rows = useMemo(() =>
    data
      .filter(r => r[`${prefix}nged`] != null)
      .map(r => ({
        label: r.setting !== '-' ? `${r.model} · ${r.setting}` : r.model,
        model: r.model,
        setting: r.setting,
        ged:  r[`${prefix}ged`],
        nged: r[`${prefix}nged`],
        f1:   r[`${prefix}f1`],
      }))
      .sort((a, b) => a.nged - b.nged), // lower NGED = better
    [data, kg]
  );

  const maxGed  = Math.max(...rows.map(r => r.ged),  1);
  const maxNged = Math.max(...rows.map(r => r.nged), 1);
  const medals = ['🥇','🥈','🥉'];

  return (
    <div className="ar-tab-content">
      <div className="ar-section-title">NGED — Normalised Graph Edit Distance (↓ lower is better)</div>
      <div className="ar-leaderboard">
        {rows.map((r, i) => {
          const color = modelColor(r.model);
          const w = Math.max(((maxNged - r.nged) / maxNged) * 100, 2);
          return (
            <div key={r.label} className="ar-lb-row">
              <div className="ar-lb-rank">{medals[i] ?? `#${i+1}`}</div>
              <div className="ar-lb-info">
                <div className="ar-lb-name">
                  <span className="ar-lb-model" style={{ color }}>{r.model}</span>
                  {r.setting !== '-' && <span className="ar-lb-setting">{SETTING_ICON[r.setting]} {r.setting}</span>}
                </div>
                <div className="ar-lb-bar-track">
                  <div className="ar-lb-bar-fill" style={{ width: `${w}%`, background: color }} />
                </div>
              </div>
              <div className="ar-lb-metrics">
                <span className="ar-lb-main" style={{ color }}>{fmt2(r.nged)}</span>
                <span className="ar-lb-sub">GED {r.ged?.toFixed(1)} · F1 {fmt2(r.f1)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scatter-style: NGED vs F1 */}
      <div className="ar-section-title" style={{ marginTop: 24 }}>F1 vs NGED — quality vs distance trade-off</div>
      <NgedF1Scatter rows={rows} />
    </div>
  );
}

function NgedF1Scatter({ rows }) {
  const W = 400, H = 200, PAD = 32;
  const f1s  = rows.map(r => r.f1  ?? 0);
  const ngeds = rows.map(r => r.nged ?? 0);
  const maxF1   = Math.max(...f1s,   0.001);
  const maxNged = Math.max(...ngeds, 0.001);

  const cx = f1   => PAD + (f1   / maxF1)   * (W - PAD * 2);
  const cy = nged => (H - PAD) - (nged / maxNged) * (H - PAD * 2);

  return (
    <div className="ar-scatter-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="ar-scatter-svg">
        {/* Axes */}
        <line x1={PAD} y1={H-PAD} x2={W-PAD} y2={H-PAD} stroke="#1e293b" strokeWidth="1" />
        <line x1={PAD} y1={PAD}   x2={PAD}   y2={H-PAD} stroke="#1e293b" strokeWidth="1" />
        <text x={W/2} y={H-4}  textAnchor="middle" fontSize="8" fill="#475569">F1 →</text>
        <text x={8}   y={H/2}  textAnchor="middle" fontSize="8" fill="#475569" transform={`rotate(-90,8,${H/2})`}>NGED ↑</text>
        {/* Grid lines */}
        {[0.25,0.5,0.75].map(t => (
          <g key={t}>
            <line x1={PAD} y1={cy(maxNged*t)} x2={W-PAD} y2={cy(maxNged*t)} stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1={cx(maxF1*t)} y1={PAD} x2={cx(maxF1*t)} y2={H-PAD} stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3,3" />
          </g>
        ))}
        {/* Points */}
        {rows.map(r => {
          const x = cx(r.f1 ?? 0), y = cy(r.nged ?? 0);
          const color = modelColor(r.model);
          return (
            <g key={r.label}>
              <circle cx={x} cy={y} r="5" fill={color} opacity="0.85" />
              <text x={x+6} y={y+3} fontSize="7" fill={color}>{r.setting !== '-' ? r.setting : r.model.split(' ')[0]}</text>
            </g>
          );
        })}
      </svg>
      <div className="ar-scatter-legend">
        {[...new Set(rows.map(r => r.model))].map(m => (
          <div key={m} className="ar-scatter-leg-row">
            <span className="ar-scatter-leg-dot" style={{ background: modelColor(m) }} />
            <span>{m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export function ShapeArena({ onBack }) {
  const [kg,   setKg]   = useState('dbpedia');
  const [tab,  setTab]  = useState('main');

  const [t3,   setT3]   = useState([]);
  const [t4,   setT4]   = useState([]);
  const [t8,   setT8]   = useState([]);
  const [t5,   setT5]   = useState([]);
  const [t9,   setT9]   = useState([]);

  useEffect(() => {
    fetch('/results/t3_main.json').then(r=>r.json()).then(setT3).catch(()=>{});
    fetch('/results/t4_dbp_criteria.json').then(r=>r.json()).then(setT4).catch(()=>{});
    fetch('/results/t8_yag_criteria.json').then(r=>r.json()).then(setT8).catch(()=>{});
    fetch('/results/t5_dbp_cardinality.json').then(r=>r.json()).then(setT5).catch(()=>{});
    fetch('/results/t9_yag_cardinality.json').then(r=>r.json()).then(setT9).catch(()=>{});
  }, []);

  const criteriaData    = kg === 'dbpedia' ? t4 : t8;
  const cardinalityData = kg === 'dbpedia' ? t5 : t9;

  const tabs = [
    { id:'main',        label:'⚔ Main Results' },
    { id:'criteria',    label:'🔬 Matching Criteria' },
    { id:'distance',    label:'📐 Distance (GED)' },
    { id:'cardinality', label:'🃏 Cardinality' },
  ];

  return (
    <div className="ar-root">
      <div className="ar-header">
        <button className="ar-back-btn" onClick={onBack}>← Library</button>
        <span className="ar-logo">⚔</span>
        <h1 className="ar-title">Shape Arena</h1>
        <div className="ar-kg-toggle">
          {['dbpedia','yago'].map(k => (
            <button key={k} className={`ar-kg-btn${kg===k?' active':''}`} onClick={() => setKg(k)}>
              <img src={`/img/${k}.png`} alt={k} style={{height:16,width:'auto',objectFit:'contain',verticalAlign:'middle',marginRight:5}} />
              {k === 'dbpedia' ? 'DBpedia' : 'YAGO'}
            </button>
          ))}
        </div>
      </div>

      <div className="ar-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`ar-tab${tab===t.id?' active':''}`}
            onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      <div className="ar-body">
        {tab === 'main'        && <TabMain       data={t3}           kg={kg} />}
        {tab === 'criteria'    && <TabCriteria   data={criteriaData}          />}
        {tab === 'distance'    && <TabDistance   data={t3}           kg={kg} />}
        {tab === 'cardinality' && <TabCardinality data={cardinalityData}       />}
      </div>
    </div>
  );
}
