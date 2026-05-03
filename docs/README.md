# SHACLEditor — Documentation Index

SHACLEditor is a browser-based tool for creating, visualising, and comparing SHACL shape graphs. It ships with a library of 568 pre-built shapes covering DBpedia, YAGO, and Wikidata, and lets you build curated "decks" for comparative analysis.

## Guides

| File | What it covers |
|---|---|
| [architecture.md](architecture.md) | Component map, data flow, tech stack |
| [shape-library.md](shape-library.md) | Browsing, loading, and filtering shapes |
| [shape-of-the-deck.md](shape-of-the-deck.md) | Deck system — creating and using shape decks |
| [data-formats.md](data-formats.md) | shapes/index.json, deck JSON, Turtle conventions |
| [development.md](development.md) | Local setup, Vite proxy, adding new shapes |

## Quick start

```bash
cd shacl-editor
npm install
npm run dev        # → http://localhost:5173
```

The app opens on the Shape Library. Use the nav buttons (Decks · Fusion · Arena · Report) in the top-right to switch views.
