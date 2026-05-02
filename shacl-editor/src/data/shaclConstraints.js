export const AVAILABLE_CONSTRAINTS = [
  // Cardinality
  { id: 'sh:minCount', label: 'Min Count', type: 'integer', category: 'Cardinality', placeholder: '1' },
  { id: 'sh:maxCount', label: 'Max Count', type: 'integer', category: 'Cardinality', placeholder: '1' },
  // Value Type
  {
    id: 'sh:datatype', label: 'Datatype', type: 'select', category: 'Value Type',
    options: [
      'xsd:string', 'xsd:integer', 'xsd:decimal', 'xsd:float', 'xsd:double',
      'xsd:boolean', 'xsd:date', 'xsd:dateTime', 'xsd:time', 'xsd:anyURI',
      'xsd:langString', 'rdf:langString',
    ],
  },
  {
    id: 'sh:nodeKind', label: 'Node Kind', type: 'select', category: 'Value Type',
    options: ['sh:IRI', 'sh:BlankNode', 'sh:Literal', 'sh:BlankNodeOrIRI', 'sh:BlankNodeOrLiteral', 'sh:IRIOrLiteral'],
  },
  { id: 'sh:class', label: 'Class', type: 'iri', category: 'Value Type', placeholder: 'ex:Person' },
  { id: 'sh:node', label: 'Node Shape', type: 'iri', category: 'Value Type', placeholder: 'ex:AddressShape' },
  // String
  { id: 'sh:pattern', label: 'Pattern (Regex)', type: 'string', category: 'String', placeholder: '^[A-Za-z]+$' },
  { id: 'sh:flags', label: 'Regex Flags', type: 'string', category: 'String', placeholder: 'i' },
  { id: 'sh:minLength', label: 'Min Length', type: 'integer', category: 'String', placeholder: '1' },
  { id: 'sh:maxLength', label: 'Max Length', type: 'integer', category: 'String', placeholder: '100' },
  { id: 'sh:languageIn', label: 'Language In', type: 'string', category: 'String', placeholder: '"en" "fr"' },
  { id: 'sh:uniqueLang', label: 'Unique Lang', type: 'boolean', category: 'String' },
  // Range
  { id: 'sh:minInclusive', label: 'Min Inclusive', type: 'number', category: 'Range', placeholder: '0' },
  { id: 'sh:maxInclusive', label: 'Max Inclusive', type: 'number', category: 'Range', placeholder: '100' },
  { id: 'sh:minExclusive', label: 'Min Exclusive', type: 'number', category: 'Range', placeholder: '0' },
  { id: 'sh:maxExclusive', label: 'Max Exclusive', type: 'number', category: 'Range', placeholder: '100' },
  // Value
  { id: 'sh:in', label: 'In (liste)', type: 'string', category: 'Value', placeholder: '"valA" "valB"' },
  { id: 'sh:hasValue', label: 'Has Value', type: 'string', category: 'Value', placeholder: '"required"' },
  // Other
  { id: 'sh:name', label: 'Name (label)', type: 'string', category: 'Meta', placeholder: 'Nom' },
  { id: 'sh:description', label: 'Description', type: 'string', category: 'Meta', placeholder: 'Description…' },
  { id: 'sh:order', label: 'Order', type: 'integer', category: 'Meta', placeholder: '1' },
  { id: 'sh:group', label: 'Group', type: 'iri', category: 'Meta', placeholder: 'ex:Group1' },
  { id: 'sh:severity', label: 'Severity', type: 'select', category: 'Meta', options: ['sh:Violation', 'sh:Warning', 'sh:Info'] },
];

export const CONSTRAINT_CATEGORIES = ['Cardinality', 'Value Type', 'String', 'Range', 'Value', 'Meta'];

export const LOGIC_OPERATORS = [
  { id: 'sh:and', label: 'AND', color: '#2d8a4e', bg: '#e8f5e9', description: 'Toutes les shapes doivent être satisfaites' },
  { id: 'sh:or', label: 'OR', color: '#1565c0', bg: '#e3f2fd', description: 'Au moins une shape doit être satisfaite' },
  { id: 'sh:not', label: 'NOT', color: '#b71c1c', bg: '#ffebee', description: 'La shape ne doit PAS être satisfaite' },
  { id: 'sh:xone', label: 'XONE', color: '#e65100', bg: '#fff3e0', description: 'Exactement une shape doit être satisfaite' },
];

export const DEFAULT_PREFIXES = {
  sh: 'http://www.w3.org/ns/shacl#',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  owl: 'http://www.w3.org/2002/07/owl#',
  foaf: 'http://xmlns.com/foaf/0.1/',
  ex: 'http://example.org/',
  schema: 'https://schema.org/',
  wd: 'http://www.wikidata.org/entity/',
  wdt: 'http://www.wikidata.org/prop/direct/',
};
