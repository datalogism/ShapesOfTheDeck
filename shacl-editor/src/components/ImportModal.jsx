import { useState, useRef } from 'react';
import { importFromTurtle } from '../utils/turtleImport';

const EXAMPLE_TURTLE = `@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix ex: <http://example.org/> .

ex:AddressShape
  a sh:NodeShape ;
  sh:targetClass ex:Address ;
  sh:property [
    sh:path ex:street ;
    sh:datatype xsd:string ;
    sh:minCount 1 ;
  ] ;
  sh:property [
    sh:path ex:postalCode ;
    sh:datatype xsd:string ;
    sh:pattern "^[0-9]{5}$" ;
  ] .
`;

export function ImportModal({ onImport, onClose }) {
  const [turtle, setTurtle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setTurtle(ev.target.result);
    reader.readAsText(file);
  };

  const handleImport = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await importFromTurtle(turtle.trim());
      onImport(result);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="import-overlay" onClick={onClose}>
      <div className="import-modal" onClick={e => e.stopPropagation()}>
        <div className="panel-header">
          <span className="panel-title">Import SHACL shape (Turtle)</span>
          <button className="panel-close" onClick={onClose}>×</button>
        </div>

        <div className="import-body">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn-secondary" onClick={() => fileRef.current.click()}>
              Load .ttl file
            </button>
            <input ref={fileRef} type="file" accept=".ttl,.n3,.turtle" style={{ display: 'none' }} onChange={handleFile} />
            <button className="btn-secondary" onClick={() => setTurtle(EXAMPLE_TURTLE)}>
              Example
            </button>
            <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>or paste Turtle below</span>
          </div>

          <textarea
            className="import-textarea"
            placeholder="@prefix sh: <http://www.w3.org/ns/shacl#> .&#10;..."
            value={turtle}
            onChange={e => setTurtle(e.target.value)}
            spellCheck={false}
          />

          {error && <div className="import-error">{error}</div>}
        </div>

        <div className="import-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary"
            onClick={handleImport}
            disabled={!turtle.trim() || loading}
          >
            {loading ? 'Loading…' : 'Import'}
          </button>
        </div>
      </div>
    </div>
  );
}
