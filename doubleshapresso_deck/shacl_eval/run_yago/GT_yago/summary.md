# SHACL Shape Coverage & Acceptability Report
**Run timestamp:** 2026-04-30 09:26 UTC  
**Random seed:** 42  
**Budget per class:** 1000  
**Min class population:** 30  
**Tolerated error rate (p):** 0.5  
**Significance level (α):** 0.05  
**Data size (|G| subjects):** 1,000,064  
**Sample size:** 2,660  

**Target coverage (overall):** 100.0% (2,660 nodes)  

## Validation Dashboard
| Metric | Value |
|--------|-------|
| **Total Violations** r(Σ) | 22,483 |
| **Violated Node Shapes** | 28/28 (100.00%) |
| Most Violated Node Shape | sh:AdministrativeArea |
| **Violated Paths** | 29/111 (26.13%) |
| Most Violated Path | label |
| **Violated Focus Nodes** | 2,660 |
| Most Violated Focus Node | Prešov |
| **Violated Constraint Components** | 4/7 (57.14%) |
| Most Violated Component | datatype |

## Simple Shape Metrics
n(s) = reach; v(s) = distinct violating nodes; r(s) = total ValidationResult entries.  
Sorted by ascending conformance (most-violated shapes first).  
Reach < 30: conformance not reported (underpowered sample).

| Shape | n(s) | v(s) | Conformance | r(s) | r(s)/v(s) | Dominant Component |
|-------|-----:|-----:|------------:|-----:|----------:|--------------------|
| AdministrativeArea | 100 | 100 | 0.0% | 257 | 2.57 | sh:Mincount (77%) |
| AirlineShape | 100 | 100 | 0.0% | 2,968 | 29.68 | sh:Datatype (90%) |
| AirportShape | 100 | 100 | 0.0% | 203 | 2.03 | sh:Mincount (50%) |
| AstronomicalObjectShape | 37 | 37 | 0.0% | 44 | 1.19 | sh:Mincount (95%) |
| AwardShape | 100 | 100 | 0.0% | 174 | 1.74 | sh:Mincount (58%) |
| BodyOfWaterShape | 100 | 100 | 0.0% | 306 | 3.06 | sh:Mincount (65%) |
| BookShape | 100 | 100 | 0.0% | 828 | 8.28 | sh:Datatype (69%) |
| CityShape | 100 | 100 | 0.0% | 1,728 | 17.28 | sh:Datatype (83%) |
| CorporationShape | 100 | 100 | 0.0% | 881 | 8.81 | sh:Datatype (77%) |
| CreativeWorkShape | 100 | 100 | 0.0% | 468 | 4.68 | sh:Datatype (79%) |
| EducationalOrganizationShape | 100 | 100 | 0.0% | 1,458 | 14.58 | sh:Datatype (86%) |
| ElectionShape | 100 | 100 | 0.0% | 903 | 9.03 | sh:Datatype (78%) |
| EventShape | 100 | 100 | 0.0% | 728 | 7.28 | sh:Datatype (86%) |
| FictionalEntityShape | 85 | 85 | 0.0% | 540 | 6.35 | sh:Datatype (79%) |
| HumanMadeGeographicalEntityShape | 100 | 100 | 0.0% | 109 | 1.09 | sh:Mincount (92%) |
| LandformShape | 100 | 100 | 0.0% | 245 | 2.45 | sh:Mincount (41%) |
| LanguageShape | 100 | 100 | 0.0% | 117 | 1.17 | sh:Mincount (85%) |
| MovieShape | 100 | 100 | 0.0% | 1,512 | 15.12 | sh:Datatype (83%) |
| MusicGroupShape | 100 | 100 | 0.0% | 981 | 9.81 | sh:Datatype (80%) |
| NewspaperShape | 100 | 100 | 0.0% | 1,564 | 15.64 | sh:Datatype (87%) |
| OrganizationShape | 100 | 100 | 0.0% | 538 | 5.38 | sh:Datatype (81%) |
| PersonShape | 100 | 100 | 0.0% | 771 | 7.71 | sh:Datatype (87%) |
| ProductShape | 82 | 82 | 0.0% | 410 | 5.00 | sh:Datatype (80%) |
| ScientistShape | 100 | 100 | 0.0% | 1,789 | 17.89 | sh:Datatype (89%) |
| SportsPersonShape | 56 | 56 | 0.0% | 1,051 | 18.77 | sh:Datatype (84%) |
| TVSeriesShape | 100 | 100 | 0.0% | 1,574 | 15.74 | sh:Datatype (87%) |
| TaxonShape | 100 | 100 | 0.0% | 173 | 1.73 | sh:Mincount (58%) |
| WayShape | 100 | 100 | 0.0% | 163 | 1.63 | sh:Mincount (61%) |
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
| AdministrativeArea | AdministrativeArea | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 59.1% | 8.4% |
| AirlineShape | Airline | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 80.0% | 0.4% |
| AirportShape | Airport | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 70.6% | 1.1% |
| AstronomicalObjectShape | AstronomicalObject | 37 | 0.0% | [0.000, 0.094] | rejected | rejected | 46.2% | 0.0% |
| AwardShape | Award | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 53.8% | 0.9% |
| BodyOfWaterShape | BodyOfWater | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 84.6% | 0.0% |
| BookShape | Book | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 85.0% | 0.3% |
| CityShape | City | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 64.0% | 0.6% |
| CorporationShape | Corporation | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 87.0% | 4.7% |
| CreativeWorkShape | CreativeWork | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 78.6% | 0.0% |
| EducationalOrganizationShape | EducationalOrganization | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 60.9% | 0.0% |
| ElectionShape | Election | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 46.7% | 1.1% |
| EventShape | Event | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 76.5% | 0.5% |
| FictionalEntityShape | FictionalEntity | 85 | 0.0% | [0.000, 0.043] | rejected | rejected | 80.0% | 0.0% |
| HumanMadeGeographicalEntityShape | HumanMadeGeographicalEntity | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 75.0% | 0.6% |
| LandformShape | Landform | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 78.6% | 0.1% |
| LanguageShape | Language | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 71.4% | 0.1% |
| MovieShape | Movie | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 85.7% | 14.2% |
| MusicGroupShape | MusicGroup | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 66.7% | 0.1% |
| NewspaperShape | Newspaper | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 62.5% | 0.8% |
| OrganizationShape | Organization | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 58.3% | 2.2% |
| PersonShape | Person | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 70.4% | 13.4% |
| ProductShape | Product | 82 | 0.0% | [0.000, 0.045] | rejected | rejected | 30.8% | 0.0% |
| ScientistShape | Scientist | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 78.6% | 3.1% |
| SportsPersonShape | SportsPerson | 56 | 0.0% | [0.000, 0.064] | rejected | rejected | 76.0% | 0.0% |
| TVSeriesShape | TVSeries | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 81.0% | 3.7% |
| TaxonShape | Taxon | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 77.8% | 43.6% |
| WayShape | Way | 100 | 0.0% | [0.000, 0.037] | rejected | rejected | 64.7% | 0.0% |
| BeliefSystemShape | BeliefSystem | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| ContinentShape | Continent | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| CountryShape | Country | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| CreatorShape | Creator | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| GenderShape | Gender | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| MusicCompositionShape | MusicComposition | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| PerformingGroupShape | PerformingGroup | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| PoliticianShape | Politician | 0 | — | — | n/a | n/a | 0.0% | 0.0% |
| WorkerShape | Worker | 0 | — | — | n/a | n/a | 0.0% | 0.0% |

## Partially Vacuous Shapes (property_coverage < 100%)
- **AdministrativeArea** — property coverage: 59.1%
- **AirlineShape** — property coverage: 80.0%
- **AirportShape** — property coverage: 70.6%
- **AstronomicalObjectShape** — property coverage: 46.2%
- **AwardShape** — property coverage: 53.8%
- **BeliefSystemShape** — property coverage: 0.0%
- **BodyOfWaterShape** — property coverage: 84.6%
- **BookShape** — property coverage: 85.0%
- **CityShape** — property coverage: 64.0%
- **ContinentShape** — property coverage: 0.0%
- **CorporationShape** — property coverage: 87.0%
- **CountryShape** — property coverage: 0.0%
- **CreativeWorkShape** — property coverage: 78.6%
- **CreatorShape** — property coverage: 0.0%
- **EducationalOrganizationShape** — property coverage: 60.9%
- **ElectionShape** — property coverage: 46.7%
- **EventShape** — property coverage: 76.5%
- **FictionalEntityShape** — property coverage: 80.0%
- **GenderShape** — property coverage: 0.0%
- **HumanMadeGeographicalEntityShape** — property coverage: 75.0%
- **LandformShape** — property coverage: 78.6%
- **LanguageShape** — property coverage: 71.4%
- **MovieShape** — property coverage: 85.7%
- **MusicCompositionShape** — property coverage: 0.0%
- **MusicGroupShape** — property coverage: 66.7%
- **NewspaperShape** — property coverage: 62.5%
- **OrganizationShape** — property coverage: 58.3%
- **PerformingGroupShape** — property coverage: 0.0%
- **PersonShape** — property coverage: 70.4%
- **PoliticianShape** — property coverage: 0.0%
- **ProductShape** — property coverage: 30.8%
- **ScientistShape** — property coverage: 78.6%
- **SportsPersonShape** — property coverage: 76.0%
- **TVSeriesShape** — property coverage: 81.0%
- **TaxonShape** — property coverage: 77.8%
- **WayShape** — property coverage: 64.7%
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

**AdministrativeArea** — v(s)=100/100 (100.0%), r(s)=257

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 38.9% |
| dateCreated | mincount | per-node | 100 | 99 | 99.0% | 38.5% |
| sameAs | datatype | per-value | 28 | 28 | 100.0% | 10.9% |
| elevation | datatype | per-value | 15 | 15 | 100.0% | 5.8% |
| populationNumber | datatype | per-value | 10 | 10 | 100.0% | 3.9% |
| area | datatype | per-value | 4 | 4 | 100.0% | 1.6% |
| dateCreated | datatype | per-value | 1 | 1 | 100.0% | 0.4% |

**AirlineShape** — v(s)=100/100 (100.0%), r(s)=2,968

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| label | datatype | per-value | 1,022 | 1,022 | 100.0% | 34.4% |
| comment | datatype | per-value | 661 | 661 | 100.0% | 22.3% |
| alternateName | datatype | per-value | 322 | 322 | 100.0% | 10.8% |
| mainEntityOfPage | mincount | per-node | 100 | 300 | 300.0% | 10.1% |
| sameAs | datatype | per-value | 90 | 270 | 300.0% | 9.1% |
| dateCreated | datatype | per-value | 81 | 243 | 300.0% | 8.2% |
| dissolutionDate | datatype | per-value | 46 | 138 | 300.0% | 4.6% |
| numberOfEmployees | datatype | per-value | 4 | 12 | 300.0% | 0.4% |

**AirportShape** — v(s)=100/100 (100.0%), r(s)=203

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 101 | 101.0% | 49.8% |
| sameAs | datatype | per-value | 50 | 51 | 102.0% | 25.1% |
| elevation | datatype | per-value | 48 | 48 | 100.0% | 23.6% |
| dateCreated | datatype | per-value | 2 | 2 | 100.0% | 1.0% |
| dateCreated | mincount | per-node | 100 | 1 | 1.0% | 0.5% |

**AstronomicalObjectShape** — v(s)=37/37 (100.0%), r(s)=44

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 37 | 37 | 100.0% | 84.1% |
| comment | mincount | per-node | 37 | 5 | 13.5% | 11.4% |
| distanceFromEarth | datatype | per-value | 1 | 1 | 100.0% | 2.3% |
| sameAs | datatype | per-value | 1 | 1 | 100.0% | 2.3% |

**AwardShape** — v(s)=100/100 (100.0%), r(s)=174

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 101 | 101.0% | 58.0% |
| sameAs | datatype | per-value | 61 | 62 | 101.6% | 35.6% |
| label | datatype | per-value | 317 | 6 | 1.9% | 3.4% |
| alternateName | datatype | per-value | 62 | 4 | 6.5% | 2.3% |
| comment | datatype | per-value | 120 | 1 | 0.8% | 0.6% |

**BodyOfWaterShape** — v(s)=100/100 (100.0%), r(s)=306

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 200 | 200.0% | 65.4% |
| sameAs | datatype | per-value | 47 | 94 | 200.0% | 30.7% |
| elevation | datatype | per-value | 5 | 10 | 200.0% | 3.3% |
| area | datatype | per-value | 1 | 2 | 200.0% | 0.7% |

**BookShape** — v(s)=100/100 (100.0%), r(s)=828

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| comment | datatype | per-value | 200 | 200 | 100.0% | 24.2% |
| mainEntityOfPage | mincount | per-node | 100 | 200 | 200.0% | 24.2% |
| label | datatype | per-value | 184 | 184 | 100.0% | 22.2% |
| dateCreated | datatype | per-value | 65 | 130 | 200.0% | 15.7% |
| inLanguage | class | per-value | 55 | 55 | 100.0% | 6.6% |
| alternateName | datatype | per-value | 40 | 40 | 100.0% | 4.8% |
| numberOfPages | datatype | per-value | 13 | 13 | 100.0% | 1.6% |
| sameAs | datatype | per-value | 3 | 6 | 200.0% | 0.7% |

**CityShape** — v(s)=100/100 (100.0%), r(s)=1,728

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| label | datatype | per-value | 3,209 | 556 | 17.3% | 32.2% |
| comment | datatype | per-value | 1,711 | 291 | 17.0% | 16.8% |
| mainEntityOfPage | mincount | per-node | 100 | 216 | 216.0% | 12.5% |
| sameAs | datatype | per-value | 84 | 183 | 217.9% | 10.6% |
| alternateName | datatype | per-value | 698 | 158 | 22.6% | 9.1% |
| populationNumber | datatype | per-value | 56 | 112 | 200.0% | 6.5% |
| dateCreated | mincount | per-node | 100 | 78 | 78.0% | 4.5% |
| area | datatype | per-value | 28 | 56 | 200.0% | 3.2% |

**CorporationShape** — v(s)=100/100 (100.0%), r(s)=881

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| label | datatype | per-value | 297 | 297 | 100.0% | 33.7% |
| mainEntityOfPage | mincount | per-node | 100 | 200 | 200.0% | 22.7% |
| comment | datatype | per-value | 138 | 138 | 100.0% | 15.7% |
| sameAs | datatype | per-value | 49 | 98 | 200.0% | 11.1% |
| dateCreated | datatype | per-value | 48 | 96 | 200.0% | 10.9% |
| alternateName | datatype | per-value | 36 | 36 | 100.0% | 4.1% |
| numberOfEmployees | datatype | per-value | 5 | 10 | 200.0% | 1.1% |
| dissolutionDate | datatype | per-value | 3 | 6 | 200.0% | 0.7% |

**CreativeWorkShape** — v(s)=100/100 (100.0%), r(s)=468

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| label | datatype | per-value | 187 | 187 | 100.0% | 40.0% |
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 21.4% |
| comment | datatype | per-value | 78 | 78 | 100.0% | 16.7% |
| alternateName | datatype | per-value | 73 | 73 | 100.0% | 15.6% |
| dateCreated | datatype | per-value | 27 | 27 | 100.0% | 5.8% |
| sameAs | datatype | per-value | 3 | 3 | 100.0% | 0.6% |

**EducationalOrganizationShape** — v(s)=100/100 (100.0%), r(s)=1,458

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| label | datatype | per-value | 196 | 392 | 200.0% | 26.9% |
| alternateName | datatype | per-value | 190 | 380 | 200.0% | 26.1% |
| comment | datatype | per-value | 159 | 318 | 200.0% | 21.8% |
| mainEntityOfPage | mincount | per-node | 100 | 200 | 200.0% | 13.7% |
| sameAs | datatype | per-value | 50 | 100 | 200.0% | 6.9% |
| dateCreated | datatype | per-value | 34 | 68 | 200.0% | 4.7% |

**ElectionShape** — v(s)=100/100 (100.0%), r(s)=903

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| comment | datatype | per-value | 162 | 324 | 200.0% | 35.9% |
| label | datatype | per-value | 145 | 290 | 200.0% | 32.1% |
| mainEntityOfPage | mincount | per-node | 100 | 200 | 200.0% | 22.1% |
| sameAs | datatype | per-value | 45 | 45 | 100.0% | 5.0% |
| alternateName | datatype | per-value | 22 | 44 | 200.0% | 4.9% |

**EventShape** — v(s)=100/100 (100.0%), r(s)=728

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| label | datatype | per-value | 262 | 262 | 100.0% | 36.0% |
| comment | datatype | per-value | 176 | 176 | 100.0% | 24.2% |
| alternateName | datatype | per-value | 130 | 130 | 100.0% | 17.9% |
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 13.7% |
| sameAs | datatype | per-value | 25 | 25 | 100.0% | 3.4% |
| startDate | datatype | per-value | 18 | 18 | 100.0% | 2.5% |
| endDate | datatype | per-value | 14 | 14 | 100.0% | 1.9% |
| participant | maxcount | per-node | 100 | 3 | 3.0% | 0.4% |

**FictionalEntityShape** — v(s)=85/85 (100.0%), r(s)=540

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| label | datatype | per-value | 487 | 223 | 45.8% | 41.3% |
| mainEntityOfPage | mincount | per-node | 85 | 111 | 130.6% | 20.6% |
| alternateName | datatype | per-value | 162 | 85 | 52.5% | 15.7% |
| comment | datatype | per-value | 194 | 75 | 38.7% | 13.9% |
| sameAs | datatype | per-value | 32 | 45 | 140.6% | 8.3% |
| appearsIn | maxcount | per-node | 85 | 1 | 1.2% | 0.2% |

**HumanMadeGeographicalEntityShape** — v(s)=100/100 (100.0%), r(s)=109

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 91.7% |
| sameAs | datatype | per-value | 6 | 6 | 100.0% | 5.5% |
| dateCreated | datatype | per-value | 2 | 2 | 100.0% | 1.8% |
| elevation | datatype | per-value | 1 | 1 | 100.0% | 0.9% |

**LandformShape** — v(s)=100/100 (100.0%), r(s)=245

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 101 | 101.0% | 41.2% |
| sameAs | datatype | per-value | 70 | 70 | 100.0% | 28.6% |
| url | maxcount | per-node | 100 | 60 | 60.0% | 24.5% |
| elevation | datatype | per-value | 13 | 13 | 100.0% | 5.3% |
| area | datatype | per-value | 1 | 1 | 100.0% | 0.4% |

**LanguageShape** — v(s)=100/100 (100.0%), r(s)=117

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 85.5% |
| sameAs | datatype | per-value | 17 | 17 | 100.0% | 14.5% |

**MovieShape** — v(s)=100/100 (100.0%), r(s)=1,512

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| comment | datatype | per-value | 682 | 682 | 100.0% | 45.1% |
| label | datatype | per-value | 229 | 229 | 100.0% | 15.1% |
| mainEntityOfPage | mincount | per-node | 100 | 200 | 200.0% | 13.2% |
| sameAs | datatype | per-value | 98 | 196 | 200.0% | 13.0% |
| dateCreated | datatype | per-value | 62 | 124 | 200.0% | 8.2% |
| inLanguage | class | per-value | 53 | 53 | 100.0% | 3.5% |
| alternateName | datatype | per-value | 21 | 21 | 100.0% | 1.4% |
| duration | datatype | per-value | 7 | 7 | 100.0% | 0.5% |

**MusicGroupShape** — v(s)=100/100 (100.0%), r(s)=981

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| label | datatype | per-value | 387 | 387 | 100.0% | 39.4% |
| mainEntityOfPage | mincount | per-node | 100 | 201 | 201.0% | 20.5% |
| comment | datatype | per-value | 123 | 123 | 100.0% | 12.5% |
| sameAs | datatype | per-value | 56 | 113 | 201.8% | 11.5% |
| alternateName | datatype | per-value | 92 | 92 | 100.0% | 9.4% |
| dateCreated | datatype | per-value | 30 | 61 | 203.3% | 6.2% |
| dissolutionDate | datatype | per-value | 2 | 4 | 200.0% | 0.4% |

**NewspaperShape** — v(s)=100/100 (100.0%), r(s)=1,564

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| comment | datatype | per-value | 346 | 692 | 200.0% | 44.2% |
| label | datatype | per-value | 219 | 438 | 200.0% | 28.0% |
| mainEntityOfPage | mincount | per-node | 100 | 200 | 200.0% | 12.8% |
| alternateName | datatype | per-value | 46 | 92 | 200.0% | 5.9% |
| dateCreated | datatype | per-value | 39 | 78 | 200.0% | 5.0% |
| sameAs | datatype | per-value | 32 | 64 | 200.0% | 4.1% |

**OrganizationShape** — v(s)=100/100 (100.0%), r(s)=538

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| comment | datatype | per-value | 140 | 140 | 100.0% | 26.0% |
| label | datatype | per-value | 121 | 121 | 100.0% | 22.5% |
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 18.6% |
| alternateName | datatype | per-value | 94 | 94 | 100.0% | 17.5% |
| dateCreated | datatype | per-value | 72 | 72 | 100.0% | 13.4% |
| sameAs | datatype | per-value | 9 | 9 | 100.0% | 1.7% |
| dissolutionDate | datatype | per-value | 2 | 2 | 100.0% | 0.4% |

**PersonShape** — v(s)=100/100 (100.0%), r(s)=771

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| label | datatype | per-value | 414 | 414 | 100.0% | 53.7% |
| comment | datatype | per-value | 148 | 148 | 100.0% | 19.2% |
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 13.0% |
| birthDate | datatype | per-value | 48 | 48 | 100.0% | 6.2% |
| deathDate | datatype | per-value | 30 | 30 | 100.0% | 3.9% |
| alternateName | datatype | per-value | 24 | 24 | 100.0% | 3.1% |
| sameAs | datatype | per-value | 7 | 7 | 100.0% | 0.9% |

**ProductShape** — v(s)=82/82 (100.0%), r(s)=410

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| comment | datatype | per-value | 246 | 246 | 100.0% | 60.0% |
| label | datatype | per-value | 82 | 82 | 100.0% | 20.0% |
| mainEntityOfPage | mincount | per-node | 82 | 82 | 100.0% | 20.0% |

**ScientistShape** — v(s)=100/100 (100.0%), r(s)=1,789

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| label | datatype | per-value | 567 | 567 | 100.0% | 31.7% |
| comment | datatype | per-value | 534 | 534 | 100.0% | 29.8% |
| mainEntityOfPage | mincount | per-node | 100 | 200 | 200.0% | 11.2% |
| birthDate | datatype | per-value | 83 | 166 | 200.0% | 9.3% |
| alternateName | datatype | per-value | 146 | 146 | 100.0% | 8.2% |
| deathDate | datatype | per-value | 44 | 88 | 200.0% | 4.9% |
| sameAs | datatype | per-value | 44 | 88 | 200.0% | 4.9% |

**SportsPersonShape** — v(s)=56/56 (100.0%), r(s)=1,051

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| label | datatype | per-value | 502 | 502 | 100.0% | 47.8% |
| comment | datatype | per-value | 195 | 195 | 100.0% | 18.6% |
| mainEntityOfPage | mincount | per-node | 56 | 112 | 200.0% | 10.7% |
| birthDate | datatype | per-value | 52 | 104 | 200.0% | 9.9% |
| deathDate | datatype | per-value | 27 | 54 | 200.0% | 5.1% |
| knowsLanguage | class | per-value | 51 | 51 | 100.0% | 4.9% |
| alternateName | datatype | per-value | 17 | 17 | 100.0% | 1.6% |
| sameAs | datatype | per-value | 12 | 12 | 100.0% | 1.1% |

**TVSeriesShape** — v(s)=100/100 (100.0%), r(s)=1,574

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| comment | datatype | per-value | 676 | 676 | 100.0% | 42.9% |
| label | datatype | per-value | 327 | 327 | 100.0% | 20.8% |
| sameAs | datatype | per-value | 113 | 226 | 200.0% | 14.4% |
| mainEntityOfPage | mincount | per-node | 100 | 200 | 200.0% | 12.7% |
| alternateName | datatype | per-value | 54 | 54 | 100.0% | 3.4% |
| numberOfEpisodes | datatype | per-value | 42 | 42 | 100.0% | 2.7% |
| numberOfSeasons | datatype | per-value | 29 | 29 | 100.0% | 1.8% |
| dateCreated | datatype | per-value | 10 | 20 | 200.0% | 1.3% |

**TaxonShape** — v(s)=100/100 (100.0%), r(s)=173

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 57.8% |
| url | maxcount | per-node | 100 | 39 | 39.0% | 22.5% |
| sameAs | datatype | per-value | 34 | 34 | 100.0% | 19.7% |

**WayShape** — v(s)=100/100 (100.0%), r(s)=163

| Path | Constraint | Scope | Targets | Results | Rate | Share |
|------|------------|-------|--------:|--------:|-----:|------:|
| mainEntityOfPage | mincount | per-node | 100 | 100 | 100.0% | 61.3% |
| url | maxcount | per-node | 100 | 49 | 49.0% | 30.1% |
| length | datatype | per-value | 12 | 12 | 100.0% | 7.4% |
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
| Scientist | 100.0% |
| SportsPerson | 100.0% |
| Way | 100.0% |
