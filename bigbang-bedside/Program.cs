using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Configuration;

// ── Load credentials from user secrets ──────────────────────────────────────
var config = new ConfigurationBuilder()
    .AddUserSecrets<Program>()
    .Build();

string endpointUri = config["CosmosDb:EndpointUri"]!;
string primaryKey  = config["CosmosDb:PrimaryKey"]!;

const string databaseId = "bigbang-bedside";

// ── Connect to Cosmos DB ─────────────────────────────────────────────────────
CosmosClient client = new CosmosClient(endpointUri, primaryKey);
Database database   = client.GetDatabase(databaseId);

Console.WriteLine("Connected to: " + databaseId);
Console.WriteLine("Seeding all five layers...\n");

// ── LAYER 1: Cosmic Origins ──────────────────────────────────────────────────
var cosmicContainer = database.GetContainer("cosmic-origins");

var cosmicRecords = new[]
{
    new {
        id = "element-carbon",
        element = "Carbon",
        atomicNumber = 6,
        symbol = "C",
        forgedIn = "Red giant and supergiant stars via triple-alpha process",
        stellarProcess = "Helium fusion: 3 He-4 → C-12",
        newtonConnection = "Stellar core gravity overcomes electron degeneracy pressure to ignite helium fusion",
        biologicalRole = "Backbone of every organic molecule — the skeleton of DNA nucleotides",
        dnaRole = "Forms the sugar-phosphate backbone and nitrogenous base rings in all four nucleotides"
    },
    new {
        id = "element-nitrogen",
        element = "Nitrogen",
        atomicNumber = 7,
        symbol = "N",
        forgedIn = "Intermediate-mass stars via CNO cycle",
        stellarProcess = "CNO cycle: converts H to He using C, N, O as catalysts",
        newtonConnection = "Gravity-driven stellar pressure sustains the CNO cycle in stars more massive than the Sun",
        biologicalRole = "Present in every amino acid and in the nitrogenous bases of DNA",
        dnaRole = "Core component of adenine, thymine, cytosine, and guanine — the four DNA bases"
    },
    new {
        id = "element-oxygen",
        element = "Oxygen",
        atomicNumber = 8,
        symbol = "O",
        forgedIn = "Massive stars via carbon and neon burning",
        stellarProcess = "Carbon fusion: C-12 + C-12 → O-16 + He-4",
        newtonConnection = "Newton's universal gravitation governs the collapse that triggers carbon ignition",
        biologicalRole = "Present in the sugar-phosphate backbone and in enzyme active sites",
        dnaRole = "Part of the deoxyribose sugar and phosphate group linking nucleotides"
    },
    new {
        id = "element-phosphorus",
        element = "Phosphorus",
        atomicNumber = 15,
        symbol = "P",
        forgedIn = "Massive stars via oxygen and neon burning",
        stellarProcess = "Oxygen burning: O-16 + O-16 → P-31 + H-1",
        newtonConnection = "Only stars with sufficient gravitational mass reach the temperatures needed for oxygen burning",
        biologicalRole = "Forms the phosphate group linking nucleotides into the DNA strand",
        dnaRole = "The phosphodiester bond — phosphorus literally holds the DNA strand together"
    },
    new {
        id = "element-sulfur",
        element = "Sulfur",
        atomicNumber = 16,
        symbol = "S",
        forgedIn = "Massive stars via oxygen burning",
        stellarProcess = "Oxygen burning byproduct: O-16 + O-16 → S-32 + He-4",
        newtonConnection = "Same gravitational collapse chain as phosphorus — requires stellar mass above 8 solar masses",
        biologicalRole = "Found in cysteine and methionine — amino acids critical to enzyme structure",
        dnaRole = "Present in the CYP enzyme proteins that pharmacogenomics tracks for drug metabolism"
    }
};

foreach (var record in cosmicRecords)
{
    await cosmicContainer.UpsertItemAsync(record, new PartitionKey(record.element));
    Console.WriteLine($"  Seeded cosmic-origins: {record.element}");
}

// ── LAYER 2: Molecular Assembly ──────────────────────────────────────────────
var molecularContainer = database.GetContainer("molecular-assembly");

var molecularRecords = new[]
{
    new {
        id = "nucleotide-adenine",
        molecule = "Adenine (A)",
        type = "Purine base",
        elementsFrom = new[] { "Carbon", "Nitrogen", "Hydrogen" },
        keplerConnection = "Like Kepler's ellipses, A-T pairing follows precise mathematical rules — exactly 2 hydrogen bonds, no variation",
        basePairsWith = "Thymine (T)",
        hydrogenBonds = 2,
        role = "One of the four DNA bases — pairs with thymine in the double helix"
    },
    new {
        id = "nucleotide-thymine",
        molecule = "Thymine (T)",
        type = "Pyrimidine base",
        elementsFrom = new[] { "Carbon", "Nitrogen", "Oxygen", "Hydrogen" },
        keplerConnection = "T pairs only with A — the precision Kepler found in planetary motion exists here at the molecular level",
        basePairsWith = "Adenine (A)",
        hydrogenBonds = 2,
        role = "One of the four DNA bases — pairs with adenine in the double helix"
    },
    new {
        id = "nucleotide-cytosine",
        molecule = "Cytosine (C)",
        type = "Pyrimidine base",
        elementsFrom = new[] { "Carbon", "Nitrogen", "Oxygen", "Hydrogen" },
        keplerConnection = "C-G bonding with 3 hydrogen bonds is stronger than A-T — data-driven precision just as Kepler corrected Copernicus with Brahe's data",
        basePairsWith = "Guanine (G)",
        hydrogenBonds = 3,
        role = "One of the four DNA bases — pairs with guanine in the double helix"
    },
    new {
        id = "nucleotide-guanine",
        molecule = "Guanine (G)",
        type = "Purine base",
        elementsFrom = new[] { "Carbon", "Nitrogen", "Oxygen", "Hydrogen" },
        keplerConnection = "G-C is the strongest base pair — like Newton's law, the rule holds universally across all organisms",
        basePairsWith = "Cytosine (C)",
        hydrogenBonds = 3,
        role = "One of the four DNA bases — pairs with cytosine in the double helix"
    },
    new {
        id = "structure-double-helix",
        molecule = "DNA Double Helix",
        type = "Macromolecular structure",
        elementsFrom = new[] { "Carbon", "Nitrogen", "Oxygen", "Phosphorus", "Hydrogen" },
        keplerConnection = "The helical geometry is mathematically precise — 10.5 base pairs per turn, 3.4 angstroms per base pair, 34 angstroms per full turn",
        basePairsWith = "N/A",
        hydrogenBonds = 0,
        role = "The complete structure encoding all genetic information — from stellar atoms to the blueprint of life"
    }
};

foreach (var record in molecularRecords)
{
    await molecularContainer.UpsertItemAsync(record, new PartitionKey(record.molecule));
    Console.WriteLine($"  Seeded molecular-assembly: {record.molecule}");
}

// ── LAYER 3: Genomic Variants ────────────────────────────────────────────────
var genomicContainer = database.GetContainer("genomic-variants");

var genomicRecords = new[]
{
    new {
        id = "gene-CYP2D6-poor",
        gene = "CYP2D6",
        allele = "*4",
        diplotype = "*4/*4",
        phenotype = "Poor Metabolizer (PM)",
        populationFrequency = "5-10% of European populations",
        enzymeActivity = "None — enzyme non-functional",
        russellConnection = "Russell demanded precise definitions — PM is not 'slow', it means zero CYP2D6 enzyme function. Precision changes the clinical action entirely.",
        affectedDrugs = new[] { "Codeine", "Tramadol", "Tamoxifen", "Metoprolol" }
    },
    new {
        id = "gene-CYP2D6-ultrarapid",
        gene = "CYP2D6",
        allele = "*1xN",
        diplotype = "*1xN/*1",
        phenotype = "Ultra-Rapid Metabolizer (UM)",
        populationFrequency = "1-2% general population, up to 29% in North African populations",
        enzymeActivity = "Greatly increased — multiple gene copies",
        russellConnection = "UM is not 'fast' — it means the drug is metabolized so rapidly therapeutic levels are never reached, or toxic metabolites accumulate dangerously",
        affectedDrugs = new[] { "Codeine", "Tramadol", "Antidepressants" }
    },
    new {
        id = "gene-TPMT-poor",
        gene = "TPMT",
        allele = "*3A",
        diplotype = "*3A/*3A",
        phenotype = "Poor Metabolizer (PM)",
        populationFrequency = "0.3% of population",
        enzymeActivity = "None — life-threatening toxicity risk with standard doses",
        russellConnection = "Vague language kills here — 'low dose' is meaningless without knowing TPMT status. Russell's precision principle is patient safety.",
        affectedDrugs = new[] { "Mercaptopurine", "Azathioprine", "Thioguanine" }
    },
    new {
        id = "gene-DPYD-poor",
        gene = "DPYD",
        allele = "*2A",
        diplotype = "*2A/*2A",
        phenotype = "Poor Metabolizer (PM)",
        populationFrequency = "0.5-1% of population",
        enzymeActivity = "None — fluorouracil cannot be cleared, causes severe toxicity",
        russellConnection = "DPYD *2A carriers receiving standard fluorouracil doses face life-threatening toxicity — precision of definition is literally life or death",
        affectedDrugs = new[] { "Fluorouracil (5-FU)", "Capecitabine" }
    },
    new {
        id = "gene-CYP2C19-poor",
        gene = "CYP2C19",
        allele = "*2",
        diplotype = "*2/*2",
        phenotype = "Poor Metabolizer (PM)",
        populationFrequency = "2-5% European, 15-20% Asian populations",
        enzymeActivity = "None — prodrugs cannot be activated",
        russellConnection = "Clopidogrel requires CYP2C19 to become active — a PM taking clopidogrel after a stent receives no antiplatelet protection. Definition precision = stent thrombosis prevention.",
        affectedDrugs = new[] { "Clopidogrel", "Omeprazole", "Voriconazole" }
    }
};

foreach (var record in genomicRecords)
{
    await genomicContainer.UpsertItemAsync(record, new PartitionKey(record.gene));
    Console.WriteLine($"  Seeded genomic-variants: {record.gene} {record.allele}");
}

// ── LAYER 4: PGx Interactions ────────────────────────────────────────────────
var pgxContainer = database.GetContainer("pgx-interactions");

var pgxRecords = new[]
{
    new {
        id = "pgx-codeine-CYP2D6-PM",
        drug = "Codeine",
        gene = "CYP2D6",
        phenotype = "Poor Metabolizer",
        cpicGuideline = "CPIC Level A — Contraindicated",
        recommendation = "Select alternative analgesic. Codeine cannot be converted to morphine. No analgesia will occur and toxic metabolites may accumulate.",
        alternativeDrugs = new[] { "Morphine", "Hydromorphone", "Oxycodone (with caution)" },
        newtonParallel = "Like Newton's F=ma, drug effect = enzyme activity × substrate concentration. Zero enzyme activity = zero analgesic effect, regardless of dose.",
        alertLevel = "HARD_STOP"
    },
    new {
        id = "pgx-codeine-CYP2D6-UM",
        drug = "Codeine",
        gene = "CYP2D6",
        phenotype = "Ultra-Rapid Metabolizer",
        cpicGuideline = "CPIC Level A — Contraindicated",
        recommendation = "Select alternative analgesic. Ultra-rapid conversion produces dangerous morphine levels. Risk of respiratory depression and death.",
        alternativeDrugs = new[] { "Morphine (reduced dose)", "NSAIDs", "Non-opioid alternatives" },
        newtonParallel = "Gravitational force with no distance limit — enzyme activity so high the conversion is instantaneous and overwhelming",
        alertLevel = "HARD_STOP"
    },
    new {
        id = "pgx-mercaptopurine-TPMT-PM",
        drug = "Mercaptopurine",
        gene = "TPMT",
        phenotype = "Poor Metabolizer",
        cpicGuideline = "CPIC Level A — Reduce dose by 90%",
        recommendation = "Reduce starting dose to 10% of standard dose. Without TPMT function, standard doses cause life-threatening myelosuppression.",
        alternativeDrugs = new[] { "Dose reduction required — do not substitute" },
        newtonParallel = "Michaelis-Menten kinetics: with no enzyme (Vmax=0), drug accumulates without limit — analogous to zero gravity resistance",
        alertLevel = "HARD_STOP"
    },
    new {
        id = "pgx-clopidogrel-CYP2C19-PM",
        drug = "Clopidogrel",
        gene = "CYP2C19",
        phenotype = "Poor Metabolizer",
        cpicGuideline = "CPIC Level A — Select alternative",
        recommendation = "Use prasugrel or ticagrelor instead. Clopidogrel is a prodrug requiring CYP2C19 activation. PM patients receive no antiplatelet benefit.",
        alternativeDrugs = new[] { "Prasugrel", "Ticagrelor" },
        newtonParallel = "A rocket with no fuel — the drug exists but cannot be activated into its therapeutic form",
        alertLevel = "HARD_STOP"
    },
    new {
        id = "pgx-fluorouracil-DPYD-PM",
        drug = "Fluorouracil (5-FU)",
        gene = "DPYD",
        phenotype = "Poor Metabolizer",
        cpicGuideline = "CPIC Level A — Reduce dose or select alternative",
        recommendation = "Reduce starting dose by 50% or select alternative. Without DPYD, 5-FU accumulates to toxic levels causing severe mucositis, neutropenia, and death.",
        alternativeDrugs = new[] { "Dose reduction required", "Raltitrexed as alternative" },
        newtonParallel = "With no clearance mechanism, drug concentration increases without bound — like an orbit with no gravitational balance",
        alertLevel = "HARD_STOP"
    }
};

foreach (var record in pgxRecords)
{
    await pgxContainer.UpsertItemAsync(record, new PartitionKey(record.drug));
    Console.WriteLine($"  Seeded pgx-interactions: {record.drug} + {record.gene}");
}

// ── LAYER 5: Clinical Alerts ─────────────────────────────────────────────────
var alertContainer = database.GetContainer("clinical-alerts");

var alertRecords = new[]
{
    new {
        id = "alert-codeine-PM",
        alertType = "HARD_STOP",
        drug = "Codeine",
        gene = "CYP2D6",
        phenotype = "Poor Metabolizer",
        alertTitle = "CYP2D6 Poor Metabolizer — Codeine Contraindicated",
        alertMessage = "Patient genotype indicates CYP2D6 Poor Metabolizer status (*4/*4). Codeine requires CYP2D6 to convert to morphine. This patient will receive no analgesia and may accumulate toxic norcodeine metabolites. Order cannot be processed. Select an alternative analgesic.",
        overrideAllowed = false,
        overrideReason = "N/A — hard stop, no override permitted",
        willoyCdsAnalog = "Epic Willow Best Practice Advisory — Hard Stop with order block",
        functionalSpecRef = "FS-PGX-001",
        clinicalSource = "CPIC Guideline for Codeine and CYP2D6 — Level A"
    },
    new {
        id = "alert-codeine-UM",
        alertType = "HARD_STOP",
        drug = "Codeine",
        gene = "CYP2D6",
        phenotype = "Ultra-Rapid Metabolizer",
        alertTitle = "CYP2D6 Ultra-Rapid Metabolizer — Codeine Contraindicated",
        alertMessage = "Patient genotype indicates CYP2D6 Ultra-Rapid Metabolizer status. Codeine will be converted to morphine at dangerous speed, risking respiratory depression and death. Order cannot be processed. Select an alternative analgesic.",
        overrideAllowed = false,
        overrideReason = "N/A — hard stop, no override permitted",
        willoyCdsAnalog = "Epic Willow Best Practice Advisory — Hard Stop with order block",
        functionalSpecRef = "FS-PGX-002",
        clinicalSource = "CPIC Guideline for Codeine and CYP2D6 — Level A"
    },
    new {
        id = "alert-mercaptopurine-PM",
        alertType = "HARD_STOP",
        drug = "Mercaptopurine",
        gene = "TPMT",
        phenotype = "Poor Metabolizer",
        alertTitle = "TPMT Poor Metabolizer — Mercaptopurine Dose Reduction Required",
        alertMessage = "Patient genotype indicates TPMT Poor Metabolizer status (*3A/*3A). Standard mercaptopurine doses will cause life-threatening myelosuppression. Dose must be reduced to 10% of standard. Order requires pharmacist and physician review before processing.",
        overrideAllowed = true,
        overrideReason = "Physician attestation of dose reduction with pharmacist co-sign required",
        willoyCdsAnalog = "Epic Willow Best Practice Advisory — Hard Stop with mandatory co-sign override",
        functionalSpecRef = "FS-PGX-003",
        clinicalSource = "CPIC Guideline for Thiopurines and TPMT/NUDT15 — Level A"
    },
    new {
        id = "alert-clopidogrel-PM",
        alertType = "SOFT_WARNING",
        drug = "Clopidogrel",
        gene = "CYP2C19",
        phenotype = "Poor Metabolizer",
        alertTitle = "CYP2C19 Poor Metabolizer — Clopidogrel Reduced Efficacy",
        alertMessage = "Patient genotype indicates CYP2C19 Poor Metabolizer status. Clopidogrel activation is significantly reduced. Consider prasugrel or ticagrelor as alternative antiplatelet therapy. Prescriber acknowledgment required to continue.",
        overrideAllowed = true,
        overrideReason = "Prescriber must acknowledge and document clinical rationale",
        willoyCdsAnalog = "Epic Willow Best Practice Advisory — Soft warning with required acknowledgment",
        functionalSpecRef = "FS-PGX-004",
        clinicalSource = "CPIC Guideline for Clopidogrel and CYP2C19 — Level A"
    },
    new {
        id = "alert-fluorouracil-PM",
        alertType = "HARD_STOP",
        drug = "Fluorouracil (5-FU)",
        gene = "DPYD",
        phenotype = "Poor Metabolizer",
        alertTitle = "DPYD Poor Metabolizer — Fluorouracil Dose Reduction Required",
        alertMessage = "Patient genotype indicates DPYD Poor Metabolizer status (*2A/*2A). Standard fluorouracil doses will accumulate to toxic levels causing severe mucositis, neutropenia, and potentially fatal toxicity. Starting dose must be reduced by 50% minimum. Order requires oncology pharmacist review.",
        overrideAllowed = true,
        overrideReason = "Oncology pharmacist review and dose adjustment documentation required",
        willoyCdsAnalog = "Epic Willow Oncology Best Practice Advisory — Hard Stop with oncology pharmacist override",
        functionalSpecRef = "FS-PGX-005",
        clinicalSource = "CPIC Guideline for Fluoropyrimidines and DPYD — Level A"
    }
};

foreach (var record in alertRecords)
{
    await alertContainer.UpsertItemAsync(record, new PartitionKey(record.alertType));
    Console.WriteLine($"  Seeded clinical-alerts: {record.drug} ({record.alertType})");
}

Console.WriteLine("\nAll five layers seeded successfully.");
Console.WriteLine("From the Big Bang to the Bedside — database complete.");