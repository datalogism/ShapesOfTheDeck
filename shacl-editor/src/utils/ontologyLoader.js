import { Store, Parser } from 'n3';

const RDF_TYPE  = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
const RDFS_LABEL = 'http://www.w3.org/2000/01/rdf-schema#label';

const CLASS_TYPES = new Set([
  'http://www.w3.org/2002/07/owl#Class',
  'http://www.w3.org/2000/01/rdf-schema#Class',
]);

const PROPERTY_TYPES = new Set([
  'http://www.w3.org/2002/07/owl#ObjectProperty',
  'http://www.w3.org/2002/07/owl#DatatypeProperty',
  'http://www.w3.org/2002/07/owl#AnnotationProperty',
  'http://www.w3.org/2002/07/owl#FunctionalProperty',
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property',
  'http://www.w3.org/2000/01/rdf-schema#Property',
]);

function parseN3(turtle) {
  return new Promise((resolve, reject) => {
    const store = new Store();
    const parser = new Parser();
    const collectedPrefixes = {};
    parser.parse(turtle, (err, quad, prefixes) => {
      if (err) return reject(new Error(err.message));
      if (quad) store.addQuad(quad);
      else {
        if (prefixes) Object.assign(collectedPrefixes, prefixes);
        resolve({ store, prefixes: collectedPrefixes });
      }
    });
  });
}

function getLabel(store, subject) {
  const labels = store.getObjects(subject, RDFS_LABEL, null);
  const en = labels.find(l => l.language === 'en');
  return (en || labels[0])?.value || null;
}

export async function parseOntologyTurtle(turtle) {
  const { store, prefixes } = await parseN3(turtle);
  const classes = [];
  const properties = [];

  for (const quad of store.match(null, RDF_TYPE, null, null)) {
    const iri = quad.subject.value;
    if (!iri.startsWith('http')) continue;
    const label = getLabel(store, quad.subject);

    if (CLASS_TYPES.has(quad.object.value)) {
      classes.push({ iri, label });
    } else if (PROPERTY_TYPES.has(quad.object.value)) {
      properties.push({ iri, label });
    }
  }

  return { classes, properties, extractedPrefixes: prefixes };
}

export async function fetchAndParseOntology(uri) {
  const res = await fetch(uri, {
    headers: {
      'Accept': 'text/turtle;q=1.0, application/rdf+xml;q=0.8, application/ld+json;q=0.6',
    },
    mode: 'cors',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const text = await res.text();
  return parseOntologyTurtle(text);
}

// Parse SPARQL endpoint namespace declarations (text/plain or HTML)
export function parseSparqlNamespaces(text) {
  const prefixes = {};
  // Format: "PREFIX prefix: <uri>" (common SPARQL format)
  const re1 = /PREFIX\s+(\w+):\s*<([^>]+)>/gi;
  let m;
  while ((m = re1.exec(text)) !== null) {
    prefixes[m[1].toLowerCase()] = m[2];
  }
  // Format: "prefix: uri" (Virtuoso nsdecl format)
  if (Object.keys(prefixes).length === 0) {
    const re2 = /^(\w[\w\d-]*):\s+(https?:\/\/\S+)/gm;
    while ((m = re2.exec(text)) !== null) {
      prefixes[m[1].toLowerCase()] = m[2];
    }
  }
  return prefixes;
}

export async function fetchSparqlNamespaces(endpointBase) {
  // Try the Virtuoso-style nsdecl help page
  const url = endpointBase.replace(/\/+$/, '') + '/?help=nsdecl';
  const res = await fetch(url, { mode: 'cors' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  const parsed = parseSparqlNamespaces(text);
  if (Object.keys(parsed).length === 0) throw new Error('No prefix declarations found in endpoint response.');
  return parsed;
}

export function shortenIRI(iri, prefixes) {
  for (const [p, uri] of Object.entries(prefixes)) {
    const uriStr = typeof uri === 'object' ? uri.value : String(uri);
    if (iri.startsWith(uriStr)) return `${p}:${iri.slice(uriStr.length)}`;
  }
  return iri;
}
