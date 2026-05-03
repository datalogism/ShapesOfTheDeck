# Data Formats

## Shape index — `public/shapes/index.json`

An array of shape entry objects. 568 entries at current count.

```json
{
  "path":     "ground-truth/SHACL/dbpedia-aligned/Actor.ttl",
  "source":   "ground-truth",
  "kg":       "dbpedia",
  "gen_mode": null,
  "model":    null,
  "variant":  "dbpedia-aligned",
  "class":    "Actor"
}
```

| Field | Values |
|---|---|
| `source` | `ground-truth` · `shapes_generated` · `shexer` |
| `kg` | `dbpedia` · `yago` · `wikidata` |
| `gen_mode` | `shacl/local` · `shacl/triples` · `shacl/global` · `shacl_orig/global` · `null` |
| `model` | `deepseek-chat` · `gpt-4o-mini` · `null` |
| `variant` | `dbpedia-aligned` · `dbpedia-complete` · `dbpedia-v0` · `dbpedia-v1` · `yago` · `shexer` · `wes_shacl` · `shacl/<mode>/<model>` |
| `class` | Human-readable class name (e.g. `Actor`, `City`) |

The `path` is relative to `public/shapes/`. To fetch a shape: `fetch('/shapes/' + entry.path)`.

## Directory structure under `public/shapes/`

```
public/shapes/
  index.json
  ground-truth/
    SHACL/
      dbpedia-aligned/    ← 20 DBpedia classes, GT aligned
      dbpedia-complete/   ← same classes, more properties
      dbpedia-v0/         ← older version
      dbpedia-v1/
      wes_shacl/          ← 53 Wikidata classes (QID filenames)
      yago/               ← YAGO GT shapes
  shapes_generated/
    shacl/
      local/deepseek-chat/dbpedia/
      local/deepseek-chat/yago/
      local/gpt-4o-mini/...
      triples/...
      global/...
    shacl_orig/...
  shexer/
    dbpedia/
    yago/
```

## Turtle conventions

Shapes use standard SHACL Turtle. The parser (`turtleImport.js`) handles:

- Prefix declarations: `@prefix sh: <...> .`
- Node shapes: resources with `rdf:type sh:NodeShape`
- Target class: `sh:targetClass`
- Property shapes: `sh:property [ sh:path ... ; sh:constraint ... ]`
- Label extraction priority:
  1. `sh:name "label"@en` (used by Wikidata `wes_shacl` shapes)
  2. Local name of the subject IRI, stripping `Shape` suffix
  3. For absolute IRIs (`<http://...>`): extract last path segment

### Wikidata shapes (`wes_shacl`)

Files are named after Wikidata QIDs (e.g. `Q5.ttl` for Person). They use:
- Absolute IRI subjects: `<http://shaclshapes.org/DiseaseShape>`
- `sh:name "Disease"@en` for the human-readable label
- `wd:`, `wdt:` prefixes for Wikidata properties

## Deck index — `public/decks/index.json`

Array of deck summaries shown in the Deck list:

```json
[
  {
    "id":           "doubleshapresso",
    "name":         "DoubleShapresso",
    "icon":         "☕",
    "color":        "#c89b3c",
    "description":  "GT vs DeepSeek-V3 vs ShExer ...",
    "kgs":          ["dbpedia", "yago"],
    "slots_count":  6,
    "classes_count": { "dbpedia": 20, "yago": 37 }
  }
]
```

`slots_count` and `classes_count` are display-only — the real data is in the full deck file.

## Full deck — `public/decks/<id>.json`

```json
{
  "id":          "doubleshapresso",
  "name":        "DoubleShapresso",
  "icon":        "☕",
  "color":       "#c89b3c",
  "description": "...",
  "kgs":         ["dbpedia", "yago"],
  "slots": [
    {
      "id":       "gt-dbpedia",
      "label":    "Ground Truth",
      "kg":       "dbpedia",
      "icon":     "👑",
      "color":    "#c89b3c",
      "eval_run": "dbpedia_gt",
      "filter": {
        "source":  "ground-truth",
        "kg":      "dbpedia",
        "variant": "dbpedia-aligned"
      }
    }
  ],
  "classes": {
    "dbpedia": ["Actor", "Airport", ...],
    "yago":    ["Athlete", "City", ...]
  }
}
```

`classes` lists which class names appear in each KG tab. This is pre-computed at deck creation time but can be extended without breaking anything — `buildMatrix()` matches on-the-fly.

## User deck (localStorage)

Identical schema to the full deck JSON, plus `_userCreated: true`. Stored as:

```
localStorage["shapedeck_user-my-deck-1748000000000"] = JSON.stringify(deck)
```

Path-list slots (created from library selection) use:
```json
"filter": { "paths": ["ground-truth/SHACL/yago/Actor.ttl", "..."] }
```

## Evaluation results — `public/eval/`

Used by `ShapeReport`. Format:

```
public/eval/
  index.json    ← list of run summaries (id, label, path, kg, source)
  <id>.json     ← full run report (global stats + per-shape breakdown)
```

See `ShapeReport.jsx` for the exact schema consumed.
