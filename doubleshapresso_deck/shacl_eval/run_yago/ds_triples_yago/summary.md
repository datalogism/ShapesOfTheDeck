# SHACL Shape Coverage & Acceptability Report
**Run timestamp:** 2026-04-30 09:31 UTC  
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
| **Total Violations** r(Σ) | 4,147 |
| **Violated Node Shapes** | 25/27 (92.59%) |
| Most Violated Node Shape | sh:AdministrativeAreaShape |
| **Violated Paths** | 33/85 (38.82%) |
| Most Violated Path | mainEntityOfPage |
| **Violated Focus Nodes** | 1,690 |
| Most Violated Focus Node | Wambaya_Gudanji_Binbinka_And_Ngarnka_Plants_And_Animals |
| **Violated Constraint Components** | 4/6 (66.67%) |
| Most Violated Component | mincount |

## Simple Shape Metrics
n(s) = reach; v(s) = distinct violating nodes; r(s) = total ValidationResult entries.  
Sorted by ascending conformance (most-violated shapes first).  
Reach < 30: conformance not reported (underpowered sample).

| Shape | n(s) | v(s) | Conformance | r(s) | r(s)/v(s) | Dominant Component |
|-------|-----:|-----:|------------:|-----:|----------:|--------------------|
| AdministrativeAreaShape | 100 | 100 | 0.0% | 223 | 2.23 | sh:Mincount (86%) |
| AirlineShape | 100 | 100 | 0.0% | 369 | 3.69 | sh:Datatype (71%) |
| AirportShape | 100 | 100 | 0.0% | 151 | 1.51 | sh:Mincount (67%) |
| BookShape | 100 | 100 | 0.0% | 432 | 4.32 | sh:Mincount (52%) |
| CityShape | 100 | 100 | 0.0% | 487 | 4.87 | sh:Datatype (50%) |
| CreativeWorkShape | 100 | 100 | 0.0% | 300 | 3.00 | sh:Mincount (89%) |
| ElectionShape | 100 | 100 | 0.0% | 232 | 2.32 | sh:Maxcount (57%) |
| LanguageShape | 100 | 100 | 0.0% | 190 | 1.90 | sh:Mincount (100%) |
| MovieShape | 100 | 100 | 0.0% | 303 | 3.03 | sh:Mincount (55%) |
| NewspaperShape | 100 | 100 | 0.0% | 371 | 3.71 | sh:Mincount (79%) |
| TVSeriesShape | 100 | 100 | 0.0% | 336 | 3.36 | sh:Mincount (70%) |
| TaxonShape | 100 | 100 | 0.0% | 100 | 1.00 | sh:Mincount (100%) |
| WayShape | 100 | 100 | 0.0% | 162 | 1.62 | sh:Mincount (91%) |
| SportsPersonShape | 56 | 55 | 1.8% | 168 | 3.05 | sh:Datatype (96%) |
| PersonShape | 100 | 51 | 49.0% | 79 | 1.55 | sh:Datatype (99%) |
| CorporationShape | 100 | 49 | 51.0% | 56 | 1.14 | sh:Datatype (100%) |
| FictionalEntityShape | 85 | 38 | 55.3% | 50 | 1.32 | sh:Mincount (56%) |
| EducationalOrganizationShape | 100 | 34 | 66.0% | 34 | 1.00 | sh:Datatype (100%) |
| MusicGroupShape | 100 | 30 | 70.0% | 33 | 1.10 | sh:Datatype (100%) |
| EventShape | 100 | 19 | 81.0% | 38 | 2.00 | sh:Datatype (84%) |
| LandformShape | 100 | 14 | 86.0% | 18 | 1.29 | sh:Datatype (78%) |
| BodyOfWaterShape | 100 | 5 | 95.0% | 10 | 2.00 | sh:Datatype (100%) |
| HumanMadeGeographicalEntityShape | 100 | 3 | 97.0% | 3 | 1.00 | sh:Datatype (100%) |
| AstronomicalObjectShape | 37 | 1 | 97.3% | 1 | 1.00 | sh:Datatype (100%) |
| AwardShape | 100 | 1 | 99.0% | 1 | 1.00 | sh:Mincount (100%) |
| OrganizationShape | 100 | 0 | 100.0% | 0 | — | sh:— |
| ProductShape | 82 | 0 | 100.0% | 0 | — | sh:— |
| BeliefSystemShape | 0 | — | — | 0 | — | — |
| ContinentShape | 0 | — | — | 0 | — | — |
| CountryShape | 0 | — | — | 0 | — | — |
| CreatorShape | 0 | — | — | 0 | — | — |
| GenderShape | 0 | — | — | 0 | — | — |
| MusicCompositionShape | 0 | — | — | 0 | — | — |
| PerformingGroupShape | 0 | — | — | 0 | — | — |
| PoliticianShape | 0 | — | — | 0 | — | — |
| WorkerShape | 0 | — | — | 0 | — | — |

## Shape Metrics (per class)
| Shape | Class | n | Trust | Wilson CI | Accept (W) | Accept (B) | PropCov | Generality |
|-------|-------|---|-------|-----------|------------|------------|---------|------------|
| AdministrativeAreaShape | AdministrativeArea | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 78.9% | 8.4% |
| AirlineShape | Airline | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 86.4% | 0.4% |
| AirportShape | Airport | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 75.0% | 1.1% |
| BookShape | Book | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 90.0% | 0.3% |
| CityShape | City | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 65.4% | 0.6% |
| CorporationShape | Corporation | 100 | 51.0% | [0.413, 0.606] | rejected | rejected | 87.5% | 4.7% |
| CreativeWorkShape | CreativeWork | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 92.3% | 0.0% |
| ElectionShape | Election | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 66.7% | 1.1% |
| FictionalEntityShape | FictionalEntity | 85 | 55.3% | [0.447, 0.654] | rejected | rejected | 88.9% | 0.0% |
| LanguageShape | Language | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 75.0% | 0.1% |
| MovieShape | Movie | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 85.0% | 14.2% |
| NewspaperShape | Newspaper | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 73.3% | 0.8% |
| PersonShape | Person | 100 | 49.0% | [0.394, 0.587] | rejected | rejected | 75.0% | 13.4% |
| SportsPersonShape | SportsPerson | 56 | 1.8% | [0.003, 0.094] | rejected | rejected | 93.8% | 0.0% |
| TVSeriesShape | TVSeries | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 81.8% | 3.7% |
| TaxonShape | Taxon | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 88.9% | 43.6% |
| WayShape | Way | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 84.6% | 0.0% |
| BeliefSystemShape | BeliefSystem | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| ContinentShape | Continent | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| CountryShape | Country | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| CreatorShape | Creator | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| GenderShape | Gender | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| MusicCompositionShape | MusicComposition | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| PerformingGroupShape | PerformingGroup | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| PoliticianShape | Politician | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| WorkerShape | Worker | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| AstronomicalObjectShape | AstronomicalObject | 37 | 97.3% | [0.862, 0.995] | accepted | accepted | 63.6% | 0.0% |
| AwardShape | Award | 100 | 99.0% | [0.946, 0.998] | accepted | accepted | 75.0% | 0.9% |
| BodyOfWaterShape | BodyOfWater | 100 | 95.0% | [0.888, 0.978] | accepted | accepted | 90.9% | 0.0% |
| EducationalOrganizationShape | EducationalOrganization | 100 | 66.0% | [0.563, 0.745] | accepted | accepted | 81.2% | 0.0% |
| EventShape | Event | 100 | 81.0% | [0.722, 0.875] | accepted | accepted | 80.0% | 0.5% |
| HumanMadeGeographicalEntityShape | HumanMadeGeographicalEntity | 100 | 97.0% | [0.915, 0.990] | accepted | accepted | 59.1% | 0.6% |
| LandformShape | Landform | 100 | 86.0% | [0.779, 0.915] | accepted | accepted | 80.0% | 0.1% |
| MusicGroupShape | MusicGroup | 100 | 70.0% | [0.604, 0.781] | accepted | accepted | 83.3% | 0.1% |
| OrganizationShape | Organization | 100 | 100.0% | [0.963, 1.000] | accepted | accepted | 100.0% | 2.2% |
| ProductShape | Product | 82 | 100.0% | [0.955, 1.000] | accepted | accepted | 41.7% | 0.0% |

## Partially Vacuous Shapes (property_coverage < 100%)
- **AdministrativeAreaShape** — property coverage: 78.9%
- **AirlineShape** — property coverage: 86.4%
- **AirportShape** — property coverage: 75.0%
- **AstronomicalObjectShape** — property coverage: 63.6%
- **AwardShape** — property coverage: 75.0%
- **BeliefSystemShape** — property coverage: 0.0%
- **BodyOfWaterShape** — property coverage: 90.9%
- **BookShape** — property coverage: 90.0%
- **CityShape** — property coverage: 65.4%
- **ContinentShape** — property coverage: 0.0%
- **CorporationShape** — property coverage: 87.5%
- **CountryShape** — property coverage: 0.0%
- **CreativeWorkShape** — property coverage: 92.3%
- **CreatorShape** — property coverage: 0.0%
- **EducationalOrganizationShape** — property coverage: 81.2%
- **ElectionShape** — property coverage: 66.7%
- **EventShape** — property coverage: 80.0%
- **FictionalEntityShape** — property coverage: 88.9%
- **GenderShape** — property coverage: 0.0%
- **HumanMadeGeographicalEntityShape** — property coverage: 59.1%
- **LandformShape** — property coverage: 80.0%
- **LanguageShape** — property coverage: 75.0%
- **MovieShape** — property coverage: 85.0%
- **MusicCompositionShape** — property coverage: 0.0%
- **MusicGroupShape** — property coverage: 83.3%
- **NewspaperShape** — property coverage: 73.3%
- **PerformingGroupShape** — property coverage: 0.0%
- **PersonShape** — property coverage: 75.0%
- **PoliticianShape** — property coverage: 0.0%
- **ProductShape** — property coverage: 41.7%
- **SportsPersonShape** — property coverage: 93.8%
- **TVSeriesShape** — property coverage: 81.8%
- **TaxonShape** — property coverage: 88.9%
- **WayShape** — property coverage: 84.6%
- **WorkerShape** — property coverage: 0.0%

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

**AdministrativeAreaShape** — v(s)=100/100 (100.0%), r(s)=223

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 44.8% |
| sameAs | mincount | per-node | 100 | 72 | 72.0% | 32.3% |
| comment | mincount | per-node | 100 | 20 | 20.0% | 9.0% |
| elevation | datatype | per-value | 15 | 15 | 100.0% | 6.7% |
| populationNumber | datatype | per-value | 10 | 10 | 100.0% | 4.5% |
| area | datatype | per-value | 4 | 4 | 100.0% | 1.8% |
| dateCreated | datatype | per-value | 1 | 1 | 100.0% | 0.4% |
| elevation | maxcount | per-node | 100 | 1 | 1.0% | 0.4% |

**AirlineShape** — v(s)=100/100 (100.0%), r(s)=369

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| dateCreated | datatype | per-value | 81 | 162 | 200.0% | 43.9% |
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 27.1% |
| dissolutionDate | datatype | per-value | 46 | 92 | 200.0% | 24.9% |
| numberOfEmployees | datatype | per-value | 4 | 8 | 200.0% | 2.2% |
| location | mincount | per-node | 100 | 5 | 5.0% | 1.4% |
| comment | mincount | per-node | 100 | 2 | 2.0% | 0.5% |

**AirportShape** — v(s)=100/100 (100.0%), r(s)=151

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 101 | 101.0% | 66.9% |
| elevation | datatype | per-value | 48 | 48 | 100.0% | 31.8% |
| dateCreated | datatype | per-value | 2 | 2 | 100.0% | 1.3% |

**AstronomicalObjectShape** — v(s)=1/37 (2.7%), r(s)=1

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| distanceFromEarth | datatype | per-value | 1 | 1 | 100.0% | 100.0% |

**AwardShape** — v(s)=1/100 (1.0%), r(s)=1

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 1 | 1.0% | 100.0% |

**BodyOfWaterShape** — v(s)=5/100 (5.0%), r(s)=10

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| elevation | datatype | per-value | 5 | 10 | 200.0% | 100.0% |

**BookShape** — v(s)=100/100 (100.0%), r(s)=432

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| dateCreated | datatype | per-value | 65 | 130 | 200.0% | 30.1% |
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 23.1% |
| sameAs | mincount | per-node | 100 | 97 | 97.0% | 22.5% |
| about | class | per-value | 32 | 64 | 200.0% | 14.8% |
| comment | mincount | per-node | 100 | 26 | 26.0% | 6.0% |
| numberOfPages | datatype | per-value | 13 | 13 | 100.0% | 3.0% |
| author | class | per-value | 60 | 2 | 3.3% | 0.5% |

**CityShape** — v(s)=100/100 (100.0%), r(s)=487

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 200 | 200.0% | 41.1% |
| populationNumber | datatype | per-value | 56 | 112 | 200.0% | 23.0% |
| area | datatype | per-value | 28 | 56 | 200.0% | 11.5% |
| dateCreated | datatype | per-value | 22 | 44 | 200.0% | 9.0% |
| elevation | datatype | per-value | 10 | 20 | 200.0% | 4.1% |
| sameAs | mincount | per-node | 100 | 17 | 17.0% | 3.5% |
| geo | mincount | per-node | 100 | 14 | 14.0% | 2.9% |
| demonym | datatype | per-value | 6 | 12 | 200.0% | 2.5% |

**CorporationShape** — v(s)=49/100 (49.0%), r(s)=56

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| dateCreated | datatype | per-value | 48 | 48 | 100.0% | 85.7% |
| numberOfEmployees | datatype | per-value | 5 | 5 | 100.0% | 8.9% |
| dissolutionDate | datatype | per-value | 3 | 3 | 100.0% | 5.4% |

**CreativeWorkShape** — v(s)=100/100 (100.0%), r(s)=300

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 33.3% |
| sameAs | mincount | per-node | 100 | 98 | 98.0% | 32.7% |
| comment | mincount | per-node | 100 | 68 | 68.0% | 22.7% |
| dateCreated | datatype | per-value | 27 | 27 | 100.0% | 9.0% |
| about | class | per-value | 6 | 6 | 100.0% | 2.0% |
| author | class | per-value | 53 | 1 | 1.9% | 0.3% |

**EducationalOrganizationShape** — v(s)=34/100 (34.0%), r(s)=34

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| dateCreated | datatype | per-value | 34 | 34 | 100.0% | 100.0% |

**ElectionShape** — v(s)=100/100 (100.0%), r(s)=232

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 43.1% |
| type | maxcount | per-node | 100 | 100 | 100.0% | 43.1% |
| label | maxcount | per-node | 100 | 32 | 32.0% | 13.8% |

**EventShape** — v(s)=19/100 (19.0%), r(s)=38

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| startDate | datatype | per-value | 18 | 18 | 100.0% | 47.4% |
| endDate | datatype | per-value | 14 | 14 | 100.0% | 36.8% |
| organizer | class | per-value | 21 | 4 | 19.0% | 10.5% |
| participant | class | per-value | 23 | 2 | 8.7% | 5.3% |

**FictionalEntityShape** — v(s)=38/85 (44.7%), r(s)=50

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| appearsIn | class | per-value | 22 | 22 | 100.0% | 44.0% |
| mainEntityOfPage | mincount | per-node | 85 | 19 | 22.4% | 38.0% |
| sameAs | mincount | per-node | 85 | 9 | 10.6% | 18.0% |

**HumanMadeGeographicalEntityShape** — v(s)=3/100 (3.0%), r(s)=3

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| dateCreated | datatype | per-value | 2 | 2 | 100.0% | 66.7% |
| elevation | datatype | per-value | 1 | 1 | 100.0% | 33.3% |

**LandformShape** — v(s)=14/100 (14.0%), r(s)=18

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| elevation | datatype | per-value | 13 | 13 | 100.0% | 72.2% |
| area | datatype | per-value | 1 | 1 | 100.0% | 5.6% |
| comment | mincount | per-node | 100 | 1 | 1.0% | 5.6% |
| location | mincount | per-node | 100 | 1 | 1.0% | 5.6% |
| mainEntityOfPage | mincount | per-node | 100 | 1 | 1.0% | 5.6% |
| sameAs | mincount | per-node | 100 | 1 | 1.0% | 5.6% |

**LanguageShape** — v(s)=100/100 (100.0%), r(s)=190

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 52.6% |
| sameAs | mincount | per-node | 100 | 83 | 83.0% | 43.7% |
| comment | mincount | per-node | 100 | 7 | 7.0% | 3.7% |

**MovieShape** — v(s)=100/100 (100.0%), r(s)=303

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| dateCreated | datatype | per-value | 62 | 124 | 200.0% | 40.9% |
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 33.0% |
| dateCreated | mincount | per-node | 100 | 38 | 38.0% | 12.5% |
| comment | mincount | per-node | 100 | 30 | 30.0% | 9.9% |
| duration | datatype | per-value | 7 | 7 | 100.0% | 2.3% |
| award | class | per-value | 2 | 2 | 100.0% | 0.7% |
| about | class | per-value | 1 | 2 | 200.0% | 0.7% |

**MusicGroupShape** — v(s)=30/100 (30.0%), r(s)=33

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| dateCreated | datatype | per-value | 30 | 31 | 103.3% | 93.9% |
| dissolutionDate | datatype | per-value | 2 | 2 | 100.0% | 6.1% |

**NewspaperShape** — v(s)=100/100 (100.0%), r(s)=371

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 200 | 200.0% | 53.9% |
| dateCreated | datatype | per-value | 39 | 78 | 200.0% | 21.0% |
| sameAs | mincount | per-node | 100 | 68 | 68.0% | 18.3% |
| comment | mincount | per-node | 100 | 24 | 24.0% | 6.5% |
| publisher | class | per-value | 5 | 1 | 20.0% | 0.3% |

**OrganizationShape** — v(s)=0/100 (0.0%), r(s)=0

*(no property paths declared)*

**PersonShape** — v(s)=51/100 (51.0%), r(s)=79

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| birthDate | datatype | per-value | 48 | 48 | 100.0% | 60.8% |
| deathDate | datatype | per-value | 30 | 30 | 100.0% | 38.0% |
| academicDegree | class | per-value | 1 | 1 | 100.0% | 1.3% |

**ProductShape** — v(s)=0/82 (0.0%), r(s)=0

*(no path-level violations found in sample)*

**SportsPersonShape** — v(s)=55/56 (98.2%), r(s)=168

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| birthDate | datatype | per-value | 52 | 106 | 203.8% | 63.1% |
| deathDate | datatype | per-value | 27 | 55 | 203.7% | 32.7% |
| comment | mincount | per-node | 56 | 7 | 12.5% | 4.2% |

**TVSeriesShape** — v(s)=100/100 (100.0%), r(s)=336

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 200 | 200.0% | 59.5% |
| numberOfEpisodes | datatype | per-value | 42 | 42 | 100.0% | 12.5% |
| numberOfSeasons | datatype | per-value | 29 | 29 | 100.0% | 8.6% |
| dateCreated | datatype | per-value | 10 | 20 | 200.0% | 6.0% |
| sameAs | mincount | per-node | 100 | 20 | 20.0% | 6.0% |
| comment | mincount | per-node | 100 | 14 | 14.0% | 4.2% |
| author | class | per-value | 7 | 7 | 100.0% | 2.1% |
| duration | datatype | per-value | 4 | 4 | 100.0% | 1.2% |

**TaxonShape** — v(s)=100/100 (100.0%), r(s)=100

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 100.0% |

**WayShape** — v(s)=100/100 (100.0%), r(s)=162

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 61.7% |
| sameAs | mincount | per-node | 100 | 44 | 44.0% | 27.2% |
| length | datatype | per-value | 12 | 12 | 100.0% | 7.4% |
| location | mincount | per-node | 100 | 4 | 4.0% | 2.5% |
| dateCreated | datatype | per-value | 2 | 2 | 100.0% | 1.2% |


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
