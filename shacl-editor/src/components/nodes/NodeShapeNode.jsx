import { Handle, Position, useReactFlow, useNodes, useEdges } from '@xyflow/react';
import { topicColor, topicColorAlpha } from '../../utils/topicColors';

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

// Group array of property nodes by topic, preserving order
function groupByTopic(propertyNodes) {
  const groups = [];
  let current = null;
  for (const ps of propertyNodes) {
    const t = ps.data.topic || '';
    if (!current || current.topic !== t) {
      current = { topic: t, props: [] };
      groups.push(current);
    }
    current.props.push(ps);
  }
  return groups;
}

export function NodeShapeNode({ id, data, selected }) {
  const { setNodes } = useReactFlow();
  const allNodes = useNodes();
  const allEdges = useEdges();
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

  // VOWL mode: compact rounded rect
  if (isVOWL) {
    return (
      <div className={`vowl-node-shape${selected ? ' vowl-selected' : ''}${collapsed ? ' vowl-ns-collapsed' : ''}`}
           style={{ minWidth: 130 }}>
        <Handle type="target" position={Position.Top}    id="in"    />
        <Handle type="source" position={Position.Right}  id="right" style={{ top: '50%' }} />
        <Handle type="source" position={Position.Left}   id="left"  style={{ top: '50%' }} />
        <Handle type="source" position={Position.Bottom} id="out"   />
        <div className="vowl-ns-inner">
          <div className="vowl-ns-title-row">
            <span className="vowl-ns-name">{data.label || 'Shape'}</span>
            <button className="vowl-collapse-btn" onClick={toggle} title={collapsed ? 'Expand' : 'Collapse'}>
              {collapsed ? '+' : '–'}
            </button>
          </div>
          {!collapsed && data.targetClass && (
            <div className="vowl-ns-class">
              <span className="vowl-ns-class-arrow">▶</span>
              {data.targetClass}
            </div>
          )}
        </div>
      </div>
    );
  }

  // UML mode: filter by active topics (nodes with no topic always shown)
  const visibleProps = data.activeTopics
    ? propertyNodes.filter(p => !p.data.topic || data.activeTopics.has(p.data.topic))
    : propertyNodes;

  const hasTopics = visibleProps.some(p => p.data.topic);
  const groups = hasTopics ? groupByTopic(visibleProps) : [{ topic: '', props: visibleProps }];

  return (
    <div className={`vowl-node-shape${selected ? ' vowl-selected' : ''}${collapsed ? ' vowl-ns-collapsed' : ''}`}
         style={{ minWidth: 200 }}>
      <Handle type="target" position={Position.Top}    id="in"    />
      <Handle type="source" position={Position.Right}  id="right" style={{ top: '50%' }} />
      <Handle type="source" position={Position.Left}   id="left"  style={{ top: '50%' }} />
      <Handle type="source" position={Position.Bottom} id="out"   />

      {/* Header */}
      <div className="vns-header">
        <span className="vns-name">{data.label || 'Shape'}</span>
        {data.targetClass && <span className="vns-target">{data.targetClass}</span>}
        <button className="vowl-collapse-btn" onClick={toggle} title={collapsed ? 'Expand' : 'Collapse'}>
          {collapsed ? '+' : '–'}
        </button>
      </div>

      {/* Property table */}
      {!collapsed && (
        propertyNodes.length > 0 ? (
          <div className="vns-props-wrapper">
            <table className="vns-props-table">
              <tbody>
                {groups.map((group, gi) => (
                  <>
                    {group.topic && (
                      <tr key={`topic-${gi}`} className="vns-topic-row">
                        <td colSpan={2}
                          style={{
                            background: topicColorAlpha(group.topic, 0.18),
                            borderLeft: `3px solid ${topicColor(group.topic)}`,
                          }}
                        >
                          <span className="vns-topic-label">{group.topic}</span>
                        </td>
                      </tr>
                    )}
                    {group.props.map(ps => (
                      <tr
                        key={ps.id}
                        className={`vns-prop-row${data.selectedPropertyId === ps.id ? ' vns-prop-selected' : ''}`}
                        onClick={e => { e.stopPropagation(); data.onSelectProperty?.(ps.id); }}
                        style={group.topic ? { borderLeft: `3px solid ${topicColor(group.topic)}20` } : {}}
                      >
                        <td className="vns-prop-path">{ps.data.path || <em>?</em>}</td>
                        <td className="vns-prop-type">
                          <TypeBadge constraints={ps.data.constraints || {}} />
                          <CardBadge constraints={ps.data.constraints || {}} />
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="vns-no-props">No properties — connect PropertyShape nodes</div>
        )
      )}

      {collapsed && propertyNodes.length > 0 && (
        <div className="vns-collapsed-count">
          {visibleProps.length < propertyNodes.length
            ? `${visibleProps.length} / ${propertyNodes.length} properties`
            : `${propertyNodes.length} propert${propertyNodes.length !== 1 ? 'ies' : 'y'}`}
        </div>
      )}
    </div>
  );
}
