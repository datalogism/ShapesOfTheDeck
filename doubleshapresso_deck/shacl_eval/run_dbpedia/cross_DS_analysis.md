# Cross-Dataset SHACL Validation Analysis — DBpedia

> Generated: 2026-04-29  
> Evaluation sample: 1,300–1,400 nodes per run (100 nodes/class, 13–14 evaluable classes)  
> Tolerance threshold: p = 0.50 (trust ≥ 50% required for acceptance)  
> Shape sets compared:
> - **Shexer** — statistics-based extractor (`baselines/shexer/dbpedia/shacl`)
> - **DeepSeek-local** — LLM-generated shapes (DeepSeek-V3, local prompt mode)
> - **GT aligned (calibrated)** — human expert shapes (`dataset/SHACL/dbpedia-aligned`), baseline violation rate B = 0.90

---

## Table of Contents

1. [Overview of the three shape sets](#1-overview-of-the-three-shape-sets)
2. [Global validation dashboard](#2-global-validation-dashboard)
3. [Per-shape conformance comparison](#3-per-shape-conformance-comparison)
4. [Constraint vocabulary and violation breakdown](#4-constraint-vocabulary-and-violation-breakdown)
5. [Property coverage and shape density](#5-property-coverage-and-shape-density)
6. [Dominant failure modes per shape set](#6-dominant-failure-modes-per-shape-set)
7. [What differs structurally between the three shape sets](#7-what-differs-structurally-between-the-three-shape-sets)
8. [Contextualisation against FULL_analysis.md findings](#8-contextualisation-against-full_analysismd-findings)
9. [Shape validation in a ReAct agentic pipeline — added value, risks, and expected improvements](#9-shape-validation-in-a-react-agentic-pipeline--added-value-risks-and-expected-improvements)

---

## 1. Overview of the three shape sets

| Attribute | Shexer | DeepSeek-local | GT aligned |
|---|---|---|---|
| **Origin** | Statistics-based KG extractor | LLM (DeepSeek-V3, local prompt) | Human domain experts |
| **Total shapes** | 21 (13 evaluable) | 20 (14 evaluable) | 20 (14 evaluable) |
| **Avg paths/shape** | ~22 (observed paths only) | ~27 (LLM-predicted) | ~32 (expert-designed) |
| **Constraint types used** | `sh:in`, `sh:maxCount`, `sh:nodeKind` | `sh:datatype`, `sh:minCount`, `sh:maxCount`, `sh:class`, `sh:or`, `sh:pattern`, `sh:minInclusive` | `sh:datatype`, `sh:minCount`, `sh:maxCount`, `sh:class`, `sh:nodeKind`, `sh:or` |
| **Baseline violation rate (B)** | 0% | 0% | 90% (calibrated run) |
| **Effective acceptance threshold** | 50% trust | 50% trust | 95% calibrated trust |
| **Sample size** | 1,300 nodes | 1,400 nodes | 1,400 nodes |

**Missing classes (no shape or empty target):** All three sets share the same missing-class pattern: Person, Politician, Scientist, SportsTeam, University, WrittenWork reach zero because the evaluated graph sample contains no nodes labelled with those classes under the available DBpedia dump. Shexer additionally lacks MusicalWork.

---

## 2. Global validation dashboard

| Metric | Shexer | DeepSeek-local | GT aligned (calibrated) |
|---|---|---|---|
| **Total violations** r(Σ) | **1,800** | 8,513 | 15,107 |
| **Violated shapes** | 12/13 (92%) | 14/14 (100%) | 14/14 (100%) |
| **Violated paths** | **6/175 (3.4%)** | 132/374 (35.3%) | 187/452 (41.4%) |
| **Violated focus nodes** | 851/1,300 (65.5%) | 1,349/1,400 (96.4%) | **1,400/1,400 (100%)** |
| **Violated constraint components** | 3/4 (75%) | 8/9 (89%) | 7/7 (100%) |
| **Most violated component** | `sh:in` | `sh:datatype` | `sh:minCount` |
| **Most violated path** | `rdf:type` | `foaf:name` | `foaf:name` |
| **Accepted shapes (trust ≥ 50%)** | **5** | 0 | 0 |

Three strikingly different profiles emerge. Shexer produces the fewest total violations and the only accepted shapes, but this is largely a consequence of its very sparse constraint vocabulary. DeepSeek shows a moderate violation count but richer constraint diversity. The GT shapes produce the highest absolute violation count — a direct consequence of their strict, expert-intended design and the well-known incompleteness of DBpedia.

---

## 3. Per-shape conformance comparison

Classes are sorted alphabetically. Missing classes (reach = 0) are omitted.

| Class | Shexer trust | Shexer accept | DeepSeek trust | DeepSeek accept | GT trust | GT accept |
|---|---:|---|---:|---|---:|---|
| Airport | 44% | rejected | 0% | rejected | 0% | rejected |
| Artist | 0% | rejected | 0% | rejected | 0% | rejected |
| Astronaut | 0% | rejected | 0% | rejected | 0% | rejected |
| Athlete | 0% | rejected | 0% | rejected | 0% | rejected |
| Building | **65%** | **accepted** | 0% | rejected | 0% | rejected |
| CelestialBody | 12% | rejected | 50% | rejected | 0% | rejected |
| City | **100%** | **accepted** | 1% | rejected | 0% | rejected |
| ComicsCharacter | 1% | rejected | 0% | rejected | 0% | rejected |
| Company | **66%** | **accepted** | 0% | rejected | 0% | rejected |
| Film | **79%** | **accepted** | 0% | rejected | 0% | rejected |
| Food | 2% | rejected | 0% | rejected | 0% | rejected |
| MeanOfTransportation | **76%** | **accepted** | 0% | rejected | 0% | rejected |
| Monument | 4% | rejected | 0% | rejected | 0% | rejected |
| MusicalWork | n/a | n/a | 0% | rejected | 0% | rejected |

**Shexer** is the only set that produces accepted shapes — five of them (Building, City, Company, Film, MeanOfTransportation). All accepted shapes share the characteristic that they have relatively stable type-value profiles in DBpedia (fewer rdf:type URI variants), so the `sh:in` enumeration constraint violations remain below 50%.

**DeepSeek-local** and **GT aligned** both score 0/14 accepted shapes, for entirely different reasons:
- DeepSeek fails because its predicted constraints (datatypes, mandatory properties, class references) are frequently wrong or overly strict.
- GT fails because the expert shapes describe an idealized view of DBpedia that the actual KG does not consistently satisfy — this is by design: GT shapes are aspirational, not descriptive.

### Notable outliers

**City (Shexer, 100% trust):** City is the single perfectly-conforming shape in the entire experiment. Shexer's City shape contains only `sh:path`, `sh:nodeKind`, and `sh:in` constraints on paths that are universally populated in DBpedia cities. The absence of any `sh:minCount` requirement means no mandatory-property violations can arise.

**CelestialBody (DeepSeek, 50% trust):** The only shape where DeepSeek achieves non-trivial trust. Half of sampled CelestialBody entities escape violations — consistent with CelestialBody being a relatively homogeneous class with predictable astronomical properties (mass, radius, temperature) that DeepSeek-V3 correctly infers from its training data.

**Airport (Shexer, 44% trust):** Close to acceptance; the main violation source is `sh:maxCount` on `dbo:comment` (54% of nodes have more than one comment). This is a DBpedia data-formatting issue, not a schema error.

---

## 4. Constraint vocabulary and violation breakdown

### 4.1 Shexer — constraint mix

Shexer uses a minimal, three-component vocabulary. Violations split cleanly into two root causes:

| Root cause | Mechanism | Examples |
|---|---|---|
| **Unexpected rdf:type values** | `sh:in` on `rdf:type` | Artist, Astronaut, Athlete: 63–94% of violations |
| **Multiple `dbo:comment` values** | `sh:maxCount 1` on `comment` | CelestialBody (84%), ComicsCharacter (100%), Monument (100%) |

Only **6 paths** are violated across 175 total — a path violation rate of 3.4%. This is the core paradox of Shexer: it generates few violations overall because it constrains almost nothing beyond what it directly observed in the KG sample it was extracted from. The shapes describe empirical observations rather than normative rules.

### 4.2 DeepSeek-local — constraint mix

DeepSeek uses a nine-component vocabulary including `sh:or`, `sh:pattern`, and `sh:minInclusive` — SHACL features the other two sets do not deploy simultaneously. Violations are spread across 132 paths (35% of 374 total):

| Component | Total violations | Share |
|---|---:|---:|
| `sh:datatype` | 2,061 | 24.2% |
| `sh:minCount` | 2,290 | 26.9% |
| `sh:class` | 1,544 | 18.1% |
| `sh:or` | 669 | 7.9% |
| `sh:maxCount` | 178 | 2.1% |
| `sh:nodeKind` | 70 | 0.8% |
| other | 1,701 | 20.0% |

**Datatype violations** are the single largest category: LLM predicts `xsd:string` where DBpedia stores `rdf:langString`, or `xsd:integer` where the graph uses `xsd:double`. This is a well-known LLM hallucination pattern on DBpedia — the model conflates type names from its training data without accounting for the specific XSD serialisation used by DBpedia infoboxes.

**minCount violations** are the second largest: DeepSeek frequently marks properties mandatory (e.g., `dbo:birthDate`, `foaf:name`) when the actual DBpedia population rate for that class is well below 100%. Properties like `dbo:birthName` or `dbo:nationality` are present on 30–60% of Person-subclass entities, so `sh:minCount 1` is violated by construction on the majority of sampled nodes.

### 4.3 GT aligned — constraint mix

The GT set uses the same SHACL vocabulary as DeepSeek but reflects domain-expert knowledge of what *should* be present:

| Component | Total violations | Share |
|---|---:|---:|
| `sh:minCount` | 8,102 | 53.6% |
| `sh:datatype` | 4,195 | 27.8% |
| `sh:class` | 2,126 | 14.1% |
| `sh:maxCount` | 447 | 3.0% |
| `sh:nodeKind` | 123 | 0.8% |
| `sh:or`, `sh:node` | 114 | 0.7% |

`sh:minCount` accounts for over half of all violations — completely different from DeepSeek (27%) and Shexer (0%). The GT shapes are aspirational: they specify mandatory properties that a well-curated DBpedia entity *should* have, but many DBpedia entities were automatically extracted from Wikipedia infoboxes and lack these fields. The most violated path is `foaf:name`, which the GT mandates with `sh:minCount 1`, yet many entities in the sampled graph expose only `rdfs:label`.

---

## 5. Property coverage and shape density

*Property coverage* measures the fraction of a shape's declared paths that appear at least once in the evaluation graph — it tells us whether the shape is describing real, present data.

| Class | Shexer cov | DeepSeek cov | GT cov |
|---|---:|---:|---:|
| Airport | 100% | 93.3% | 89.5% |
| Artist | 100% | 100% | 81.6% |
| Astronaut | 100% | 100% | 100% |
| Athlete | 100% | 80.0% | 45.7% |
| Building | 100% | 69.4% | 78.2% |
| CelestialBody | 100% | 100% | 96.6% |
| City | 100% | 77.5% | 74.0% |
| ComicsCharacter | 100% | 31.2% | 81.8% |
| Company | 100% | 96.9% | 91.9% |
| Film | 100% | 100% | 87.5% |
| Food | 100% | 69.6% | 87.0% |
| MeanOfTransportation | 100% | 92.6% | 77.4% |
| Monument | 100% | 44.4% | 44.4% |
| MusicalWork | n/a | 94.1% | 45.2% |
| **Average (evaluable)** | **100%** | **80.6%** | **76.4%** |

**Shexer achieves 100% property coverage on every shape** — by construction, since it only includes paths it directly observed in the KG data. This is a key differentiator: Shexer never generates phantom paths, while both DeepSeek and GT can include paths that are absent from the sampled graph.

**DeepSeek** shows the widest spread: ComicsCharacter (31.2%) and Monument (44.4%) expose severely phantom paths — the LLM predicted properties that are simply not used in DBpedia for those classes. By contrast, Artist, Astronaut, CelestialBody, Film, and Company reach 97–100%.

**GT** has low coverage for Athlete (45.7%), MusicalWork (45.2%), and Monument (44.4%). For Athlete this is expected: the GT `AthleteShape` contains 81 properties spanning all sports disciplines (rugby, baseball, cricket, basketball, etc.), but any individual sampled Athlete entity from one sport will only carry a small fraction of those paths. The low coverage reflects GT completeness, not data absence.

---

## 6. Dominant failure modes per shape set

### Shexer — rdf:type enumeration mismatch

The overwhelming failure mode is `sh:in` on `rdf:type`. Shexer extracted the set of rdf:type values it observed for each class from a sample, then constrained every entity to have those exact types. In practice, DBpedia entities of the same class carry different combinations of `rdf:type` values depending on what the Wikipedia infobox parser resolved at extraction time. The result is that ~14–16 enumerated type values per shape are rarely all present simultaneously, triggering violations in all people-related classes (Artist: 94% of violations, Athlete: 94%, Astronaut: 63%).

A secondary issue: `sh:maxCount 1` on `dbo:comment`. DBpedia stores multilingual comments via `dbo:abstract` and `rdfs:comment`, often with multiple language tags on the same subject — hence most entities carry more than one comment value.

These two failure modes explain essentially the entire violation budget (1,800 violations across 1,300 nodes).

### DeepSeek-local — constraint type hallucination

DeepSeek's failure mode is more diffuse but structurally more serious. It produces *correct paths* at a much higher rate than Shexer (132/374 violated vs 6/175), but the associated constraints are frequently incorrect:

1. **Wrong datatype** — the LLM predicts `xsd:string` for properties DBpedia stores as `rdf:langString`, predicts `xsd:integer` for values stored as `xsd:double`, etc. This accounts for 24% of violations.
2. **Mandatory properties that aren't universal** — `sh:minCount 1` on properties present in only 30–70% of entities. This accounts for 27% of violations.
3. **Wrong class reference** — the LLM uses `sh:class dbo:Band` where the actual target is a generic IRI, or misidentifies the target class of an object property. This accounts for 18%.

The resulting shapes correctly enumerate the right property *names* but attach constraints calibrated to a "textbook" or "Wikipedia lead section" view of the class rather than the actual DBpedia serialisation.

### GT aligned — DBpedia data incompleteness

The GT shapes fail not because they are wrong, but because DBpedia is incomplete. The expert-designed shapes specify that entities *should* have properties like `foaf:name`, `dbo:birthPlace`, `dbo:abstract`, `dbo:nationality` — all reasonable requirements for well-described entities. But DBpedia is an automatically extracted open-world KG: many infoboxes do not populate these fields, and Wikipedia's community coverage is uneven.

With a 90% baseline calibration (B = 0.90), the effective threshold is 95% trust, but calibrated trust is −11.1% for every evaluated class. Even accounting for the expected noise floor, the gap between the expert-mandated properties and the actual DBpedia fill rate is too large. This quantifies a known DBpedia limitation: the `dbpedia-aligned` shapes are approximately 35% mandatory-constraint density vs the data's actual fill rate.

---

## 7. What differs structurally between the three shape sets

### 7.1 Depth of constraints

| Dimension | Shexer | DeepSeek-local | GT aligned |
|---|---|---|---|
| **Mandatory properties** | None (no `sh:minCount`) | Many (often aggressive) | Many (aspirational) |
| **Datatype constraints** | None (only sh:in) | Extensive (often wrong) | Extensive (correct) |
| **Class references** | None | Extensive | Extensive |
| **Advanced SHACL** (`sh:or`, `sh:pattern`) | None | Present in 5+ shapes | Present in 5+ shapes |
| **Cardinality style** | Per-value `sh:maxCount` (1 per sh:in value) | Per-node `sh:minCount`/`sh:maxCount` | Per-node `sh:minCount`/`sh:maxCount` |
| **Value enumeration** (`sh:in`) | Dominant (rdf:type lists) | Absent | Rarely (City only) |

Shexer and GT are at opposite ends of the constraint depth spectrum. Shexer is purely observational: it records what values were seen but imposes no normative requirements. GT is purely normative: it specifies what a complete, well-curated entity should look like. DeepSeek falls between the two — it attempts normativity but with imprecise calibration.

### 7.2 Scope of the evaluated graph vs scope of the shapes

The three shape sets also differ in how well they *match* the scope of the evaluation graph:

- **Shexer** shapes cover exactly the paths present in the data (100% path coverage) → the evaluation graph and shapes are naturally aligned.
- **DeepSeek** shapes partially overshoot the data (80.6% average path coverage) → 20% of declared paths are phantom.
- **GT** shapes intentionally overshoot for completeness-heavy classes (76.4% average path coverage, down to 45% for Athlete/MusicalWork) → the shapes describe the ideal KG, not the actual one.

### 7.3 Violation intensity (violations per failing node)

| Shape set | Avg r(s)/v(s) across all shapes |
|---|---|
| **Shexer** | ~2.1 | 
| **DeepSeek-local** | ~5.9 |
| **GT aligned** | ~12.8 |

The GT shapes generate on average 12.8 violations per failing node — more than 6× Shexer and 2× DeepSeek. This reflects the depth of GT constraints: an entity that violates one GT property is typically missing several mandatory fields simultaneously. In Shexer, an entity either has the right rdf:type profile (conforming) or it doesn't (one or two violations). DeepSeek sits in between: failing nodes tend to fail 5–10 constraints simultaneously, mixing datatype and minCount violations.

### 7.4 Structural divergence in dominant violation paths

| Shape set | Top violated path | Share of total violations |
|---|---|---|
| Shexer | `rdf:type` | ~76% |
| DeepSeek-local | `foaf:name` | ~4% |
| GT aligned | `foaf:name` | ~3.6% |

Shexer's concentration on a single path (`rdf:type`) is remarkable: 76% of all violations come from one path, caused by one constraint type (`sh:in`). For DeepSeek and GT, violations are distributed across many paths — the top path accounts for only 3–4% of total violations. This spread indicates that DeepSeek and GT are evaluating a much richer set of constraints and failure modes.

The shared top-violated path between DeepSeek and GT (`foaf:name`) is revealing: both sets mandate `foaf:name` in some form, and both find it often absent or stored under `rdfs:label` instead. This is a well-documented DBpedia property-naming inconsistency.

---

## 8. Contextualisation against FULL_analysis.md findings

The `FULL_analysis.md` reports classification metrics (Precision, Recall, F1) comparing generated shapes against the GT reference on a property-matching basis. The SHACL validation evaluation reported here measures the *opposite direction*: how well each shape set fits the actual DBpedia data rather than how closely it approximates the GT. Reading both together reveals important tensions.

### 8.1 Shexer: low F1 but best validation acceptance

In `FULL_analysis.md`, Shexer achieves F1 = 0.015 on DBpedia (SHACL, exact matching) — the lowest of all systems. Yet here Shexer is the **only** system with accepted shapes (5 out of 13 evaluable). This apparent contradiction resolves cleanly:

- **F1 measures shape structure** — whether Shexer's constraints (heavily `sh:in`-based) match the GT's constraint style (`sh:class`, `sh:datatype`). They do not, producing near-zero F1.
- **Validation acceptance measures data-conformance** — whether real DBpedia entities satisfy the shape. Shexer's minimal constraints (mainly rdf:type enumeration) are trivially satisfied by a majority of entities for some classes.

The takeaway is that Shexer generates *observationally valid but normatively shallow* shapes. They describe the KG as it is, not as it should be.

### 8.2 DeepSeek-local: moderate F1, zero acceptance

`FULL_analysis.md` reports DeepSeek-V3 (local, DBpedia) F1 = 0.124 at exact matching, improving to 0.374 at datatype/loosened matching. The **4× gain from relaxing constraints** under that matching criterion was identified as evidence of a "constraint-correctness bottleneck." The SHACL validation confirms this diagnosis precisely: 24% of DeepSeek violations are datatype mismatches, and 27% are mandatory-property violations — exactly the two constraint dimensions that the loosened matcher relaxes.

DeepSeek-local achieves 0/14 accepted shapes in validation because its datatype and minCount predictions are calibrated for an idealized Wikipedia-encyclopaedia entity rather than for the actual DBpedia serialisation. Even its best shape (CelestialBody, 50% trust) stops just short of acceptance.

The local prompt mode gives DeepSeek-V3 individual entity triples — enough to predict the *right properties* but not enough to calibrate the *right constraints*. The model lacks statistical frequency information about which properties are present across the class, so it defaults to treating every property it sees as mandatory.

### 8.3 GT aligned: highest F1 by construction, zero acceptance

GT shapes are the reference used to compute F1 in `FULL_analysis.md`. By definition they score F1 = 1.0 against themselves. But the SHACL validation reveals that the GT shapes themselves do not conform to the actual DBpedia data: every single evaluated shape is rejected, with 15,107 total violations and 100% of focus nodes violating at least one constraint.

This is not a failure of the GT shapes — it is a measurement of DBpedia data quality. The 90% baseline calibration (B = 0.90) applied to the GT run acknowledges this: even the expert-crafted shapes were expected to produce high violation rates simply due to DBpedia incompleteness. Yet even with this generous calibration, all 14 shapes still fail (calibrated trust = −11.1%).

This result has direct consequences for how F1 scores should be interpreted: the GT reference shapes describe a DBpedia that does not fully exist yet. An LLM that matches the GT well (high F1) is not necessarily producing a shape that is useful for *validating* the current DBpedia — it is producing a shape that aligns with an expert's normative intent.

### 8.4 The trilemma: observational vs normative vs expert

The three evaluated shape sets represent three distinct philosophies:

| Philosophy | Representative | FULL_analysis F1 | Validation acceptance | Data fidelity |
|---|---|---|---|---|
| **Observational** — describe what is | Shexer | 0.015 | 5/13 ✓ | High (100% path coverage) |
| **Predictive** — infer what likely is | DeepSeek-local | 0.124 | 0/14 ✗ | Medium (80.6% path coverage) |
| **Normative** — specify what should be | GT aligned | 1.0 (by definition) | 0/14 ✗ | Medium-low (76.4% path coverage) |

A shape generator that targets high F1 (matching GT semantics) will produce shapes that fail validation against the real KG. A shape generator that targets high validation acceptance (conformance to real data) will produce shallow, non-normative shapes. This is a fundamental tension in automated schema generation for open-world, noisy KGs like DBpedia.

### 8.5 Implications for future development

1. **Constraint calibration is the bottleneck for LLMs.** The FULL_analysis finding that relaxed matching increases DeepSeek F1 by 4× is confirmed by the validation result: datatype and minCount errors account for over 50% of DeepSeek violations. Future prompt engineering for the `local` mode should focus on providing frequency statistics for each property (e.g., "present in X% of sampled entities") to let the model decide whether `sh:minCount 1` is appropriate.

2. **The global prompt mode would likely produce better validation results.** `FULL_analysis.md` shows that the global mode gives DeepSeek access to predicate-count frequencies — precisely the information needed to set `sh:minCount` correctly. The global mode achieves F1 = 0.515 at relaxed matching vs 0.374 for local, and 0.812 cardinality accuracy on YAGO (vs 0.228 for local). A global-mode DeepSeek run for DBpedia is predicted to generate fewer minCount violations.

3. **Shexer's accepted shapes identify the easy cases.** The five classes where Shexer achieves acceptance (Building, City, Company, Film, MeanOfTransportation) are those with relatively homogeneous rdf:type profiles and high property fill rates. These classes should be the benchmark targets for LLM-based approaches — if a generated shape cannot achieve acceptance on City (which even Shexer handles with 100% trust), it has a fundamental constraint-calibration problem.

4. **GT calibration quantifies the noise floor.** The 90% baseline calibration was chosen to reflect the expected DBpedia incompleteness. The −11.1% calibrated trust across all GT shapes means the actual violation rate (~100%) exceeds the expected baseline (90%) by roughly 10 percentage points for every class. This gap is the irreducible "DBpedia noise" that any shape validation pipeline must account for, and it provides a principled lower bound for setting the `baseline_violation_rate` parameter in future runs.

---

---

## 9. Shape validation in a ReAct agentic pipeline — added value, risks, and expected improvements

The current Shapespresso agentic pipeline (`shapespresso/agentic_pipeline/`) implements a **ReAct (Reason + Act)** loop using LangGraph. Its v4 topology positions two pyshacl-backed validation nodes at critical junctures of the graph:

- **fu3\_shape\_validation** — runs *before* the critic LLM, after upfront investigation but before any reasoning about what to add or change. It validates the current in-memory shape against a live SPARQL-sampled KG graph and stores a compact violation report (`fu3_report`: violation count, per-property breakdown, one-line summary) in the pipeline state.
- **fu1\_validation** — runs *after* apply\_changes, as a post-hoc correction pass. It fires SELECT queries per newly added property to verify whether the declared `nodeKind` (IRI vs Literal) actually matches the data, and corrects mismatches in-place before the shape is finalised.

The analysis in sections 4–8 provides a direct empirical grounding for evaluating what these nodes contribute, where they fail, and how they should be extended.

### 9.1 Added value: validation as the "Observe" step of ReAct

In a ReAct design the agent alternates between **Reason** (LLM call), **Act** (tool call or write), and **Observe** (environment response). Without fu3, the critic LLM in `critic_llm1` reasons from SPARQL coverage statistics alone — it knows that a property appears in X% of sampled entities but not whether the constraints it already declared are syntactically or semantically valid against the data. fu3 closes this gap by giving the critic a **data-grounded observation** before any decision is made.

The cross-dataset analysis quantifies exactly what this observation can correct. The two dominant failure modes of DeepSeek-local are datatype violations (24% of all violations, driven by `xsd:string` vs `rdf:langString` mismatches) and minCount violations (27%, driven by mandatory constraints on sparsely populated properties). Both are precisely the types of violation that fu3 can detect property-by-property and report to the critic. With the fu3 report in scope, the critic can reason: *"foaf:name generates a datatype violation on 100% of sampled nodes — the stored values are `rdf:langString`, not `xsd:string` as I declared; I should correct the constraint."* This is a qualitatively different, constraint-level signal that SPARQL coverage statistics alone cannot provide.

fu1 addresses a narrower but persistent failure: nodeKind misclassification. Section 4.2 shows that 18% of DeepSeek-local violations come from `sh:class` constraints — the LLM predicts an object-type constraint where the actual values are mixed (IRI + Literal) or purely literal. fu1 fires a single SELECT per new property counting IRI and literal occurrences, then corrects the declared nodeKind to match, or removes the type constraint entirely for mixed-type properties. This is the only node in the pipeline that directly targets the constraint-type mismatch identified in section 4.2, and its correction is deterministic — no LLM cost.

Together, fu3 + fu1 implement a **two-point validation bracket**: fu3 diagnoses the initial shape before reasoning; fu1 corrects the post-reasoning output before finalisation. This is the minimal ReAct loop structure needed to catch both pre-existing and newly introduced constraint errors.

The empirical SportsTeam trace (`docs/agentic_pipeline/05_test0_analysis.md`) shows F1 improving from 0.136 at the initial repair stage to 0.417 after apply\_changes — a 3× gain driven by the critic + investigation loop. The validation feedback nodes are the mechanism by which data reality is injected into that loop.

### 9.2 Potential risks

**Risk 1 — DBpedia noise amplification.** The most important finding from the GT calibrated run is that even expert-designed shapes generate 15,107 violations across 1,400 nodes, with 100% of focus nodes failing at least one constraint. The effective noise floor is approximately 90% (the baseline\_violation\_rate B used for the GT run). If fu3 samples a representative DBpedia graph, any constraint with `sh:minCount 1` — even a correct one — will be flagged as violated for the fraction of entities that simply do not carry that property. The critic may interpret these violations as signal to remove constraints that are normatively correct but descriptively sparse. Without explicit noise calibration in the fu3 report (e.g., flagging that a property with 40% coverage is sparse-by-design, not wrong-by-constraint), the critic has no way to distinguish genuine constraint errors from DBpedia incompleteness.

**Risk 2 — Shexer-style seed shape contamination.** Before the normalization patch applied to `shacl_eval/validation.py`, Shexer-originated shapes fed into the pipeline would generate catastrophic fu3 reports: multiple `sh:in` property shapes on `rdf:type` with `sh:maxCount 1` produce O(N × n\_type\_values) violations on any DBpedia entity, completely dominating the violation report with structural noise. The normalization collapses these into a single merged `sh:in` list before validation, but it is only applied in the evaluation pipeline. If the agentic pipeline's fu3\_shape\_validation node receives a Shexer-generated seed shape directly from the repair loop without equivalent pre-processing, the fu3 report will be similarly distorted, and the critic will focus its reasoning on the wrong violations.

**Risk 3 — Sample sensitivity and variance.** fu3 uses a small SPARQL CONSTRUCT sample (`fu3_sample_size` in `PipelineConfig`). The validation results in this document used 100 nodes per class. The Shexer violation profile shows that City achieves 100% trust (0 violations) while Food reaches only 2% trust on the same 100-node sample. Small-sample fu3 runs on rare classes (Astronaut: population 679, Monument: 1,759) may produce violation rates that differ substantially from the population-level distribution, causing the critic to over- or under-correct constraints for those classes.

**Risk 4 — Convergence to permissive shapes (Gresham's law of constraint softening).** If the critic consistently responds to fu3 violations by removing or weakening constraints, the iterative loop converges toward a minimal, Shexer-like observational shape — one that validates well against any KG sample because it asserts almost nothing. The quality gate (`validate_and_gate`) provides a 50% property retention floor that prevents total collapse, but it does not prevent gradual constraint weakening across multiple iterations. A shape that started with 30 constraints and retained 16 while softening all of them to `sh:nodeKind sh:IRI` without minCount or datatype would pass the quality gate but be normatively worthless — analogous to the Shexer Building shape (accepted at 65% trust, but asserting only rdf:type enumeration and no property requirements).

**Risk 5 — ReAct loop cost at scale.** The SportsTeam trace shows a full pipeline run takes 68 seconds for one class. With fu3 adding a SPARQL CONSTRUCT fetch plus pySHACL validation, and iterative\_investigation running up to 3 rounds × N properties of SPARQL queries, a 14-class DBpedia run at full budget will consume significant time and API credits. This cost is only justified if the fu3 signal reliably improves the final shape quality — a condition that the current experiments cannot yet confirm because `FULL_analysis.md` reports that the agentic\_global mode for DeepSeek-V3 produced only 3/20 DBpedia shapes (pipeline abort failures).

### 9.3 Expected improvements to shapes produced

When the risks above are controlled, the validation-informed ReAct loop should produce measurably better shapes along three dimensions:

**Constraint precision.** The dominant DeepSeek-local failure — datatype violations on 24% of all results — is structurally correctable by the fu3 → critic feedback. A critic that sees `foaf:name[Datatype×127]` in the fu3 report for Airport can correct `sh:datatype xsd:string` to `sh:datatype rdf:langString` before the shape is finalised. Similarly, `sh:minCount 1` violations appearing at >70% rates across a 100-node sample are a strong signal that the property is not genuinely mandatory for that class; the critic can demote these to optional constraints. Both corrections directly address the two largest violation categories in the DeepSeek evaluation (datatype: 24%, minCount: 27%).

**NodeKind correctness.** fu1 already implements data-driven nodeKind correction for newly added properties. Extending its scope to also re-probe *existing* nodeKind constraints (not just newly added ones) would address the 18% class-reference violation share seen in DeepSeek-local shapes, where the LLM assigned `sh:class dbo:Band` to a property that carries both IRI and literal values in the real graph.

**Calibrated cardinality.** The most significant gap between DeepSeek-local (0% accepted shapes) and Shexer (5/13 accepted shapes) is not property selection but cardinality calibration. Shexer generates no `sh:minCount` constraints at all — avoiding all mandatory-property violations but at the cost of normative depth. DeepSeek generates `sh:minCount 1` aggressively. The optimal point is between the two: mandatory constraints on properties with genuine 80%+ population rates (the `min_count_coverage_threshold` in `PipelineConfig`). The BAK-1 calibration in `critic_llm1` already derives per-class thresholds from the P90/P75 coverage distribution of missing properties. Combined with fu3 feedback confirming which existing minCount constraints actually violate, the pipeline should converge toward shapes that approach the 50%+ trust acceptance threshold for more classes — particularly the five classes where Shexer already succeeds (Building, City, Company, Film, MeanOfTransportation), which represent the achievable benchmark for data-conformant constraint generation.

**A measurable target.** The cross-dataset analysis establishes a concrete benchmark: any agentic-pipeline shape should at minimum match or exceed the Shexer acceptance rate (5/13 evaluable classes) while also improving on the structural depth that Shexer cannot achieve (non-zero `sh:minCount`, correct datatypes, class references). Achieving both simultaneously — data-conformant *and* normatively rich — is the specific challenge that the fu3 + critic + fu1 loop is designed to solve. Re-running the SHACL evaluation pipeline on agentic pipeline outputs with the same sample and baseline configuration as this analysis would provide a direct before/after comparison on the metrics defined here: total violations, accepted shapes, violated paths, and violations-per-failing-node.

---

*Generated by Claude Code from `output/shacl_eval/Shexer/metrics.json`, `output/shacl_eval/Deep-seek-local/metrics.json`, `output/shacl_eval/GT_aligned_calibrated/metrics.json`, `shape_analysis/FULL_analysis.md`, and `shapespresso/agentic_pipeline/` source code.*
