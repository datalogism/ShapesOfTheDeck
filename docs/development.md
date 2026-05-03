# Development Guide

## Prerequisites

- Node.js 18+
- Python 3.10+ (only for the ShEx translator server)

## Setup

```bash
cd shacl-editor
npm install
npm run dev          # Vite dev server on http://localhost:5173
```

The app is also available on port 5174 or 5175 if 5173 is busy (Vite auto-increments).

## Vite proxy

`vite.config.js` proxies `/api` → `http://localhost:8765` for the optional ShEx translator:

```js
server: {
  proxy: {
    '/api': 'http://localhost:8765'
  }
}
```

The translator server (`main.py` at the project root) is a FastAPI app. Start it with:

```bash
cd ..          # project root
python main.py
```

The UI shows a coloured dot (green = online, red = offline) next to the → ShEx / ← ShEx buttons.

## Adding new shapes

1. Place the `.ttl` file somewhere under `public/shapes/`.
2. Add an entry to `public/shapes/index.json`:

```json
{
  "path":     "ground-truth/SHACL/wes_shacl/Q5.ttl",
  "source":   "ground-truth",
  "kg":       "wikidata",
  "gen_mode": null,
  "model":    null,
  "variant":  "wes_shacl",
  "class":    "Human"
}
```

3. The Shape Library picks it up on next page load — no code changes needed.

### Turtle requirements

- Must be valid Turtle parseable by n3.js.
- At least one `rdf:type sh:NodeShape` subject.
- `sh:targetClass` for the target.
- For Wikidata shapes: include `sh:name "Label"@en` on the NodeShape subject.

## Adding a new built-in deck

1. Create `public/decks/<id>.json` (see [data-formats.md](data-formats.md) for schema).
2. Add a summary to `public/decks/index.json`.
3. (Optional) Place a logo at `public/img/<id>.png` and register in `DeckView.jsx`:

```js
const DECK_LOGOS = {
  doubleshapresso: '/img/doubleshapresso.png',
  myNewDeck:       '/img/myNewDeck.png',   // ← add this
};
```

## Knowledge graph logos

Logos for DBpedia, YAGO, and Wikidata are at `public/img/`:

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
    decks/           ← built-in deck JSON
    eval/            ← evaluation run results
    img/             ← KG and deck logos
    shapes/          ← .ttl files + index.json
  src/
    App.jsx          ← root component, navigation state
    App.css          ← all styles (~4 400 lines)
    components/
      DeckView.jsx   ← Deck system (DeckView, DeckBuilder, AddToDeckDialog, …)
      ShapeLibrary.jsx
      ShapeArena.jsx
      ShapeFusion.jsx
      ShapeReport.jsx
      ConstraintPanel.jsx
      ConfigPanel.jsx
      CodeEditorView.jsx
      ShapeListView.jsx
      TurtleExportPanel.jsx
      ImportModal.jsx
      nodes/
        NodeShapeNode.jsx
        PropertyShapeNode.jsx
        LogicNode.jsx
      edges/
        PropertyEdge.jsx
    data/
      shaclConstraints.js   ← constraint catalogue, default prefixes
      commonPrefixes.js
    utils/
      turtleImport.js       ← .ttl → ReactFlow
      turtleExport.js       ← ReactFlow → .ttl
      translator.js         ← SHACL ↔ ShEx API calls
      graphLayout.js        ← Dagre auto-layout
      ontologyLoader.js
      topicColors.js
```

## Building for production

```bash
npm run build      # → dist/
```

The build is a standard Vite SPA. Serve `dist/` from any static host. All shape files in `public/` are copied verbatim.

## Linting / type-checking

No linter is configured. The project uses plain JSX (no TypeScript). Vite reports syntax errors during `npm run dev`.
