import { DEFAULT_PREFIXES } from '../data/shaclConstraints';

const INTEGER_CONSTRAINTS = new Set(['sh:minCount', 'sh:maxCount', 'sh:minLength', 'sh:maxLength', 'sh:order']);
const NUMBER_CONSTRAINTS = new Set(['sh:minInclusive', 'sh:maxInclusive', 'sh:minExclusive', 'sh:maxExclusive']);
const IRI_CONSTRAINTS = new Set(['sh:datatype', 'sh:nodeKind', 'sh:class', 'sh:node', 'sh:severity', 'sh:group']);
const BOOLEAN_CONSTRAINTS = new Set(['sh:uniqueLang', 'sh:closed']);

const BORDER = '  # ' + '═'.repeat(73);

function resolvePrefix(value, prefixes) {
  if (!value) return null;
  for (const [prefix, uri] of Object.entries(prefixes)) {
    if (value.startsWith(`${prefix}:`)) return `<${uri}${value.slice(prefix.length + 1)}>`;
  }
  if (value.startsWith('http://') || value.startsWith('https://')) return `<${value}>`;
  return value;
}

function serializeConstraintValue(key, value, prefixes) {
  if (BOOLEAN_CONSTRAINTS.has(key)) return value === 'true' ? 'true' : 'false';
  if (INTEGER_CONSTRAINTS.has(key)) return value;
  if (NUMBER_CONSTRAINTS.has(key)) return value;
  if (IRI_CONSTRAINTS.has(key)) {
    const resolved = resolvePrefix(value, prefixes);
    return resolved || `<${value}>`;
  }
  if (key === 'sh:in') {
    const items = value.trim().split(/\s+/);
    return `( ${items.join(' ')} )`;
  }
  if (key === 'sh:languageIn') {
    const items = value.trim().split(/\s+/);
    return `( ${items.join(' ')} )`;
  }
  if (key === 'sh:path') {
    const resolved = resolvePrefix(value, prefixes);
    return resolved || value;
  }
  return `"${value.replace(/"/g, '\\"')}"`;
}

function renderPropertyShape(node, prefixes, indent = '    ') {
  const { path, constraints = {} } = node.data;
  const lines = [];
  lines.push(`${indent}[`);
  const pathVal = resolvePrefix(path, prefixes) || path || '?';
  lines.push(`${indent}  sh:path ${pathVal} ;`);

  const entries = Object.entries(constraints).filter(([, v]) => v !== '' && v !== undefined && v !== null);
  entries.forEach(([key, value], i) => {
    const serialized = serializeConstraintValue(key, value, prefixes);
    const sep = i < entries.length - 1 ? ' ;' : '';
    lines.push(`${indent}  ${key} ${serialized}${sep}`);
  });

  lines.push(`${indent}]`);
  return lines.join('\n');
}

function emitTopicHeader(lines, topic) {
  lines.push('');
  lines.push(BORDER);
  lines.push(`  # ${topic}`);
  lines.push(BORDER);
  lines.push('');
}

export function exportToTurtle(nodes, edges, userPrefixes = {}) {
  const prefixes = { ...DEFAULT_PREFIXES, ...userPrefixes };
  const lines = [];

  // Prefix declarations
  for (const [p, uri] of Object.entries(prefixes)) {
    lines.push(`@prefix ${p}: <${uri}> .`);
  }
  lines.push('');

  const nodeShapes = nodes.filter(n => n.type === 'nodeShape');
  const propertyShapes = nodes.filter(n => n.type === 'propertyShape');
  const logicNodes = nodes.filter(n => n.type === 'logicNode');

  const edgesBySource = {};
  for (const e of edges) {
    edgesBySource[e.source] = edgesBySource[e.source] || [];
    edgesBySource[e.source].push(e.target);
  }

  for (const ns of nodeShapes) {
    const shapeIRI = `ex:${ns.data.label || ns.id}`;
    lines.push(`${shapeIRI}`);
    lines.push(`  a sh:NodeShape ;`);

    if (ns.data.targetClass) {
      const tc = resolvePrefix(ns.data.targetClass, prefixes) || ns.data.targetClass;
      lines.push(`  sh:targetClass ${tc} ;`);
    }

    const childIds = edgesBySource[ns.id] || [];
    const childProps = childIds
      .map(id => propertyShapes.find(p => p.id === id))
      .filter(Boolean);
    const childLogic = childIds
      .map(id => logicNodes.find(l => l.id === id))
      .filter(Boolean);

    const totalTerminable = childProps.length + childLogic.length;
    let terminableIdx = 0;

    const hasTopics = childProps.some(p => p.data?.topic);

    if (hasTopics) {
      // Group properties by topic preserving encounter order
      const groups = [];
      let currentGroup = null;
      for (const ps of childProps) {
        const t = ps.data.topic || '';
        if (!currentGroup || currentGroup.topic !== t) {
          currentGroup = { topic: t, props: [] };
          groups.push(currentGroup);
        }
        currentGroup.props.push(ps);
      }

      for (const group of groups) {
        if (group.topic) emitTopicHeader(lines, group.topic);
        for (const ps of group.props) {
          terminableIdx++;
          const sep = terminableIdx === totalTerminable ? ' .' : ' ;';
          lines.push(`  sh:property`);
          lines.push(renderPropertyShape(ps, prefixes) + sep);
        }
      }
    } else {
      childProps.forEach((ps, i) => {
        const isLast = i === childProps.length - 1 && childLogic.length === 0;
        terminableIdx++;
        const sep = isLast ? ' .' : ' ;';
        lines.push(`  sh:property`);
        lines.push(renderPropertyShape(ps, prefixes) + sep);
      });
    }

    childLogic.forEach((lg, i) => {
      terminableIdx++;
      const isLast = terminableIdx === totalTerminable;
      const sep = isLast ? ' .' : ' ;';
      const grandChildIds = edgesBySource[lg.id] || [];
      const grandChildProps = grandChildIds
        .map(id => propertyShapes.find(p => p.id === id))
        .filter(Boolean);

      if (grandChildProps.length > 0) {
        lines.push(`  ${lg.data.operator} (`);
        grandChildProps.forEach(gp => {
          lines.push(renderPropertyShape(gp, prefixes, '      '));
        });
        lines.push(`  )${sep}`);
      } else if (isLast && childProps.length === 0) {
        lines.push(`  .`);
      }
    });

    if (childProps.length === 0 && childLogic.length === 0) {
      lines.push(`  .`);
    }

    lines.push('');
  }

  return lines.join('\n');
}
