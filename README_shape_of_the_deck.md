# Shape of the Deck

> A curated deck system for comparing SHACL shape sets across knowledge graphs and generation methods.

## Concept

A **deck** is a named, structured collection of shape sets — like a Yugioh card deck, but for SHACL shapes.

Each deck defines:
- A set of **target classes** (e.g., `Airport`, `City`, `Person`)
- A set of **slots**, each representing one shape generation approach (Ground Truth, LLM model, ShExer, etc.)
- Optionally: links to evaluation runs (`metrics.json`) for each slot

The deck browser lets you navigate the full matrix of **class × approach**, load any individual shape into the editor, and compare shape quality at a glance.

---

## Deck structure

### `public/decks/index.json`

Registry of all available decks:

```json
[
  {
    "id": "doubleshapresso",
    "name": "DoubleShapresso",
    "icon": "☕",
    "kgs": ["dbpedia", "yago"],
    "slots_count": 6
  }
]
```

### `public/decks/{id}.json`

Full deck definition:

```json
{
  "id": "doubleshapresso",
  "slots": [
    {
      "id": "gt-dbpedia",
      "label": "Ground Truth",
      "kg": "dbpedia",
      "icon": "👑",
      "color": "#c89b3c",
      "eval_run": "GT_aligned_calibrated",
      "filter": { "source": "ground-truth", "kg": "dbpedia", "variant": "dbpedia-aligned" }
    }
  ],
  "classes": {
    "dbpedia": ["Airport", "Artist", ...],
    "yago": ["AdministrativeArea", "Airline", ...]
  }
}
```

Each **slot filter** maps to entries in `public/shapes/index.json` using:
- `source` — `"ground-truth"`, `"shapes_generated"`, or `"shexer"`
- `kg` — `"dbpedia"`, `"yago"`, or `"wikidata"`
- `gen_mode` — e.g. `"shacl/local"`, `"shacl/triples"`
- `model` — e.g. `"deepseek-chat"`, `"gpt-4o-mini"`
- `variant` — e.g. `"dbpedia-aligned"`

---

## DoubleShapresso deck

The first deck, **DoubleShapresso**, covers the core evaluation from the paper:

| Slot | KG | Source | Eval run |
|------|----|--------|----------|
| 👑 Ground Truth | DBpedia | `ground-truth/dbpedia-aligned` | `GT_aligned_calibrated` |
| 🤖 DeepSeek Local | DBpedia | `shapes_generated/shacl/local/deepseek-chat` | `Deep-seek-local` |
| 🔬 ShExer | DBpedia | `shexer/dbpedia` | `Shexer` |
| 👑 Ground Truth | YAGO | `ground-truth/yago` | `GT_yago` |
| 🤖 DeepSeek Triples | YAGO | `shapes_generated/shacl/triples/deepseek-chat` | `ds_triples_yago` |
| 🔬 ShExer | YAGO | `shexer/yago` | `shexer_yago` |

**DBpedia classes (20):** Airport, Artist, Astronaut, Athlete, Building, CelestialBody, City, ComicsCharacter, Company, Film, Food, MeanOfTransportation, Monument, MusicalWork, Person, Politician, Scientist, SportsTeam, University, WrittenWork

**YAGO classes (37):** AdministrativeArea, Airline, Airport, AstronomicalObject, Award, BeliefSystem, BodyOfWater, Book, City, Continent, Corporation, Country, CreativeWork, Creator, EducationalOrganization, Election, Event, FictionalEntity, Gender, HumanMadeGeographicalEntity, Landform, Language, Movie, MusicComposition, MusicGroup, Newspaper, Organization, PerformingGroup, Person, Politician, Product, Scientist, SportsPerson, TVSeries, Taxon, Way, Worker

---

## Adding a new deck

1. Create `public/decks/{my-deck}.json` following the schema above.
2. Add a summary entry to `public/decks/index.json`.
3. Ensure the referenced `.ttl` files are present under `public/shapes/` and indexed in `public/shapes/index.json`.

The deck browser will automatically pick up the new deck on next page load.

---

## Directory layout

```
public/
  decks/
    index.json              # deck registry
    doubleshapresso.json    # DoubleShapresso deck definition
  shapes/
    index.json              # flat index of all 568 shape files
    ground-truth/SHACL/
    shapes_generated/
    shexer/

src/components/
  DeckView.jsx              # "Shape of the Deck" UI component
```
