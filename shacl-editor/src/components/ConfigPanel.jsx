import { useState } from 'react';
import { COMMON_PREFIXES } from '../data/commonPrefixes';
import {
  fetchAndParseOntology,
  parseOntologyTurtle,
  fetchSparqlNamespaces,
  shortenIRI,
} from '../utils/ontologyLoader';

/* ── Prefix tab ──────────────────────────────────────── */
function PrefixTab({ prefixes, onChange }) {
  const [newPrefix, setNewPrefix] = useState('');
  const [newUri, setNewUri]       = useState('');
  const [sparqlUrl, setSparqlUrl] = useState('https://dbpedia.org/sparql');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [showCommon, setShowCommon]   = useState(false);

  const addPrefix = () => {
    const p = newPrefix.trim().replace(/:$/, '');
    const u = newUri.trim();
    if (!p || !u) return;
    onChange({ ...prefixes, [p]: u });
    setNewPrefix(''); setNewUri('');
  };

  const removePrefix = (p) => {
    const next = { ...prefixes };
    delete next[p];
    onChange(next);
  };

  const importFromEndpoint = async () => {
    setImportError(''); setImporting(true);
    try {
      const imported = await fetchSparqlNamespaces(sparqlUrl);
      onChange({ ...prefixes, ...imported });
    } catch (e) {
      setImportError(e.message);
    } finally {
      setImporting(false);
    }
  };

  const addCommon = (p, uri) => {
    if (!prefixes[p]) onChange({ ...prefixes, [p]: uri });
  };

  return (
    <div className="cfg-tab-body">
      <div className="cfg-section-title">Active prefixes</div>
      <div className="prefix-table-wrapper">
        <table className="prefix-table">
          <thead>
            <tr><th>Prefix</th><th>Namespace URI</th><th></th></tr>
          </thead>
          <tbody>
            {Object.entries(prefixes).map(([p, uri]) => (
              <tr key={p}>
                <td className="pfx-prefix">{p}:</td>
                <td className="pfx-uri">
                  <input
                    className="pfx-uri-input"
                    value={uri}
                    onChange={e => onChange({ ...prefixes, [p]: e.target.value })}
                  />
                </td>
                <td>
                  <button className="btn-remove" onClick={() => removePrefix(p)}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cfg-add-row">
        <input
          className="cfg-input pfx-add-prefix"
          placeholder="prefix"
          value={newPrefix}
          onChange={e => setNewPrefix(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addPrefix()}
        />
        <span className="pfx-colon">:</span>
        <input
          className="cfg-input pfx-add-uri"
          placeholder="https://…"
          value={newUri}
          onChange={e => setNewUri(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addPrefix()}
        />
        <button className="btn-primary cfg-btn-sm" onClick={addPrefix}>Add</button>
      </div>

      <div className="cfg-divider" />

      <div className="cfg-section-title">Common prefixes</div>
      <div className="common-prefix-list">
        {COMMON_PREFIXES.map(({ prefix, uri, description }) => (
          <button
            key={prefix + uri}
            className={`common-pfx-btn${prefixes[prefix] === uri ? ' added' : ''}`}
            onClick={() => addCommon(prefix, uri)}
            title={uri}
          >
            {prefix}:
            <span className="cpfx-desc">{description}</span>
          </button>
        ))}
      </div>

      <div className="cfg-divider" />

      <div className="cfg-section-title">Import from SPARQL endpoint</div>
      <div className="cfg-add-row">
        <input
          className="cfg-input"
          style={{ flex: 1 }}
          placeholder="https://dbpedia.org/sparql"
          value={sparqlUrl}
          onChange={e => setSparqlUrl(e.target.value)}
        />
        <button className="btn-primary cfg-btn-sm" onClick={importFromEndpoint} disabled={importing}>
          {importing ? 'Loading…' : 'Import'}
        </button>
      </div>
      {importError && <div className="cfg-error">{importError}</div>}
      <p className="cfg-hint">
        Fetches prefix declarations from a Virtuoso-compatible SPARQL endpoint (e.g. <code>?help=nsdecl</code>).
        May fail due to CORS — paste prefixes manually in that case.
      </p>
    </div>
  );
}

/* ── Ontology tab ────────────────────────────────────── */
function OntologyEntry({ onto, prefixes, onRemove }) {
  const [open, setOpen] = useState(false);
  const total = onto.classes.length + onto.properties.length;

  return (
    <div className="onto-entry">
      <div className="onto-header">
        <button className="btn-collapse-inline" onClick={() => setOpen(o => !o)}>
          {open ? '▾' : '▸'}
        </button>
        <span className="onto-uri">{onto.label || onto.uri}</span>
        <span className="onto-counts">
          {onto.classes.length} classes · {onto.properties.length} props
        </span>
        <button className="btn-remove" onClick={onRemove}>×</button>
      </div>
      {open && (
        <div className="onto-detail">
          {onto.classes.length > 0 && (
            <>
              <div className="onto-detail-title">Classes</div>
              <div className="onto-term-list">
                {onto.classes.map(c => (
                  <span key={c.iri} className="onto-term" title={c.iri}>
                    {shortenIRI(c.iri, prefixes)}
                    {c.label && <em> — {c.label}</em>}
                  </span>
                ))}
              </div>
            </>
          )}
          {onto.properties.length > 0 && (
            <>
              <div className="onto-detail-title">Properties</div>
              <div className="onto-term-list">
                {onto.properties.map(p => (
                  <span key={p.iri} className="onto-term" title={p.iri}>
                    {shortenIRI(p.iri, prefixes)}
                    {p.label && <em> — {p.label}</em>}
                  </span>
                ))}
              </div>
            </>
          )}
          {total === 0 && <div className="cfg-hint">No classes or properties found.</div>}
        </div>
      )}
      {onto.status === 'error' && <div className="cfg-error">{onto.error}</div>}
    </div>
  );
}

function OntologyTab({ ontologies, prefixes, onChange }) {
  const [urlInput, setUrlInput]   = useState('');
  const [turtleInput, setTurtle]  = useState('');
  const [labelInput, setLabel]    = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [mode, setMode]           = useState('url'); // 'url' | 'paste'

  const addOntology = async () => {
    setError(''); setLoading(true);
    try {
      let result;
      const uri = urlInput.trim() || 'pasted-ontology';
      if (mode === 'url') {
        result = await fetchAndParseOntology(urlInput.trim());
      } else {
        result = await parseOntologyTurtle(turtleInput.trim());
      }
      const onto = {
        uri,
        label: labelInput.trim() || uri,
        classes: result.classes,
        properties: result.properties,
        status: 'loaded',
        error: null,
      };
      onChange([...ontologies, onto]);
      setUrlInput(''); setTurtle(''); setLabel('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const removeOntology = (idx) => onChange(ontologies.filter((_, i) => i !== idx));

  return (
    <div className="cfg-tab-body">
      <p className="cfg-hint" style={{ marginBottom: 12 }}>
        Load an ontology to restrict and autocomplete <code>sh:path</code>, <code>sh:class</code>,
        and <code>sh:targetClass</code> to terms from that ontology.
      </p>

      {ontologies.map((onto, i) => (
        <OntologyEntry
          key={onto.uri + i}
          onto={onto}
          prefixes={prefixes}
          onRemove={() => removeOntology(i)}
        />
      ))}

      <div className="cfg-divider" />
      <div className="cfg-section-title">Add ontology</div>

      <div className="onto-mode-toggle">
        <button className={`toggle-btn${mode === 'url' ? ' active' : ''}`} onClick={() => setMode('url')}>
          From URL
        </button>
        <button className={`toggle-btn${mode === 'paste' ? ' active' : ''}`} onClick={() => setMode('paste')}>
          Paste Turtle
        </button>
      </div>

      <div className="cfg-add-row" style={{ marginTop: 8 }}>
        <input
          className="cfg-input"
          style={{ flex: 1 }}
          placeholder="Label (optional)"
          value={labelInput}
          onChange={e => setLabel(e.target.value)}
        />
      </div>

      {mode === 'url' ? (
        <div className="cfg-add-row">
          <input
            className="cfg-input"
            style={{ flex: 1 }}
            placeholder="https://xmlns.com/foaf/0.1/"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addOntology()}
          />
          <button className="btn-primary cfg-btn-sm" onClick={addOntology} disabled={loading || !urlInput.trim()}>
            {loading ? 'Loading…' : 'Load'}
          </button>
        </div>
      ) : (
        <>
          <textarea
            className="import-textarea"
            placeholder="@prefix owl: <…> .&#10;ex:MyClass a owl:Class ."
            value={turtleInput}
            onChange={e => setTurtle(e.target.value)}
            style={{ height: 120, marginTop: 8 }}
          />
          <div className="cfg-add-row">
            <button
              className="btn-primary cfg-btn-sm"
              style={{ marginLeft: 'auto' }}
              onClick={addOntology}
              disabled={loading || !turtleInput.trim()}
            >
              {loading ? 'Parsing…' : 'Parse & Add'}
            </button>
          </div>
        </>
      )}

      {error && <div className="cfg-error">{error}</div>}
      <p className="cfg-hint">
        URL loading may fail due to CORS restrictions. In that case, use "Paste Turtle" instead.
      </p>
    </div>
  );
}

/* ── Main panel ──────────────────────────────────────── */
export function ConfigPanel({ prefixes, onPrefixesChange, ontologies, onOntologiesChange, onClose }) {
  const [tab, setTab] = useState('prefixes');

  return (
    <div className="export-overlay" onClick={onClose}>
      <div className="cfg-modal" onClick={e => e.stopPropagation()}>
        <div className="panel-header">
          <span className="panel-title">⚙ Configuration</span>
          <button className="panel-close" onClick={onClose}>×</button>
        </div>

        <div className="cfg-tabs">
          <button className={`cfg-tab-btn${tab === 'prefixes' ? ' active' : ''}`} onClick={() => setTab('prefixes')}>
            Prefixes
          </button>
          <button className={`cfg-tab-btn${tab === 'ontologies' ? ' active' : ''}`} onClick={() => setTab('ontologies')}>
            Ontologies
            {ontologies.length > 0 && <span className="cfg-tab-badge">{ontologies.length}</span>}
          </button>
        </div>

        <div className="cfg-body">
          {tab === 'prefixes'
            ? <PrefixTab prefixes={prefixes} onChange={onPrefixesChange} />
            : <OntologyTab ontologies={ontologies} prefixes={prefixes} onChange={onOntologiesChange} />
          }
        </div>
      </div>
    </div>
  );
}
