 const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, BorderStyle, WidthType, ShadingType, LevelFormat } = require('docx');
const fs = require('fs');

const NAVY     = "1B3A5C";
const WHITE    = "FFFFFF";
const TAGLINE  = "B8C8DC";
const CONTACT  = "C8D8E8";
const BODY     = "4B5563";
const COMP_BG  = "F3F4F6";
const COMP_BDR = "D1D5DB";
const RED_BG   = "FEE2E2";
const RED_TEXT = "991B1B";
const AMB_BG   = "FEF3C7";
const AMB_TEXT = "92400E";

const noBorder  = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const CONTENT_W = 9360;

function secHeader(text) {
  return new Paragraph({
    spacing: { before: 220, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: NAVY, space: 3 } },
    children: [new TextRun({ text, bold: true, size: 22, font: "Arial", color: NAVY, characterSpacing: 30 })]
  });
}

function field(label, value) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: label + ": ", bold: true, size: 20, font: "Arial", color: NAVY }),
      new TextRun({ text: value, size: 20, font: "Arial", color: BODY })
    ]
  });
}

function bodyPara(text, spacingAfter = 120) {
  return new Paragraph({
    spacing: { after: spacingAfter },
    children: [new TextRun({ text, size: 20, font: "Arial", color: BODY })]
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 20, font: "Arial", color: BODY })]
  });
}

function subHeader(text) {
  return new Paragraph({
    spacing: { before: 100, after: 60 },
    children: [new TextRun({ text, bold: true, size: 20, font: "Arial", color: NAVY })]
  });
}

function alertBox(isHardStop, title, message) {
  const bg   = isHardStop ? RED_BG  : AMB_BG;
  const col  = isHardStop ? RED_TEXT : AMB_TEXT;
  const prefix = isHardStop ? "HARD STOP — " : "SOFT WARNING — ";
  const border = { style: BorderStyle.SINGLE, size: 4, color: col };
  const borders = { top: border, bottom: border, left: border, right: border };
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    borders: { top: border, bottom: border, left: border, right: border, insideH: noBorder, insideV: noBorder },
    rows: [new TableRow({ children: [
      new TableCell({
        borders,
        width: { size: CONTENT_W, type: WidthType.DXA },
        shading: { fill: bg, type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 160, right: 160 },
        children: [
          new Paragraph({
            spacing: { after: 60 },
            children: [new TextRun({ text: prefix + title, bold: true, size: 22, font: "Arial", color: col })]
          }),
          new Paragraph({
            spacing: { after: 0 },
            children: [new TextRun({ text: message, size: 20, font: "Arial", color: col })]
          })
        ]
      })
    ]})]
  });
}

function testHeaderRow() {
  const b = { style: BorderStyle.SINGLE, size: 1, color: COMP_BDR };
  const borders = { top: b, bottom: b, left: b, right: b };
  function hCell(text, width) {
    return new TableCell({
      borders, width: { size: width, type: WidthType.DXA },
      shading: { fill: COMP_BG, type: ShadingType.CLEAR },
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 18, font: "Arial", color: NAVY })] })]
    });
  }
  return new TableRow({ children: [hCell("Test scenario",2600), hCell("Input / patient state",2600), hCell("Expected system behavior",2600), hCell("Result",1560)] });
}

function testRow(scenario, input, expected) {
  const b = { style: BorderStyle.SINGLE, size: 1, color: COMP_BDR };
  const borders = { top: b, bottom: b, left: b, right: b };
  function cell(text, width) {
    return new TableCell({
      borders, width: { size: width, type: WidthType.DXA },
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: [new Paragraph({ children: [new TextRun({ text, size: 18, font: "Arial", color: BODY })] })]
    });
  }
  function passCell() {
    return new TableCell({
      borders, width: { size: 1560, type: WidthType.DXA },
      shading: { fill: "D1FAE5", type: ShadingType.CLEAR },
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: [new Paragraph({ children: [new TextRun({ text: "PASS", bold: true, size: 18, font: "Arial", color: "065F46" })] })]
    });
  }
  return new TableRow({ children: [cell(scenario,2600), cell(input,2600), cell(expected,2600), passCell()] });
}

function docHeader(title, subtitle, docId) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder },
    rows: [new TableRow({ children: [
      new TableCell({
        borders: noBorders,
        width: { size: CONTENT_W, type: WidthType.DXA },
        shading: { fill: NAVY, type: ShadingType.CLEAR },
        margins: { top: 200, bottom: 200, left: 280, right: 280 },
        children: [
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
            children: [new TextRun({ text: "EPIC WILLOW — FUNCTIONAL SPECIFICATION", bold: true, size: 28, font: "Arial", color: WHITE, characterSpacing: 60 })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
            children: [new TextRun({ text: subtitle, size: 20, font: "Arial", color: TAGLINE })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 },
            children: [new TextRun({ text: docId + "  │  Version: 1.0  │  Status: Draft  │  April 2026", size: 18, font: "Arial", color: CONTACT })] }),
        ]
      })
    ]})]
  });
}

function footerNote() {
  return new Paragraph({
    spacing: { before: 200, after: 0 },
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: COMP_BDR, space: 8 } },
    children: [new TextRun({ text: "This functional specification was produced as part of the \"From the Big Bang to the Bedside\" pharmacogenomics informatics project. github.com/IT-Professional-Kristina", size: 17, font: "Arial", color: "9CA3AF", italics: true })]
  });
}

function numbering() {
  return {
    config: [{
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 540, hanging: 260 } } } }]
    }]
  };
}

function pageProps() {
  return { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } };
}

// ── FS-PGX-002: Codeine + CYP2D6 Ultra-Rapid Metabolizer ─────────────────────
function buildPGX002() {
  return new Document({
    numbering: numbering(),
    styles: { default: { document: { run: { font: "Arial", size: 20, color: BODY } } } },
    sections: [{ properties: pageProps(), children: [
      docHeader("FS-PGX-002", "Pharmacogenomics Clinical Decision Support  │  Medication Safety Alert", "Document ID: FS-PGX-002"),
      new Paragraph({ spacing: { before: 60, after: 120 }, children: [new TextRun({ text: "" })] }),

      secHeader("1. Document Information"),
      field("Specification ID", "FS-PGX-002"),
      field("Title", "CYP2D6 Ultra-Rapid Metabolizer — Codeine Hard Stop Alert"),
      field("Epic Module", "Willow Inpatient / Willow Ambulatory"),
      field("Alert Type", "Hard Stop — Order Block (no override permitted)"),
      field("Author", "Kristina Ankrah, Healthcare IT Analyst"),
      field("Clinical Source", "CPIC Guideline for Codeine and CYP2D6 — Evidence Level A"),
      field("Status", "Draft — Pending clinical and pharmacy review"),

      secHeader("2. Clinical Background and Purpose"),
      bodyPara("CYP2D6 Ultra-Rapid Metabolizers (UM) carry multiple functional copies of the CYP2D6 gene, resulting in greatly accelerated codeine-to-morphine conversion. While Poor Metabolizers receive no benefit from codeine, Ultra-Rapid Metabolizers face the opposite and equally dangerous problem — morphine accumulates at dangerous speed, risking respiratory depression, central nervous system depression, and death."),
      bodyPara("This risk is particularly severe in breastfeeding mothers (where morphine passes to infants through breast milk) and in post-surgical patients receiving codeine for pain management. The FDA issued a black box warning for codeine in Ultra-Rapid Metabolizers in 2013. CPIC classifies the recommendation as Level A — the highest evidence level."),
      bodyPara("Newton parallel from project framework: ultra-rapid metabolism is the inverse of the Poor Metabolizer problem — like a gravitational field so strong that even light cannot escape. The enzyme activity is so high that standard doses produce toxic morphine concentrations before the body can respond."),

      secHeader("3. Alert Trigger Conditions"),
      bodyPara("The alert fires when ALL of the following conditions are simultaneously true:"),
      bullet("A codeine order is initiated in Epic Willow Inpatient or Willow Ambulatory"),
      bullet("The patient's discrete genomic data contains a documented CYP2D6 result"),
      bullet("The CYP2D6 result maps to Ultra-Rapid Metabolizer phenotype (*1xN, *2xN, or equivalent gene duplication diplotype)"),
      bullet("The order has not yet been verified by a pharmacist"),

      secHeader("4. Alert Display — Simulated Willow CDS Hard Stop"),
      bodyPara("The following represents the alert message as it would appear in Epic Willow at the point of order entry:"),
      new Paragraph({ spacing: { before: 120, after: 120 }, children: [new TextRun({ text: "" })] }),
      alertBox(true, "Codeine Order Blocked — CYP2D6 Ultra-Rapid Metabolizer",
        "Patient genomic data indicates CYP2D6 Ultra-Rapid Metabolizer status (gene duplication). Codeine is converted to morphine at dangerous speed in this patient. Life-threatening respiratory depression and CNS toxicity may result. Risk is elevated in breastfeeding patients — morphine passes to infant through breast milk. This order cannot be processed. Select an alternative analgesic. Recommended alternatives: morphine (reduced dose with monitoring), NSAIDs, non-opioid alternatives. Reference: CPIC Guideline for Codeine and CYP2D6 — Level A. Questions: contact pharmacy."),
      new Paragraph({ spacing: { before: 120, after: 80 }, children: [new TextRun({ text: "" })] }),
      field("Override permitted", "No — hard stop. No override pathway exists."),
      field("Button options", "\"Select Alternative\" (primary) | \"View CPIC Guideline\" (secondary)"),
      field("Pharmacist notification", "Alert event logged with timestamp, provider NPI, and patient genomic result reference"),

      secHeader("5. Build Requirements — Epic Willow Configuration"),
      subHeader("5.1  Medication grouper"),
      bullet("Reuse GROUPER-CODEINE-ALL from FS-PGX-001 — same codeine medication grouper applies"),
      subHeader("5.2  Genomic result mapping"),
      bullet("Map CYP2D6 gene duplication results (*1xN, *2xN, *2x3, *35xN) to Ultra-Rapid Metabolizer phenotype category"),
      bullet("Confirm gene duplication reporting format with laboratory informatics — result interfaces may report duplications differently across reference laboratories"),
      subHeader("5.3  BPA configuration"),
      bullet("Alert type: Hard Stop — Order Block"),
      bullet("Logic: IF medication IN GROUPER-CODEINE-ALL AND CYP2D6 phenotype = Ultra-Rapid Metabolizer THEN fire hard stop"),
      bullet("This alert is a separate BPA from FS-PGX-001 — both PM and UM alerts must be active simultaneously"),
      bullet("Override: None permitted"),

      secHeader("6. Testing Scenarios"),
      new Paragraph({ spacing: { before: 120, after: 80 }, children: [new TextRun({ text: "" })] }),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2600, 2600, 2600, 1560],
        rows: [
          testHeaderRow(),
          testRow("UM patient orders codeine", "CYP2D6 *1xN/*1 + codeine oral order", "Hard stop fires — order blocked"),
          testRow("UM breastfeeding patient orders codeine", "CYP2D6 *2xN + codeine order, OB flag active", "Hard stop fires — order blocked"),
          testRow("PM patient orders codeine", "CYP2D6 *4/*4 + codeine order", "FS-PGX-001 alert fires — not this alert"),
          testRow("UM patient orders morphine", "CYP2D6 *1xN + morphine IR order", "No alert — morphine not in codeine grouper"),
          testRow("No PGx data on file", "No CYP2D6 result + codeine order", "No alert — insufficient data"),
        ]
      }),

      secHeader("7. Review and Sign-Off"),
      field("Clinical Pharmacy Review", "Pending"),
      field("Physician Champion Review", "Pending"),
      field("Epic Analyst Build Sign-off", "Pending"),
      field("Go-Live Approval", "Pending"),
      footerNote()
    ]}]
  });
}

// ── FS-PGX-003: Mercaptopurine + TPMT Poor Metabolizer ───────────────────────
function buildPGX003() {
  return new Document({
    numbering: numbering(),
    styles: { default: { document: { run: { font: "Arial", size: 20, color: BODY } } } },
    sections: [{ properties: pageProps(), children: [
      docHeader("FS-PGX-003", "Pharmacogenomics Clinical Decision Support  │  Oncology Medication Safety", "Document ID: FS-PGX-003"),
      new Paragraph({ spacing: { before: 60, after: 120 }, children: [new TextRun({ text: "" })] }),

      secHeader("1. Document Information"),
      field("Specification ID", "FS-PGX-003"),
      field("Title", "TPMT Poor Metabolizer — Mercaptopurine Hard Stop with Mandatory Dose Reduction"),
      field("Epic Module", "Willow Inpatient / Beacon Oncology"),
      field("Alert Type", "Hard Stop — Override permitted with oncology pharmacist co-sign and documented dose reduction"),
      field("Author", "Kristina Ankrah, Healthcare IT Analyst"),
      field("Clinical Source", "CPIC Guideline for Thiopurines and TPMT/NUDT15 — Evidence Level A"),
      field("Status", "Draft — Pending clinical and pharmacy review"),

      secHeader("2. Clinical Background and Purpose"),
      bodyPara("Mercaptopurine (6-MP) is a thiopurine immunosuppressant used in pediatric acute lymphoblastic leukemia (ALL) maintenance therapy and inflammatory bowel disease. It requires the TPMT enzyme for detoxification. Patients who are TPMT Poor Metabolizers cannot metabolize mercaptopurine — standard doses cause life-threatening myelosuppression (bone marrow failure), with white blood cell counts dropping to dangerously low levels."),
      bodyPara("Unlike the codeine alerts (FS-PGX-001, 002), this alert permits a carefully controlled override — because the drug is sometimes clinically necessary and can be used safely at a dramatically reduced dose (10% of standard). The override requires oncology pharmacist review and documented dose adjustment, making this a co-sign hard stop rather than an absolute block."),
      bodyPara("DPYD parallel from project framework: both TPMT and DPYD deficiency result in drug accumulation without limit — like Newton's gravitational collapse with no counterbalancing force. The drug concentrates until toxicity results. The only intervention is reducing the substrate load — dose reduction."),

      secHeader("3. Alert Trigger Conditions"),
      bullet("A mercaptopurine, azathioprine, or thioguanine order is initiated in Willow Inpatient or Beacon Oncology"),
      bullet("The patient's discrete genomic data contains a documented TPMT result"),
      bullet("The TPMT result maps to Poor Metabolizer phenotype (*3A/*3A, *3A/*3C, *3C/*3C, or equivalent non-functional diplotype)"),
      bullet("The order dose exceeds 10% of the standard weight-based dose"),

      secHeader("4. Alert Display — Simulated Willow CDS Hard Stop"),
      new Paragraph({ spacing: { before: 120, after: 120 }, children: [new TextRun({ text: "" })] }),
      alertBox(true, "Mercaptopurine Order Requires Review — TPMT Poor Metabolizer",
        "Patient genomic data indicates TPMT Poor Metabolizer status (*3A/*3A). Standard mercaptopurine doses will cause life-threatening myelosuppression in this patient. Dose MUST be reduced to 10% of standard weight-based dose. This order requires oncology pharmacist review and co-sign with documented dose adjustment before processing. Do not administer standard dose. Reference: CPIC Guideline for Thiopurines and TPMT/NUDT15 — Level A. Contact oncology pharmacy immediately."),
      new Paragraph({ spacing: { before: 120, after: 80 }, children: [new TextRun({ text: "" })] }),
      field("Override permitted", "Yes — with oncology pharmacist co-sign and documented 90% dose reduction"),
      field("Override requirement", "Pharmacist must document: (1) TPMT PM status acknowledged, (2) dose reduced to 10% of standard, (3) CBC monitoring plan in place"),
      field("Button options", "\"Route for Pharmacist Co-sign\" (primary) | \"Cancel Order\" (secondary) | \"View CPIC Guideline\""),

      secHeader("5. Build Requirements"),
      subHeader("5.1  Medication grouper"),
      bullet("Create GROUPER-THIOPURINES containing: mercaptopurine (6-MP), azathioprine, thioguanine — all formulations and routes"),
      subHeader("5.2  Genomic result mapping"),
      bullet("Map TPMT non-functional alleles to Poor Metabolizer phenotype: *2, *3A, *3B, *3C, *4, *5, *6, *7, *8"),
      bullet("Note: NUDT15 also affects thiopurine metabolism — coordinate with clinical pharmacogenomics team on combined TPMT/NUDT15 phenotype mapping"),
      subHeader("5.3  BPA configuration with co-sign workflow"),
      bullet("Alert type: Hard Stop with co-sign override pathway"),
      bullet("Logic: IF medication IN GROUPER-THIOPURINES AND TPMT phenotype = Poor Metabolizer THEN fire hard stop"),
      bullet("Override: Oncology pharmacist co-sign required — standard override reason dropdown insufficient"),
      bullet("Dose check: Configure secondary alert if ordered dose exceeds 10% of standard weight-based dose after co-sign"),

      secHeader("6. Testing Scenarios"),
      new Paragraph({ spacing: { before: 120, after: 80 }, children: [new TextRun({ text: "" })] }),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2600, 2600, 2600, 1560],
        rows: [
          testHeaderRow(),
          testRow("PM patient — standard dose ordered", "TPMT *3A/*3A + mercaptopurine 75mg/m2", "Hard stop fires — co-sign required"),
          testRow("PM patient — reduced dose ordered", "TPMT *3A/*3A + mercaptopurine 7.5mg/m2", "Hard stop fires — co-sign still required"),
          testRow("PM patient — pharmacist co-signs", "Co-sign completed + dose reduction documented", "Order released for administration"),
          testRow("NM patient orders mercaptopurine", "TPMT *1/*1 + mercaptopurine standard dose", "No alert — order processes normally"),
          testRow("PM patient orders azathioprine", "TPMT *3A/*3A + azathioprine order", "Hard stop fires — grouper includes azathioprine"),
        ]
      }),

      secHeader("7. Review and Sign-Off"),
      field("Clinical Pharmacy Review", "Pending — Oncology Clinical Pharmacist"),
      field("Oncology Physician Champion", "Pending"),
      field("Epic Analyst Build Sign-off", "Pending"),
      field("Go-Live Approval", "Pending — CMIO"),
      footerNote()
    ]}]
  });
}

// ── FS-PGX-004: Clopidogrel + CYP2C19 Poor Metabolizer ───────────────────────
function buildPGX004() {
  return new Document({
    numbering: numbering(),
    styles: { default: { document: { run: { font: "Arial", size: 20, color: BODY } } } },
    sections: [{ properties: pageProps(), children: [
      docHeader("FS-PGX-004", "Pharmacogenomics Clinical Decision Support  │  Cardiovascular Medication Safety", "Document ID: FS-PGX-004"),
      new Paragraph({ spacing: { before: 60, after: 120 }, children: [new TextRun({ text: "" })] }),

      secHeader("1. Document Information"),
      field("Specification ID", "FS-PGX-004"),
      field("Title", "CYP2C19 Poor Metabolizer — Clopidogrel Soft Warning with Alternative Recommendation"),
      field("Epic Module", "Willow Inpatient / Willow Ambulatory"),
      field("Alert Type", "Soft Warning — Prescriber acknowledgment required, order not blocked"),
      field("Author", "Kristina Ankrah, Healthcare IT Analyst"),
      field("Clinical Source", "CPIC Guideline for Clopidogrel and CYP2C19 — Evidence Level A"),
      field("Status", "Draft — Pending clinical and pharmacy review"),

      secHeader("2. Clinical Background and Purpose"),
      bodyPara("Clopidogrel is an antiplatelet prodrug used to prevent stent thrombosis and cardiovascular events. It requires CYP2C19 to convert from its inactive form to its active thiol metabolite. CYP2C19 Poor Metabolizers cannot perform this activation — clopidogrel provides no antiplatelet benefit, leaving patients with coronary stents at risk of stent thrombosis, heart attack, and death."),
      bodyPara("Unlike the codeine and mercaptopurine alerts, the clopidogrel alert is configured as a soft warning rather than a hard stop. This reflects clinical reality — there are situations where clopidogrel may still be the preferred agent despite reduced efficacy, and the prescriber must make that determination. The alert ensures the prescriber is aware of the genomic finding and must actively acknowledge it before proceeding."),
      bodyPara("Copernican parallel from project framework: the old model — one antiplatelet fits all — is the geocentric error. CYP2C19 PM patients need prasugrel or ticagrelor at the center of their treatment plan, not clopidogrel. The genome is the center; the drug selection orbits it."),

      secHeader("3. Alert Trigger Conditions"),
      bullet("A clopidogrel order is initiated in Willow Inpatient or Willow Ambulatory"),
      bullet("The patient's discrete genomic data contains a documented CYP2C19 result"),
      bullet("The CYP2C19 result maps to Poor Metabolizer phenotype (*2/*2, *2/*3, *3/*3)"),
      bullet("The order has not yet been verified by a pharmacist"),

      secHeader("4. Alert Display — Simulated Willow CDS Soft Warning"),
      new Paragraph({ spacing: { before: 120, after: 120 }, children: [new TextRun({ text: "" })] }),
      alertBox(false, "Clopidogrel — Reduced Efficacy Expected — CYP2C19 Poor Metabolizer",
        "Patient genomic data indicates CYP2C19 Poor Metabolizer status (*2/*2). Clopidogrel requires CYP2C19 activation to produce antiplatelet effect. This patient has significantly reduced or absent CYP2C19 activity — clopidogrel is unlikely to provide adequate antiplatelet protection. Consider prasugrel or ticagrelor as alternative antiplatelet therapy. Prescriber must acknowledge this finding to continue. Reference: CPIC Guideline for Clopidogrel and CYP2C19 — Level A."),
      new Paragraph({ spacing: { before: 120, after: 80 }, children: [new TextRun({ text: "" })] }),
      field("Override permitted", "Yes — prescriber acknowledgment required with documented clinical rationale"),
      field("Override reason required", "Prescriber must select from dropdown: (1) Alternative contraindicated, (2) Patient preference after counseling, (3) Clinical circumstances require clopidogrel"),
      field("Button options", "\"Acknowledge and Continue\" (requires reason) | \"Select Alternative\" | \"View CPIC Guideline\""),
      field("Pharmacist notification", "Alert firing and prescriber acknowledgment reason logged — pharmacist receives notification for independent review"),

      secHeader("5. Build Requirements"),
      subHeader("5.1  Medication grouper"),
      bullet("Create GROUPER-CLOPIDOGREL containing all clopidogrel formulations and combination products"),
      subHeader("5.2  Genomic result mapping"),
      bullet("Map CYP2C19 non-functional alleles to Poor Metabolizer: *2, *3, *4, *5, *6, *7, *8"),
      bullet("Note: CYP2C19 Intermediate Metabolizers (*1/*2) also have reduced efficacy — coordinate with clinical pharmacogenomics on whether separate IM alert is needed"),
      subHeader("5.3  BPA configuration — soft warning"),
      bullet("Alert type: Soft Warning with mandatory acknowledgment reason"),
      bullet("Logic: IF medication IN GROUPER-CLOPIDOGREL AND CYP2C19 phenotype = Poor Metabolizer THEN fire soft warning"),
      bullet("Override: Permitted — prescriber must select acknowledgment reason from controlled dropdown"),
      bullet("Pharmacist: Notification sent to dispensing pharmacist queue when override is selected"),

      secHeader("6. Testing Scenarios"),
      new Paragraph({ spacing: { before: 120, after: 80 }, children: [new TextRun({ text: "" })] }),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2600, 2600, 2600, 1560],
        rows: [
          testHeaderRow(),
          testRow("PM patient orders clopidogrel", "CYP2C19 *2/*2 + clopidogrel 75mg order", "Soft warning fires — acknowledgment required"),
          testRow("PM prescriber acknowledges", "Soft warning fires → reason selected → continue", "Order processes — pharmacist notified"),
          testRow("PM prescriber selects alternative", "Soft warning fires → Select Alternative clicked", "Order cancelled — returns to med search"),
          testRow("NM patient orders clopidogrel", "CYP2C19 *1/*1 + clopidogrel order", "No alert — order processes normally"),
          testRow("PM patient orders prasugrel", "CYP2C19 *2/*2 + prasugrel order", "No alert — prasugrel not in grouper"),
          testRow("PM — no reason selected", "Acknowledge clicked without reason selection", "System requires reason — cannot proceed"),
        ]
      }),

      secHeader("7. Review and Sign-Off"),
      field("Clinical Pharmacy Review", "Pending — Cardiovascular Clinical Pharmacist"),
      field("Cardiology Physician Champion", "Pending"),
      field("Epic Analyst Build Sign-off", "Pending"),
      field("Go-Live Approval", "Pending — CMIO"),
      footerNote()
    ]}]
  });
}

// ── FS-PGX-005: Fluorouracil + DPYD Poor Metabolizer ─────────────────────────
function buildPGX005() {
  return new Document({
    numbering: numbering(),
    styles: { default: { document: { run: { font: "Arial", size: 20, color: BODY } } } },
    sections: [{ properties: pageProps(), children: [
      docHeader("FS-PGX-005", "Pharmacogenomics Clinical Decision Support  │  Oncology Chemotherapy Safety", "Document ID: FS-PGX-005"),
      new Paragraph({ spacing: { before: 60, after: 120 }, children: [new TextRun({ text: "" })] }),

      secHeader("1. Document Information"),
      field("Specification ID", "FS-PGX-005"),
      field("Title", "DPYD Poor Metabolizer — Fluorouracil Hard Stop with Oncology Pharmacist Override"),
      field("Epic Module", "Willow Inpatient / Beacon Oncology"),
      field("Alert Type", "Hard Stop — Override permitted with oncology pharmacist review and 50% dose reduction documentation"),
      field("Author", "Kristina Ankrah, Healthcare IT Analyst"),
      field("Clinical Source", "CPIC Guideline for Fluoropyrimidines and DPYD — Evidence Level A"),
      field("Status", "Draft — Pending clinical and pharmacy review"),

      secHeader("2. Clinical Background and Purpose"),
      bodyPara("Fluorouracil (5-FU) and its oral prodrug capecitabine are among the most widely used chemotherapy agents, used in colorectal, breast, head and neck, and gastric cancers. They require the DPYD enzyme for clearance. DPYD Poor Metabolizers cannot clear fluorouracil — the drug accumulates to toxic levels causing severe mucositis, neutropenia, hand-foot syndrome, and potentially fatal toxicity even at standard doses."),
      bodyPara("This is one of the highest-stakes pharmacogenomic alerts in oncology practice. The FDA updated fluorouracil labeling in 2022 to recommend DPYD testing before treatment. CPIC classifies the recommendation as Level A. Even heterozygous carriers (*2A/*1 — intermediate metabolizers) require dose reduction, though this specification focuses on the Poor Metabolizer (*2A/*2A) population."),
      bodyPara("Stellar nucleosynthesis connection from project framework: the phosphorus and sulfur forged in massive stellar cores form the phosphodiester backbone of the DPYD gene itself. A single nucleotide variant in that stellar-forged DNA sequence — one base pair changed — abolishes an enzyme and makes a standard chemotherapy dose potentially fatal. The Big Bang to the bedside, in one gene."),

      secHeader("3. Alert Trigger Conditions"),
      bullet("A fluorouracil (5-FU) or capecitabine order is initiated in Willow Inpatient or Beacon Oncology"),
      bullet("The patient's discrete genomic data contains a documented DPYD result"),
      bullet("The DPYD result maps to Poor Metabolizer phenotype (*2A/*2A or equivalent fully non-functional diplotype)"),
      bullet("The order dose has not been reviewed and documented by an oncology pharmacist in the current encounter"),

      secHeader("4. Alert Display — Simulated Willow CDS Hard Stop"),
      new Paragraph({ spacing: { before: 120, after: 120 }, children: [new TextRun({ text: "" })] }),
      alertBox(true, "Fluorouracil Order Requires Oncology Pharmacist Review — DPYD Poor Metabolizer",
        "Patient genomic data indicates DPYD Poor Metabolizer status (*2A/*2A). Standard fluorouracil and capecitabine doses will accumulate to toxic levels in this patient, causing severe mucositis, neutropenia, and potentially fatal toxicity. Starting dose must be reduced by minimum 50%. This order requires oncology pharmacist review, dose adjustment documentation, and co-sign before processing. Do not administer at standard dose. Reference: CPIC Guideline for Fluoropyrimidines and DPYD — Level A. Contact oncology pharmacy immediately."),
      new Paragraph({ spacing: { before: 120, after: 80 }, children: [new TextRun({ text: "" })] }),
      field("Override permitted", "Yes — oncology pharmacist co-sign required with documented 50% minimum dose reduction and toxicity monitoring plan"),
      field("Override requirement", "Pharmacist must document: (1) DPYD PM status acknowledged, (2) dose reduced by minimum 50%, (3) enhanced toxicity monitoring plan, (4) patient counseling completed"),
      field("Button options", "\"Route for Oncology Pharmacist Review\" (primary) | \"Cancel Order\" (secondary) | \"View CPIC Guideline\""),

      secHeader("5. Build Requirements"),
      subHeader("5.1  Medication grouper"),
      bullet("Create GROUPER-FLUOROPYRIMIDINES containing: fluorouracil IV (all concentrations and infusion durations), capecitabine oral, tegafur-containing combinations"),
      bullet("Note: Fluorouracil appears across multiple Beacon regimens — coordinate with Beacon analyst to ensure all regimen-linked orderable items are captured in grouper"),
      subHeader("5.2  Genomic result mapping"),
      bullet("Map DPYD non-functional alleles to Poor Metabolizer: *2A (c.1905+1G>A), *13 (c.1679T>G), p.D949V, HapB3"),
      bullet("Note: DPYD variant nomenclature varies across reference laboratories — confirm interface mapping with laboratory informatics before build"),
      subHeader("5.3  BPA configuration — oncology hard stop"),
      bullet("Alert type: Hard Stop with oncology pharmacist co-sign override"),
      bullet("Logic: IF medication IN GROUPER-FLUOROPYRIMIDINES AND DPYD phenotype = Poor Metabolizer THEN fire hard stop"),
      bullet("Beacon integration: Alert must fire within Beacon regimen ordering workflow, not only standalone Willow orders"),
      bullet("Override: Oncology pharmacist co-sign with four required documentation fields — standard override reason insufficient"),

      secHeader("6. Testing Scenarios"),
      new Paragraph({ spacing: { before: 120, after: 80 }, children: [new TextRun({ text: "" })] }),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2600, 2600, 2600, 1560],
        rows: [
          testHeaderRow(),
          testRow("PM patient — 5-FU IV standard dose", "DPYD *2A/*2A + 5-FU 400mg/m2 bolus order", "Hard stop fires — pharmacist review required"),
          testRow("PM patient — capecitabine order", "DPYD *2A/*2A + capecitabine 1250mg/m2 order", "Hard stop fires — grouper includes capecitabine"),
          testRow("PM — pharmacist co-signs with dose reduction", "50% dose reduction documented + co-sign complete", "Order released for administration"),
          testRow("PM — Beacon regimen ordered", "DPYD *2A/*2A + FOLFOX regimen in Beacon", "Hard stop fires within Beacon workflow"),
          testRow("NM patient orders 5-FU", "DPYD *1/*1 + 5-FU standard dose", "No alert — order processes normally"),
          testRow("PM — co-sign without all 4 fields", "Partial documentation + co-sign attempted", "System requires all 4 fields — cannot release"),
        ]
      }),

      secHeader("7. Review and Sign-Off"),
      field("Oncology Pharmacy Review", "Pending — Oncology Clinical Pharmacist"),
      field("Oncology Physician Champion", "Pending — Medical Oncologist"),
      field("Beacon Analyst Coordination", "Pending — Beacon Application Analyst"),
      field("Epic Analyst Build Sign-off", "Pending — Willow Application Analyst"),
      field("Go-Live Approval", "Pending — CMIO / Oncology Medical Director"),
      footerNote()
    ]}]
  });
}

// ── Generate all four documents ───────────────────────────────────────────────
async function generateAll() {
  const specs = [
    { doc: buildPGX002(), filename: "FS-PGX-002_Codeine_CYP2D6_UM.docx" },
    { doc: buildPGX003(), filename: "FS-PGX-003_Mercaptopurine_TPMT_PM.docx" },
    { doc: buildPGX004(), filename: "FS-PGX-004_Clopidogrel_CYP2C19_PM.docx" },
    { doc: buildPGX005(), filename: "FS-PGX-005_Fluorouracil_DPYD_PM.docx" },
  ];

  for (const spec of specs) {
    const buf = await Packer.toBuffer(spec.doc);
    fs.writeFileSync(spec.filename, buf);
    console.log("Created: " + spec.filename);
  }

  console.log("\nAll four functional specs generated.");
  console.log("FS-PGX-001 through FS-PGX-005 complete.");
}

generateAll();