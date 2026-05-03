import { useState, useMemo, useEffect } from 'react';
import { extractTopicMap } from '../utils/turtleImport';
import { topicColor } from '../utils/topicColors';

function shapeNameFromPath(path) {
  return path.split('/').pop().replace(/\.ttl$/, '');
}

// ── Expandable table row ──────────────────────────────────
function TopicTableRow({ topic, distinctProps, shapeCount, entries }) {
  const [open, setOpen] = useState(false);
  const color = topicColor(topic) || '#6366f1';

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
          <span className="lts-topic-label">{topic}</span>
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
export function TopicStudio({ onBack }) {
  const [index, setIndex]       = useState([]);
  const [loaded, setLoaded]     = useState(0);
  const [total, setTotal]       = useState(0);
  const [topicData, setTopicData] = useState(new Map());
  const [search, setSearch]     = useState('');
  const [sortBy, setSortBy]     = useState('count');

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
        setTopicData(prev => {
          const next = new Map(prev);
          for (const r of results) {
            if (!r) continue;
            const topicMap = extractTopicMap(r.ttl);
            const shapeName = shapeNameFromPath(r.e.path);
            for (const [propPath, topic] of topicMap.entries()) {
              if (!next.has(topic)) next.set(topic, []);
              next.get(topic).push({ shapeName, shapePath: r.e.path, propPath });
            }
          }
          return next;
        });
        setLoaded(l => Math.min(l + chunk.length, index.length));
        await new Promise(r => setTimeout(r, 40));
      }
    };
    run();
    return () => { cancelled = true; };
  }, [index]);

  const totalTopics    = topicData.size;
  const totalAnnotated = useMemo(() => [...topicData.values()].reduce((s, a) => s + a.length, 0), [topicData]);
  const shapesCovered  = useMemo(() => new Set([...topicData.values()].flat().map(e => e.shapePath)).size, [topicData]);
  const coveragePct    = total > 0 ? Math.round(shapesCovered / total * 100) : 0;
  const loadPct        = total > 0 ? Math.round(loaded / total * 100) : 0;
  const isLoading      = total === 0 || loaded < total;

  const filteredTopics = useMemo(() => {
    let arr = [...topicData.entries()];
    if (search) arr = arr.filter(([t]) => t.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === 'count') return arr.sort((a, b) => new Set(b[1].map(e => e.shapePath)).size - new Set(a[1].map(e => e.shapePath)).size);
    if (sortBy === 'props')  return arr.sort((a, b) => new Set(b[1].map(e => e.propPath)).size - new Set(a[1].map(e => e.propPath)).size);
    return arr.sort((a, b) => a[0].localeCompare(b[0]));
  }, [topicData, search, sortBy]);

  return (
    <div className="ts-root">
      {/* Header */}
      <div className="ts-header">
        <button className="ts-back-btn" onClick={onBack}>← Library</button>
        <img src="/img/logo.png" className="app-logo-img" alt="ShapeOfTheDecks" />
        <span className="ts-title">Topic Studio</span>
      </div>

      {/* Stats */}
      <div className="lts-stats-row">
        <div className="lts-stat-box">
          <span className="lts-stat-val">{totalTopics}</span>
          <span className="lts-stat-lbl">topics</span>
        </div>
        <div className="lts-stat-box">
          <span className="lts-stat-val">{totalAnnotated}</span>
          <span className="lts-stat-lbl">annotated props</span>
        </div>
        <div className="lts-stat-box">
          <span className="lts-stat-val">{shapesCovered}</span>
          <span className="lts-stat-lbl">shapes w/ topics</span>
        </div>
        <div className="lts-stat-box">
          <span className="lts-stat-val lts-stat-pct">{coveragePct}%</span>
          <span className="lts-stat-lbl">library coverage</span>
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
          placeholder="Search topics…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="lts-sort-toggle">
          <button className={`lts-sort-btn${sortBy === 'count' ? ' active' : ''}`} onClick={() => setSortBy('count')}>Most shapes</button>
          <button className={`lts-sort-btn${sortBy === 'props'  ? ' active' : ''}`} onClick={() => setSortBy('props')}>Most props</button>
          <button className={`lts-sort-btn${sortBy === 'alpha'  ? ' active' : ''}`} onClick={() => setSortBy('alpha')}>A–Z</button>
        </div>
      </div>

      {/* Table */}
      <div className="lts-table-wrap">
        {filteredTopics.length === 0 && !isLoading && (
          <div className="lts-empty">
            {totalTopics === 0
              ? 'No topic annotations found. Only ground-truth shapes carry topic annotations (═══ section headers).'
              : 'No topics match your search.'}
          </div>
        )}
        {filteredTopics.length === 0 && isLoading && totalTopics === 0 && (
          <div className="lts-empty lts-empty-loading">Scanning shape library…</div>
        )}
        {filteredTopics.length > 0 && (
          <table className="lts-table">
            <thead>
              <tr>
                <th className="lts-th-name" onClick={() => setSortBy('alpha')} title="Sort A–Z">
                  Topic {sortBy === 'alpha' ? '▴' : ''}
                </th>
                <th className="lts-th-num" onClick={() => setSortBy('props')} title="Sort by distinct props">
                  Distinct props {sortBy === 'props' ? '▴' : ''}
                </th>
                <th className="lts-th-num" onClick={() => setSortBy('count')} title="Sort by shapes">
                  Shapes {sortBy === 'count' ? '▴' : ''}
                </th>
                <th className="lts-th-chevron" />
              </tr>
            </thead>
            <tbody>
              {filteredTopics.map(([topic, entries]) => {
                const distinctProps = new Set(entries.map(e => e.propPath)).size;
                const shapeSet      = new Set(entries.map(e => e.shapePath));
                return (
                  <TopicTableRow
                    key={topic}
                    topic={topic}
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
