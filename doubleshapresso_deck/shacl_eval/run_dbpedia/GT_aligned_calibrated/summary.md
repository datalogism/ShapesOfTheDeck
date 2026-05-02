# SHACL Shape Coverage & Acceptability Report
**Run timestamp:** 2026-04-29 09:16 UTC  
**Random seed:** 42  
**Budget per class:** 1000  
**Min class population:** 30  
**Tolerated error rate (p):** 0.5  
**Baseline violation rate (B):** 90.0%  
**Effective acceptance threshold:** 95.0%  
**Significance level (α):** 0.05  
**Data size (|G| subjects):** 1,374,049  
**Sample size:** 1,400  

**Target coverage (overall):** 100.0% (1,400 nodes)  

## Validation Dashboard
| Metric | Value |
|--------|-------|
| **Total Violations** r(Σ) | 15,107 |
| **Violated Node Shapes** | 14/14 (100.00%) |
| Most Violated Node Shape | sh:AirportShape |
| **Violated Paths** | 187/452 (41.37%) |
| Most Violated Path | name |
| **Violated Focus Nodes** | 1,400 |
| Most Violated Focus Node | dbr:Vladimir_Khozin |
| **Violated Constraint Components** | 7/7 (100.00%) |
| Most Violated Component | mincount |

## Simple Shape Metrics
n(s) = reach; v(s) = distinct violating nodes; r(s) = total ValidationResult entries.  
Sorted by ascending conformance (most-violated shapes first).  
Reach < 30: conformance not reported (underpowered sample).

| Shape | n(s) | v(s) | Conformance | r(s) | r(s)/v(s) | Dominant Component |
|-------|-----:|-----:|------------:|-----:|----------:|--------------------|
| AirportShape | 100 | 100 | 0.0% | 776 | 7.76 | sh:Datatype (60%) |
| ArtistShape | 100 | 100 | 0.0% | 1,555 | 15.55 | sh:Mincount (35%) |
| AstronautShape | 100 | 100 | 0.0% | 1,038 | 10.38 | sh:Class (31%) |
| AthleteShape | 100 | 100 | 0.0% | 2,242 | 22.42 | sh:Mincount (48%) |
| BuildingShape | 100 | 100 | 0.0% | 1,525 | 15.25 | sh:Mincount (80%) |
| CelestialBodyShape | 100 | 100 | 0.0% | 1,438 | 14.38 | sh:Mincount (73%) |
| CityShape | 100 | 100 | 0.0% | 2,034 | 20.34 | sh:Mincount (39%) |
| ComicsCharacterShape | 100 | 100 | 0.0% | 486 | 4.86 | sh:Datatype (53%) |
| CompanyShape | 100 | 100 | 0.0% | 1,086 | 10.86 | sh:Mincount (76%) |
| FilmShape | 100 | 100 | 0.0% | 1,296 | 12.96 | sh:Mincount (64%) |
| FoodShape | 100 | 100 | 0.0% | 474 | 4.74 | sh:Datatype (41%) |
| MeanOfTransportationShape | 100 | 100 | 0.0% | 468 | 4.68 | sh:Datatype (55%) |
| MonumentShape | 100 | 100 | 0.0% | 282 | 2.82 | sh:Datatype (35%) |
| MusicalWorkShape | 100 | 100 | 0.0% | 407 | 4.07 | sh:Mincount (71%) |
| PersonShape | 0 | — | — | 0 | — | — |
| PoliticianShape | 0 | — | — | 0 | — | — |
| ScientistShape | 0 | — | — | 0 | — | — |
| SportsTeamShape | 0 | — | — | 0 | — | — |
| UniversityShape | 0 | — | — | 0 | — | — |
| WrittenWorkShape | 0 | — | — | 0 | — | — |

## Shape Metrics (per class)
| Shape | Class | n | Trust | Cal.Trust | Accept (W) | Accept (B) | Cal.Acc (W) | Cal.Acc (B) | PropCov | Generality |
|-------|-------|---|-------|-----------|------------|------------|-------------|-------------|---------|------------|
| AirportShape | Airport | 100 | 0.0% | -11.1% | rejected | rejected | rejected | rejected | 89.5% | 1.1% |
| ArtistShape | Artist | 100 | 0.0% | -11.1% | rejected | rejected | rejected | rejected | 81.6% | 7.7% |
| AstronautShape | Astronaut | 100 | 0.0% | -11.1% | rejected | rejected | rejected | rejected | 100.0% | 0.0% |
| AthleteShape | Athlete | 100 | 0.0% | -11.1% | rejected | rejected | rejected | rejected | 45.7% | 38.7% |
| BuildingShape | Building | 100 | 0.0% | -11.1% | rejected | rejected | rejected | rejected | 78.2% | 8.9% |
| CelestialBodyShape | CelestialBody | 100 | 0.0% | -11.1% | rejected | rejected | rejected | rejected | 96.6% | 0.9% |
| CityShape | City | 100 | 0.0% | -11.1% | rejected | rejected | rejected | rejected | 74.0% | 1.5% |
| ComicsCharacterShape | ComicsCharacter | 100 | 0.0% | -11.1% | rejected | rejected | rejected | rejected | 81.8% | 0.3% |
| CompanyShape | Company | 100 | 0.0% | -11.1% | rejected | rejected | rejected | rejected | 91.9% | 6.5% |
| FilmShape | Film | 100 | 0.0% | -11.1% | rejected | rejected | rejected | rejected | 87.5% | 10.7% |
| FoodShape | Food | 100 | 0.0% | -11.1% | rejected | rejected | rejected | rejected | 87.0% | 0.5% |
| MeanOfTransportationShape | MeanOfTransportation | 100 | 0.0% | -11.1% | rejected | rejected | rejected | rejected | 77.4% | 5.3% |
| MonumentShape | Monument | 100 | 0.0% | -11.1% | rejected | rejected | rejected | rejected | 85.7% | 0.1% |
| MusicalWorkShape | MusicalWork | 100 | 0.0% | -11.1% | rejected | rejected | rejected | rejected | 45.2% | 17.8% |
| PersonShape | Person | 0 | — | — | n/a | n/a | — | — | 0.0% | 0.0% |
| PoliticianShape | Politician | 0 | — | — | n/a | n/a | — | — | 0.0% | 0.0% |
| ScientistShape | Scientist | 0 | — | — | n/a | n/a | — | — | 0.0% | 0.0% |
| SportsTeamShape | SportsTeam | 0 | — | — | n/a | n/a | — | — | 0.0% | 0.0% |
| UniversityShape | University | 0 | — | — | n/a | n/a | — | — | 0.0% | 0.0% |
| WrittenWorkShape | WrittenWork | 0 | — | — | n/a | n/a | — | — | 0.0% | 0.0% |

## Partially Vacuous Shapes (property_coverage < 100%)
- **AirportShape** — property coverage: 89.5%
- **ArtistShape** — property coverage: 81.6%
- **AthleteShape** — property coverage: 45.7%
- **BuildingShape** — property coverage: 78.2%
- **CelestialBodyShape** — property coverage: 96.6%
- **CityShape** — property coverage: 74.0%
- **ComicsCharacterShape** — property coverage: 81.8%
- **CompanyShape** — property coverage: 91.9%
- **FilmShape** — property coverage: 87.5%
- **FoodShape** — property coverage: 87.0%
- **MeanOfTransportationShape** — property coverage: 77.4%
- **MonumentShape** — property coverage: 85.7%
- **MusicalWorkShape** — property coverage: 45.2%
- **PersonShape** — property coverage: 0.0%
- **PoliticianShape** — property coverage: 0.0%
- **ScientistShape** — property coverage: 0.0%
- **SportsTeamShape** — property coverage: 0.0%
- **UniversityShape** — property coverage: 0.0%
- **WrittenWorkShape** — property coverage: 0.0%

*No classes were skipped.*

*No hub-cap events during neighbourhood expansion.*

## Per-Constraint Violation Rates
For each shape: v(s)/n(s) = shape-level violation rate.  
Per-constraint columns: **Scope** (per-node / per-value), **Targets** (denominator), **Results** (r(p,s) = total ValidationResult entries), **Rate** (results/targets), **Share** (results/r(s)).  
Per-node constraints use n(s) as denominator; per-value constraints use actual (node, value) pair count from the sample.

**AirportShape** — v(s)=100/100 (100.0%), r(s)=776

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| runwayLength | datatype | per-value | 159 | 159 | 100.0% | 20.5% |
| elevation | datatype | per-value | 128 | 128 | 100.0% | 16.5% |
| name | datatype | per-value | 127 | 127 | 100.0% | 16.4% |
| city | class | per-value | 100 | 75 | 75.0% | 9.7% |
| comment | datatype | per-value | 150 | 54 | 36.0% | 7.0% |
| location | mincount | per-node | 100 | 46 | 46.0% | 5.9% |
| city | mincount | per-node | 100 | 38 | 38.0% | 4.9% |
| elevation | maxcount | per-node | 100 | 32 | 32.0% | 4.1% |

**ArtistShape** — v(s)=100/100 (100.0%), r(s)=1,555

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| associatedBand | class | per-value | 102 | 136 | 133.3% | 8.7% |
| genre | class | per-value | 145 | 100 | 69.0% | 6.4% |
| comment | datatype | per-value | 148 | 100 | 67.6% | 6.4% |
| name | datatype | per-value | 93 | 93 | 100.0% | 6.0% |
| nationality | mincount | per-node | 100 | 90 | 90.0% | 5.8% |
| birthName | mincount | per-node | 100 | 87 | 87.0% | 5.6% |
| hometown | mincount | per-node | 100 | 82 | 82.0% | 5.3% |
| occupation | mincount | per-node | 100 | 82 | 82.0% | 5.3% |

**AstronautShape** — v(s)=100/100 (100.0%), r(s)=1,038

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| comment | datatype | per-value | 200 | 202 | 101.0% | 19.5% |
| occupation | class | per-value | 158 | 158 | 100.0% | 15.2% |
| name | datatype | per-value | 90 | 90 | 100.0% | 8.7% |
| nationality | mincount | per-node | 100 | 81 | 81.0% | 7.8% |
| timeInSpace | mincount | per-node | 100 | 81 | 81.0% | 7.8% |
| birthPlace | maxcount | per-node | 100 | 73 | 73.0% | 7.0% |
| birthName | mincount | per-node | 100 | 70 | 70.0% | 6.7% |
| almaMater | class | per-value | 107 | 66 | 61.7% | 6.4% |

**AthleteShape** — v(s)=100/100 (100.0%), r(s)=2,242

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| team | class | per-value | 260 | 512 | 196.9% | 22.8% |
| name | datatype | per-value | 116 | 116 | 100.0% | 5.2% |
| sport | mincount | per-node | 100 | 100 | 100.0% | 4.5% |
| status | mincount | per-node | 100 | 100 | 100.0% | 4.5% |
| birthName | mincount | per-node | 100 | 100 | 100.0% | 4.5% |
| residence | mincount | per-node | 100 | 99 | 99.0% | 4.4% |
| country | mincount | per-node | 100 | 98 | 98.0% | 4.4% |
| stateOfOrigin | mincount | per-node | 100 | 98 | 98.0% | 4.4% |

**BuildingShape** — v(s)=100/100 (100.0%), r(s)=1,525

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| name | datatype | per-value | 116 | 116 | 100.0% | 7.6% |
| city | mincount | per-node | 100 | 99 | 99.0% | 6.5% |
| height | mincount | per-node | 100 | 99 | 99.0% | 6.5% |
| foundingDate | mincount | per-node | 100 | 98 | 98.0% | 6.4% |
| builder | mincount | per-node | 100 | 98 | 98.0% | 6.4% |
| numberOfRooms | mincount | per-node | 100 | 98 | 98.0% | 6.4% |
| floorCount | mincount | per-node | 100 | 96 | 96.0% | 6.3% |
| buildingEndDate | mincount | per-node | 100 | 93 | 93.0% | 6.1% |

**CelestialBodyShape** — v(s)=100/100 (100.0%), r(s)=1,438

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| name | datatype | per-value | 113 | 113 | 100.0% | 7.9% |
| mass | mincount | per-node | 100 | 99 | 99.0% | 6.9% |
| abbreviation | mincount | per-node | 100 | 99 | 99.0% | 6.9% |
| temperature | mincount | per-node | 100 | 99 | 99.0% | 6.9% |
| averageSpeed | mincount | per-node | 100 | 98 | 98.0% | 6.8% |
| density | mincount | per-node | 100 | 97 | 97.0% | 6.7% |
| apparentMagnitude | mincount | per-node | 100 | 97 | 97.0% | 6.7% |
| comment | datatype | per-value | 180 | 84 | 46.7% | 5.8% |

**CityShape** — v(s)=100/100 (100.0%), r(s)=2,034

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| name | datatype | per-value | 120 | 120 | 100.0% | 5.9% |
| areaTotal | or | per-node | 100 | 119 | 119.0% | 5.9% |
| areaTotal | datatype | per-value | 119 | 119 | 100.0% | 5.9% |
| leaderName | mincount | per-node | 100 | 100 | 100.0% | 4.9% |
| leaderTitle | mincount | per-node | 100 | 100 | 100.0% | 4.9% |
| populationTotal | datatype | per-value | 92 | 92 | 100.0% | 4.5% |
| areaLand | datatype | per-value | 92 | 92 | 100.0% | 4.5% |
| populationUrban | mincount | per-node | 100 | 91 | 91.0% | 4.5% |

**ComicsCharacterShape** — v(s)=100/100 (100.0%), r(s)=486

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| givenName | datatype | per-value | 100 | 100 | 100.0% | 20.6% |
| portrayer | mincount | per-node | 100 | 100 | 100.0% | 20.6% |
| comment | datatype | per-value | 198 | 99 | 50.0% | 20.4% |
| name | mincount | per-node | 100 | 71 | 71.0% | 14.6% |
| name | datatype | per-value | 38 | 38 | 100.0% | 7.8% |
| creator | class | per-value | 182 | 18 | 9.9% | 3.7% |
| differentFrom | nodekind | per-value | 17 | 17 | 100.0% | 3.5% |
| differentFrom | datatype | per-value | 17 | 17 | 100.0% | 3.5% |

**CompanyShape** — v(s)=100/100 (100.0%), r(s)=1,086

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| name | datatype | per-value | 100 | 100 | 100.0% | 9.2% |
| country | mincount | per-node | 100 | 98 | 98.0% | 9.0% |
| numberOfLocations | mincount | per-node | 100 | 94 | 94.0% | 8.7% |
| owner | mincount | per-node | 100 | 93 | 93.0% | 8.6% |
| foundedBy | mincount | per-node | 100 | 92 | 92.0% | 8.5% |
| locationCountry | mincount | per-node | 100 | 91 | 91.0% | 8.4% |
| locationCity | mincount | per-node | 100 | 84 | 84.0% | 7.7% |
| headquarter | mincount | per-node | 100 | 84 | 84.0% | 7.7% |

**FilmShape** — v(s)=100/100 (100.0%), r(s)=1,296

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| author | mincount | per-node | 100 | 100 | 100.0% | 7.7% |
| name | datatype | per-value | 99 | 99 | 100.0% | 7.6% |
| country | mincount | per-node | 100 | 85 | 85.0% | 6.6% |
| budget | mincount | per-node | 100 | 84 | 84.0% | 6.5% |
| gross | mincount | per-node | 100 | 83 | 83.0% | 6.4% |
| releaseDate | mincount | per-node | 100 | 83 | 83.0% | 6.4% |
| imdbId | mincount | per-node | 100 | 81 | 81.0% | 6.2% |
| runtime | datatype | per-value | 77 | 76 | 98.7% | 5.9% |

**FoodShape** — v(s)=100/100 (100.0%), r(s)=474

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| ingredient | or | per-node | 100 | 181 | 181.0% | 38.2% |
| comment | datatype | per-value | 194 | 97 | 50.0% | 20.5% |
| name | datatype | per-value | 90 | 90 | 100.0% | 19.0% |
| ingredient | mincount | per-node | 100 | 33 | 33.0% | 7.0% |
| ingredientName | mincount | per-node | 100 | 23 | 23.0% | 4.9% |
| name | mincount | per-node | 100 | 11 | 11.0% | 2.3% |
| servingSize | datatype | per-value | 9 | 9 | 100.0% | 1.9% |
| country | class | per-value | 60 | 6 | 10.0% | 1.3% |

**MeanOfTransportationShape** — v(s)=100/100 (100.0%), r(s)=468

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| commissioningDate | mincount | per-node | 100 | 73 | 73.0% | 15.6% |
| length | datatype | per-value | 59 | 59 | 100.0% | 12.6% |
| shipBeam | datatype | per-value | 53 | 53 | 100.0% | 11.3% |
| length | mincount | per-node | 100 | 42 | 42.0% | 9.0% |
| topSpeed | datatype | per-value | 32 | 32 | 100.0% | 6.8% |
| numberBuilt | datatype | per-value | 24 | 24 | 100.0% | 5.1% |
| shipDraft | datatype | per-value | 21 | 21 | 100.0% | 4.5% |
| comment | datatype | per-value | 108 | 17 | 15.7% | 3.6% |

**MonumentShape** — v(s)=100/100 (100.0%), r(s)=282

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| comment | datatype | per-value | 192 | 96 | 50.0% | 34.0% |
| location | maxcount | per-node | 100 | 70 | 70.0% | 24.8% |
| location | class | per-value | 224 | 50 | 22.3% | 17.7% |
| designer | class | per-value | 45 | 45 | 100.0% | 16.0% |
| comment | mincount | per-node | 100 | 4 | 4.0% | 1.4% |
| location | mincount | per-node | 100 | 4 | 4.0% | 1.4% |
| wikiPageRevisionID | mincount | per-node | 100 | 4 | 4.0% | 1.4% |
| label | mincount | per-node | 100 | 3 | 3.0% | 1.1% |

**MusicalWorkShape** — v(s)=100/100 (100.0%), r(s)=407

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| recordDate | mincount | per-node | 100 | 100 | 100.0% | 24.6% |
| genre | mincount | per-node | 100 | 79 | 79.0% | 19.4% |
| artist | mincount | per-node | 100 | 71 | 71.0% | 17.4% |
| artist | class | per-value | 34 | 29 | 85.3% | 7.1% |
| producer | class | per-value | 28 | 25 | 89.3% | 6.1% |
| runtime | datatype | per-value | 24 | 24 | 100.0% | 5.9% |
| label | mincount | per-node | 100 | 13 | 13.0% | 3.2% |
| comment | mincount | per-node | 100 | 13 | 13.0% | 3.2% |


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
