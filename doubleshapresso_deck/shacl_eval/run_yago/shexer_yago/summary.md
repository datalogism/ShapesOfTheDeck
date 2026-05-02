# SHACL Shape Coverage & Acceptability Report
**Run timestamp:** 2026-04-30 09:36 UTC  
**Random seed:** 42  
**Budget per class:** 1000  
**Min class population:** 30  
**Tolerated error rate (p):** 0.5  
**Significance level (α):** 0.05  
**Data size (|G| subjects):** 1,000,064  
**Sample size:** 2,660  

**Target coverage (overall):** 96.2% (2,660 nodes)  

## Validation Dashboard
| Metric | Value |
|--------|-------|
| **Total Violations** r(Σ) | 18,551 |
| **Violated Node Shapes** | 27/27 (100.00%) |
| Most Violated Node Shape | AdministrativeArea |
| **Violated Paths** | 12/50 (24.00%) |
| Most Violated Path | type |
| **Violated Focus Nodes** | 2,609 |
| Most Violated Focus Node | Papeete |
| **Violated Constraint Components** | 4/5 (80.00%) |
| Most Violated Component | nodekind |

## Simple Shape Metrics
n(s) = reach; v(s) = distinct violating nodes; r(s) = total ValidationResult entries.  
Sorted by ascending conformance (most-violated shapes first).  
Reach < 30: conformance not reported (underpowered sample).

| Shape | n(s) | v(s) | Conformance | r(s) | r(s)/v(s) | Dominant Component |
|-------|-----:|-----:|------------:|-----:|----------:|--------------------|
| AdministrativeArea | 100 | 100 | 0.0% | 306 | 3.06 | sh:In (33%) |
| Airline | 100 | 100 | 0.0% | 3,490 | 34.90 | sh:Nodekind (65%) |
| Airport | 100 | 100 | 0.0% | 765 | 7.65 | sh:Nodekind (56%) |
| AstronomicalObject | 37 | 37 | 0.0% | 219 | 5.92 | sh:Mincount (52%) |
| Award | 100 | 100 | 0.0% | 265 | 2.65 | sh:Nodekind (60%) |
| BodyOfWater | 100 | 100 | 0.0% | 965 | 9.65 | sh:In (42%) |
| Book | 100 | 100 | 0.0% | 626 | 6.26 | sh:In (36%) |
| City | 100 | 100 | 0.0% | 4,095 | 40.95 | sh:Nodekind (75%) |
| Corporation | 100 | 100 | 0.0% | 893 | 8.93 | sh:Nodekind (32%) |
| CreativeWork | 100 | 100 | 0.0% | 107 | 1.07 | sh:Mincount (93%) |
| EducationalOrganization | 100 | 100 | 0.0% | 924 | 9.24 | sh:Nodekind (31%) |
| Election | 100 | 100 | 0.0% | 504 | 5.04 | sh:Maxcount (40%) |
| Event | 100 | 100 | 0.0% | 101 | 1.01 | sh:Mincount (99%) |
| HumanMadeGeographicalEntity | 100 | 100 | 0.0% | 213 | 2.13 | sh:In (47%) |
| Landform | 100 | 100 | 0.0% | 461 | 4.61 | sh:Maxcount (39%) |
| Language | 100 | 100 | 0.0% | 100 | 1.00 | sh:Mincount (100%) |
| Movie | 100 | 100 | 0.0% | 656 | 6.56 | sh:Maxcount (35%) |
| MusicGroup | 100 | 100 | 0.0% | 1,049 | 10.49 | sh:Nodekind (37%) |
| Newspaper | 100 | 100 | 0.0% | 708 | 7.08 | sh:In (30%) |
| Organization | 100 | 100 | 0.0% | 125 | 1.25 | sh:Mincount (80%) |
| Person | 100 | 100 | 0.0% | 103 | 1.03 | sh:Mincount (97%) |
| Product | 82 | 82 | 0.0% | 82 | 1.00 | sh:Mincount (100%) |
| SportsPerson | 56 | 56 | 0.0% | 356 | 6.36 | sh:In (51%) |
| TVSeries | 100 | 100 | 0.0% | 874 | 8.74 | sh:In (30%) |
| Taxon | 100 | 100 | 0.0% | 107 | 1.07 | sh:Mincount (93%) |
| Way | 100 | 100 | 0.0% | 247 | 2.47 | sh:In (40%) |
| FictionalEntity | 85 | 34 | 60.0% | 210 | 6.18 | sh:In (58%) |
| Continent | 0 | — | — | 0 | — | — |
| Country | 0 | — | — | 0 | — | — |
| Creator | 0 | — | — | 0 | — | — |
| Gender | 0 | — | — | 0 | — | — |
| MusicComposition | 0 | — | — | 0 | — | — |
| PerformingGroup | 0 | — | — | 0 | — | — |
| Politician | 0 | — | — | 0 | — | — |
| Worker | 0 | — | — | 0 | — | — |

## Shape Metrics (per class)
| Shape | Class | n | Trust | Wilson CI | Accept (W) | Accept (B) | PropCov | Generality |
|-------|-------|---|-------|-----------|------------|------------|---------|------------|
| AdministrativeArea | AdministrativeArea | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 90.9% | 8.4% |
| Airline | Airline | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 92.3% | 0.4% |
| Airport | Airport | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 91.7% | 1.1% |
| AstronomicalObject | AstronomicalObject | 37 | 0.0% | [0.000, 0.094] | rejected | rejected | 80.0% | 0.0% |
| Award | Award | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 85.7% | 0.9% |
| BodyOfWater | BodyOfWater | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 87.5% | 0.0% |
| Book | Book | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 85.7% | 0.3% |
| City | City | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 94.1% | 0.6% |
| Corporation | Corporation | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 88.9% | 4.7% |
| CreativeWork | CreativeWork | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 88.9% | 0.0% |
| EducationalOrganization | EducationalOrganization | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 87.5% | 0.0% |
| Election | Election | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 77.8% | 1.1% |
| Event | Event | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 71.4% | 0.5% |
| FictionalEntity | FictionalEntity | 85 | 60.0% | [0.494, 0.698] | rejected | accepted | 87.5% | 0.0% |
| HumanMadeGeographicalEntity | HumanMadeGeographicalEntity | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 87.5% | 0.6% |
| Landform | Landform | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 90.0% | 0.1% |
| Language | Language | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 83.3% | 0.1% |
| Movie | Movie | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 88.9% | 14.2% |
| MusicGroup | MusicGroup | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 88.9% | 0.1% |
| Newspaper | Newspaper | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 88.9% | 0.8% |
| Organization | Organization | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 87.5% | 2.2% |
| Person | Person | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 88.9% | 13.4% |
| Product | Product | 82 | 0.0% | [0.000, 0.045] | rejected | rejected | 40.0% | 0.0% |
| SportsPerson | SportsPerson | 56 | 0.0% | [0.000, 0.064] | rejected | rejected | 93.3% | 0.0% |
| TVSeries | TVSeries | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 90.0% | 3.7% |
| Taxon | Taxon | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 87.5% | 43.6% |
| Way | Way | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 90.0% | 0.0% |
| Continent | Continent | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| Country | Country | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| Creator | Creator | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| Gender | Gender | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| MusicComposition | MusicComposition | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| PerformingGroup | PerformingGroup | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| Politician | Politician | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| Worker | Worker | 0 | — | — | n/a | n/a | 0.0% | 0.0% |

## Partially Vacuous Shapes (property_coverage < 100%)
- **AdministrativeArea** — property coverage: 90.9%
- **Airline** — property coverage: 92.3%
- **Airport** — property coverage: 91.7%
- **AstronomicalObject** — property coverage: 80.0%
- **Award** — property coverage: 85.7%
- **BodyOfWater** — property coverage: 87.5%
- **Book** — property coverage: 85.7%
- **City** — property coverage: 94.1%
- **Continent** — property coverage: 0.0%
- **Corporation** — property coverage: 88.9%
- **Country** — property coverage: 0.0%
- **CreativeWork** — property coverage: 88.9%
- **Creator** — property coverage: 0.0%
- **EducationalOrganization** — property coverage: 87.5%
- **Election** — property coverage: 77.8%
- **Event** — property coverage: 71.4%
- **FictionalEntity** — property coverage: 87.5%
- **Gender** — property coverage: 0.0%
- **HumanMadeGeographicalEntity** — property coverage: 87.5%
- **Landform** — property coverage: 90.0%
- **Language** — property coverage: 83.3%
- **Movie** — property coverage: 88.9%
- **MusicComposition** — property coverage: 0.0%
- **MusicGroup** — property coverage: 88.9%
- **Newspaper** — property coverage: 88.9%
- **Organization** — property coverage: 87.5%
- **PerformingGroup** — property coverage: 0.0%
- **Person** — property coverage: 88.9%
- **Politician** — property coverage: 0.0%
- **Product** — property coverage: 40.0%
- **SportsPerson** — property coverage: 93.3%
- **TVSeries** — property coverage: 90.0%
- **Taxon** — property coverage: 87.5%
- **Way** — property coverage: 90.0%
- **Worker** — property coverage: 0.0%

## Skipped Classes (population below threshold)
- `http://schema.org/Continent` — N_c = 11
- `http://schema.org/Country` — N_c = 17
- `http://schema.org/MusicComposition` — N_c = 7
- `http://schema.org/PerformingGroup` — N_c = 13
- `http://schema.org/Politician` — N_c = 0
- `http://yago-knowledge.org/resource/BeliefSystem` — N_c = 3
- `http://yago-knowledge.org/resource/Creator` — N_c = 4
- `http://yago-knowledge.org/resource/Gender` — N_c = 15
- `http://yago-knowledge.org/resource/Worker` — N_c = 21

## Hub-Cap Events (neighbourhood expansion)
- Predicate `<http://schema.org/actor>` on `<http://yago-knowledge.org/resource/History_of_the_World_Part_II>`: 154 values capped
- Predicate `<http://schema.org/url>` on `<http://yago-knowledge.org/resource/Papeete>`: 101 values capped
- Predicate `<http://www.w3.org/2000/01/rdf-schema#label>` on `<http://yago-knowledge.org/resource/Disciples_production_team>`: 217 values capped
- Predicate `<http://www.w3.org/2000/01/rdf-schema#label>` on `<http://yago-knowledge.org/resource/Oryol>`: 112 values capped
- Predicate `<http://www.w3.org/2000/01/rdf-schema#label>` on `<http://yago-knowledge.org/resource/Papeete>`: 146 values capped

## Per-Constraint Violation Rates
For each shape: v(s)/n(s) = shape-level violation rate.  
Per-constraint columns: **Scope** (per-node / per-value), **Targets** (denominator), **Results** (r(p,s) = total ValidationResult entries), **Rate** (results/targets), **Share** (results/r(s)).  
Per-node constraints use n(s) as denominator; per-value constraints use actual (node, value) pair count from the sample.

**AdministrativeArea** — v(s)=100/100 (100.0%), r(s)=306

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 32.7% |
| type | in | per-value | 200 | 100 | 50.0% | 32.7% |
| type | maxcount | per-node | 100 | 100 | 100.0% | 32.7% |
| image | nodekind | per-value | 6 | 6 | 100.0% | 2.0% |

**Airline** — v(s)=100/100 (100.0%), r(s)=3,490

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| url | nodekind | per-value | 734 | 2,202 | 300.0% | 63.1% |
| type | in | per-value | 302 | 606 | 200.7% | 17.4% |
| mainEntityOfPage | mincount | per-node | 100 | 300 | 300.0% | 8.6% |
| type | maxcount | per-node | 100 | 300 | 300.0% | 8.6% |
| image | nodekind | per-value | 58 | 58 | 100.0% | 1.7% |
| logo | nodekind | per-value | 12 | 24 | 200.0% | 0.7% |

**Airport** — v(s)=100/100 (100.0%), r(s)=765

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| url | nodekind | per-value | 405 | 405 | 100.0% | 52.9% |
| type | in | per-value | 229 | 132 | 57.6% | 17.3% |
| mainEntityOfPage | mincount | per-node | 100 | 101 | 101.0% | 13.2% |
| type | maxcount | per-node | 100 | 101 | 101.0% | 13.2% |
| image | nodekind | per-value | 26 | 26 | 100.0% | 3.4% |

**AstronomicalObject** — v(s)=37/37 (100.0%), r(s)=219

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| type | in | per-value | 74 | 37 | 50.0% | 16.9% |
| type | maxcount | per-node | 37 | 37 | 100.0% | 16.9% |
| mainEntityOfPage | mincount | per-node | 37 | 37 | 100.0% | 16.9% |
| label | mincount | per-node | 37 | 36 | 97.3% | 16.4% |
| sameAs | mincount | per-node | 37 | 36 | 97.3% | 16.4% |
| comment | maxcount | per-node | 37 | 30 | 81.1% | 13.7% |
| comment | mincount | per-node | 37 | 5 | 13.5% | 2.3% |
| label | maxcount | per-node | 37 | 1 | 2.7% | 0.5% |

**Award** — v(s)=100/100 (100.0%), r(s)=265

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| url | nodekind | per-value | 158 | 158 | 100.0% | 59.6% |
| mainEntityOfPage | mincount | per-node | 100 | 101 | 101.0% | 38.1% |
| type | in | per-value | 102 | 4 | 3.9% | 1.5% |
| type | maxcount | per-node | 100 | 2 | 2.0% | 0.8% |

**BodyOfWater** — v(s)=100/100 (100.0%), r(s)=965

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| type | in | per-value | 303 | 406 | 134.0% | 42.1% |
| mainEntityOfPage | mincount | per-node | 100 | 200 | 200.0% | 20.7% |
| type | maxcount | per-node | 100 | 200 | 200.0% | 20.7% |
| sameAs | mincount | per-node | 100 | 106 | 106.0% | 11.0% |
| image | nodekind | per-value | 19 | 38 | 200.0% | 3.9% |
| geo | mincount | per-node | 100 | 15 | 15.0% | 1.6% |

**Book** — v(s)=100/100 (100.0%), r(s)=626

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| type | in | per-value | 213 | 226 | 106.1% | 36.1% |
| mainEntityOfPage | mincount | per-node | 100 | 200 | 200.0% | 31.9% |
| type | maxcount | per-node | 100 | 200 | 200.0% | 31.9% |

**City** — v(s)=100/100 (100.0%), r(s)=4,095

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| url | nodekind | per-value | 2,480 | 2,933 | 118.3% | 71.6% |
| type | in | per-value | 356 | 582 | 163.5% | 14.2% |
| mainEntityOfPage | mincount | per-node | 100 | 216 | 216.0% | 5.3% |
| type | maxcount | per-node | 100 | 216 | 216.0% | 5.3% |
| image | nodekind | per-value | 72 | 146 | 202.8% | 3.6% |
| location | maxcount | per-node | 100 | 1 | 1.0% | 0.0% |
| comment | mincount | per-node | 100 | 1 | 1.0% | 0.0% |

**Corporation** — v(s)=100/100 (100.0%), r(s)=893

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| url | nodekind | per-value | 139 | 278 | 200.0% | 31.1% |
| type | in | per-value | 203 | 206 | 101.5% | 23.1% |
| mainEntityOfPage | mincount | per-node | 100 | 200 | 200.0% | 22.4% |
| type | maxcount | per-node | 100 | 200 | 200.0% | 22.4% |
| logo | nodekind | per-value | 9 | 9 | 100.0% | 1.0% |

**CreativeWork** — v(s)=100/100 (100.0%), r(s)=107

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 93.5% |
| image | nodekind | per-value | 3 | 3 | 100.0% | 2.8% |
| inLanguage | maxcount | per-node | 100 | 1 | 1.0% | 0.9% |
| sameAs | maxcount | per-node | 100 | 1 | 1.0% | 0.9% |
| type | in | per-value | 101 | 1 | 1.0% | 0.9% |
| type | maxcount | per-node | 100 | 1 | 1.0% | 0.9% |

**EducationalOrganization** — v(s)=100/100 (100.0%), r(s)=924

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| url | nodekind | per-value | 144 | 288 | 200.0% | 31.2% |
| type | in | per-value | 218 | 236 | 108.3% | 25.5% |
| mainEntityOfPage | mincount | per-node | 100 | 200 | 200.0% | 21.6% |
| type | maxcount | per-node | 100 | 200 | 200.0% | 21.6% |

**Election** — v(s)=100/100 (100.0%), r(s)=504

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| type | maxcount | per-node | 100 | 200 | 200.0% | 39.7% |
| type | in | per-value | 200 | 200 | 100.0% | 39.7% |
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 19.8% |
| sameAs | maxcount | per-node | 100 | 4 | 4.0% | 0.8% |

**Event** — v(s)=100/100 (100.0%), r(s)=101

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 99.0% |
| sameAs | maxcount | per-node | 100 | 1 | 1.0% | 1.0% |

**FictionalEntity** — v(s)=34/85 (40.0%), r(s)=210

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| type | in | per-value | 150 | 121 | 80.7% | 57.6% |
| type | maxcount | per-node | 85 | 59 | 69.4% | 28.1% |
| mainEntityOfPage | mincount | per-node | 85 | 26 | 30.6% | 12.4% |
| label | maxcount | per-node | 85 | 1 | 1.2% | 0.5% |
| comment | maxcount | per-node | 85 | 1 | 1.2% | 0.5% |
| sameAs | mincount | per-node | 85 | 1 | 1.2% | 0.5% |
| sameAs | maxcount | per-node | 85 | 1 | 1.2% | 0.5% |

**HumanMadeGeographicalEntity** — v(s)=100/100 (100.0%), r(s)=213

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| type | in | per-value | 200 | 100 | 50.0% | 46.9% |
| type | maxcount | per-node | 100 | 100 | 100.0% | 46.9% |
| image | nodekind | per-value | 13 | 13 | 100.0% | 6.1% |

**Landform** — v(s)=100/100 (100.0%), r(s)=461

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| type | in | per-value | 202 | 105 | 52.0% | 22.8% |
| mainEntityOfPage | mincount | per-node | 100 | 101 | 101.0% | 21.9% |
| type | maxcount | per-node | 100 | 101 | 101.0% | 21.9% |
| location | maxcount | per-node | 100 | 76 | 76.0% | 16.5% |
| sameAs | mincount | per-node | 100 | 30 | 30.0% | 6.5% |
| image | nodekind | per-value | 28 | 28 | 100.0% | 6.1% |
| geo | mincount | per-node | 100 | 18 | 18.0% | 3.9% |
| image | maxcount | per-node | 100 | 2 | 2.0% | 0.4% |

**Language** — v(s)=100/100 (100.0%), r(s)=100

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 100.0% |

**Movie** — v(s)=100/100 (100.0%), r(s)=656

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| type | in | per-value | 207 | 214 | 103.4% | 32.6% |
| type | maxcount | per-node | 100 | 200 | 200.0% | 30.5% |
| mainEntityOfPage | mincount | per-node | 100 | 200 | 200.0% | 30.5% |
| sameAs | maxcount | per-node | 100 | 27 | 27.0% | 4.1% |
| comment | mincount | per-node | 100 | 15 | 15.0% | 2.3% |

**MusicGroup** — v(s)=100/100 (100.0%), r(s)=1,049

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| url | nodekind | per-value | 182 | 383 | 210.4% | 36.5% |
| type | in | per-value | 206 | 216 | 104.9% | 20.6% |
| mainEntityOfPage | mincount | per-node | 100 | 201 | 201.0% | 19.2% |
| type | maxcount | per-node | 100 | 201 | 201.0% | 19.2% |
| url | maxcount | per-node | 100 | 37 | 37.0% | 3.5% |
| image | nodekind | per-value | 10 | 10 | 100.0% | 1.0% |
| sameAs | maxcount | per-node | 100 | 1 | 1.0% | 0.1% |

**Newspaper** — v(s)=100/100 (100.0%), r(s)=708

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| type | in | per-value | 207 | 214 | 103.4% | 30.2% |
| mainEntityOfPage | mincount | per-node | 100 | 200 | 200.0% | 28.2% |
| type | maxcount | per-node | 100 | 200 | 200.0% | 28.2% |
| url | nodekind | per-value | 94 | 94 | 100.0% | 13.3% |

**Organization** — v(s)=100/100 (100.0%), r(s)=125

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 80.0% |
| url | nodekind | per-value | 25 | 25 | 100.0% | 20.0% |

**Person** — v(s)=100/100 (100.0%), r(s)=103

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 97.1% |
| image | nodekind | per-value | 3 | 3 | 100.0% | 2.9% |

**Product** — v(s)=82/82 (100.0%), r(s)=82

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 82 | 82 | 100.0% | 100.0% |

**SportsPerson** — v(s)=56/56 (100.0%), r(s)=356

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| type | in | per-value | 143 | 181 | 126.6% | 50.8% |
| type | maxcount | per-node | 56 | 114 | 203.6% | 32.0% |
| mainEntityOfPage | mincount | per-node | 56 | 56 | 100.0% | 15.7% |
| nationality | maxcount | per-node | 56 | 4 | 7.1% | 1.1% |
| sameAs | maxcount | per-node | 56 | 1 | 1.8% | 0.3% |

**TVSeries** — v(s)=100/100 (100.0%), r(s)=874

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| type | in | per-value | 233 | 266 | 114.2% | 30.4% |
| mainEntityOfPage | mincount | per-node | 100 | 200 | 200.0% | 22.9% |
| type | maxcount | per-node | 100 | 200 | 200.0% | 22.9% |
| url | nodekind | per-value | 175 | 175 | 100.0% | 20.0% |
| sameAs | maxcount | per-node | 100 | 33 | 33.0% | 3.8% |

**Taxon** — v(s)=100/100 (100.0%), r(s)=107

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 93.5% |
| image | nodekind | per-value | 7 | 7 | 100.0% | 6.5% |

**Way** — v(s)=100/100 (100.0%), r(s)=247

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| type | in | per-value | 200 | 100 | 50.0% | 40.5% |
| type | maxcount | per-node | 100 | 100 | 100.0% | 40.5% |
| image | nodekind | per-value | 47 | 47 | 100.0% | 19.0% |


## Target Coverage per Class
| Class | Coverage |
|-------|----------|
| AdministrativeArea | 100.0% |
| Airline | 100.0% |
| Airport | 100.0% |
| BodyOfWater | 100.0% |
| Book | 100.0% |
| City | 100.0% |
| Corporation | 100.0% |
| CreativeWork | 100.0% |
| EducationalOrganization | 100.0% |
| Event | 100.0% |
| Landform | 100.0% |
| Language | 100.0% |
| Movie | 100.0% |
| MusicGroup | 100.0% |
| Newspaper | 100.0% |
| Organization | 100.0% |
| Person | 100.0% |
| Product | 100.0% |
| TVSeries | 100.0% |
| Taxon | 100.0% |
| AstronomicalObject | 100.0% |
| Award | 100.0% |
| Election | 100.0% |
| FictionalEntity | 100.0% |
| HumanMadeGeographicalEntity | 100.0% |
| Scientist | 0.0% |
| SportsPerson | 100.0% |
| Way | 100.0% |
