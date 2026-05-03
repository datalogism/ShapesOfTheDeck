import { useState, useMemo, useEffect } from 'react';
import { topicColor } from '../utils/topicColors';

function shapeNameFromPath(path) {
  return path.split('/').pop().replace(/\.ttl$/, '');
}

// Extract prefix→URI map from @prefix declarations
function extractPrefixMap(ttlText) {
  const map = new Map();
  for (const m of ttlText.matchAll(/@prefix\s+(\w*):\s*<([^>]+)>/g)) {
    if (m[1]) map.set(m[1], m[2]);
  }
  return map;
}

// Extract namespace prefix from a path token (e.g. "dbo:name" → "dbo")
function prefixOf(path) {
  if (!path) return null;
  const m = path.match(/^([a-zA-Z][a-zA-Z0-9_-]*):/);
  return m ? m[1] : null;
}

// ── Expandable table row ──────────────────────────────────
function NsTableRow({ ns, uri, distinctProps, shapeCount, entries }) {
  const [open, setOpen] = useState(false);
  const color = topicColor(ns) || '#6366f1';

  const byShape = useMemo(() => {
    const m = new Map();
    for (const e of entries) {
      if (!m.has(e.shapeName)) m.set(e.shapeName, new Set());
      m.get(e.shapeName).add(e.propPath);
    }
    return [...m.entries()];
  }, [entries]);

  return (
    <>
      <tr className={`lts-tr${open ? ' lts-tr-open' : ''}`} onClick={() => setOpen(o => !o)}>
        <td className="lts-td-name">
          <span className="lts-dot" style={{ background: color }} />
          <span className="lts-topic-label">{ns}:</span>
          {uri && <span className="ns-uri" title={uri}>{uri}</span>}
        </td>
        <td className="lts-td-num">{distinctProps}</td>
        <td className="lts-td-num">{shapeCount}</td>
        <td className="lts-td-chevron">{open ? '▾' : '▸'}</td>
      </tr>
      {open && (
        <tr className="lts-tr-detail">
          <td colSpan={4} className="lts-td-detail">
            {byShape.map(([shapeName, pathSet]) => (
              <div key={shapeName} className="lts-detail-group">
                <span className="lts-detail-shape">◈ {shapeName}</span>
                <div className="lts-detail-props">
                  {[...pathSet].map((p, i) => (
                    <code key={i} className="lts-prop-code">{p}</code>
                  ))}
                </div>
              </div>
            ))}
          </td>
        </tr>
      )}
    </>
  );
}

// ── Main export ───────────────────────────────────────────
export function NamespaceStudio({ onBack }) {
  const [index, setIndex]     = useState([]);
  const [loaded, setLoaded]   = useState(0);
  const [total, setTotal]     = useState(0);
  const [nsData, setNsData]   = useState(new Map()); // ns → [{shapeName, shapePath, propPath}]
  const [uriMap, setUriMap]   = useState(new Map()); // ns → URI (first seen)
  const [search, setSearch]   = useState('');
  const [sortBy, setSortBy]   = useState('props');

  useEffect(() => {
    fetch('/shapes/index.json')
      .then(r => r.json())
      .then(data => { setIndex(data); setTotal(data.length); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (index.length === 0) return;
    let cancelled = false;
    const BATCH = 8;
    let i = 0;

    const run = async () => {
      while (i < index.length && !cancelled) {
        const chunk = index.slice(i, i + BATCH);
        i += BATCH;
        const results = await Promise.all(chunk.map(e =>
          fetch(`/shapes/${e.path}`).then(r => r.text())
            .then(ttl => ({ e, ttl })).catch(() => null)
        ));
        if (cancelled) return;

        setNsData(prev => {
          const nextNs  = new Map(prev);
          const nextUri = new Map();

          for (const r of results) {
            if (!r) continue;
            const shapeName  = shapeNameFromPath(r.e.path);
            const prefixMap  = extractPrefixMap(r.ttl);

            // Collect URI hints
            for (const [p, u] of prefixMap) nextUri.set(p, u);

            // Extract all sh:path values
            for (const m of r.ttl.matchAll(/sh:path\s+([^\s;,\]]+)/g)) {
              const path = m[1].trim();
              const ns   = prefixOf(path);
              if (!ns) continue;
              if (!nextNs.has(ns)) nextNs.set(ns, []);
              nextNs.get(ns).push({ shapeName, shapePath: r.e.path, propPath: path });
            }

            // Collect URI hints
            setUriMap(prev2 => {
              const u2 = new Map(prev2);
              for (const [p, u] of prefixMap) if (!u2.has(p)) u2.set(p, u);
              return u2;
            });
          }
          return nextNs;
        });

        setLoaded(l => Math.min(l + chunk.length, index.length));
        await new Promise(r => setTimeout(r, 40));
      }
    };
    run();
    return () => { cancelled = true; };
  }, [index]);

  const totalNs        = nsData.size;
  const totalProps     = useMemo(() => new Set([...nsData.values()].flat().map(e => e.propPath)).size, [nsData]);
  const shapesCovered  = useMemo(() => new Set([...nsData.values()].flat().map(e => e.shapePath)).size, [nsData]);
  const loadPct        = total > 0 ? Math.round(loaded / total * 100) : 0;
  const isLoading      = total === 0 || loaded < total;

  const filtered = useMemo(() => {
    let arr = [...nsData.entries()];
    if (search) arr = arr.filter(([ns]) => ns.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === 'props')  return arr.sort((a, b) => new Set(b[1].map(e => e.propPath)).size - new Set(a[1].map(e => e.propPath)).size);
    if (sortBy === 'count')  return arr.sort((a, b) => new Set(b[1].map(e => e.shapePath)).size - new Set(a[1].map(e => e.shapePath)).size);
    return arr.sort((a, b) => a[0].localeCompare(b[0]));
  }, [nsData, search, sortBy]);

  return (
    <div className="ts-root">
      {/* Header */}
      <div className="ts-header">
        <button className="ts-back-btn" onClick={onBack}>← Library</button>
        <img src="/img/logo.png" className="app-logo-img" alt="ShapeOfTheDecks" />
        <span className="ts-title">Namespace Studio</span>
      </div>

      {/* Stats */}
      <div className="lts-stats-row">
        <div className="lts-stat-box">
          <span className="lts-stat-val">{totalNs}</span>
          <span className="lts-stat-lbl">namespaces</span>
        </div>
        <div className="lts-stat-box">
          <span className="lts-stat-val">{totalProps}</span>
          <span className="lts-stat-lbl">distinct props</span>
        </div>
        <div className="lts-stat-box">
          <span className="lts-stat-val">{shapesCovered}</span>
          <span className="lts-stat-lbl">shapes scanned</span>
        </div>
        <div className="lts-stat-box">
          <span className="lts-stat-val lts-stat-pct">{total}</span>
          <span className="lts-stat-lbl">total shapes</span>
        </div>
        {isLoading && (
          <div className="lts-inline-progress">
            <div className="lts-prog-bar">
              <div className="lts-prog-fill" style={{ width: `${loadPct}%` }} />
            </div>
            <span className="lts-prog-txt">Scanning… {loaded}/{total}</span>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="lts-toolbar">
        <input
          className="lts-search"
          placeholder="Search namespaces…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="lts-sort-toggle">
          <button className={`lts-sort-btn${sortBy === 'props'  ? ' active' : ''}`} onClick={() => setSortBy('props')}>Most props</button>
          <button className={`lts-sort-btn${sortBy === 'count'  ? ' active' : ''}`} onClick={() => setSortBy('count')}>Most shapes</button>
          <button className={`lts-sort-btn${sortBy === 'alpha'  ? ' active' : ''}`} onClick={() => setSortBy('alpha')}>A–Z</button>
        </div>
      </div>

      {/* Table */}
      <div className="lts-table-wrap">
        {filtered.length === 0 && isLoading && totalNs === 0 && (
          <div className="lts-empty lts-empty-loading">Scanning shape library…</div>
        )}
        {filtered.length === 0 && !isLoading && (
          <div className="lts-empty">No namespaces match your search.</div>
        )}
        {filtered.length > 0 && (
          <table className="lts-table">
            <thead>
              <tr>
                <th className="lts-th-name" onClick={() => setSortBy('alpha')} title="Sort A–Z">
                  Namespace {sortBy === 'alpha' ? '▴' : ''}
                </th>
                <th className="lts-th-num" onClick={() => setSortBy('props')} title="Sort by distinct properties">
                  Distinct props {sortBy === 'props' ? '▴' : ''}
                </th>
                <th className="lts-th-num" onClick={() => setSortBy('count')} title="Sort by shapes">
                  Shapes {sortBy === 'count' ? '▴' : ''}
                </th>
                <th className="lts-th-chevron" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(([ns, entries]) => {
                const distinctProps = new Set(entries.map(e => e.propPath)).size;
                const shapeSet      = new Set(entries.map(e => e.shapePath));
                return (
                  <NsTableRow
                    key={ns}
                    ns={ns}
                    uri={uriMap.get(ns) || null}
                    distinctProps={distinctProps}
                    shapeCount={shapeSet.size}
                    entries={entries}
                  />
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
