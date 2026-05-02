# SHACL Shape Coverage & Acceptability Report
**Run timestamp:** 2026-04-29 11:38 UTC  
**Random seed:** 42  
**Budget per class:** 1000  
**Min class population:** 30  
**Tolerated error rate (p):** 0.5  
**Significance level (α):** 0.05  
**Data size (|G| subjects):** 1,130,009  
**Sample size:** 1,300  

**Target coverage (overall):** 100.0% (1,300 nodes)  

## Validation Dashboard
| Metric | Value |
|--------|-------|
| **Total Violations** r(Σ) | 1,800 |
| **Violated Node Shapes** | 12/13 (92.31%) |
| Most Violated Node Shape | Artist |
| **Violated Paths** | 6/175 (3.43%) |
| Most Violated Path | type |
| **Violated Focus Nodes** | 851 |
| Most Violated Focus Node | dbr:Tom_Chatto |
| **Violated Constraint Components** | 3/4 (75.00%) |
| Most Violated Component | in |

## Simple Shape Metrics
n(s) = reach; v(s) = distinct violating nodes; r(s) = total ValidationResult entries.  
Sorted by ascending conformance (most-violated shapes first).  
Reach < 30: conformance not reported (underpowered sample).

| Shape | n(s) | v(s) | Conformance | r(s) | r(s)/v(s) | Dominant Component |
|-------|-----:|-----:|------------:|-----:|----------:|--------------------|
| Artist | 100 | 100 | 0.0% | 416 | 4.16 | sh:In (94%) |
| Astronaut | 100 | 100 | 0.0% | 331 | 3.31 | sh:In (63%) |
| Athlete | 100 | 100 | 0.0% | 379 | 3.79 | sh:In (94%) |
| ComicsCharacter | 100 | 99 | 1.0% | 99 | 1.00 | sh:Maxcount (100%) |
| Food | 100 | 98 | 2.0% | 122 | 1.24 | sh:Maxcount (80%) |
| Monument | 100 | 96 | 4.0% | 96 | 1.00 | sh:Maxcount (100%) |
| CelestialBody | 100 | 88 | 12.0% | 101 | 1.15 | sh:Maxcount (83%) |
| Airport | 100 | 56 | 44.0% | 58 | 1.04 | sh:Maxcount (93%) |
| Building | 100 | 35 | 65.0% | 76 | 2.17 | sh:In (100%) |
| Company | 100 | 34 | 66.0% | 58 | 1.71 | sh:In (100%) |
| MeanOfTransportation | 100 | 24 | 76.0% | 43 | 1.79 | sh:In (100%) |
| Film | 100 | 21 | 79.0% | 21 | 1.00 | sh:Maxcount (100%) |
| City | 100 | 0 | 100.0% | 0 | — | sh:— |
| MusicalWork | 0 | — | — | 0 | — | — |
| Person | 0 | — | — | 0 | — | — |
| Politician | 0 | — | — | 0 | — | — |
| Scientist | 0 | — | — | 0 | — | — |
| SportsTeam | 0 | — | — | 0 | — | — |
| University | 0 | — | — | 0 | — | — |
| WrittenWork | 0 | — | — | 0 | — | — |

## Shape Metrics (per class)
| Shape | Class | n | Trust | Wilson CI | Accept (W) | Accept (B) | PropCov | Generality |
|-------|-------|---|-------|-----------|------------|------------|---------|------------|
| Airport | Airport | 100 | 44.0% | [0.347, 0.538] | rejected | rejected | 100.0% | 1.3% |
| Artist | Artist | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 100.0% | 9.3% |
| Astronaut | Astronaut | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 100.0% | 0.1% |
| Athlete | Athlete | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 100.0% | 47.0% |
| CelestialBody | CelestialBody | 100 | 12.0% | [0.070, 0.198] | rejected | rejected | 100.0% | 1.1% |
| ComicsCharacter | ComicsCharacter | 100 | 1.0% | [0.002, 0.054] | rejected | rejected | 100.0% | 0.3% |
| Food | Food | 100 | 2.0% | [0.006, 0.070] | rejected | rejected | 100.0% | 0.7% |
| Monument | Monument | 100 | 4.0% | [0.016, 0.098] | rejected | rejected | 100.0% | 0.2% |
| MusicalWork | MusicalWork | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| Person | Person | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| Politician | Politician | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| Scientist | Scientist | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| SportsTeam | SportsTeam | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| University | University | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| WrittenWork | WrittenWork | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| Building | Building | 100 | 65.0% | [0.553, 0.736] | accepted | accepted | 100.0% | 10.9% |
| City | City | 100 | 100.0% | [0.963, 1.000] | accepted | accepted | 100.0% | 1.9% |
| Company | Company | 100 | 66.0% | [0.563, 0.745] | accepted | accepted | 100.0% | 7.9% |
| Film | Film | 100 | 79.0% | [0.700, 0.858] | accepted | accepted | 100.0% | 13.0% |
| MeanOfTransportation | MeanOfTransportation | 100 | 76.0% | [0.668, 0.833] | accepted | accepted | 100.0% | 6.4% |

## Partially Vacuous Shapes (property_coverage < 100%)
- **MusicalWork** — property coverage: 0.0%
- **Person** — property coverage: 0.0%
- **Politician** — property coverage: 0.0%
- **Scientist** — property coverage: 0.0%
- **SportsTeam** — property coverage: 0.0%
- **University** — property coverage: 0.0%
- **WrittenWork** — property coverage: 0.0%

*No classes were skipped.*

*No hub-cap events during neighbourhood expansion.*

## Per-Constraint Violation Rates
For each shape: v(s)/n(s) = shape-level violation rate.  
Per-constraint columns: **Scope** (per-node / per-value), **Targets** (denominator), **Results** (r(p,s) = total ValidationResult entries), **Rate** (results/targets), **Share** (results/r(s)).  
Per-node constraints use n(s) as denominator; per-value constraints use actual (node, value) pair count from the sample.

**Airport** — v(s)=56/100 (56.0%), r(s)=58

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| comment | maxcount | per-node | 100 | 54 | 54.0% | 93.1% |
| type | in | per-value | 604 | 4 | 0.7% | 6.9% |

**Artist** — v(s)=100/100 (100.0%), r(s)=416

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| type | in | per-value | 1,557 | 392 | 25.2% | 94.2% |
| birthYear | maxcount | per-node | 100 | 8 | 8.0% | 1.9% |
| birthPlace | nodekind | per-value | 157 | 7 | 4.5% | 1.7% |
| deathYear | maxcount | per-node | 100 | 5 | 5.0% | 1.2% |
| deathPlace | nodekind | per-value | 40 | 4 | 10.0% | 1.0% |

**Astronaut** — v(s)=100/100 (100.0%), r(s)=331

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| type | in | per-value | 1,405 | 210 | 14.9% | 63.4% |
| comment | maxcount | per-node | 100 | 99 | 99.0% | 29.9% |
| birthYear | maxcount | per-node | 100 | 13 | 13.0% | 3.9% |
| birthPlace | nodekind | per-value | 257 | 5 | 1.9% | 1.5% |
| deathYear | maxcount | per-node | 100 | 4 | 4.0% | 1.2% |

**Athlete** — v(s)=100/100 (100.0%), r(s)=379

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| type | in | per-value | 1,468 | 356 | 24.3% | 93.9% |
| birthPlace | nodekind | per-value | 175 | 12 | 6.9% | 3.2% |
| birthYear | maxcount | per-node | 100 | 9 | 9.0% | 2.4% |
| deathYear | maxcount | per-node | 100 | 2 | 2.0% | 0.5% |

**Building** — v(s)=35/100 (35.0%), r(s)=76

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| type | in | per-value | 514 | 76 | 14.8% | 100.0% |

**CelestialBody** — v(s)=88/100 (88.0%), r(s)=101

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| comment | maxcount | per-node | 100 | 84 | 84.0% | 83.2% |
| type | in | per-value | 665 | 17 | 2.6% | 16.8% |

**City** — v(s)=0/100 (0.0%), r(s)=0

*(no path-level violations found in sample)*

**ComicsCharacter** — v(s)=99/100 (99.0%), r(s)=99

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| comment | maxcount | per-node | 100 | 99 | 99.0% | 100.0% |

**Company** — v(s)=34/100 (34.0%), r(s)=58

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| type | in | per-value | 1,069 | 58 | 5.4% | 100.0% |

**Film** — v(s)=21/100 (21.0%), r(s)=21

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| comment | maxcount | per-node | 100 | 21 | 21.0% | 100.0% |

**Food** — v(s)=98/100 (98.0%), r(s)=122

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| comment | maxcount | per-node | 100 | 97 | 97.0% | 79.5% |
| type | in | per-value | 325 | 25 | 7.7% | 20.5% |

**MeanOfTransportation** — v(s)=24/100 (24.0%), r(s)=43

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| type | in | per-value | 480 | 43 | 9.0% | 100.0% |

**Monument** — v(s)=96/100 (96.0%), r(s)=96

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| comment | maxcount | per-node | 100 | 96 | 96.0% | 100.0% |


## Target Coverage per Class
| Class | Coverage |
|-------|----------|
| Airport | 100.0% |
| Artist | 100.0% |
| Astronaut | 100.0% |
| Athlete | 100.0% |
| Building | 100.0% |
| CelestialBody | 100.0% |
| City | 100.0% |
| ComicsCharacter | 100.0% |
| Company | 100.0% |
| Film | 100.0% |
| Food | 100.0% |
| MeanOfTransportation | 100.0% |
| Monument | 100.0% |
