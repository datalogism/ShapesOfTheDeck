# Shape Deck Builder

The Shape Deck Builder is the deck management module. A **deck** is a named collection of **slots**, where each slot selects a subset of shapes from the library. The Deck Detail view renders a class × slot matrix, making it easy to track coverage and compare generation methods across ontology classes.

## Deck anatomy

```json
{
  "id": "doubleshapresso",
  "name": "DoubleShapresso",
  "icon": "☕",
  "color": "#c89b3c",
  "description": "GT vs DeepSeek-V3 vs ShExer — evaluated on DBpedia & YAGO",
  "kgs": ["dbpedia", "yago"],
  "slots": [ ... ],
  "classes": {
    "dbpedia": ["Actor", "Airport", ...],
    "yago": ["Athlete", "City", ...]
  }
}
```

## Slot anatomy

A slot has either a **filter** (dynamic — matches whatever the index contains at runtime) or an explicit **paths** list (static — exact shape files).

### Filter-based slot
```json
{
  "id": "gt-dbpedia",
  "label": "Ground Truth",
  "kg": "dbpedia",
  "icon": "👑",
  "color": "#c89b3c",
  "filter": {
    "source": "ground-truth",
    "kg": "dbpedia",
    "variant": "dbpedia-aligned"
  }
}
```

### Path-based slot (created from library selection)
```json
{
  "id": "s1748000000000",
  "label": "My selection",
  "kg": "dbpedia",
  "icon": "📌",
  "color": "#475569",
  "filter": {
    "paths": [
      "ground-truth/SHACL/dbpedia-aligned/Actor.ttl",
      "shapes_generated/shacl/local/deepseek-chat/dbpedia/Actor.ttl"
    ]
  }
}
```

`matchSlot(entry, filter)` in `DeckView.jsx` handles both cases: it checks `filter.paths` first; if absent, it falls back to field-by-field matching.

## Built-in decks

Served as static JSON files from `public/decks/`:

```
public/decks/
  index.json           ← list of deck summaries (id, name, icon, kgs, slots_count, …)
  doubleshapresso.json ← full deck with slots and classes
```

Built-in decks are **read-only** — they cannot be deleted from the UI.

### DoubleShapresso

The first built-in deck. Compares three generation methods across two KGs:

| Slot | Source | KG |
|---|---|---|
| Ground Truth | ground-truth (dbpedia-aligned) | DBpedia |
| DeepSeek Local | shapes_generated, shacl/local, deepseek-chat | DBpedia |
| ShExer | shexer | DBpedia |
| Ground Truth | ground-truth | YAGO |
| DeepSeek Triples | shapes_generated, shacl/triples, deepseek-chat | YAGO |
| ShExer | shexer | YAGO |

Coverage: 20 DBpedia classes · 37 YAGO classes.

## User decks

Stored in `localStorage` with key `shapedeck_<id>`. They carry `_userCreated: true` and can be deleted from the deck list (🗑 button). User decks persist across browser sessions.

### Creating a deck — three ways

**1. New Deck button** (Decks view)  
Opens `DeckBuilder`. Define name, icon, description, then add slots. Each slot has a KG picker, source chips, mode/model selects, variant select, and a live match count.

**2. Save as Deck** (Shape Library filter bar)  
Appears when any filter differs from "All". One click → `QuickSaveDeckDialog` → names the deck and the slot, saves the filter object.

**3. Add to Deck** (Shape Library selection bar)  
Select individual shapes using the card checkboxes or the per-row checkboxes in the Stats panel. Click **Add to Deck →** → `AddToDeckDialog`:
- **New Deck** — creates a deck with one path-list slot.
- **Add to Existing** — appends a path-list slot to an existing user deck.

**4. Clone a shape from the library**  
After loading a shape into the Shape Builder, any edited clone can be saved to `localStorage` for later retrieval.

## Deck Detail view

```
← Decks   ☕ DoubleShapresso                        72% coverage
───────────────────────────────────────────────
[DBpedia]  [YAGO]
───────────────────────────────────────────────
Class        Ground Truth   DeepSeek   ShExer
Actor        [Load]         [Load]     —
Airport      [Load]         —          [Load]
...
```

Each cell shows **Load** if a matching shape exists in the index, or **—** if not. Clicking **Load** opens the shape in the Shape Builder.

The KG tab switcher filters slots and classes to the selected knowledge graph. The coverage percentage shows how many cells in the matrix are filled.

## Adding a new built-in deck

1. Create `public/decks/<id>.json` following the deck schema above.
2. Add a summary entry to `public/decks/index.json`.
3. Optionally place a logo image at `public/img/<id>.png` and add it to `DECK_LOGOS` in `DeckView.jsx`.

No code changes are needed beyond step 3 — `DeckView` fetches both files at runtime.
