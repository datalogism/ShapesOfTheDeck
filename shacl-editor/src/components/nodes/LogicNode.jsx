import { Handle, Position, useNodes, useEdges, useReactFlow } from '@xyflow/react';
import { LOGIC_OPERATORS } from '../../data/shaclConstraints';

function TypeBadge({ constraints }) {
  const dtype = constraints['sh:datatype'];
  const cls   = constraints['sh:class'];
  const nk    = constraints['sh:nodeKind'];
  if (dtype) return <span className="vns-type literal">{dtype.replace(/^(xsd:|rdf:)/, '')}</span>;
  if (cls)   return <span className="vns-type iri">{cls}</span>;
  if (nk)    return <span className="vns-type iri">{nk.replace('sh:', '')}</span>;
  return null;
}

function CardBadge({ constraints }) {
  const min = constraints['sh:minCount'];
  const max = constraints['sh:maxCount'];
  if (min === undefined && max === undefined) return null;
  const label = min === max ? `[${min}]` : `[${min ?? '0'}..${max ?? '*'}]`;
  return <span className="vns-card">{label}</span>;
}

export function LogicNode({ id, data, selected }) {
  const { setNodes } = useReactFlow();
  const allNodes = useNodes();
  const allEdges = useEdges();
  const op = LOGIC_OPERATORS.find(o => o.id === data.operator) || LOGIC_OPERATORS[0];
  const collapsed = !!data.collapsed;
  const isVOWL = data.graphMode === 'vowl';

  const childEdges = allEdges.filter(e => e.source === id);
  const propertyNodes = childEdges
    .map(e => allNodes.find(n => n.id === e.target))
    .filter(n => n?.type === 'propertyShape');

  const toggle = (e) => {
    e.stopPropagation();
    setNodes(ns => ns.map(n =>
      n.id === id ? { ...n, data: { ...n.data, collapsed: !collapsed } } : n
    ));
  };

  // VOWL mode: classic diamond
  if (isVOWL) {
    return (
      <div className={`vowl-logic-outer${selected ? ' vowl-selected' : ''}`}>
        <Handle type="target" position={Position.Top} id="in" />
        <div
          className="vowl-logic-diamond"
          style={{ borderColor: op.color, background: op.bg }}
        >
          <span className="vowl-logic-label" style={{ color: op.color }}>
            {op.label}
          </span>
        </div>
        <Handle type="source" position={Position.Bottom} id="out" />
      </div>
    );
  }

  // UML mode: flat node with embedded property list
  return (
    <div
      className={`vowl-logic-node${selected ? ' vowl-selected' : ''}${collapsed ? ' vowl-ns-collapsed' : ''}`}
      style={{ borderColor: op.color, minWidth: 180 }}
    >
      <Handle type="target" position={Position.Top}    id="in"    />
      <Handle type="source" position={Position.Right}  id="right" style={{ top: '50%' }} />
      <Handle type="source" position={Position.Left}   id="left"  style={{ top: '50%' }} />
      <Handle type="source" position={Position.Bottom} id="out"   />

      {/* Header */}
      <div className="vln-header" style={{ background: op.color }}>
        <span className="vln-badge">{op.label}</span>
        <span className="vln-desc">{op.description}</span>
        <button className="vowl-collapse-btn" onClick={toggle} title={collapsed ? 'Expand' : 'Collapse'}>
          {collapsed ? '+' : '–'}
        </button>
      </div>

      {/* Property rows */}
      {!collapsed && (
        propertyNodes.length > 0 ? (
          <div className="vns-props-wrapper">
            <table className="vns-props-table">
              <tbody>
                {propertyNodes.map(ps => (
                  <tr
                    key={ps.id}
                    className={`vns-prop-row${data.selectedPropertyId === ps.id ? ' vns-prop-selected' : ''}`}
                    onClick={e => { e.stopPropagation(); data.onSelectProperty?.(ps.id); }}
                  >
                    <td className="vns-prop-path">
                      <span className="vln-bn-marker">[ ]</span>
                      {ps.data.path || <em>?</em>}
                    </td>
                    <td className="vns-prop-type">
                      <TypeBadge constraints={ps.data.constraints || {}} />
                      <CardBadge constraints={ps.data.constraints || {}} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="vns-no-props">No properties — connect PropertyShape nodes</div>
        )
      )}

      {collapsed && propertyNodes.length > 0 && (
        <div className="vns-collapsed-count">{propertyNodes.length} propert{propertyNodes.length !== 1 ? 'ies' : 'y'}</div>
      )}
    </div>
  );
}
