import { useState, useEffect, useMemo } from 'react';

// ── Helpers ───────────────────────────────────────────────
function matchSlot(entry, filter) {
  if (filter.source  && entry.source   !== filter.source)   return false;
  if (filter.kg      && entry.kg       !== filter.kg)       return false;
  if (filter.variant && entry.variant  !== filter.variant)  return false;
  if (filter.gen_mode && entry.gen_mode !== filter.gen_mode) return false;
  if (filter.model   && entry.model    !== filter.model)    return false;
  return true;
}

function buildMatrix(classes, slots, index) {
  // Returns Map<className, Map<slotId, indexEntry|null>>
  const m = new Map();
  for (const cls of classes) {
    const row = new Map();
    for (const slot of slots) {
      const entry = index.find(e => e.class === cls && matchSlot(e, slot.filter));
      row.set(slot.id, entry ?? null);
    }
    m.set(cls, row);
  }
  return m;
}

const KG_COLORS = { dbpedia: '#3b82f6', yago: '#a78bfa', wikidata: '#10b981' };
const KG_LOGOS  = { dbpedia: '/img/dbpedia.png', yago: '/img/yago.png', wikidata: '/img/wikidata.png' };
const KG_LABELS = { dbpedia: 'DBpedia', yago: 'YAGO', wikidata: 'Wikidata' };

function KgLogo({ kg, size = 18, style = {} }) {
  return KG_LOGOS[kg]
    ? <img src={KG_LOGOS[kg]} alt={KG_LABELS[kg] ?? kg} title={KG_LABELS[kg] ?? kg}
           style={{ height: size, width: 'auto', objectFit: 'contain', verticalAlign: 'middle', ...style }} />
    : <span>{KG_LABELS[kg] ?? kg}</span>;
}

const DECK_LOGOS = { doubleshapresso: '/img/doubleshapresso.png' };

// ── Deck list ─────────────────────────────────────────────
function DeckCard({ deck, onClick }) {
  const deckLogo = DECK_LOGOS[deck.id];
  return (
    <div className="dk-box" onClick={onClick} style={{ '--dk-color': deck.color }}>
      <div className="dk-box-shine" />
      {deckLogo
        ? <img src={deckLogo} alt={deck.name} className="dk-box-logo" />
        : <div className="dk-box-icon">{deck.icon}</div>
      }
      <div className="dk-box-name">{deck.name}</div>
      <div className="dk-box-desc">{deck.description}</div>
      <div className="dk-box-meta">
        {deck.kgs?.map(kg => (
          <span key={kg} className="dk-kg-badge" style={{ background: KG_COLORS[kg] + '22', border: `1px solid ${KG_COLORS[kg]}55` }}>
            <KgLogo kg={kg} size={14} />
          </span>
        ))}
        <span className="dk-slot-count">{deck.slots_count} slots</span>
      </div>
    </div>
  );
}

// ── Deck detail ───────────────────────────────────────────
function ShapeCell({ entry, onLoad }) {
  if (!entry) return <td className="dk-cell dk-cell-empty"><span>—</span></td>;
  return (
    <td className="dk-cell dk-cell-present">
      <button className="dk-load-btn" onClick={() => onLoad(entry.path)} title={entry.path}>
        Load
      </button>
    </td>
  );
}

function DeckDetail({ deck, index, onLoad, onBack }) {
  const [activeKg, setActiveKg] = useState(deck.kgs?.[0] ?? 'dbpedia');

  const slots   = useMemo(() => deck.slots.filter(s => s.kg === activeKg), [deck, activeKg]);
  const classes = useMemo(() => deck.classes?.[activeKg] ?? [], [deck, activeKg]);
  const matrix  = useMemo(() => buildMatrix(classes, slots, index), [classes, slots, index]);

  // Count coverage
  const coverage = useMemo(() => {
    let filled = 0, total = 0;
    for (const row of matrix.values()) {
      for (const entry of row.values()) {
        total++;
        if (entry) filled++;
      }
    }
    return { filled, total, pct: total ? Math.round((filled / total) * 100) : 0 };
  }, [matrix]);

  return (
    <div className="dk-detail">
      {/* Header */}
      <div className="dk-detail-header">
        <button className="dk-back-btn" onClick={onBack}>← Decks</button>
        <div className="dk-detail-title">
          <span className="dk-detail-icon">{deck.icon}</span>
          <div>
            <h2 className="dk-detail-name">{deck.name}</h2>
            <p className="dk-detail-desc">{deck.description}</p>
          </div>
        </div>
        <div className="dk-coverage-pill" title={`${coverage.filled}/${coverage.total} shapes present`}>
          {coverage.pct}% coverage
        </div>
      </div>

      {/* KG tabs */}
      <div className="dk-kg-tabs">
        {deck.kgs?.map(kg => (
          <button
            key={kg}
            className={`dk-kg-tab${activeKg === kg ? ' active' : ''}`}
            style={{ '--kgc': KG_COLORS[kg] }}
            onClick={() => setActiveKg(kg)}
          >
            <KgLogo kg={kg} size={16} style={{ marginRight: 4 }} />
            <span className="dk-kg-tab-label">{KG_LABELS[kg]}</span>
            <span className="dk-kg-tab-count">{deck.classes?.[kg]?.length ?? 0}</span>
          </button>
        ))}
      </div>

      {/* Slot header + matrix */}
      <div className="dk-matrix-wrap">
        <table className="dk-matrix">
          <thead>
            <tr>
              <th className="dk-th-class">Class</th>
              {slots.map(s => (
                <th key={s.id} className="dk-th-slot" style={{ '--slotc': s.color }}>
                  <span className="dk-slot-icon">{s.icon}</span>
                  <span className="dk-slot-label">{s.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {classes.map(cls => {
              const row = matrix.get(cls) ?? new Map();
              const rowFilled = [...row.values()].filter(Boolean).length;
              return (
                <tr key={cls} className={`dk-row${rowFilled === 0 ? ' dk-row-empty' : ''}`}>
                  <td className="dk-td-class">
                    <span className="dk-class-name">{cls}</span>
                    <span className="dk-class-cov">{rowFilled}/{slots.length}</span>
                  </td>
                  {slots.map(s => (
                    <ShapeCell key={s.id} entry={row.get(s.id)} onLoad={onLoad} />
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────
export function DeckView({ onLoad, onBack }) {
  const [deckList, setDeckList]   = useState([]);
  const [activeDeck, setActiveDeck] = useState(null);
  const [index, setIndex]         = useState([]);

  useEffect(() => {
    fetch('/decks/index.json').then(r => r.json()).then(setDeckList).catch(() => {});
    fetch('/shapes/index.json').then(r => r.json()).then(setIndex).catch(() => {});
  }, []);

  const handleSelectDeck = (summary) => {
    fetch(`/decks/${summary.id}.json`)
      .then(r => r.json())
      .then(setActiveDeck)
      .catch(() => {});
  };

  const handleLoad = (path) => {
    onLoad(path);
  };

  return (
    <div className="dk-root">
      <div className="dk-root-header">
        {onBack && (
          <button className="dk-back-btn" onClick={onBack} style={{ marginRight: 8 }}>← Library</button>
        )}
        <span className="dk-root-title">Shape of the Deck</span>
        <span className="dk-root-sub">Curated shape set collections for comparative analysis</span>
      </div>

      {activeDeck ? (
        <DeckDetail
          deck={activeDeck}
          index={index}
          onLoad={handleLoad}
          onBack={() => setActiveDeck(null)}
        />
      ) : (
        <div className="dk-list">
          {deckList.length === 0 && (
            <div className="dk-empty-state">Loading decks…</div>
          )}
          {deckList.map(deck => (
            <DeckCard key={deck.id} deck={deck} onClick={() => handleSelectDeck(deck)} />
          ))}
        </div>
      )}
    </div>
  );
}
