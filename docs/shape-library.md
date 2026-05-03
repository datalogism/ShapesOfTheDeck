# Shape Library

The Shape Library is the home screen of ShapeOfTheDecks. It displays all 606 shapes as cards and lets you filter, inspect, load, compare, and select them.

## Layout

```
┌────────────────────────────────────────────────────────┐
│  Header: title · nav buttons · Analysis · + New        │
│  Filter bar: KG / Source / Mode / Model / Search       │
│  Save-as-Deck bar (when filters are active)            │
├──────────────────────────────┬─────────────────────────┤
│  Card grid (scrollable)      │  Right panel            │
│  [□ Person]  [□ City] …      │  Stats table  /  Charts │
│                              │  (opens on card click)  │
│  ──────────────────────────  │                         │
│  📌 N shapes selected        │                         │
│  [Clear]  [Add to Deck →]    │                         │
└──────────────────────────────┴─────────────────────────┘
```

## Shape counts

| Source | Shapes |
|---|---:|
| Ground Truth | 169 |
| LLM-generated (DeepSeek-V3, GPT-4o-mini) | 342 |
| ShExer | 57 |
| Kastor | 38 |
| **Total** | **606** |

Knowledge graphs covered: **DBpedia · YAGO · Wikidata**.

## Filters

| Filter | Values |
|---|---|
| KG | All · DBpedia · YAGO · Wikidata |
| Source | All · Ground Truth · LLM Generated · ShExer · Kastor |
| Mode | All · Local · Triples · Global · Global (orig) |
| Model | All · DeepSeek-V3 · GPT-4o-mini |
| Search | Free-text on class name |

Filters combine with AND. The count chip updates live.

## Card interactions

**Click the card body** — opens the Stats panel on the right. Shows all variants of that class in a table with property-type statistics and **Load** / **Clone** buttons.

**Click the □ checkbox** (bottom-right of card) — toggles all variants of that class into the selection set. The checkbox shows:
- `□` — nothing selected
- `▣` — some variants selected
- `☑` — all variants selected

Cards with any selection get a highlighted outline.

## Loading a shape into the Shape Builder

Click **Load** in the Stats panel row for a specific variant. The app switches to the **Shape Builder** in graph view with that shape loaded.

**Clone** works the same way but names the shape `<original> (clone)`, giving you an independent editable copy.

## Selection bar

Appears at the bottom of the card grid when `selectedPaths.size > 0`:

```
📌 3 shapes selected    [Clear]  [Add to Deck →]
```

**Add to Deck →** opens `AddToDeckDialog` with two modes:
- **New Deck** — creates a fresh user deck with one slot containing the selected paths.
- **Add to Existing** — appends a new slot to an existing user deck from localStorage.

Both modes ask for a deck name and slot name. After saving, the app navigates to the Decks view.

## Right panel — Stats tab

Each row corresponds to one shape file (one entry in `shapes/index.json`). Columns:

| Column | Meaning |
|---|---|
| Variant | Source + mode label |
| KG | DBpedia / YAGO / Wikidata logo |
| Tot. | Total `sh:property` blocks |
| DT | Datatype properties (`sh:datatype` or `sh:nodeKind sh:Literal`) |
| Obj | Object properties (`sh:class` or IRI node kind) |
| No Range | Properties with neither DT nor Obj |
| Mand. | `sh:minCount ≥ 1` |
| Funct. | `sh:maxCount = 1` |
| □ | Per-row selection checkbox for fine-grained deck building |

## Right panel — Analysis tab

Aggregate bar charts for the full filtered set:
- Duelist Sources (by generation source)
- Knowledge Graph Arena (by KG)
- Class Coverage (unique classes per source)
- LLM Battle Modes (by generation strategy)
- AI Models (by language model)
- Variant Depth (histogram: how many classes have N variants)
- Top Classes (most represented by variant count)

## Side-by-side comparison

From the Stats panel, open any two variants of the same class using **Load** to have them side-by-side in the Shape Builder for manual inspection. For a diff-based comparison, use the **Shape Fusion** module.

## Save as Deck (filter-based)

When any filter differs from "All", a banner appears below the filter bar:

```
N shapes selected    [📦 Save as Deck]
```

This creates a deck slot using the current filter object (source/kg/mode/model). Every shape that matches the filter at save time is included. Future index additions that match will also appear in the slot automatically.

This is distinct from the selection-based **Add to Deck**, which stores an explicit list of paths (`filter.paths`).
