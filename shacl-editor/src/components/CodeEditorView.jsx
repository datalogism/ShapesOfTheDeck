import { useState, useEffect, useCallback, useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, ViewPlugin, Decoration } from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';
import { exportToTurtle } from '../utils/turtleExport';
import { importFromTurtle } from '../utils/turtleImport';

const lineWrap = EditorView.lineWrapping;

// ── Topic comment highlighter ──────────────────────────────
// DBpedia:  # ═══... border  /  # TOPIC NAME
// YAGO:     ############################## topic name  (single line)
const BORDER_RE     = /^\s*#\s*[═]{10,}/;
const TOPIC_NAME_RE = /^\s*#\s+[A-Z][A-Z &\-\/0-9]+\s*$/;
const HASH_TOP_RE   = /^\s*#{10,}\s+\S/;   // YAGO ######... topic name

function buildTopicDecorations(view) {
  const builder = new RangeSetBuilder();
  for (const { from, to } of view.visibleRanges) {
    let pos = from;
    while (pos <= to) {
      const line = view.state.doc.lineAt(pos);
      const text = line.text;
      if (BORDER_RE.test(text)) {
        builder.add(line.from, line.from, Decoration.line({ class: 'cm-topic-border' }));
      } else if (HASH_TOP_RE.test(text) || TOPIC_NAME_RE.test(text)) {
        builder.add(line.from, line.from, Decoration.line({ class: 'cm-topic-name' }));
      }
      pos = line.to + 1;
    }
  }
  return builder.finish();
}

const topicHighlighter = ViewPlugin.fromClass(
  class {
    constructor(view) { this.decorations = buildTopicDecorations(view); }
    update(u) {
      if (u.docChanged || u.viewportChanged)
        this.decorations = buildTopicDecorations(u.view);
    }
  },
  { decorations: v => v.decorations }
);

// ── Diff helper ──────────────────────────────────────────
function diffSnapshots(prev, curr) {
  if (!prev) return { added: curr.nodes.length, modified: 0, deleted: 0 };
  const prevMap = Object.fromEntries(prev.nodes.map(n => [n.id, n]));
  const currMap = Object.fromEntries(curr.nodes.map(n => [n.id, n]));
  let added = 0, modified = 0, deleted = 0;
  for (const n of curr.nodes) {
    if (!prevMap[n.id]) added++;
    else if (JSON.stringify(n.data) !== JSON.stringify(prevMap[n.id].data)) modified++;
  }
  for (const n of prev.nodes) {
    if (!currMap[n.id]) deleted++;
  }
  // Also count edge changes as modifications
  const prevEdgeIds = new Set(prev.edges.map(e => e.id));
  const currEdgeIds = new Set(curr.edges.map(e => e.id));
  for (const e of curr.edges) if (!prevEdgeIds.has(e.id)) added++;
  for (const e of prev.edges) if (!currEdgeIds.has(e.id)) deleted++;
  return { added, modified, deleted };
}

// ── History panel ─────────────────────────────────────────
function HistoryPanel({ history, currentIdx, selectedIdx, onSelect, onRestore, prefixes }) {
  const diffs = useMemo(() => history.map((snap, i) => diffSnapshots(history[i - 1] ?? null, snap)), [history]);
  const maxTotal = useMemo(() => Math.max(1, ...diffs.map(d => d.added + d.modified + d.deleted)), [diffs]);

  return (
    <div className="hist-panel">
      <div className="hist-panel-header">
        <span className="hist-title">⏱ History</span>
        <span className="hist-count">{history.length} snapshot{history.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="hist-list">
        {[...history].reverse().map((snap, revIdx) => {
          const idx = history.length - 1 - revIdx;
          const diff = diffs[idx];
          const total = diff.added + diff.modified + diff.deleted;
          const isCurrent = idx === currentIdx;
          const isSelected = idx === selectedIdx;

          const addW  = total ? Math.round((diff.added    / maxTotal) * 100) : 0;
          const modW  = total ? Math.round((diff.modified / maxTotal) * 100) : 0;
          const delW  = total ? Math.round((diff.deleted  / maxTotal) * 100) : 0;

          return (
            <div
              key={idx}
              className={`hist-entry${isCurrent ? ' hist-current' : ''}${isSelected ? ' hist-selected' : ''}`}
              onClick={() => onSelect(idx)}
              title={`Step ${idx + 1}: +${diff.added} ~${diff.modified} -${diff.deleted}`}
            >
              <div className="hist-entry-meta">
                <span className="hist-step">
                  {isCurrent ? '● now' : idx < currentIdx ? `−${currentIdx - idx}` : `+${idx - currentIdx}`}
                </span>
                <span className="hist-diff-counts">
                  {diff.added   > 0 && <span className="hist-add">+{diff.added}</span>}
                  {diff.modified > 0 && <span className="hist-mod">~{diff.modified}</span>}
                  {diff.deleted  > 0 && <span className="hist-del">−{diff.deleted}</span>}
                  {total === 0 && <span className="hist-zero">∅</span>}
                </span>
              </div>
              <div className="hist-bar">
                {addW > 0 && <div className="hist-bar-add" style={{ width: `${addW}%` }} />}
                {modW > 0 && <div className="hist-bar-mod" style={{ width: `${modW}%` }} />}
                {delW > 0 && <div className="hist-bar-del" style={{ width: `${delW}%` }} />}
                {total === 0 && <div className="hist-bar-zero" style={{ width: '4px' }} />}
              </div>
            </div>
          );
        })}
      </div>

      {selectedIdx !== null && selectedIdx !== currentIdx && (
        <div className="hist-restore-row">
          <button className="btn-code btn-hist-restore" onClick={() => onRestore(selectedIdx)}>
            ↩ Restore step {selectedIdx + 1}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────
export function CodeEditorView({ nodes, edges, prefixes, past, future, onApply }) {
  const hasShapes = nodes.some(n => n.type === 'nodeShape');

  const [isEditing, setIsEditing]     = useState(!hasShapes);
  const [code, setCode]               = useState(() => hasShapes ? exportToTurtle(nodes, edges, prefixes) : '');
  const [error, setError]             = useState('');
  const [applying, setApplying]       = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedHistIdx, setSelectedHistIdx] = useState(null);

  // Full ordered history: oldest → current → future
  const fullHistory = useMemo(
    () => [...past, { nodes, edges }, ...future],
    [past, nodes, edges, future]
  );
  const currentIdx = past.length;

  // Sync reader code with graph, reset history selection when graph changes
  useEffect(() => {
    if (!isEditing && selectedHistIdx === null) {
      setCode(exportToTurtle(nodes, edges, prefixes));
    }
  }, [nodes, edges, prefixes, isEditing, selectedHistIdx]);

  // When history entry selected, show its Turtle
  useEffect(() => {
    if (selectedHistIdx === null) return;
    const snap = fullHistory[selectedHistIdx];
    if (snap) setCode(exportToTurtle(snap.nodes, snap.edges, prefixes));
  }, [selectedHistIdx, fullHistory, prefixes]);

  const handleEdit = useCallback(() => {
    setCode(exportToTurtle(nodes, edges, prefixes));
    setError('');
    setIsEditing(true);
    setSelectedHistIdx(null);
  }, [nodes, edges, prefixes]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setError('');
    setCode(exportToTurtle(nodes, edges, prefixes));
  }, [nodes, edges, prefixes]);

  const handleApply = useCallback(async () => {
    setError('');
    setApplying(true);
    try {
      const result = await importFromTurtle(code);
      onApply(result);
      setIsEditing(false);
      setSelectedHistIdx(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setApplying(false);
    }
  }, [code, onApply]);

  const handleSelectHistory = useCallback((idx) => {
    setSelectedHistIdx(idx === selectedHistIdx ? null : idx);
    if (isEditing) { setIsEditing(false); setError(''); }
  }, [selectedHistIdx, isEditing]);

  const handleRestoreHistory = useCallback((idx) => {
    const snap = fullHistory[idx];
    if (!snap) return;
    onApply(snap);
    setSelectedHistIdx(null);
  }, [fullHistory, onApply]);

  const isHistoryPreview = selectedHistIdx !== null && selectedHistIdx !== currentIdx;
  const editorReadOnly = !isEditing || isHistoryPreview;

  let modeBadge, modeHint;
  if (isHistoryPreview) {
    modeBadge = <span className="code-mode-badge history">⏱ History</span>;
    modeHint = `Viewing step ${selectedHistIdx + 1} of ${fullHistory.length} — click Restore to apply.`;
  } else if (isEditing) {
    modeBadge = <span className="code-mode-badge editing">✎ Editor</span>;
    modeHint = 'Edit Turtle directly, then click Apply to update the graph.';
  } else {
    modeBadge = <span className="code-mode-badge reading">◉ Reader</span>;
    modeHint = 'Live Turtle view — switch to Editor to modify.';
  }

  return (
    <div className="code-view-root">
      {/* Toolbar */}
      <div className="code-view-bar">
        {modeBadge}
        <span className="code-view-hint">{modeHint}</span>
        <div className="code-view-actions">
          {!isEditing && !isHistoryPreview && (
            <button className="btn-code btn-code-edit" onClick={handleEdit}>Edit</button>
          )}
          {isEditing && !isHistoryPreview && (
            <>
              <button className="btn-code btn-code-apply" onClick={handleApply} disabled={applying}>
                {applying ? 'Applying…' : 'Apply'}
              </button>
              {hasShapes && (
                <button className="btn-code btn-code-cancel" onClick={handleCancel}>Cancel</button>
              )}
            </>
          )}
          {isHistoryPreview && (
            <>
              <button className="btn-code btn-hist-restore" onClick={() => handleRestoreHistory(selectedHistIdx)}>
                ↩ Restore
              </button>
              <button className="btn-code btn-code-cancel" onClick={() => { setSelectedHistIdx(null); }}>
                ✕ Close
              </button>
            </>
          )}
          <button
            className={`btn-code btn-hist-toggle${historyOpen ? ' active' : ''}`}
            onClick={() => setHistoryOpen(o => !o)}
            title="Toggle history panel"
          >
            ⏱ History{fullHistory.length > 1 ? ` (${fullHistory.length})` : ''}
          </button>
        </div>
      </div>

      {error && <div className="code-view-error">{error}</div>}

      {/* Body: editor + optional history sidebar */}
      <div className="code-view-body">
        <div className="code-view-editor">
          <CodeMirror
            value={code}
            height="100%"
            style={{ flex: 1, minHeight: 0, height: '100%' }}
            theme={oneDark}
            extensions={[lineWrap, topicHighlighter]}
            editable={!editorReadOnly}
            readOnly={editorReadOnly}
            onChange={setCode}
            basicSetup={{
              lineNumbers: true,
              foldGutter: false,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: false,
              highlightActiveLine: !editorReadOnly,
              highlightSelectionMatches: false,
            }}
          />
        </div>

        {historyOpen && (
          <HistoryPanel
            history={fullHistory}
            currentIdx={currentIdx}
            selectedIdx={selectedHistIdx}
            onSelect={handleSelectHistory}
            onRestore={handleRestoreHistory}
            prefixes={prefixes}
          />
        )}
      </div>
    </div>
  );
}
