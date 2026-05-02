export const COMMON_PREFIXES = [
  { prefix: 'rdf',     uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#', description: 'RDF' },
  { prefix: 'rdfs',    uri: 'http://www.w3.org/2000/01/rdf-schema#',        description: 'RDF Schema' },
  { prefix: 'owl',     uri: 'http://www.w3.org/2002/07/owl#',               description: 'OWL' },
  { prefix: 'sh',      uri: 'http://www.w3.org/ns/shacl#',                  description: 'SHACL' },
  { prefix: 'xsd',     uri: 'http://www.w3.org/2001/XMLSchema#',            description: 'XML Schema Datatypes' },
  { prefix: 'foaf',    uri: 'http://xmlns.com/foaf/0.1/',                   description: 'FOAF' },
  { prefix: 'schema',  uri: 'https://schema.org/',                          description: 'Schema.org' },
  { prefix: 'dc',      uri: 'http://purl.org/dc/elements/1.1/',             description: 'Dublin Core' },
  { prefix: 'dcterms', uri: 'http://purl.org/dc/terms/',                    description: 'Dublin Core Terms' },
  { prefix: 'skos',    uri: 'http://www.w3.org/2004/02/skos/core#',         description: 'SKOS' },
  { prefix: 'dbo',     uri: 'http://dbpedia.org/ontology/',                 description: 'DBpedia Ontology' },
  { prefix: 'dbp',     uri: 'http://dbpedia.org/property/',                 description: 'DBpedia Property' },
  { prefix: 'wd',      uri: 'http://www.wikidata.org/entity/',              description: 'Wikidata Entity' },
  { prefix: 'wdt',     uri: 'http://www.wikidata.org/prop/direct/',         description: 'Wikidata Direct Props' },
  { prefix: 'geo',     uri: 'http://www.w3.org/2003/01/geo/wgs84_pos#',     description: 'WGS84 Geo' },
  { prefix: 'ex',      uri: 'http://example.org/',                          description: 'Example' },
];

export const INITIAL_PREFIXES = {
  rdf:    'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs:   'http://www.w3.org/2000/01/rdf-schema#',
  owl:    'http://www.w3.org/2002/07/owl#',
  sh:     'http://www.w3.org/ns/shacl#',
  xsd:    'http://www.w3.org/2001/XMLSchema#',
  foaf:   'http://xmlns.com/foaf/0.1/',
  schema: 'https://schema.org/',
  ex:     'http://example.org/',
};
