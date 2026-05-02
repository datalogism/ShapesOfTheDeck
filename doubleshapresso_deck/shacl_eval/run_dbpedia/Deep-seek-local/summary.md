# SHACL Shape Coverage & Acceptability Report
**Run timestamp:** 2026-04-29 09:27 UTC  
**Random seed:** 42  
**Budget per class:** 1000  
**Min class population:** 30  
**Tolerated error rate (p):** 0.5  
**Significance level (α):** 0.05  
**Data size (|G| subjects):** 1,374,049  
**Sample size:** 1,400  

**Target coverage (overall):** 100.0% (1,400 nodes)  

## Validation Dashboard
| Metric | Value |
|--------|-------|
| **Total Violations** r(Σ) | 8,513 |
| **Violated Node Shapes** | 14/14 (100.00%) |
| Most Violated Node Shape | BuildingShape |
| **Violated Paths** | 132/374 (35.29%) |
| Most Violated Path | name |
| **Violated Focus Nodes** | 1,349 |
| Most Violated Focus Node | dbr:Viktor_Patsayev |
| **Violated Constraint Components** | 8/9 (88.89%) |
| Most Violated Component | datatype |

## Simple Shape Metrics
n(s) = reach; v(s) = distinct violating nodes; r(s) = total ValidationResult entries.  
Sorted by ascending conformance (most-violated shapes first).  
Reach < 30: conformance not reported (underpowered sample).

| Shape | n(s) | v(s) | Conformance | r(s) | r(s)/v(s) | Dominant Component |
|-------|-----:|-----:|------------:|-----:|----------:|--------------------|
| BuildingShape | 100 | 100 | 0.0% | 185 | 1.85 | sh:Datatype (83%) |
| MonumentShape | 100 | 100 | 0.0% | 172 | 1.72 | sh:Mincount (37%) |
| MusicalWorkShape | 100 | 100 | 0.0% | 356 | 3.56 | sh:Mincount (84%) |
| AirportShape | 100 | 100 | 0.0% | 380 | 3.80 | sh:Datatype (82%) |
| ArtistShape | 100 | 100 | 0.0% | 1,035 | 10.35 | sh:Datatype (44%) |
| AstronautShape | 100 | 100 | 0.0% | 1,371 | 13.71 | sh:Class (37%) |
| AthleteShape | 100 | 100 | 0.0% | 1,041 | 10.41 | sh:Or (35%) |
| ComicsCharacterShape | 100 | 100 | 0.0% | 204 | 2.04 | sh:Mincount (91%) |
| CompanyShape | 100 | 100 | 0.0% | 865 | 8.65 | sh:Mincount (50%) |
| FilmShape | 100 | 100 | 0.0% | 915 | 9.15 | sh:Class (49%) |
| FoodShape | 100 | 100 | 0.0% | 162 | 1.62 | sh:Datatype (78%) |
| MeanOfTransportationShape | 100 | 100 | 0.0% | 786 | 7.86 | sh:Mincount (58%) |
| CityShape | 100 | 99 | 1.0% | 800 | 8.08 | sh:Datatype (63%) |
| CelestialBodyShape | 100 | 50 | 50.0% | 241 | 4.82 | sh:Datatype (83%) |
| ScientistShape | 0 | — | — | 0 | — | — |
| PersonShape | 0 | — | — | 0 | — | — |
| PoliticianShape | 0 | — | — | 0 | — | — |
| SportsTeamShape | 0 | — | — | 0 | — | — |
| UniversityShape | 0 | — | — | 0 | — | — |
| WrittenWorkShape | 0 | — | — | 0 | — | — |

## Shape Metrics (per class)
| Shape | Class | n | Trust | Wilson CI | Accept (W) | Accept (B) | PropCov | Generality |
|-------|-------|---|-------|-----------|------------|------------|---------|------------|
| AirportShape | Airport | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 93.3% | 1.1% |
| ArtistShape | Artist | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 100.0% | 7.7% |
| AstronautShape | Astronaut | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 100.0% | 0.0% |
| AthleteShape | Athlete | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 80.0% | 38.7% |
| BuildingShape | Building | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 69.4% | 8.9% |
| CelestialBodyShape | CelestialBody | 100 | 50.0% | [0.404, 0.596] | rejected | rejected | 100.0% | 0.9% |
| CityShape | City | 100 | 1.0% | [0.002, 0.054] | rejected | rejected | 77.5% | 1.5% |
| ComicsCharacterShape | ComicsCharacter | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 31.2% | 0.3% |
| CompanyShape | Company | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 96.9% | 6.5% |
| FilmShape | Film | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 100.0% | 10.7% |
| FoodShape | Food | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 69.6% | 0.5% |
| MeanOfTransportationShape | MeanOfTransportation | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 92.6% | 5.3% |
| MonumentShape | Monument | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 44.4% | 0.1% |
| MusicalWorkShape | MusicalWork | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 94.1% | 17.8% |
| PersonShape | Person | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| PoliticianShape | Politician | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| ScientistShape | Scientist | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| SportsTeamShape | SportsTeam | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| UniversityShape | University | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| WrittenWorkShape | WrittenWork | 0 | — | — | n/a | n/a | 0.0% | 0.0% |

## Partially Vacuous Shapes (property_coverage < 100%)
- **BuildingShape** — property coverage: 69.4%
- **MonumentShape** — property coverage: 44.4%
- **MusicalWorkShape** — property coverage: 94.1%
- **ScientistShape** — property coverage: 0.0%
- **AirportShape** — property coverage: 93.3%
- **AthleteShape** — property coverage: 80.0%
- **CityShape** — property coverage: 77.5%
- **ComicsCharacterShape** — property coverage: 31.2%
- **CompanyShape** — property coverage: 96.9%
- **FoodShape** — property coverage: 69.6%
- **MeanOfTransportationShape** — property coverage: 92.6%
- **PersonShape** — property coverage: 0.0%
- **PoliticianShape** — property coverage: 0.0%
- **SportsTeamShape** — property coverage: 0.0%
- **UniversityShape** — property coverage: 0.0%
- **WrittenWorkShape** — property coverage: 0.0%

*No classes were skipped.*

*No hub-cap events during neighbourhood expansion.*

## Per-Constraint Violation Rates
For each shape: v(s)/n(s) = shape-level violation rate.  
Per-constraint columns: **Scope** (per-node / per-value), **Targets** (denominator), **Results** (r(p,s) = total ValidationResult entries), **Rate** (results/targets), **Share** (results/r(s)).  
Per-node constraints use n(s) as denominator; per-value constraints use actual (node, value) pair count from the sample.

**BuildingShape** — v(s)=100/100 (100.0%), r(s)=185

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| name | datatype | per-value | 116 | 116 | 100.0% | 62.7% |
| name | maxcount | per-node | 100 | 23 | 23.0% | 12.4% |
| address | datatype | per-value | 11 | 11 | 100.0% | 5.9% |
| name | mincount | per-node | 100 | 9 | 9.0% | 4.9% |
| buildingStartDate | datatype | per-value | 8 | 8 | 100.0% | 4.3% |
| buildingEndDate | datatype | per-value | 7 | 7 | 100.0% | 3.8% |
| cost | datatype | per-value | 4 | 4 | 100.0% | 2.2% |
| originalName | datatype | per-value | 4 | 4 | 100.0% | 2.2% |

**MonumentShape** — v(s)=100/100 (100.0%), r(s)=172

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| name | mincount | per-node | 100 | 60 | 60.0% | 34.9% |
| location | class | per-value | 224 | 50 | 22.3% | 29.1% |
| name | datatype | per-value | 43 | 43 | 100.0% | 25.0% |
| designer | class | per-value | 45 | 13 | 28.9% | 7.6% |
| location | mincount | per-node | 100 | 4 | 4.0% | 2.3% |
| name | maxcount | per-node | 100 | 2 | 2.0% | 1.2% |

**MusicalWorkShape** — v(s)=100/100 (100.0%), r(s)=356

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| releaseDate | mincount | per-node | 100 | 79 | 79.0% | 22.2% |
| runtime | mincount | per-node | 100 | 77 | 77.0% | 21.6% |
| name | mincount | per-node | 100 | 72 | 72.0% | 20.2% |
| artist | mincount | per-node | 100 | 71 | 71.0% | 19.9% |
| name | datatype | per-value | 30 | 30 | 100.0% | 8.4% |
| runtime | datatype | per-value | 24 | 24 | 100.0% | 6.7% |
| name | maxcount | per-node | 100 | 2 | 2.0% | 0.6% |
| runtime | maxcount | per-node | 100 | 1 | 1.0% | 0.3% |

**AirportShape** — v(s)=100/100 (100.0%), r(s)=380

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| runwayLength | datatype | per-value | 159 | 159 | 100.0% | 41.8% |
| elevation | datatype | per-value | 128 | 128 | 100.0% | 33.7% |
| city | class | per-value | 100 | 37 | 37.0% | 9.7% |
| homepage | datatype | per-value | 23 | 23 | 100.0% | 6.1% |
| location | class | per-value | 90 | 14 | 15.6% | 3.7% |
| owner | class | per-value | 20 | 11 | 55.0% | 2.9% |
| operator | class | per-value | 33 | 8 | 24.2% | 2.1% |

**ArtistShape** — v(s)=100/100 (100.0%), r(s)=1,035

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| type | or | per-node | 100 | 196 | 196.0% | 18.9% |
| name | datatype | per-value | 93 | 186 | 200.0% | 18.0% |
| birthYear | datatype | per-value | 74 | 132 | 178.4% | 12.8% |
| givenName | datatype | per-value | 34 | 68 | 200.0% | 6.6% |
| associatedBand | class | per-value | 102 | 68 | 66.7% | 6.6% |
| associatedMusicalArtist | class | per-value | 102 | 61 | 59.8% | 5.9% |
| genre | class | per-value | 145 | 50 | 34.5% | 4.8% |
| deathYear | datatype | per-value | 29 | 48 | 165.5% | 4.6% |

**AstronautShape** — v(s)=100/100 (100.0%), r(s)=1,371

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| type | or | per-node | 100 | 305 | 305.0% | 22.2% |
| birthYear | datatype | per-value | 105 | 184 | 175.2% | 13.4% |
| name | datatype | per-value | 90 | 180 | 200.0% | 13.1% |
| selection | class | per-value | 173 | 173 | 100.0% | 12.6% |
| occupation | class | per-value | 158 | 158 | 100.0% | 11.5% |
| birthPlace | class | per-value | 257 | 102 | 39.7% | 7.4% |
| deathYear | datatype | per-value | 28 | 48 | 171.4% | 3.5% |
| almaMater | class | per-value | 107 | 33 | 30.8% | 2.4% |

**AthleteShape** — v(s)=100/100 (100.0%), r(s)=1,041

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| type | or | per-node | 100 | 368 | 368.0% | 35.4% |
| birthYear | datatype | per-value | 88 | 158 | 179.5% | 15.2% |
| name | datatype | per-value | 116 | 116 | 100.0% | 11.1% |
| position | class | per-value | 74 | 74 | 100.0% | 7.1% |
| birthPlace | class | per-value | 175 | 70 | 40.0% | 6.7% |
| height | datatype | per-value | 46 | 46 | 100.0% | 4.4% |
| deathYear | datatype | per-value | 18 | 32 | 177.8% | 3.1% |
| birthPlace | mincount | per-node | 100 | 28 | 28.0% | 2.7% |

**CelestialBodyShape** — v(s)=50/100 (50.0%), r(s)=241

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| formerName | datatype | per-value | 47 | 47 | 100.0% | 19.5% |
| orbitalPeriod | datatype | per-value | 32 | 32 | 100.0% | 13.3% |
| absoluteMagnitude | datatype | per-value | 29 | 29 | 100.0% | 12.0% |
| apoapsis | datatype | per-value | 27 | 27 | 100.0% | 11.2% |
| periapsis | datatype | per-value | 27 | 27 | 100.0% | 11.2% |
| discoverer | class | per-value | 40 | 21 | 52.5% | 8.7% |
| name | mincount | per-node | 100 | 19 | 19.0% | 7.9% |
| albedo | datatype | per-value | 9 | 9 | 100.0% | 3.7% |

**CityShape** — v(s)=99/100 (99.0%), r(s)=800

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| timeZone | class | per-value | 142 | 142 | 100.0% | 17.8% |
| areaTotal | datatype | per-value | 119 | 119 | 100.0% | 14.9% |
| areaLand | datatype | per-value | 92 | 92 | 100.0% | 11.5% |
| elevation | datatype | per-value | 89 | 89 | 100.0% | 11.1% |
| type | class | per-value | 87 | 87 | 100.0% | 10.9% |
| populationDensity | datatype | per-value | 84 | 84 | 100.0% | 10.5% |
| homepage | datatype | per-value | 48 | 48 | 100.0% | 6.0% |
| areaWater | datatype | per-value | 71 | 44 | 62.0% | 5.5% |

**ComicsCharacterShape** — v(s)=100/100 (100.0%), r(s)=204

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| firstAppearance | mincount | per-node | 100 | 100 | 100.0% | 49.0% |
| name | mincount | per-node | 100 | 71 | 71.0% | 34.8% |
| creator | class | per-value | 182 | 18 | 9.9% | 8.8% |
| creator | mincount | per-node | 100 | 12 | 12.0% | 5.9% |
| givenName | mincount | per-node | 100 | 3 | 3.0% | 1.5% |

**CompanyShape** — v(s)=100/100 (100.0%), r(s)=865

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| product | class | per-value | 110 | 110 | 100.0% | 12.7% |
| industry | class | per-value | 92 | 92 | 100.0% | 10.6% |
| revenue | mincount | per-node | 100 | 90 | 90.0% | 10.4% |
| foundingDate | mincount | per-node | 100 | 88 | 88.0% | 10.2% |
| numberOfEmployees | mincount | per-node | 100 | 77 | 77.0% | 8.9% |
| type | class | per-value | 61 | 61 | 100.0% | 7.1% |
| type | mincount | per-node | 100 | 54 | 54.0% | 6.2% |
| homepage | mincount | per-node | 100 | 49 | 49.0% | 5.7% |

**FilmShape** — v(s)=100/100 (100.0%), r(s)=915

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| starring | class | per-value | 279 | 275 | 98.6% | 30.1% |
| country | mincount | per-node | 100 | 85 | 85.0% | 9.3% |
| releaseDate | mincount | per-node | 100 | 83 | 83.0% | 9.1% |
| imdbId | mincount | per-node | 100 | 81 | 81.0% | 8.9% |
| runtime | datatype | per-value | 77 | 76 | 98.7% | 8.3% |
| distributor | class | per-value | 64 | 27 | 42.2% | 3.0% |
| language | class | per-value | 47 | 26 | 55.3% | 2.8% |
| writer | class | per-value | 90 | 26 | 28.9% | 2.8% |

**FoodShape** — v(s)=100/100 (100.0%), r(s)=162

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| name | datatype | per-value | 90 | 90 | 100.0% | 55.6% |
| alias | datatype | per-value | 28 | 28 | 100.0% | 17.3% |
| ingredientName | mincount | per-node | 100 | 23 | 23.0% | 14.2% |
| name | mincount | per-node | 100 | 11 | 11.0% | 6.8% |
| servingSize | datatype | per-value | 9 | 9 | 100.0% | 5.6% |
| name | maxcount | per-node | 100 | 1 | 1.0% | 0.6% |

**MeanOfTransportationShape** — v(s)=100/100 (100.0%), r(s)=786

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| name | datatype | per-value | 110 | 110 | 100.0% | 14.0% |
| layout | mincount | per-node | 100 | 94 | 94.0% | 12.0% |
| bodyStyle | mincount | per-node | 100 | 93 | 93.0% | 11.8% |
| engine | mincount | per-node | 100 | 89 | 89.0% | 11.3% |
| class | mincount | per-node | 100 | 80 | 80.0% | 10.2% |
| manufacturer | mincount | per-node | 100 | 71 | 71.0% | 9.0% |
| length | datatype | per-value | 59 | 59 | 100.0% | 7.5% |
| class | class | per-value | 31 | 31 | 100.0% | 3.9% |


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
| MusicalWork | 100.0% |
