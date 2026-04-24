# From the Big Bang to the Bedside
### A Transdisciplinary Pharmacogenomics Informatics Platform

[![Azure](https://img.shields.io/badge/Azure-Cosmos%20DB-0078D4)](https://azure.microsoft.com)
[![C#](https://img.shields.io/badge/Language-C%23-.NET-512BD4)](https://dotnet.microsoft.com)
[![Epic](https://img.shields.io/badge/Epic-Willow%20Analyst-E31837)](https://www.epic.com)
[![CPIC](https://img.shields.io/badge/Guidelines-CPIC%20Level%20A-2E7D32)](https://cpicpgx.org)

---

## What This Project Is

This platform traces a single unbroken chain — from the Big Bang through stellar nucleosynthesis, 
DNA assembly, genomic variation, and pharmacogenomics, arriving at a simulated Epic Willow 
clinical decision support alert that protects a patient from a dangerous drug-gene interaction.

Every layer is real data. Every connection is scientifically grounded. The clinical alerts 
are modeled on CPIC Level A guidelines — the highest evidence standard in pharmacogenomics.

This project was built to demonstrate three things simultaneously:

1. **Cloud infrastructure skills** — Azure Cosmos DB, C# SDK, serverless architecture
2. **Clinical informatics depth** — pharmacogenomics, drug-gene interactions, CPIC guidelines
3. **Epic Willow analyst thinking** — functional specifications written in the format a 
   Willow analyst produces before any build begins

---

## The Five-Layer Architecture

### Layer 1 — Cosmic Origins (`cosmic-origins` container)
The Big Bang produced hydrogen. Stars fused hydrogen into the elements of life.

| Element | Atomic # | Forged In | Role in DNA |
|---------|----------|-----------|-------------|
| Carbon | 6 | Red giant stars — triple-alpha process | Backbone of every nucleotide |
| Nitrogen | 7 | CNO cycle in intermediate-mass stars | Core of all four DNA bases |
| Oxygen | 8 | Massive stars — carbon burning | Sugar-phosphate backbone |
| Phosphorus | 15 | Massive stars — oxygen burning | Phosphodiester bonds holding DNA together |
| Sulfur | 16 | Massive stars — oxygen burning | CYP enzyme protein structure |

*Newton's universal gravitation governs the stellar collapse that ignites the fusion 
reactions producing these elements. The same F = Gm₁m₂/r² that explains planetary 
orbits explains why stars forge the atoms in your DNA.*

### Layer 2 — Molecular Assembly (`molecular-assembly` container)
Stellar elements assembled into nucleotides — the building blocks of DNA.

The base pairing rules (A-T: 2 hydrogen bonds, G-C: 3 hydrogen bonds) are as 
mathematically precise as Kepler's ellipses. Like Kepler's data-driven correction 
of Copernicus, the double helix structure was forced on Watson and Crick by the 
X-ray crystallography data — not chosen, but demanded by evidence.

### Layer 3 — Genomic Variants (`genomic-variants` container)
Specific genes govern drug metabolism. Variants in those genes change everything.

| Gene | Key Allele | Phenotype | Population Frequency |
|------|-----------|-----------|---------------------|
| CYP2D6 | *4/*4 | Poor Metabolizer | 5-10% European |
| CYP2D6 | *1xN | Ultra-Rapid Metabolizer | 1-2% general |
| TPMT | *3A/*3A | Poor Metabolizer | 0.3% |
| DPYD | *2A/*2A | Poor Metabolizer | 0.5-1% |
| CYP2C19 | *2/*2 | Poor Metabolizer | 2-5% European |

*Russell's insight: precision of definition changes clinical action entirely. 
"Slow metabolizer" is vague. "CYP2D6 Poor Metabolizer — zero enzyme function" 
is precise. That precision is the difference between a wrong dose and a safe one.*

### Layer 4 — Pharmacogenomics (`pgx-interactions` container)
Drug-gene interactions modeled on CPIC Level A guidelines.

| Drug | Gene | Phenotype | CPIC Recommendation | Alert Level |
|------|------|-----------|-------------------|-------------|
| Codeine | CYP2D6 | Poor Metabolizer | Contraindicated | HARD STOP |
| Codeine | CYP2D6 | Ultra-Rapid Metabolizer | Contraindicated | HARD STOP |
| Mercaptopurine | TPMT | Poor Metabolizer | Reduce dose 90% | HARD STOP |
| Clopidogrel | CYP2C19 | Poor Metabolizer | Select alternative | SOFT WARNING |
| Fluorouracil | DPYD | Poor Metabolizer | Reduce dose 50% | HARD STOP |

### Layer 5 — Clinical Safety Alerts (`clinical-alerts` container)
Simulated Epic Willow CDS alerts built from CPIC guidelines.

Each alert is documented in a formal functional specification — written in the 
format an Epic Willow analyst produces before any build begins in the Epic environment.

---

## Functional Specification Portfolio

Five complete Epic Willow functional specifications produced as analyst artifacts:

| Document | Drug + Gene | Alert Type | Key Clinical Risk |
|----------|------------|------------|------------------|
| FS-PGX-001 | Codeine + CYP2D6 PM | Hard Stop | No analgesia — toxic metabolite accumulation |
| FS-PGX-002 | Codeine + CYP2D6 UM | Hard Stop | Respiratory depression — fatal morphine accumulation |
| FS-PGX-003 | Mercaptopurine + TPMT PM | Hard Stop + Co-sign | Life-threatening myelosuppression |
| FS-PGX-004 | Clopidogrel + CYP2C19 PM | Soft Warning | No antiplatelet effect — stent thrombosis risk |
| FS-PGX-005 | Fluorouracil + DPYD PM | Hard Stop + Co-sign | Fatal chemotherapy toxicity |

Each specification includes:
- Clinical background and purpose
- Precise alert trigger conditions
- Simulated Willow CDS alert display (hard stop or soft warning)
- Epic Willow build requirements (medication groupers, BPA configuration, genomic mapping)
- Unit and functional test scenarios with expected system behavior
- Review and sign-off matrix

---

## Technical Stack
---
Azure Cosmos DB (NoSQL)     — Five-container database, serverless capacity mode
C# .NET Console App         — Azure Cosmos DB SDK v3.58, user secrets management
Microsoft.Azure.Cosmos      — SDK for database connection and document upsert
JavaScript + docx library   — Functional specification document generation
GitHub                      — Version control and portfolio presentation

## Project Structure
bigbang-bedside/
├── bigbang-bedside/          # C# console app — Cosmos DB seeding
│   ├── Program.cs            # Main seeding script — all five layers
│   └── bigbang-bedside.csproj
├── functional-specs/         # Epic Willow functional specifications
│   ├── FS-PGX-001_Codeine_CYP2D6_PM.docx
│   ├── FS-PGX-002_Codeine_CYP2D6_UM.docx
│   ├── FS-PGX-003_Mercaptopurine_TPMT_PM.docx
│   ├── FS-PGX-004_Clopidogrel_CYP2C19_PM.docx
│   ├── FS-PGX-005_Fluorouracil_DPYD_PM.docx
│   ├── FunctionalSpec_PGX001.js
│   └── FunctionalSpecs_PGX002to005.js
└── README.md

---

## The Intellectual Thread

This project is grounded in a transdisciplinary framework connecting:

**Bertrand Russell** → Precision of definition is the foundation of reliable knowledge.
A Poor Metabolizer is not "slow" — it means zero enzyme function. That precision 
changes the clinical action entirely.

**Copernicus → Kepler → Galileo** → The old model (one drug, one dose, all patients) 
is the geocentric error. Pharmacogenomics is the Copernican shift — the genome is the 
center. Drug selection orbits the patient's genetic makeup.

**Isaac Newton** → Drug metabolism follows Michaelis-Menten kinetics: V = Vmax[S]/(Km+[S]).
Both Newton's law and enzyme kinetics describe how two things interact across a variable.
A CYP2D6 Poor Metabolizer has effectively zero gravitational constant — the enzyme 
barely pulls the drug in for metabolism. The drug accumulates. Toxicity follows.

**Stellar Nucleosynthesis** → The carbon, nitrogen, oxygen, phosphorus, and sulfur 
forged in stellar cores assembled into the CYP2D6 gene. A single nucleotide variant 
in that stellar-forged DNA — one base pair changed — abolishes an enzyme and makes 
a standard codeine dose ineffective or a standard fluorouracil dose potentially fatal.

The Big Bang to the bedside. In one gene.

---

## Clinical Data Sources

- [CPIC Guidelines](https://cpicpgx.org/guidelines/) — All pharmacogenomic recommendations
- [PharmGKB](https://www.pharmgkb.org) — Gene-drug interaction database
- [FDA Table of Pharmacogenomic Biomarkers](https://www.fda.gov/medical-devices/precision-medicine/table-pharmacogenomic-biomarkers-drug-labeling)

---

## Author

**Kristina Ankrah** — Healthcare IT Professional  
Epic Willow | Clinical Informatics | Azure Cloud Infrastructure  
[github.com/IT-Professional-Kristina](https://github.com/IT-Professional-Kristina)

*"From the Big Bang to the Genome" — published research paper connecting 
cosmological origins through genomics to FHIR-based EHR architecture.*