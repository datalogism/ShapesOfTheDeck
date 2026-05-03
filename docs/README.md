# ShapeOfTheDecks — Documentation Index

> **⚠️ Beta** — ShapeOfTheDecks is in active development. APIs and file formats may change between releases.

ShapeOfTheDecks is a local, browser-based workbench for working with SHACL shapes extracted from knowledge graphs. It ships with 606 pre-built shapes covering DBpedia, YAGO, and Wikidata, and provides a complete workflow from browsing a curated library to building, fusing, annotating, and evaluating shapes.

## Guides

| File | What it covers |
|---|---|
| [architecture.md](architecture.md) | Component map, navigation model, data flow, tech stack, CSS conventions |
| [shape-library.md](shape-library.md) | Browsing, filtering, loading, and selecting shapes |
| [shape-of-the-deck.md](shape-of-the-deck.md) | Deck system — creating and using shape decks |
| [data-formats.md](data-formats.md) | `shapes/index.json`, deck JSON, Turtle conventions, evaluation results |
| [development.md](development.md) | Local setup, save-shape middleware, adding new shapes and decks |

## Quick start

```bash
cd shacl-editor
npm install
npm run dev        # → http://localhost:5173
```

The app opens on the **Shape Library**. Use the navigation bar to switch between modules:

| Nav item | Module |
|---|---|
| Library | Shape Library |
| Decks | Shape Deck Builder |
| Fusion | Shape Fusion |
| Namespaces | Namespace Manager |
| Topics | Shape Topic Designer |
| (Shape Builder opens when a shape is loaded) | |

## User tutorial

A complete walkthrough with annotated screenshots is at [../tutorial/TUTORIAL.md](../tutorial/TUTORIAL.md).
