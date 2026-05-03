# Architecture

## Tech stack

| Layer | Choice |
|---|---|
| UI framework | React 19 + Vite 8 |
| Graph canvas | @xyflow/react v12 (ReactFlow) |
| Graph layout | @dagrejs/dagre |
| Turtle parsing & serialisation | n3.js v2 |
| Code editor | @uiw/react-codemirror (CodeMirror 6) |
| Styling | Plain CSS (`App.css`, ~4 500 lines) |
| Shape persistence | `localStorage` (user decks + user shapes) |
| Optional translator | FastAPI + shaclex-py (Python 3.10+), port 8765 |

## Top-level component tree

```
App (App.jsx)
├── ShapeLibrary          ← Shape Library module (default view)
├── DeckView              ← Shape Deck Builder
├── ShapeFusion           ← Shape Fusion module
├── NamespaceStudio       ← Namespace Manager
├── TopicStudio           ← Shape Topic Designer
├── ShapeArena            ← evaluation leaderboard
├── ShapeReport           ← validation report viewer
└── Shape Builder views (ReactFlow canvas, list, code)
    ├── NodeShapeNode
    ├── PropertyShapeNode
    ├── LogicNode
    └── ConstraintPanel
```

## Navigation model

`App.jsx` keeps a single `activeMode` state:

```
'library' | 'decks' | 'fusion' | 'namespaces' | 'topics' | 'arena' | 'report' | 'editor'
```

Switching modes replaces the full-page content. There is no router — every view is a full-screen React component rendered directly from `App`.

## Data flow: Shape Library → Shape Builder

```
/shapes/index.json ──► ShapeLibrary (filteredEntries)
                              │  user clicks Load
                              ▼
                     fetch /shapes/<path>.ttl
                              │
                     importFromTurtle()   (utils/turtleImport.js)
                              │
                     { nodes, edges }  ──► ReactFlow canvas
```

## Data flow: Shape Fusion → Shape Builder (new tab)

```
ShapeFusion: buildFusedTurtle()
                    │
          localStorage.setItem(key, JSON.stringify({ ttl, name }))
                    │
          window.open('...?load=<key>', '_blank')
                    │
          App.jsx useEffect reads ?load param
                    │
          sessionStorage guard (StrictMode-safe)
                    │
          importFromTurtle(ttl) ──► ReactFlow canvas in editor mode
```

The `sessionStorage` guard (key `_sf_done_<key>`) prevents React 19 StrictMode's double-effect invocation from consuming the localStorage entry twice.

## Data flow: Save to Library (dev only)

```
Shape Builder toolbar: 📚 Library
                    │
          POST /save-shape  { ttl, path, meta }
                    │
          Vite configureServer middleware (saveShapePlugin)
                    │
          fs.writeFileSync(public/shapes/<path>.ttl)
          update public/shapes/index.json
```

This middleware only runs in dev mode (`npm run dev`). The button is hidden in the production build.

## Deck data flow

```
/decks/index.json ──► DeckView (serverDecks)
localStorage        ──► DeckView (userDecks)
                              │  user opens deck
                              ▼
                     /decks/<id>.json (built-in)
                     OR localStorage value (user)
                              │
                     matchSlot(entry, filter) per slot
                              │
                     DeckDetail matrix (class × slot)
```

## Key utilities

| File | Purpose |
|---|---|
| `utils/turtleImport.js` | Parse `.ttl` → ReactFlow nodes/edges. Handles absolute IRIs, `sh:name`, `wd:/wdt:` prefixes, topic section comments |
| `utils/turtleExport.js` | ReactFlow nodes/edges → Turtle text |
| `utils/translator.js` | SHACL ↔ ShEx via FastAPI (`/api/translate/*`) |
| `utils/graphLayout.js` | Dagre-based auto-layout (UML and VOWL modes) |
| `utils/topicColors.js` | Deterministic colour per ontology topic |

## CSS architecture

All styles live in `src/App.css`. Class prefixes by component:

| Prefix | Component |
|---|---|
| `yu-` | ShapeLibrary |
| `dk-` | DeckView / DeckDetail |
| `dkb-` | DeckBuilder form |
| `qs-` | QuickSaveDeckDialog |
| `atd-` | AddToDeckDialog |
| `rp-` | ShapeReport |
| `ar-` | ShapeArena |
| `sf-` | ShapeFusion (including `sf-badge-*` model badges, `sf-cp-*` colored preview) |
| `ns-` | NamespaceStudio |
| `ts-` | TopicStudio |
| `app-`, `cap-`, `tfp-` | Shape Builder / toolbar / topic filter panel |
| `sld-` | SaveLibraryDialog |
