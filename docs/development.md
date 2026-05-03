# Development Guide

## Prerequisites

| Dependency | Minimum version | Notes |
|---|---|---|
| **Node.js** | **18.x** | 20 LTS or 22 LTS recommended |
| **npm** | **9.x** | Bundled with Node.js |
| **Python** | **3.10+** | Optional — only for the ShEx translator server |

## Setup

```bash
cd shacl-editor
npm install
npm run dev          # Vite dev server on http://localhost:5173
```

If port 5173 is busy, Vite automatically tries 5174, 5175, etc.

## Optional: ShEx translator server

Enables the `→ ShEx` and `← ShEx` format-conversion buttons in the Shape Builder toolbar. Not required for any other feature.

```bash
pip install fastapi uvicorn shaclex-py
python shacl-editor/translator_server.py
```

The translator starts on `http://localhost:8765`. `vite.config.js` proxies `/api` → `http://localhost:8765`. The Shape Builder toolbar shows a **green dot** when the server is reachable, or a **red dot** when it is not — the buttons are disabled but all other features work normally.

## Save-shape Vite middleware

`vite.config.js` includes a `saveShapePlugin()` that intercepts `POST /save-shape` requests in development mode. This is what powers the **📚 Library** toolbar button in the Shape Builder.

```js
// vite.config.js (simplified)
function saveShapePlugin() {
  return {
    name: 'save-shape',
    configureServer(server) {
      server.middlewares.use('/save-shape', (req, res) => {
        // reads JSON body: { ttl, path, meta }
        // writes public/shapes/<path>.ttl
        // updates public/shapes/index.json
      });
    }
  };
}
```

This middleware is **not available in the production build** (`npm run build`). The Library button is hidden in production.

## Adding new shapes manually

1. Place the `.ttl` file somewhere under `public/shapes/`.
2. Add an entry to `public/shapes/index.json`:

```json
{
  "path":     "user/MyClassShape.ttl",
  "source":   "user",
  "kg":       "dbpedia",
  "gen_mode": "manual",
  "model":    "",
  "variant":  "user",
  "class":    "MyClass"
}
```

3. The Shape Library picks it up on next page load — no code changes needed.

### Turtle requirements

- Must be valid Turtle parseable by n3.js.
- At least one `rdf:type sh:NodeShape` subject.
- `sh:targetClass` for the target class.
- For Wikidata shapes: include `sh:name "Label"@en` on the NodeShape subject.
- Avoid bare `:` prefixes — n3.js requires all namespace prefixes to be declared.

## Adding a new built-in deck

1. Create `public/decks/<id>.json` (see [data-formats.md](data-formats.md) for schema).
2. Add a summary to `public/decks/index.json`.
3. (Optional) Place a logo at `public/img/<id>.png` and register it in `DeckView.jsx`:

```js
const DECK_LOGOS = {
  doubleshapresso: '/img/doubleshapresso.png',
  myNewDeck:       '/img/myNewDeck.png',
};
```

## Knowledge graph logos

| File | Used for |
|---|---|
| `public/img/dbpedia.png` | KG chips, card badges, table pills |
| `public/img/yago.png` | same |
| `public/img/wikidata.png` | same |

Rendered via the `KgLogo` component (exported from `DeckView.jsx`) or directly with `<img src="/img/{kg}.png">`.

## Project structure

```
shacl-editor/
  public/
    decks/                 ← built-in deck JSON
    eval/                  ← evaluation run results
    img/                   ← KG and deck logos
    shapes/                ← .ttl files + index.json
  src/
    App.jsx                ← root component, navigation state, fusion load effect
    App.css                ← all styles (~4 500 lines)
    components/
      ShapeLibrary.jsx     ← Shape Library module
      DeckView.jsx         ← Shape Deck Builder (DeckView, DeckBuilder, dialogs)
      ShapeFusion.jsx      ← Shape Fusion module (picker, diff preview, fuse)
      NamespaceStudio.jsx  ← Namespace Manager
      TopicStudio.jsx      ← Shape Topic Designer
      ShapeArena.jsx       ← evaluation leaderboard
      ShapeReport.jsx      ← validation report viewer
      ShapeListView.jsx    ← Shape Builder — list view
      CodeEditorView.jsx   ← Shape Builder — code view
      ConstraintPanel.jsx  ← property constraint editor
      ConfigPanel.jsx      ← prefix + ontology configuration
      nodes/
        NodeShapeNode.jsx
        PropertyShapeNode.jsx
        LogicNode.jsx
      edges/
        PropertyEdge.jsx
    utils/
      turtleImport.js      ← .ttl → ReactFlow nodes/edges
      turtleExport.js      ← ReactFlow nodes/edges → .ttl
      translator.js        ← SHACL ↔ ShEx API calls
      graphLayout.js       ← Dagre auto-layout
      topicColors.js       ← deterministic colour per topic
  translator_server.py     ← optional FastAPI ShEx translator
  vite.config.js           ← Vite config + saveShapePlugin middleware
```

## Building for production

```bash
npm run build      # output → shacl-editor/dist/
```

`dist/` is a standard Vite SPA. Serve it from any static host or CDN. All files under `public/` (shapes, decks, images) are copied verbatim.

> **Note:** The `📚 Library` save button requires the Vite dev-server middleware. It is absent in the production build.

## Linting / type-checking

No linter is configured. The project uses plain JSX (no TypeScript). Vite reports syntax errors during `npm run dev`.
