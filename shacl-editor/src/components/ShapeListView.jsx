import { useState } from 'react';
import { LOGIC_OPERATORS } from '../data/shaclConstraints';
import { topicColor, topicColorAlpha } from '../utils/topicColors';

function ConstraintChip({ label, value }) {
  return (
    <span className="chip">
      <span className="chip-key">{label.replace('sh:', '')}</span>
      <span className="chip-val">{String(value)}</span>
    </span>
  );
}

function PropertyRow({ node, selected, onClick }) {
  const [expanded, setExpanded] = useState(false);
  const constraints = node.data.constraints || {};
  const entries = Object.entries(constraints).filter(([, v]) => v !== '' && v != null);
  const PREVIEW = 3;
  const hasMore = entries.length > PREVIEW;
  const visible = expanded ? entries : entries.slice(0, PREVIEW);

  return (
    <tr
      className={`prop-row${selected ? ' prop-row-selected' : ''}`}
      onClick={() => onClick(node.id)}
    >
      <td className="cell-path">
        <span className="path-label">{node.data.path || <em className="muted">?</em>}</span>
      </td>
      <td className="cell-constraints">
        {entries.length === 0
          ? <span className="muted-italic">No constraints</span>
          : (
            <>
              {visible.map(([k, v]) => <ConstraintChip key={k} label={k} value={v} />)}
              {hasMore && (
                <button
                  className="btn-expand-chips"
                  onClick={e => { e.stopPropagation(); setExpanded(x => !x); }}
                  title={expanded ? 'Show less' : `Show ${entries.length - PREVIEW} more`}
                >
                  {expanded ? '▴ less' : `+${entries.length - PREVIEW} ▾`}
                </button>
              )}
            </>
          )
        }
      </td>
    </tr>
  );
}

function AddLogicMenu({ onAdd }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button className="btn-add-prop" onClick={() => setOpen(o => !o)}>
        + Logic group ▾
      </button>
      {open && (
        <div className="logic-add-menu">
          {LOGIC_OPERATORS.map(op => (
            <button
              key={op.id}
              className="logic-add-item"
              onClick={() => { onAdd(op.id); setOpen(false); }}
            >
              <span className="logic-inline-badge" style={{ background: op.color }}>{op.label}</span>
              <span className="logic-add-desc">{op.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LogicGroup({ logicNode, children, selectedId, onSelectLogic, onSelectProp, onAddPropToLogic }) {
  const [collapsed, setCollapsed] = useState(false);
  const op = LOGIC_OPERATORS.find(o => o.id === logicNode.data.operator) || LOGIC_OPERATORS[0];
  const isSelected = selectedId === logicNode.id;

  return (
    <>
      <tr
        className={`logic-group-header${isSelected ? ' logic-group-selected' : ''}`}
        onClick={() => onSelectLogic(logicNode.id)}
        title="Click to select / edit this operator"
      >
        <td colSpan={2}>
          <div className="logic-group-header-inner">
            <button
              className="btn-collapse-inline"
              onClick={e => { e.stopPropagation(); setCollapsed(c => !c); }}
              title={collapsed ? 'Expand' : 'Collapse'}
            >
              {collapsed ? '▸' : '▾'}
            </button>
            <span className="logic-inline-badge" style={{ background: op.color }}>{op.label}</span>
            <span className="logic-inline-desc">{op.description}</span>
            <span className="logic-child-count">{children.length} propert{children.length !== 1 ? 'ies' : 'y'}</span>
            <span className="logic-edit-hint">click to edit</span>
          </div>
        </td>
      </tr>

      {!collapsed && children.map((child, idx) => (
        <tr
          key={child.id}
          className={`prop-row prop-row-indented${selectedId === child.id ? ' prop-row-selected' : ''}`}
          onClick={e => { e.stopPropagation(); onSelectProp(child.id); }}
        >
          <td className="cell-path">
            <span className="logic-bn-label" title="blank node">_:b{idx}</span>
            <span className="path-label">{child.data.path || <em className="muted">?</em>}</span>
          </td>
          <td className="cell-constraints">
            {Object.entries(child.data.constraints || {})
              .filter(([, v]) => v !== '' && v != null)
              .map(([k, v]) => <ConstraintChip key={k} label={k} value={v} />)
            }
          </td>
        </tr>
      ))}

      {!collapsed && (
        <tr className="logic-group-footer">
          <td colSpan={2}>
            <button
              className="btn-add-prop btn-add-in-logic"
              onClick={e => { e.stopPropagation(); onAddPropToLogic(logicNode.id); }}
            >
              + Property in {op.label}
            </button>
          </td>
        </tr>
      )}
    </>
  );
}

// A collapsible topic panel inside a shape card
function TopicPanel({ topic, props, selectedId, onSelectNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const color = topicColor(topic);

  return (
    <div className="topic-panel" style={{ borderLeftColor: color }}>
      <div
        className="topic-panel-header"
        style={{ background: topicColorAlpha(topic, 0.12) }}
        onClick={() => setCollapsed(c => !c)}
      >
        <span className="topic-panel-dot" style={{ background: color }} />
        <span className="topic-panel-name">{topic}</span>
        <span className="topic-panel-count">{props.length}</span>
        <span className="topic-panel-toggle">{collapsed ? '▸' : '▾'}</span>
      </div>
      {!collapsed && (
        <table className="prop-table">
          <tbody>
            {props.map(ps => (
              <PropertyRow
                key={ps.id}
                node={ps}
                selected={selectedId === ps.id}
                onClick={onSelectNode}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export function ShapeListView({ nodes, edges, selectedNodeId, onSelectNode, onAddProperty, onAddLogicToShape, onAddPropertyToLogic }) {
  const [collapsedShapes, setCollapsedShapes] = useState(new Set());

  const toggleShape = (id) => setCollapsedShapes(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const edgesBySource = {};
  for (const e of edges) {
    edgesBySource[e.source] = edgesBySource[e.source] || [];
    edgesBySource[e.source].push(e.target);
  }

  const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));
  const nodeShapes = nodes.filter(n => n.type === 'nodeShape');

  if (nodeShapes.length === 0) {
    return (
      <div className="listview-empty">
        <p>No shapes yet. Add a <strong>NodeShape</strong> from the toolbar.</p>
      </div>
    );
  }

  return (
    <div className="listview-root">
      {nodeShapes.map(ns => {
        const isCollapsed = collapsedShapes.has(ns.id);
        const childIds = edgesBySource[ns.id] || [];
        const directProps = childIds.map(id => nodeById[id]).filter(n => n?.type === 'propertyShape');
        const logicGroups = childIds.map(id => nodeById[id]).filter(n => n?.type === 'logicNode');
        const totalProps = directProps.length + logicGroups.reduce((acc, lg) => {
          return acc + (edgesBySource[lg.id] || []).filter(id => nodeById[id]?.type === 'propertyShape').length;
        }, 0);

        // Group direct props by topic
        const hasTopics = directProps.some(p => p.data.topic);
        const topicGroups = [];
        if (hasTopics) {
          let currentGroup = null;
          for (const ps of directProps) {
            const t = ps.data.topic || '';
            if (!currentGroup || currentGroup.topic !== t) {
              currentGroup = { topic: t, props: [] };
              topicGroups.push(currentGroup);
            }
            currentGroup.props.push(ps);
          }
        }

        return (
          <div key={ns.id} className="shape-card">
            <div
              className={`shape-card-header${selectedNodeId === ns.id ? ' selected' : ''}`}
              onClick={() => onSelectNode(ns.id)}
            >
              <button
                className="btn-collapse-shape"
                onClick={e => { e.stopPropagation(); toggleShape(ns.id); }}
                title={isCollapsed ? 'Expand' : 'Collapse'}
              >
                {isCollapsed ? '▸' : '▾'}
              </button>
              <div className="shape-name">
                <span className="shape-icon">◈</span>
                {ns.data.label || 'Shape'}
              </div>
              {ns.data.targetClass && (
                <div className="shape-target">
                  <span className="chip-key">sh:targetClass</span>
                  <span className="chip-val">{ns.data.targetClass}</span>
                </div>
              )}
              <span className="shape-prop-count">{totalProps} prop{totalProps !== 1 ? 's' : ''}</span>
              {hasTopics && (
                <span className="shape-topic-count">{topicGroups.filter(g => g.topic).length} topics</span>
              )}
            </div>

            {!isCollapsed && (
              <>
                {/* Topic panels for direct properties */}
                {hasTopics ? (
                  <div className="topic-panels-wrapper">
                    {topicGroups.map((group, gi) =>
                      group.topic ? (
                        <TopicPanel
                          key={group.topic + gi}
                          topic={group.topic}
                          props={group.props}
                          selectedId={selectedNodeId}
                          onSelectNode={onSelectNode}
                        />
                      ) : (
                        // Untopiced properties
                        <div key={'notopic-' + gi} className="prop-table-wrapper">
                          <table className="prop-table">
                            <tbody>
                              {group.props.map(ps => (
                                <PropertyRow
                                  key={ps.id}
                                  node={ps}
                                  selected={selectedNodeId === ps.id}
                                  onClick={onSelectNode}
                                />
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  directProps.length > 0 && (
                    <div className="prop-table-wrapper">
                      <table className="prop-table">
                        <thead>
                          <tr>
                            <th className="th-path">sh:path</th>
                            <th className="th-constraints">Constraints</th>
                          </tr>
                        </thead>
                        <tbody>
                          {directProps.map(ps => (
                            <PropertyRow
                              key={ps.id}
                              node={ps}
                              selected={selectedNodeId === ps.id}
                              onClick={onSelectNode}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}

                {/* Logic groups always at bottom */}
                {logicGroups.length > 0 && (
                  <div className="prop-table-wrapper">
                    <table className="prop-table">
                      <tbody>
                        {logicGroups.map(lg => {
                          const lgChildIds = edgesBySource[lg.id] || [];
                          const lgProps = lgChildIds.map(id => nodeById[id]).filter(n => n?.type === 'propertyShape');
                          return (
                            <LogicGroup
                              key={lg.id}
                              logicNode={lg}
                              children={lgProps}
                              selectedId={selectedNodeId}
                              onSelectLogic={onSelectNode}
                              onSelectProp={onSelectNode}
                              onAddPropToLogic={onAddPropertyToLogic}
                            />
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {directProps.length === 0 && logicGroups.length === 0 && (
                  <div className="prop-table-wrapper">
                    <table className="prop-table">
                      <tbody>
                        <tr><td colSpan={2} className="cell-empty">No linked property shapes.</td></tr>
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="shape-card-footer">
                  <button className="btn-add-prop" onClick={() => onAddProperty(ns.id)}>
                    + Property
                  </button>
                  <AddLogicMenu onAdd={(opId) => onAddLogicToShape(ns.id, opId)} />
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
