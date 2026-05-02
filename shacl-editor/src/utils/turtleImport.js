import { Store, Parser } from 'n3';

// ── Topic extraction ──────────────────────────────────────
// Recognises two topic-comment styles:
//   DBpedia:  # ═══...  /  # TOPIC NAME  /  # ═══...
//   YAGO:     ############################## topic name
// Returns Map<shortPath, topicName>
function extractTopicMap(turtle) {
  const lines = turtle.split('\n');
  const topicMap = new Map();
  let currentTopic = null;
  const BORDER_RE   = /^\s*#\s*[═]{10,}/;           // DBpedia ═══ border
  const HASH_TOP_RE = /^\s*#{10,}\s+(.+?)\s*$/;      // YAGO ######... topic name
  let prevWasBorder = false;
  let collecting = false;
  let blockLines = [];
  let depth = 0;

  for (const line of lines) {
    if (!collecting) {
      // YAGO single-line: ############################## topic name
      const hashMatch = line.match(HASH_TOP_RE);
      if (hashMatch && !/^#+$/.test(hashMatch[1])) {
        currentTopic = hashMatch[1].trim();
        prevWasBorder = false;
        continue;
      }

      if (BORDER_RE.test(line)) { prevWasBorder = true; continue; }
      if (prevWasBorder) {
        const m = line.match(/^\s*#\s+(.+?)\s*$/);
        if (m && !/[═]/.test(m[1])) currentTopic = m[1].trim();
        prevWasBorder = false;
        continue;
      }
      prevWasBorder = false;

      if (/sh:property\s*\[/.test(line)) {
        collecting = true;
        blockLines = [line];
        depth = (line.match(/\[/g) || []).length - (line.match(/\]/g) || []).length;
        if (depth <= 0) {
          const pathMatch = blockLines.join('\n').match(/sh:path\s+([^\s;,\]]+)/);
          if (pathMatch && currentTopic) topicMap.set(pathMatch[1].trim(), currentTopic);
          collecting = false; blockLines = []; depth = 0;
        }
      }
    } else {
      blockLines.push(line);
      depth += (line.match(/\[/g) || []).length - (line.match(/\]/g) || []).length;
      if (depth <= 0) {
        const pathMatch = blockLines.join('\n').match(/sh:path\s+([^\s;,\]]+)/);
        if (pathMatch && currentTopic) topicMap.set(pathMatch[1].trim(), currentTopic);
        collecting = false; blockLines = []; depth = 0;
      }
    }
  }
  return topicMap;
}

const SH = 'http://www.w3.org/ns/shacl#';
const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
const RDF_TYPE = `${RDF}type`;
const RDF_FIRST = `${RDF}first`;
const RDF_REST = `${RDF}rest`;
const RDF_NIL = `${RDF}nil`;

function parseStore(turtle) {
  return new Promise((resolve, reject) => {
    const store = new Store();
    const parser = new Parser();
    const collectedPrefixes = {};
    parser.parse(turtle, (err, quad, prefixes) => {
      if (err) return reject(new Error(`Parse error: ${err.message}`));
      if (quad) store.addQuad(quad);
      else {
        if (prefixes) Object.assign(collectedPrefixes, prefixes);
        resolve({ store, prefixes: collectedPrefixes });
      }
    });
  });
}

function buildPrefixMap(prefixes) {
  // uri → prefix
  return Object.entries(prefixes).reduce((acc, [p, uri]) => {
    const uriStr = typeof uri === 'object' ? uri.value : String(uri);
    acc[uriStr] = p;
    return acc;
  }, {});
}

function shorten(iri, prefixMap) {
  if (!iri) return iri;
  for (const [uri, prefix] of Object.entries(prefixMap)) {
    if (iri.startsWith(uri)) return `${prefix}:${iri.slice(uri.length)}`;
  }
  return `<${iri}>`;
}

function getOne(store, subject, predicate) {
  const results = store.getObjects(subject, predicate, null);
  return results[0] || null;
}

function getAll(store, subject, predicate) {
  return store.getObjects(subject, predicate, null);
}

function collectRdfList(store, listNode) {
  const items = [];
  let current = listNode;
  while (current && current.value !== RDF_NIL) {
    const first = getOne(store, current, RDF_FIRST);
    if (first) items.push(first);
    current = getOne(store, current, RDF_REST);
  }
  return items;
}

function extractConstraints(store, bnode, prefixMap) {
  const SKIP = new Set([RDF_TYPE, `${SH}path`]);
  const LOGIC_PROPS = new Set([`${SH}and`, `${SH}or`, `${SH}not`, `${SH}xone`]);

  const constraints = {};
  const logicOps = {};

  for (const quad of store.match(bnode, null, null, null)) {
    const pred = quad.predicate.value;
    if (SKIP.has(pred)) continue;

    if (LOGIC_PROPS.has(pred)) {
      const listNode = quad.object;
      const items = collectRdfList(store, listNode);
      logicOps[shorten(pred, prefixMap)] = items;
      continue;
    }

    const obj = quad.object;
    let value;
    if (obj.termType === 'NamedNode') {
      value = shorten(obj.value, prefixMap);
    } else if (obj.termType === 'Literal') {
      value = obj.value;
    } else {
      value = obj.value;
    }

    const shortPred = shorten(pred, prefixMap);
    constraints[shortPred] = value;
  }

  return { constraints, logicOps };
}

let _idCounter = 100;
const uid = () => `imported_${++_idCounter}`;

// Resolve a list item to one or more { path, constraints } objects.
// Handles three patterns:
//   1. Direct property shape: item has sh:path directly
//   2. Wrapper pattern:       item has sh:property → inner node has sh:path
//   3. Multiple properties:   item has multiple sh:property links
function resolvePropertyNode(store, item, prefixMap) {
  // Pattern 1: direct sh:path on the item
  const directPath = getOne(store, item, `${SH}path`);
  if (directPath) {
    const path = shorten(directPath.value, prefixMap);
    const { constraints } = extractConstraints(store, item, prefixMap);
    return [{ path, constraints }];
  }

  // Pattern 2 & 3: item has sh:property pointing to inner property shapes
  const innerProps = getAll(store, item, `${SH}property`);
  if (innerProps.length > 0) {
    return innerProps.map(inner => {
      const pathNode = getOne(store, inner, `${SH}path`);
      const path = pathNode ? shorten(pathNode.value, prefixMap) : '';
      const { constraints } = extractConstraints(store, inner, prefixMap);
      return { path, constraints };
    });
  }

  // Fallback: treat item as-is with no path
  const { constraints } = extractConstraints(store, item, prefixMap);
  return [{ path: '', constraints }];
}

export async function importFromTurtle(turtle) {
  const topicMap = extractTopicMap(turtle);
  const { store, prefixes } = await parseStore(turtle);
  const prefixMap = buildPrefixMap(prefixes);

  // Ensure common prefixes
  const commonPrefixes = {
    'http://www.w3.org/ns/shacl#': 'sh',
    'http://www.w3.org/2001/XMLSchema#': 'xsd',
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#': 'rdf',
    'http://xmlns.com/foaf/0.1/': 'foaf',
    'http://example.org/': 'ex',
    'https://schema.org/': 'schema',
    'http://www.wikidata.org/entity/': 'wd',
    'http://www.wikidata.org/prop/direct/': 'wdt',
  };
  for (const [uri, p] of Object.entries(commonPrefixes)) {
    if (!prefixMap[uri]) prefixMap[uri] = p;
  }

  const nodes = [];
  const edges = [];

  // Find all NodeShapes
  const nodeShapeSubjects = store.getSubjects(RDF_TYPE, `${SH}NodeShape`, null);

  nodeShapeSubjects.forEach((nsSubject, nsIdx) => {
    const nsId = uid();
    // Prefer sh:name (used in Wikidata/WES shapes), then derive from IRI
    const shNameNode = getOne(store, nsSubject, `${SH}name`);
    let label;
    if (shNameNode) {
      label = shNameNode.value;
    } else {
      const shortened = shorten(nsSubject.value, prefixMap);
      if (shortened.startsWith('<')) {
        // Absolute URI: extract local name after last / or #
        label = nsSubject.value.replace(/.*[/#]/, '').replace(/Shape$/, '');
      } else {
        label = shortened.replace(/^ex:/, '').replace(/^.*:/, '');
      }
    }
    const targetClassNode = getOne(store, nsSubject, `${SH}targetClass`);
    const targetClass = targetClassNode ? shorten(targetClassNode.value, prefixMap) : '';

    nodes.push({
      id: nsId,
      type: 'nodeShape',
      position: { x: 80 + nsIdx * 320, y: 60 },
      data: { label, targetClass, constraints: {} },
    });

    // sh:property blank nodes (may themselves be wrappers)
    const propertyNodes = getAll(store, nsSubject, `${SH}property`);
    let propFlatIdx = 0;
    propertyNodes.forEach((propBnode) => {
      const resolved = resolvePropertyNode(store, propBnode, prefixMap);
      resolved.forEach(({ path, constraints }) => {
        const psId = uid();
        nodes.push({
          id: psId,
          type: 'propertyShape',
          position: { x: 80 + nsIdx * 320 + (propFlatIdx - Math.floor(propertyNodes.length / 2)) * 210, y: 260 },
          data: { path, constraints, topic: topicMap.get(path) || '' },
        });
        edges.push({
          id: uid(),
          source: nsId,
          target: psId,
          type: 'propertyEdge',
          markerEnd: { type: 'arrowclosed', color: '#555' },
        });
        propFlatIdx++;
      });
    });

    // Logical operators directly on the node shape
    for (const logicPred of [`${SH}and`, `${SH}or`, `${SH}not`, `${SH}xone`]) {
      const listHeads = getAll(store, nsSubject, logicPred);
      listHeads.forEach((listHead, lIdx) => {
        const items = collectRdfList(store, listHead);
        if (items.length === 0) return;

        const lgId = uid();
        const shortOp = shorten(logicPred, prefixMap);
        nodes.push({
          id: lgId,
          type: 'logicNode',
          position: { x: 80 + nsIdx * 320 + lIdx * 220, y: 450 },
          data: { operator: shortOp },
        });
        edges.push({
          id: uid(),
          source: nsId,
          target: lgId,
          type: 'propertyEdge',
          markerEnd: { type: 'arrowclosed', color: '#555' },
        });

        items.forEach((item, iIdx) => {
          // Resolve the actual property shape node (may be wrapped in [ sh:property [...] ])
          const resolvedProps = resolvePropertyNode(store, item, prefixMap);
          resolvedProps.forEach((resolved, rIdx) => {
            const psId = uid();
            nodes.push({
              id: psId,
              type: 'propertyShape',
              position: {
                x: 80 + nsIdx * 320 + lIdx * 220 + (iIdx - Math.floor(items.length / 2)) * 200,
                y: 620 + rIdx * 80,
              },
              data: { path: resolved.path, constraints: resolved.constraints, topic: topicMap.get(resolved.path) || '' },
            });
            edges.push({
              id: uid(),
              source: lgId,
              target: psId,
              type: 'smoothstep',
              markerEnd: { type: 'arrowclosed' },
              style: { strokeWidth: 2, stroke: '#90a4ae' },
            });
          });
        });
      });
    }
  });

  if (nodes.length === 0) throw new Error('No sh:NodeShape found in the document.');

  return { nodes, edges };
}
