import { useState } from 'react';
import { AVAILABLE_CONSTRAINTS, CONSTRAINT_CATEGORIES, LOGIC_OPERATORS } from '../data/shaclConstraints';
import { shortenIRI } from '../utils/ontologyLoader';

function ConstraintField({ constraintDef, value, onChange, onRemove, suggestions }) {
  const listId = suggestions?.length ? `dl-${constraintDef.id.replace(/\W/g, '')}` : null;

  const renderInput = () => {
    if (constraintDef.type === 'select') {
      return (
        <select value={value} onChange={e => onChange(e.target.value)} className="constraint-input">
          <option value="">—</option>
          {constraintDef.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    }
    if (constraintDef.type === 'boolean') {
      return (
        <select value={value} onChange={e => onChange(e.target.value)} className="constraint-input">
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      );
    }
    return (
      <>
        <input
          type={constraintDef.type === 'integer' || constraintDef.type === 'number' ? 'number' : 'text'}
          value={value}
          placeholder={constraintDef.placeholder || ''}
          onChange={e => onChange(e.target.value)}
          className="constraint-input"
          list={listId || undefined}
        />
        {listId && (
          <datalist id={listId}>
            {suggestions.map(s => <option key={s} value={s} />)}
          </datalist>
        )}
      </>
    );
  };

  return (
    <div className="constraint-row">
      <span className="constraint-key">{constraintDef.id}</span>
      {renderInput()}
      <button className="btn-remove" onClick={onRemove} title="Remove">×</button>
    </div>
  );
}

function AddConstraintMenu({ activeKeys, onAdd }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const available = AVAILABLE_CONSTRAINTS.filter(
    c => !activeKeys.includes(c.id) &&
      (search === '' || c.id.toLowerCase().includes(search.toLowerCase()) || c.label.toLowerCase().includes(search.toLowerCase()))
  );

  const byCategory = CONSTRAINT_CATEGORIES.reduce((acc, cat) => {
    const items = available.filter(c => c.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div className="add-constraint-wrapper">
      <button className="btn-add" onClick={() => setOpen(o => !o)}>
        + Add constraint
      </button>
      {open && (
        <div className="constraint-menu">
          <input
            autoFocus
            className="constraint-search"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="constraint-menu-list">
            {Object.entries(byCategory).map(([cat, items]) => (
              <div key={cat}>
                <div className="menu-category">{cat}</div>
                {items.map(c => (
                  <button
                    key={c.id}
                    className="menu-item"
                    onClick={() => { onAdd(c); setOpen(false); setSearch(''); }}
                  >
                    <span className="menu-item-id">{c.id}</span>
                    <span className="menu-item-label">{c.label}</span>
                  </button>
                ))}
              </div>
            ))}
            {Object.keys(byCategory).length === 0 && (
              <div className="menu-empty">No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ConstraintPanel({ node, onUpdate, onClose, prefixes = {}, ontologies = [] }) {
  // Build suggestion lists from loaded ontologies
  const allClasses = ontologies.flatMap(o => o.classes.map(c => shortenIRI(c.iri, prefixes)));
  const allProps   = ontologies.flatMap(o => o.properties.map(p => shortenIRI(p.iri, prefixes)));
  const SUGGESTIONS = {
    'sh:class':       allClasses,
    'sh:node':        allClasses,
    'sh:targetClass': allClasses,
    'sh:path':        allProps,
  };
  if (!node) {
    return (
      <div className="panel panel-empty">
        <p>Select a node to edit its properties.</p>
      </div>
    );
  }

  const isNodeShape = node.type === 'nodeShape';
  const isLogic = node.type === 'logicNode';

  const updateData = (patch) => onUpdate(node.id, patch);

  if (isLogic) {
    const currentOp = LOGIC_OPERATORS.find(o => o.id === node.data.operator) || LOGIC_OPERATORS[0];
    return (
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Logic Operator</span>
          <button className="panel-close" onClick={onClose}>×</button>
        </div>
        <div className="panel-section">
          <div className="section-title">Operator type</div>
          <div className="logic-operator-grid">
            {LOGIC_OPERATORS.map(op => (
              <button
                key={op.id}
                className={`logic-op-btn${op.id === currentOp.id ? ' active' : ''}`}
                style={op.id === currentOp.id
                  ? { background: op.color, borderColor: op.color, color: '#fff' }
                  : { borderColor: op.color, color: op.color }
                }
                onClick={() => updateData({ operator: op.id })}
                title={op.description}
              >
                {op.label}
              </button>
            ))}
          </div>
          <p className="logic-desc-large" style={{ marginTop: 10 }}>{currentOp.description}</p>
        </div>
        <div className="panel-section">
          <p className="help-text">
            In list view: use the <strong>+ Property in {currentOp.label}</strong> button under this group.<br />
            In graph view: connect nodes with edges.
          </p>
        </div>
      </div>
    );
  }

  if (isNodeShape) {
    return (
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Node Shape</span>
          <button className="panel-close" onClick={onClose}>×</button>
        </div>
        <div className="panel-section">
          <label className="field-label-row">
            Shape name
            <input
              className="constraint-input full"
              value={node.data.label || ''}
              placeholder="PersonShape"
              onChange={e => updateData({ label: e.target.value })}
            />
          </label>
          <label className="field-label-row">
            sh:targetClass
            <input
              className="constraint-input full"
              value={node.data.targetClass || ''}
              placeholder="foaf:Person"
              onChange={e => updateData({ targetClass: e.target.value })}
              list="dl-targetClass"
            />
            {allClasses.length > 0 && (
              <datalist id="dl-targetClass">
                {allClasses.map(c => <option key={c} value={c} />)}
              </datalist>
            )}
          </label>
        </div>
        <div className="panel-section">
          <p className="help-text">Connect PropertyShapes or logic operators from this node using edges.</p>
        </div>
      </div>
    );
  }

  // PropertyShape panel
  const constraints = node.data.constraints || {};
  const activeKeys = Object.keys(constraints);

  const handleConstraintChange = (key, value) => {
    updateData({ constraints: { ...constraints, [key]: value } });
  };

  const handleRemoveConstraint = (key) => {
    const next = { ...constraints };
    delete next[key];
    updateData({ constraints: next });
  };

  const handleAddConstraint = (constraintDef) => {
    const defaultVal = constraintDef.type === 'boolean' ? 'true'
      : constraintDef.type === 'select' ? (constraintDef.options?.[0] || '')
      : '';
    updateData({ constraints: { ...constraints, [constraintDef.id]: defaultVal } });
  };

  const byCategory = CONSTRAINT_CATEGORIES.reduce((acc, cat) => {
    const items = activeKeys
      .filter(k => {
        const def = AVAILABLE_CONSTRAINTS.find(c => c.id === k);
        return def?.category === cat;
      })
      .map(k => ({ key: k, def: AVAILABLE_CONSTRAINTS.find(c => c.id === k) }))
      .filter(x => x.def);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  const unknownKeys = activeKeys.filter(k => !AVAILABLE_CONSTRAINTS.find(c => c.id === k));

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Property Shape</span>
        <button className="panel-close" onClick={onClose}>×</button>
      </div>

      <div className="panel-section">
        <label className="field-label-row">
          sh:path
          <input
            className="constraint-input full"
            value={node.data.path || ''}
            placeholder="foaf:name"
            onChange={e => updateData({ path: e.target.value })}
            list="dl-path"
          />
          {allProps.length > 0 && (
            <datalist id="dl-path">
              {allProps.map(p => <option key={p} value={p} />)}
            </datalist>
          )}
        </label>
      </div>

      <div className="panel-section">
        <div className="section-title">Constraints</div>

        {Object.entries(byCategory).map(([cat, items]) => (
          <div key={cat} className="constraint-group">
            <div className="group-title">{cat}</div>
            {items.map(({ key, def }) => (
              <ConstraintField
                key={key}
                constraintDef={def}
                value={constraints[key]}
                onChange={v => handleConstraintChange(key, v)}
                onRemove={() => handleRemoveConstraint(key)}
                suggestions={SUGGESTIONS[key] || []}
              />
            ))}
          </div>
        ))}

        {unknownKeys.length > 0 && (
          <div className="constraint-group">
            <div className="group-title">Other</div>
            {unknownKeys.map(k => (
              <div key={k} className="constraint-row">
                <span className="constraint-key">{k}</span>
                <input
                  className="constraint-input"
                  value={constraints[k]}
                  onChange={e => handleConstraintChange(k, e.target.value)}
                />
                <button className="btn-remove" onClick={() => handleRemoveConstraint(k)}>×</button>
              </div>
            ))}
          </div>
        )}

        {activeKeys.length === 0 && (
          <div className="empty-state">No constraints yet. Add one below.</div>
        )}
      </div>

      <div className="panel-section">
        <AddConstraintMenu activeKeys={activeKeys} onAdd={handleAddConstraint} />
      </div>
    </div>
  );
}
