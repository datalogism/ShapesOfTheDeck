import { useState } from 'react';
import { exportToTurtle } from '../utils/turtleExport';

export function TurtleExportPanel({ nodes, edges, prefixes = {}, onClose }) {
  const [copied, setCopied] = useState(false);
  const turtle = exportToTurtle(nodes, edges, prefixes);

  const handleCopy = () => {
    navigator.clipboard.writeText(turtle).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([turtle], { type: 'text/turtle;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shapes.ttl';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="export-overlay" onClick={onClose}>
      <div className="export-modal" onClick={e => e.stopPropagation()}>
        <div className="panel-header">
          <span className="panel-title">Export Turtle</span>
          <div className="export-actions">
            <button className="btn-secondary" onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</button>
            <button className="btn-secondary" onClick={handleDownload}>Download .ttl</button>
            <button className="panel-close" onClick={onClose}>×</button>
          </div>
        </div>
        <pre className="turtle-code">{turtle}</pre>
      </div>
    </div>
  );
}
