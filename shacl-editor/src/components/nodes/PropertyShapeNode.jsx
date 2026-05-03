import { Handle, Position } from '@xyflow/react';
import { topicColor } from '../../utils/topicColors';

function isLiteral(constraints) {
  return !!constraints['sh:datatype'];
}

function getTypeLabel(data) {
  const c = data.constraints || {};
  if (c['sh:datatype']) return c['sh:datatype'].replace(/^(xsd:|rdf:)/, '');
  if (c['sh:class'])    return c['sh:class'];
  if (c['sh:node'])     return c['sh:node'];
  if (c['sh:nodeKind']) return c['sh:nodeKind'].replace('sh:', '');
  return null;
}

function getExtraCount(data) {
  const c = data.constraints || {};
  const skip = new Set(['sh:datatype', 'sh:class', 'sh:node', 'sh:nodeKind', 'sh:minCount', 'sh:maxCount']);
  return Object.keys(c).filter(k => !skip.has(k) && c[k] !== '' && c[k] != null).length;
}

export function PropertyShapeNode({ data, selected }) {
  const constraints = data.constraints || {};
  const literal = isLiteral(constraints);
  const typeLabel = getTypeLabel(data);
  const extraCount = getExtraCount(data);
  const path = data.path || '';
  const topic = data.effectiveTopic || data.topic || '';

  const minCount = constraints['sh:minCount'];
  const maxCount = constraints['sh:maxCount'];
  let cardinality = null;
  if (minCount !== undefined || maxCount !== undefined) {
    const min = minCount ?? '0';
    const max = maxCount ?? '*';
    cardinality = min === max ? `[${min}]` : `[${min}..${max}]`;
  }

  const shapeClass = literal ? 'vowl-literal-node' : 'vowl-iri-node';
  const innerClass = literal ? 'vowl-literal-inner' : 'vowl-iri-inner';
  const tc = topicColor(topic);

  return (
    <div
      className={`${shapeClass}${selected ? ' vowl-selected' : ''}`}
      style={tc ? { borderColor: tc, boxShadow: `0 0 0 2px ${tc}40` } : {}}
    >
      <Handle type="target" position={Position.Top} id="in" />
      <div className={innerClass}>
        {topic && (
          <span
            className="vowl-topic-dot"
            style={{ background: tc }}
            title={topic}
          />
        )}
        {path && <span className="vowl-path-label">{path}</span>}
        {!path && <span className="vowl-value-unknown">●</span>}
        {typeLabel && <span className="vowl-value-type">{typeLabel}</span>}
        {cardinality && <span className="vowl-cardinality-badge">{cardinality}</span>}
        {extraCount > 0 && <span className="vowl-extra-badge">+{extraCount}</span>}
      </div>
      <Handle type="source" position={Position.Bottom} id="out" />
    </div>
  );
}
