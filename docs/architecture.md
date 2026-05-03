# Architecture

## Tech stack

| Layer | Choice |
|---|---|
| UI framework | React 18 + Vite |
| Graph canvas | @xyflow/react v12 (ReactFlow) |
| Turtle parsing | n3.js |
| Styling | Plain CSS (App.css, ~4 300 lines) |
| Storage | `localStorage` for user-created decks |
| Translator server | FastAPI (Python), `main.py`, port 8765 |

## Top-level component tree

```
App (App.jsx)
├── ShapeLibrary          ← default view
├── DeckView              ← "Shape of the Deck"
├── ShapeArena            ← side-by-side diff
├── ShapeFusion           ← LLM-style merge
├── ShapeReport           ← evaluation metrics
└── Editor views (ReactFlow canvas, list, code)
    ├── NodeShapeNode
    ├── PropertyShapeNode
    ├── LogicNode
    └── ConstraintPanel
```

## Navigation model

`App.jsx` keeps a single `activeMode` state:

```
'library' | 'decks' | 'arena' | 'fusion' | 'report' | 'editor'
```

Switching modes replaces the full-page content. There is no router — every view is a full-screen React component returned directly from `App`.

## Data flow (Shape Library → Editor)

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
| `utils/turtleImport.js` | Parse `.ttl` → ReactFlow nodes/edges. Handles absolute IRIs, `sh:name`, `wd:/wdt:` prefixes |
| `utils/turtleExport.js` | ReactFlow nodes/edges → Turtle text |
| `utils/translator.js` | SHACL ↔ ShEx via FastAPI (`/api/translate/*`) |
| `utils/graphLayout.js` | Dagre-based auto-layout |
| `utils/topicColors.js` | Deterministic colour per ontology topic |
| `data/shaclConstraints.js` | SHACL constraint catalogue + default prefixes |

## CSS architecture

All styles live in `src/App.css`. Class prefixes by component:

| Prefix | Component |
|---|---|
| `yu-` | ShapeLibrary (Yugioh-style cards) |
| `dk-` | DeckView / DeckDetail |
| `dkb-` | DeckBuilder form |
| `qs-` | QuickSaveDeckDialog |
| `atd-` | AddToDeckDialog |
| `rp-` | ShapeReport |
| `ar-` | ShapeArena |
| `sf-` | ShapeFusion |
| `app-`, `cap-`, `tfp-` | Editor / toolbar / topic filter |
