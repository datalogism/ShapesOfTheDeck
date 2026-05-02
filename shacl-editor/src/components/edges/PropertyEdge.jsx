import { BaseEdge, EdgeLabelRenderer, getBezierPath, useNodes } from '@xyflow/react';

export function PropertyEdge({
  id, source, target,
  sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  markerEnd, selected,
}) {
  const nodes = useNodes();
  const sourceNode = nodes.find(n => n.id === source);
  const targetNode = nodes.find(n => n.id === target);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  const isPropertyEdge =
    (sourceNode?.type === 'nodeShape' || sourceNode?.type === 'logicNode') &&
    targetNode?.type === 'propertyShape';

  const constraints = targetNode?.data?.constraints || {};
  const path = targetNode?.data?.path || '';
  const minCount = constraints['sh:minCount'];
  const maxCount = constraints['sh:maxCount'];

  let cardinality = null;
  if (minCount !== undefined || maxCount !== undefined) {
    const min = minCount ?? '0';
    const max = maxCount ?? '*';
    cardinality = min === max ? `[${min}]` : `[${min}..${max}]`;
  }

  const edgeColor = selected ? '#1155cc' : '#555';

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: edgeColor, strokeWidth: selected ? 2 : 1.5 }}
      />

      {isPropertyEdge && path && (
        <EdgeLabelRenderer>
          <div
            className={`property-edge-label nodrag nopan${selected ? ' edge-label-selected' : ''}`}
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)` }}
          >
            <span className="edge-path-name">{path}</span>
            {cardinality && <span className="edge-cardinality">{cardinality}</span>}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
