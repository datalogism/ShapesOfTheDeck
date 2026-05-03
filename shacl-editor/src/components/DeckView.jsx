import { useState, useEffect, useMemo, useCallback } from 'react';

// ── Shared helpers ────────────────────────────────────────
export function matchSlot(entry, filter) {
  if (filter.paths) return filter.paths.includes(entry.path); // explicit path list
  if (filter.source   && entry.source   !== filter.source)   return false;
  if (filter.kg       && entry.kg       !== filter.kg)       return false;
  if (filter.variant  && entry.variant  !== filter.variant)  return false;
  if (filter.gen_mode && entry.gen_mode !== filter.gen_mode) return false;
  if (filter.model    && entry.model    !== filter.model)    return false;
  return true;
}

const KG_COLORS = { dbpedia: '#3b82f6', yago: '#a78bfa', wikidata: '#10b981' };
const KG_LOGOS  = { dbpedia: '/img/dbpedia.png', yago: '/img/yago.png', wikidata: '/img/wikidata.png' };
const KG_LABELS = { dbpedia: 'DBpedia', yago: 'YAGO', wikidata: 'Wikidata' };
const DECK_LOGOS = { doubleshapresso: '/img/doubleshapresso.png' };

export function KgLogo({ kg, size = 18, style = {} }) {
  return KG_LOGOS[kg]
    ? <img src={KG_LOGOS[kg]} alt={KG_LABELS[kg] ?? kg} title={KG_LABELS[kg] ?? kg}
           style={{ height: size, width: 'auto', objectFit: 'contain', verticalAlign: 'middle', ...style }} />
    : <span>{KG_LABELS[kg] ?? kg}</span>;
}

const SOURCE_OPTS = [
  { value: 'ground-truth',    label: 'Ground Truth',  icon: '👑' },
  { value: 'shapes_generated',label: 'LLM Generated', icon: '🤖' },
  { value: 'shexer',          label: 'ShExer',         icon: '🔬' },
  { value: 'kastor',          label: 'Kastor',          icon: '🏗️' },
];
const MODE_OPTS = [
  { value: 'shacl/local',      label: 'Local'         },
  { value: 'shacl/triples',    label: 'Triples'       },
  { value: 'shacl/global',     label: 'Global'        },
  { value: 'shacl_orig/global',label: 'Global (orig)' },
];
const MODEL_OPTS = [
  { value: 'deepseek-chat', label: 'DeepSeek-V3'  },
  { value: 'gpt-4o-mini',   label: 'GPT-4o mini' },
];
const DBP_VARIANTS = ['dbpedia-aligned','dbpedia-complete','dbpedia-v0','dbpedia-v1'];

function buildSlotFilter(slot) {
  const f = { source: slot.filterSource || 'ground-truth', kg: slot.kg || 'dbpedia' };
  if (f.source === 'shapes_generated') {
    if (slot.filterMode)  f.gen_mode = slot.filterMode;
    if (slot.filterModel) f.model    = slot.filterModel;
  }
  if (f.source === 'ground-truth' && f.kg === 'dbpedia' && slot.filterVariant)
    f.variant = slot.filterVariant;
  return f;
}

function slotMatchCount(slot, index) {
  const f = buildSlotFilter(slot);
  const matches = index.filter(e => matchSlot(e, f));
  return { shapes: matches.length, classes: new Set(matches.map(e => e.class)).size };
}

// ── SlotEditor ────────────────────────────────────────────
function SlotEditor({ slot, index, onChange, onRemove }) {
  const { shapes, classes } = useMemo(() => slotMatchCount(slot, index), [slot, index]);
  const ICON_OPTS = ['👑','🤖','🔬','📦','⚗','🌍','🔵','🟣'];

  return (
    <div className="dkb-slot">
      <div className="dkb-slot-header">
        <select className="dkb-icon-sel" value={slot.icon||'📦'} onChange={e => onChange({...slot, icon: e.target.value})}>
          {ICON_OPTS.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        <input className="dkb-slot-label" value={slot.label} onChange={e => onChange({...slot, label: e.target.value})} placeholder="Slot name" />
        <button className="dkb-slot-remove" onClick={onRemove} title="Remove slot">✕</button>
      </div>

      <div className="dkb-row">
        <span className="dkb-label">KG</span>
        <div className="dkb-chips">
          {['dbpedia','yago','wikidata'].map(kg => (
            <button key={kg} className={`dkb-chip${slot.kg===kg?' active':''}`}
              onClick={() => onChange({...slot, kg})}>
              <KgLogo kg={kg} size={12} style={{marginRight:3}} />{KG_LABELS[kg]}
            </button>
          ))}
        </div>
      </div>

      <div className="dkb-row">
        <span className="dkb-label">Source</span>
        <div className="dkb-chips">
          {SOURCE_OPTS.map(s => (
            <button key={s.value} className={`dkb-chip${slot.filterSource===s.value?' active':''}`}
              onClick={() => onChange({...slot, filterSource: s.value, filterMode: undefined, filterModel: undefined, filterVariant: undefined})}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>

      {slot.filterSource === 'shapes_generated' && (
        <div className="dkb-row dkb-row-selects">
          <div className="dkb-sel-group">
            <span className="dkb-label">Mode</span>
            <select className="dkb-select" value={slot.filterMode||''} onChange={e => onChange({...slot, filterMode: e.target.value||undefined})}>
              <option value="">All</option>
              {MODE_OPTS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div className="dkb-sel-group">
            <span className="dkb-label">Model</span>
            <select className="dkb-select" value={slot.filterModel||''} onChange={e => onChange({...slot, filterModel: e.target.value||undefined})}>
              <option value="">All</option>
              {MODEL_OPTS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
        </div>
      )}

      {slot.filterSource === 'ground-truth' && slot.kg === 'dbpedia' && (
        <div className="dkb-row">
          <span className="dkb-label">Variant</span>
          <select className="dkb-select" value={slot.filterVariant||''} onChange={e => onChange({...slot, filterVariant: e.target.value||undefined})}>
            <option value="">All</option>
            {DBP_VARIANTS.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      )}

      <div className="dkb-match">
        {shapes > 0
          ? <span className="dkb-match-ok">→ {shapes} shapes · {classes} classes</span>
          : <span className="dkb-match-empty">→ No shapes match</span>}
      </div>
    </div>
  );
}

// ── DeckBuilder ───────────────────────────────────────────
function DeckBuilder({ index, onSave, onClose, initialSlots = null }) {
  const [name, setName]               = useState('My Deck');
  const [icon, setIcon]               = useState('🃏');
  const [description, setDescription] = useState('');
  const [slots, setSlots] = useState(initialSlots ?? [{
    id: 's0', label: 'Slot 1', kg: 'dbpedia', icon: '👑',
    filterSource: 'ground-truth', filterVariant: 'dbpedia-aligned',
  }]);

  const updateSlot = (idx, upd) => setSlots(s => s.map((x,i) => i===idx ? upd : x));
  const addSlot    = () => setSlots(s => [...s, {
    id: `s${Date.now()}`, label: `Slot ${s.length+1}`, kg: 'dbpedia', icon: '📦', filterSource: 'ground-truth',
  }]);
  const removeSlot = (idx) => setSlots(s => s.filter((_,i) => i!==idx));

  const handleSave = () => {
    if (!name.trim() || slots.length === 0) return;
    const id = `user-${name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-+/g,'-')}-${Date.now()}`;
    const builtSlots = slots.map(s => ({
      id: s.id, label: s.label, kg: s.kg, icon: s.icon||'📦',
      color: KG_COLORS[s.kg] || '#475569', eval_run: '',
      filter: buildSlotFilter(s),
    }));
    const kgs = [...new Set(builtSlots.map(s => s.kg))];
    const classes = {};
    for (const kg of kgs) {
      const classSet = new Set();
      builtSlots.filter(s => s.kg === kg)
        .forEach(sl => index.filter(e => matchSlot(e, sl.filter)).forEach(e => classSet.add(e.class)));
      classes[kg] = [...classSet].sort();
    }
    const deck = {
      id, name: name.trim(), icon, color: KG_COLORS[kgs[0]] || '#475569',
      description, kgs, slots: builtSlots, classes, _userCreated: true,
    };
    localStorage.setItem(`shapedeck_${id}`, JSON.stringify(deck));
    onSave(deck);
  };

  const totalSlots   = slots.length;
  const totalClasses = useMemo(() => {
    const set = new Set();
    slots.forEach(s => index.filter(e => matchSlot(e, buildSlotFilter(s))).forEach(e => set.add(e.class)));
    return set.size;
  }, [slots, index]);

  return (
    <div className="dkb-root">
      <div className="dkb-header">
        <h2 className="dkb-title">＋ New Deck</h2>
        <button className="dk-back-btn" onClick={onClose}>✕ Cancel</button>
      </div>

      <div className="dkb-body">
        {/* Meta */}
        <div className="dkb-meta">
          <div className="dkb-row">
            <span className="dkb-label">Name</span>
            <input className="dkb-input" value={name} onChange={e => setName(e.target.value)} placeholder="Deck name" />
          </div>
          <div className="dkb-row">
            <span className="dkb-label">Icon</span>
            <input className="dkb-input dkb-input-icon" value={icon} onChange={e => setIcon(e.target.value)} maxLength={2} />
          </div>
          <div className="dkb-row">
            <span className="dkb-label">Description</span>
            <input className="dkb-input" value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional" />
          </div>
        </div>

        {/* Slots */}
        <div className="dkb-slots-header">
          <span className="dkb-section-title">Slots</span>
          <button className="dkb-add-slot" onClick={addSlot}>＋ Add Slot</button>
        </div>
        <div className="dkb-slots">
          {slots.map((s,i) => (
            <SlotEditor key={s.id} slot={s} index={index}
              onChange={upd => updateSlot(i, upd)}
              onRemove={() => removeSlot(i)} />
          ))}
        </div>
      </div>

      <div className="dkb-footer">
        <span className="dkb-summary">
          {totalSlots} slot{totalSlots!==1?'s':''} · {totalClasses} unique class{totalClasses!==1?'es':''}
        </span>
        <button className="dkb-save-btn" onClick={handleSave} disabled={!name.trim()||slots.length===0}>
          💾 Save Deck
        </button>
      </div>
    </div>
  );
}

// ── User-deck localStorage helpers ────────────────────────
function loadUserDecks() {
  const decks = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('shapedeck_')) {
      try { decks.push(JSON.parse(localStorage.getItem(key))); } catch {}
    }
  }
  return decks;
}

function deleteUserDeck(id) {
  localStorage.removeItem(`shapedeck_${id}`);
}

// ── Matrix helpers ────────────────────────────────────────
function buildMatrix(classes, slots, index) {
  const m = new Map();
  for (const cls of classes) {
    const row = new Map();
    for (const slot of slots)
      row.set(slot.id, index.find(e => e.class === cls && matchSlot(e, slot.filter)) ?? null);
    m.set(cls, row);
  }
  return m;
}

// ── Deck list card ────────────────────────────────────────
function DeckCard({ deck, onClick, onDelete }) {
  const deckLogo = DECK_LOGOS[deck.id];
  return (
    <div className="dk-box" onClick={onClick} style={{ '--dk-color': deck.color }}>
      <div className="dk-box-shine" />
      {deckLogo
        ? <img src={deckLogo} alt={deck.name} className="dk-box-logo" />
        : <div className="dk-box-icon">{deck.icon}</div>}
      <div className="dk-box-name">{deck.name}</div>
      <div className="dk-box-desc">{deck.description}</div>
      <div className="dk-box-meta">
        {deck.kgs?.map(kg => (
          <span key={kg} className="dk-kg-badge"
            style={{ background: KG_COLORS[kg]+'22', border: `1px solid ${KG_COLORS[kg]}55` }}>
            <KgLogo kg={kg} size={14} />
          </span>
        ))}
        <span className="dk-slot-count">{deck.slots_count ?? deck.slots?.length ?? 0} slots</span>
        {onDelete && (
          <button className="dk-delete-btn" title="Delete deck"
            onClick={e => { e.stopPropagation(); onDelete(deck.id); }}>🗑</button>
        )}
      </div>
    </div>
  );
}

// ── Deck detail ───────────────────────────────────────────
function ShapeCell({ entry, onLoad }) {
  if (!entry) return <td className="dk-cell dk-cell-empty"><span>—</span></td>;
  return (
    <td className="dk-cell dk-cell-present">
      <button className="dk-load-btn" onClick={() => onLoad(entry.path)} title={entry.path}>Load</button>
    </td>
  );
}

function DeckDetail({ deck, index, onLoad, onBack }) {
  const [activeKg, setActiveKg] = useState(deck.kgs?.[0] ?? 'dbpedia');
  const slots   = useMemo(() => deck.slots.filter(s => s.kg === activeKg), [deck, activeKg]);
  const classes = useMemo(() => deck.classes?.[activeKg] ?? [], [deck, activeKg]);
  const matrix  = useMemo(() => buildMatrix(classes, slots, index), [classes, slots, index]);

  const coverage = useMemo(() => {
    let filled = 0, total = 0;
    for (const row of matrix.values())
      for (const e of row.values()) { total++; if (e) filled++; }
    return { filled, total, pct: total ? Math.round((filled/total)*100) : 0 };
  }, [matrix]);

  return (
    <div className="dk-detail">
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

      <div className="dk-kg-tabs">
        {deck.kgs?.map(kg => (
          <button key={kg} className={`dk-kg-tab${activeKg===kg?' active':''}`}
            style={{ '--kgc': KG_COLORS[kg] }} onClick={() => setActiveKg(kg)}>
            <KgLogo kg={kg} size={16} style={{marginRight:4}} />
            <span className="dk-kg-tab-label">{KG_LABELS[kg]}</span>
            <span className="dk-kg-tab-count">{deck.classes?.[kg]?.length ?? 0}</span>
          </button>
        ))}
      </div>

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
                <tr key={cls} className={`dk-row${rowFilled===0?' dk-row-empty':''}`}>
                  <td className="dk-td-class">
                    <span className="dk-class-name">{cls}</span>
                    <span className="dk-class-cov">{rowFilled}/{slots.length}</span>
                  </td>
                  {slots.map(s => <ShapeCell key={s.id} entry={row.get(s.id)} onLoad={onLoad} />)}
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
export function DeckView({ onLoad, onBack, initialBuilder = null }) {
  const [serverDecks, setServerDecks] = useState([]);
  const [userDecks,   setUserDecks]   = useState(() => loadUserDecks());
  const [activeDeck,  setActiveDeck]  = useState(null);
  const [showBuilder, setShowBuilder] = useState(!!initialBuilder);
  const [index, setIndex] = useState([]);

  useEffect(() => {
    fetch('/decks/index.json').then(r => r.json()).then(setServerDecks).catch(() => {});
    fetch('/shapes/index.json').then(r => r.json()).then(setIndex).catch(() => {});
  }, []);

  const allDecks = useMemo(() => [...serverDecks, ...userDecks], [serverDecks, userDecks]);

  const handleSelectDeck = useCallback((summary) => {
    if (summary._userCreated) { setActiveDeck(summary); return; }
    fetch(`/decks/${summary.id}.json`).then(r => r.json()).then(setActiveDeck).catch(() => {});
  }, []);

  const handleSaveDeck = useCallback((deck) => {
    setUserDecks(loadUserDecks());
    setShowBuilder(false);
    setActiveDeck(deck);
  }, []);

  const handleDeleteDeck = useCallback((id) => {
    deleteUserDeck(id);
    setUserDecks(loadUserDecks());
    if (activeDeck?.id === id) setActiveDeck(null);
  }, [activeDeck]);

  if (showBuilder) {
    return (
      <div className="dk-root">
        <div className="dk-root-header">
          <img src="/img/logo.png" className="app-header-logo" alt="ShapeOfTheDecks" />
          {onBack && <button className="dk-back-btn" onClick={onBack} style={{marginRight:8}}>← Library</button>}
          <span className="dk-root-title">Shape of the Deck</span>
        </div>
        <DeckBuilder
          index={index}
          initialSlots={initialBuilder}
          onSave={handleSaveDeck}
          onClose={() => setShowBuilder(false)}
        />
      </div>
    );
  }

  return (
    <div className="dk-root">
      <div className="dk-root-header">
        {onBack && <button className="dk-back-btn" onClick={onBack} style={{marginRight:8}}>← Library</button>}
        <span className="dk-root-title">Shape of the Deck</span>
        <span className="dk-root-sub">Curated shape set collections for comparative analysis</span>
        <button className="dkb-new-btn" onClick={() => setShowBuilder(true)}>＋ New Deck</button>
      </div>

      {activeDeck ? (
        <DeckDetail deck={activeDeck} index={index} onLoad={onLoad} onBack={() => setActiveDeck(null)} />
      ) : (
        <div className="dk-list">
          {allDecks.length === 0 && <div className="dk-empty-state">No decks yet — click ＋ New Deck to create one.</div>}
          {allDecks.map(deck => (
            <DeckCard key={deck.id} deck={deck}
              onClick={() => handleSelectDeck(deck)}
              onDelete={deck._userCreated ? handleDeleteDeck : null} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Add-to-Deck dialog (used from ShapeLibrary selection bar) ────────────────
export function AddToDeckDialog({ selectedPaths, index, onSaved, onClose }) {
  const paths = useMemo(() => [...selectedPaths], [selectedPaths]);
  const [mode, setMode] = useState('new');
  const [deckName, setDeckName]   = useState('My Deck');
  const [slotName, setSlotName]   = useState('Selected Shapes');
  const [existingId, setExistingId] = useState('');
  const [newSlotName, setNewSlotName] = useState('Selected Shapes');

  const userDecks = useMemo(() => loadUserDecks(), []);

  const byKg = useMemo(() => {
    const m = {};
    for (const path of paths) {
      const e = index.find(x => x.path === path);
      if (e) m[e.kg] = (m[e.kg] || 0) + 1;
    }
    return m;
  }, [paths, index]);

  const kgsInPaths = useMemo(() =>
    [...new Set(paths.map(p => index.find(e => e.path === p)?.kg).filter(Boolean))],
    [paths, index]);

  const buildClassesMap = () => {
    const out = {};
    for (const kg of kgsInPaths) {
      out[kg] = [...new Set(
        paths.map(p => index.find(e => e.path === p))
          .filter(e => e?.kg === kg).map(e => e.class)
      )].sort();
    }
    return out;
  };

  const handleSave = () => {
    const slot = {
      id: `s${Date.now()}`, icon: '📌', color: '#475569', eval_run: '',
      filter: { paths },
      kg: kgsInPaths[0] || 'dbpedia',
    };
    const classes = buildClassesMap();

    if (mode === 'new') {
      slot.label = slotName;
      const id = `user-${deckName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
      const kg  = kgsInPaths[0] || 'dbpedia';
      const deck = {
        id, name: deckName.trim(), icon: '🃏',
        color: KG_COLORS[kg] || '#475569',
        description: `${paths.length} shapes picked from library`,
        kgs: kgsInPaths.length ? kgsInPaths : ['dbpedia'],
        slots: [slot], classes, _userCreated: true,
      };
      localStorage.setItem(`shapedeck_${id}`, JSON.stringify(deck));
      onSaved(deck);
    } else {
      if (!existingId) return;
      slot.label = newSlotName;
      let existing;
      try { existing = JSON.parse(localStorage.getItem(`shapedeck_${existingId}`)); } catch { return; }
      if (!existing) return;
      const mergedKgs = [...new Set([...existing.kgs, ...kgsInPaths])];
      const mergedCls = { ...existing.classes };
      for (const [kg, cls] of Object.entries(classes))
        mergedCls[kg] = [...new Set([...(mergedCls[kg] || []), ...cls])].sort();
      const updated = { ...existing, kgs: mergedKgs, slots: [...existing.slots, slot], classes: mergedCls };
      localStorage.setItem(`shapedeck_${existingId}`, JSON.stringify(updated));
      onSaved(updated);
    }
  };

  return (
    <div className="qs-overlay" onClick={onClose}>
      <div className="qs-dialog atd-dialog" onClick={e => e.stopPropagation()}>
        <div className="qs-title">📌 Add to Deck</div>
        <div className="atd-count">
          {paths.length} shape{paths.length !== 1 ? 's' : ''} selected
          {Object.entries(byKg).map(([kg, n]) => (
            <span key={kg} className="atd-kg-badge">
              <KgLogo kg={kg} size={12} style={{ marginRight: 2 }} />{n}
            </span>
          ))}
        </div>

        <div className="atd-mode-row">
          <button className={`atd-mode-btn${mode === 'new' ? ' active' : ''}`} onClick={() => setMode('new')}>
            ＋ New Deck
          </button>
          <button
            className={`atd-mode-btn${mode === 'existing' ? ' active' : ''}`}
            onClick={() => setMode('existing')}
            disabled={userDecks.length === 0}
            title={userDecks.length === 0 ? 'No saved decks yet' : undefined}
          >
            ↪ Add to Existing
          </button>
        </div>

        {mode === 'new' && (
          <>
            <label className="qs-label">Deck name
              <input className="dkb-input" value={deckName} onChange={e => setDeckName(e.target.value)} />
            </label>
            <label className="qs-label">Slot name
              <input className="dkb-input" value={slotName} onChange={e => setSlotName(e.target.value)} />
            </label>
          </>
        )}

        {mode === 'existing' && (
          <>
            <label className="qs-label">Deck
              <select className="dkb-select" value={existingId} onChange={e => setExistingId(e.target.value)}>
                <option value="">Choose a deck…</option>
                {userDecks.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </label>
            <label className="qs-label">New slot name
              <input className="dkb-input" value={newSlotName} onChange={e => setNewSlotName(e.target.value)} />
            </label>
          </>
        )}

        <div className="qs-actions">
          <button className="dk-back-btn" onClick={onClose}>Cancel</button>
          <button className="dkb-save-btn"
            onClick={handleSave}
            disabled={mode === 'new' ? !deckName.trim() : !existingId}>
            💾 Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Quick Save dialog (used from ShapeLibrary) ────────────
export function QuickSaveDeckDialog({ filters, index, onSaved, onClose }) {
  const [name, setName] = useState('My Deck');
  const [slotLabel, setSlotLabel] = useState(() => {
    const parts = [];
    if (filters.source !== 'all') parts.push(filters.source === 'ground-truth' ? 'GT' : filters.source === 'shexer' ? 'ShExer' : filters.source === 'kastor' ? 'Kastor' : 'LLM');
    if (filters.kg !== 'all') parts.push(KG_LABELS[filters.kg] ?? filters.kg);
    if (filters.model !== 'all') parts.push(filters.model);
    return parts.join(' ') || 'Slot 1';
  });

  const matchCount = useMemo(() => {
    return index.filter(e => {
      if (filters.kg !== 'all' && e.kg !== filters.kg) return false;
      if (filters.source !== 'all') {
        if (filters.source === 'ground-truth' && e.source !== 'ground-truth') return false;
        if (filters.source === 'generated'    && e.source !== 'shapes_generated') return false;
        if (filters.source === 'shexer'       && e.source !== 'shexer') return false;
        if (filters.source === 'kastor'       && e.source !== 'kastor') return false;
      }
      if (filters.mode  !== 'all' && e.gen_mode !== filters.mode) return false;
      if (filters.model !== 'all' && e.model    !== filters.model) return false;
      return true;
    }).length;
  }, [filters, index]);

  const handleSave = () => {
    const id = `user-${name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${Date.now()}`;
    const filter = {};
    if (filters.kg !== 'all')     filter.kg     = filters.kg;
    if (filters.source === 'ground-truth')    filter.source = 'ground-truth';
    if (filters.source === 'generated')       filter.source = 'shapes_generated';
    if (filters.source === 'shexer')          filter.source = 'shexer';
    if (filters.source === 'kastor')          filter.source = 'kastor';
    if (filters.mode  !== 'all')  filter.gen_mode = filters.mode;
    if (filters.model !== 'all')  filter.model    = filters.model;

    const kg = filters.kg !== 'all' ? filters.kg : 'dbpedia';
    const matches = index.filter(e => matchSlot(e, filter));
    const classes = { [kg]: [...new Set(matches.map(e => e.class))].sort() };

    const deck = {
      id, name: name.trim(), icon: '🃏',
      color: KG_COLORS[kg] || '#475569',
      description: `Created from library filter`,
      kgs: [kg],
      slots: [{ id:'s0', label: slotLabel, kg, icon:'📦', color: KG_COLORS[kg]||'#475569', eval_run:'', filter }],
      classes, _userCreated: true,
    };
    localStorage.setItem(`shapedeck_${id}`, JSON.stringify(deck));
    onSaved(deck);
  };

  return (
    <div className="qs-overlay" onClick={onClose}>
      <div className="qs-dialog" onClick={e => e.stopPropagation()}>
        <div className="qs-title">📦 Save as Deck</div>
        <div className="qs-count">{matchCount} shapes will be in the slot</div>
        <label className="qs-label">Deck name
          <input className="dkb-input" value={name} onChange={e => setName(e.target.value)} />
        </label>
        <label className="qs-label">Slot name
          <input className="dkb-input" value={slotLabel} onChange={e => setSlotLabel(e.target.value)} />
        </label>
        <div className="qs-actions">
          <button className="dk-back-btn" onClick={onClose}>Cancel</button>
          <button className="dkb-save-btn" onClick={handleSave} disabled={!name.trim()}>💾 Save</button>
        </div>
      </div>
    </div>
  );
}
