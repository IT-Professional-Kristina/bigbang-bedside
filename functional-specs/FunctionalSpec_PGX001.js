 const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, BorderStyle, WidthType, ShadingType, LevelFormat,
        TabStopType, UnderlineType } = require('docx');
const fs = require('fs');

const NAVY      = "1B3A5C";
const WHITE     = "FFFFFF";
const TAGLINE   = "B8C8DC";
const CONTACT   = "C8D8E8";
const BODY      = "4B5563";
const COMP_BG   = "F3F4F6";
const COMP_BDR  = "D1D5DB";
const RED_BG    = "FEE2E2";
const RED_TEXT  = "991B1B";
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

function alertBox(title, message) {
  const redBorder = { style: BorderStyle.SINGLE, size: 4, color: RED_TEXT };
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    borders: { top: redBorder, bottom: redBorder, left: redBorder, right: redBorder, insideH: noBorder, insideV: noBorder },
    rows: [new TableRow({ children: [
      new TableCell({
        borders: { top: redBorder, bottom: redBorder, left: redBorder, right: redBorder },
        width: { size: CONTENT_W, type: WidthType.DXA },
        shading: { fill: RED_BG, type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 160, right: 160 },
        children: [
          new Paragraph({
            spacing: { after: 60 },
            children: [new TextRun({ text: "HARD STOP — " + title, bold: true, size: 22, font: "Arial", color: RED_TEXT })]
          }),
          new Paragraph({
            spacing: { after: 0 },
            children: [new TextRun({ text: message, size: 20, font: "Arial", color: RED_TEXT })]
          })
        ]
      })
    ]})]
  });
}

function testRow(scenario, input, expected, pass) {
  const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: COMP_BDR };
  const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
  const passColor = pass ? "065F46" : RED_TEXT;
  const passBg   = pass ? "D1FAE5" : RED_BG;
  function cell(text, width, bg = "FFFFFF", color = BODY) {
    return new TableCell({
      borders,
      width: { size: width, type: WidthType.DXA },
      shading: { fill: bg, type: ShadingType.CLEAR },
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: [new Paragraph({ children: [new TextRun({ text, size: 18, font: "Arial", color })] })]
    });
  }
  return new TableRow({ children: [
    cell(scenario, 2600),
    cell(input, 2600),
    cell(expected, 2600),
    cell(pass ? "PASS" : "FAIL", 1560, passBg, passColor)
  ]});
}

function testHeaderRow() {
  const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: COMP_BDR };
  const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
  function hCell(text, width) {
    return new TableCell({
      borders,
      width: { size: width, type: WidthType.DXA },
      shading: { fill: COMP_BG, type: ShadingType.CLEAR },
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 18, font: "Arial", color: NAVY })] })]
    });
  }
  return new TableRow({ children: [
    hCell("Test scenario", 2600),
    hCell("Input / patient state", 2600),
    hCell("Expected system behavior", 2600),
    hCell("Result", 1560)
  ]});
}

const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "•",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 540, hanging: 260 } } }
      }]
    }]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 20, color: BODY } } }
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    children: [

      // ── HEADER ─────────────────────────────────────────────────────────────
      new Table({
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
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 60 },
                children: [new TextRun({ text: "EPIC WILLOW — FUNCTIONAL SPECIFICATION", bold: true, size: 28, font: "Arial", color: WHITE, characterSpacing: 60 })]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 60 },
                children: [new TextRun({ text: "Pharmacogenomics Clinical Decision Support  │  Medication Safety Alert", size: 20, font: "Arial", color: TAGLINE })]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 0 },
                children: [new TextRun({ text: "Document ID: FS-PGX-001  │  Version: 1.0  │  Status: Draft  │  April 2026", size: 18, font: "Arial", color: CONTACT })]
              }),
            ]
          })
        ]})]
      }),

      new Paragraph({ spacing: { before: 60, after: 120 }, children: [new TextRun({ text: "" })] }),

      // ── SECTION 1: DOCUMENT INFORMATION ───────────────────────────────────
      secHeader("1. Document Information"),
      field("Specification ID", "FS-PGX-001"),
      field("Title", "CYP2D6 Poor Metabolizer — Codeine Hard Stop Alert"),
      field("Epic Module", "Willow Inpatient / Willow Ambulatory"),
      field("Alert Type", "Hard Stop — Order Block (no override permitted)"),
      field("Author", "Kristina Ankrah, Healthcare IT Analyst"),
      field("Clinical Source", "CPIC Guideline for Codeine and CYP2D6 — Evidence Level A"),
      field("CPIC URL", "https://cpicpgx.org/guidelines/guideline-for-codeine-and-cyp2d6/"),
      field("Created", "April 2026"),
      field("Status", "Draft — Pending clinical and pharmacy review"),

      new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "" })] }),

      // ── SECTION 2: CLINICAL BACKGROUND ────────────────────────────────────
      secHeader("2. Clinical Background and Purpose"),
      bodyPara("Codeine is an opioid prodrug that requires conversion to morphine by the CYP2D6 enzyme to produce analgesic effect. Patients who carry two non-functional CYP2D6 alleles — classified as Poor Metabolizers (PM) — cannot perform this conversion. In PM patients, codeine provides no therapeutic benefit and may result in accumulation of toxic norcodeine metabolites."),
      bodyPara("Pharmacogenomic (PGx) testing identifies CYP2D6 Poor Metabolizer status prior to prescribing. When a patient's genomic profile is documented in the EHR and indicates CYP2D6 PM status, Epic Willow must prevent codeine from being ordered without clinical justification and pharmacist review."),
      bodyPara("This functional specification defines the clinical decision support (CDS) alert that Epic Willow will fire when a codeine order is placed for a CYP2D6 Poor Metabolizer patient. The alert is configured as a hard stop — the order cannot be processed until an alternative medication is selected."),

      bodyPara("Connection to transdisciplinary project framework:", 60),
      bullet("Layer 1 (Cosmic Origins): The carbon, nitrogen, and oxygen atoms forged in stellar nucleosynthesis form the CYP2D6 enzyme protein structure"),
      bullet("Layer 3 (Genomic Variants): CYP2D6 *4/*4 diplotype = zero enzyme function — Russell's precision principle applied to pharmacology"),
      bullet("Layer 4 (PGx Interactions): CPIC Level A recommendation — codeine contraindicated in CYP2D6 PM patients"),
      bullet("Layer 5 (This specification): The Willow hard stop that operationalizes the CPIC guideline at the point of order entry"),

      new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "" })] }),

      // ── SECTION 3: TRIGGER CONDITIONS ─────────────────────────────────────
      secHeader("3. Alert Trigger Conditions"),
      bodyPara("The alert fires when ALL of the following conditions are simultaneously true:"),
      bullet("A codeine order is initiated in Epic Willow Inpatient or Willow Ambulatory (any route: oral, IV, or combination product containing codeine)"),
      bullet("The patient's discrete genomic data in the EHR contains a documented CYP2D6 result"),
      bullet("The CYP2D6 result maps to a Poor Metabolizer phenotype (*4/*4, *4/*5, *4/*6, or equivalent non-functional diplotype)"),
      bullet("The order has not yet been verified by a pharmacist"),

      new Paragraph({ spacing: { before: 100, after: 80 }, children: [new TextRun({ text: "The alert does NOT fire when:", bold: true, size: 20, font: "Arial", color: NAVY })] }),
      bullet("No CYP2D6 result is documented in the patient record (alert requires discrete genomic data — absence of data does not trigger)"),
      bullet("The CYP2D6 result indicates Normal Metabolizer, Intermediate Metabolizer, or Ultra-Rapid Metabolizer phenotype (separate specification FS-PGX-002 covers UM)"),
      bullet("The order is placed by a clinical pharmacist in the context of a documented PGx review workflow"),

      new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "" })] }),

      // ── SECTION 4: ALERT DISPLAY ───────────────────────────────────────────
      secHeader("4. Alert Display — Simulated Willow CDS Hard Stop"),
      bodyPara("The following represents the alert message as it would appear to the ordering provider or pharmacist in Epic Willow at the point of order entry:"),
      new Paragraph({ spacing: { before: 120, after: 120 }, children: [new TextRun({ text: "" })] }),

      alertBox(
        "Codeine Order Blocked — CYP2D6 Poor Metabolizer",
        "Patient genomic data indicates CYP2D6 Poor Metabolizer status (*4/*4). Codeine requires CYP2D6 enzyme activity to convert to morphine. This patient has no functional CYP2D6 enzyme — codeine will provide no analgesia and may accumulate toxic norcodeine metabolites. This order cannot be processed. Please select an alternative analgesic. Recommended alternatives: morphine, hydromorphone, oxycodone (with caution). Reference: CPIC Guideline for Codeine and CYP2D6 — Level A. Questions: contact pharmacy."
      ),

      new Paragraph({ spacing: { before: 120, after: 80 }, children: [new TextRun({ text: "" })] }),

      field("Override permitted", "No — this is a hard stop. The order is blocked. No override pathway exists."),
      field("Button options presented to user", "\"Select Alternative\" (primary) | \"View CPIC Guideline\" (secondary)"),
      field("Action on \"Select Alternative\"", "Order is cancelled. Ordering workflow returns to medication search."),
      field("Pharmacist notification", "Alert event is logged in the patient's medication safety record with timestamp and ordering provider NPI"),

      new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "" })] }),

      // ── SECTION 5: BUILD REQUIREMENTS ─────────────────────────────────────
      secHeader("5. Build Requirements — Epic Willow Configuration"),
      bodyPara("The following configuration items must be built in Epic Willow to implement this alert. Each item requires analyst build, unit testing, and sign-off prior to integrated testing."),

      new Paragraph({ spacing: { before: 100, after: 60 }, children: [new TextRun({ text: "5.1  Medication grouper", bold: true, size: 20, font: "Arial", color: NAVY })] }),
      bullet("Create a medication grouper in Willow containing all codeine-containing orderable items including combination products (codeine/acetaminophen, codeine/aspirin, codeine/promethazine)"),
      bullet("Grouper ID to be assigned during build — reference as GROUPER-CODEINE-ALL in testing documentation"),

      new Paragraph({ spacing: { before: 100, after: 60 }, children: [new TextRun({ text: "5.2  Genomic result mapping", bold: true, size: 20, font: "Arial", color: NAVY })] }),
      bullet("Map discrete CYP2D6 genomic result values to the Poor Metabolizer phenotype category in Epic's genomic data model"),
      bullet("Confirm with laboratory informatics team which result interface feeds CYP2D6 data into discrete fields — interface mapping must be validated before alert build"),
      bullet("Non-functional alleles to map: *4, *5, *6, *7, *8, *11, *12, *13, *14, *15 (confirm complete list with clinical pharmacogenomics team)"),

      new Paragraph({ spacing: { before: 100, after: 60 }, children: [new TextRun({ text: "5.3  Best Practice Advisory (BPA) configuration", bold: true, size: 20, font: "Arial", color: NAVY })] }),
      bullet("Alert type: Hard Stop — Order Block"),
      bullet("Trigger: Medication order entry (not verification — fires at prescriber order entry)"),
      bullet("Logic: IF medication IN GROUPER-CODEINE-ALL AND patient CYP2D6 phenotype = Poor Metabolizer THEN fire hard stop"),
      bullet("Override: None permitted — hard stop cannot be bypassed"),
      bullet("Logging: All alert firings logged to medication safety event record with provider ID, timestamp, and resolution action"),

      new Paragraph({ spacing: { before: 100, after: 60 }, children: [new TextRun({ text: "5.4  Alternative medication suggestions", bold: true, size: 20, font: "Arial", color: NAVY })] }),
      bullet("Configure alert to display three alternative medication suggestions: morphine IR, hydromorphone, oxycodone"),
      bullet("Each alternative links directly to the orderable item in Willow for one-click ordering after alert acknowledgment"),

      new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "" })] }),

      // ── SECTION 6: TESTING ─────────────────────────────────────────────────
      secHeader("6. Testing Scenarios — Unit and Functional Test Cases"),
      bodyPara("The following test cases must be executed and documented prior to integrated testing sign-off. All testing performed in Epic non-production (NPE) environment."),

      new Paragraph({ spacing: { before: 120, after: 80 }, children: [new TextRun({ text: "" })] }),

      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: [2600, 2600, 2600, 1560],
        rows: [
          testHeaderRow(),
          testRow("PM patient orders codeine", "CYP2D6 *4/*4 + codeine oral order", "Hard stop fires — order blocked", true),
          testRow("PM patient orders codeine/APAP combo", "CYP2D6 *4/*4 + Tylenol #3 order", "Hard stop fires — order blocked", true),
          testRow("NM patient orders codeine", "CYP2D6 *1/*1 + codeine oral order", "No alert — order processes normally", true),
          testRow("No PGx data on file", "No CYP2D6 result + codeine order", "No alert — insufficient data to trigger", true),
          testRow("PM patient orders morphine", "CYP2D6 *4/*4 + morphine IR order", "No alert — morphine not in codeine grouper", true),
          testRow("PM patient — alternative selected", "Hard stop fires → provider clicks Select Alternative", "Order cancelled, returns to med search", true),
        ]
      }),

      new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "" })] }),

      // ── SECTION 7: SIGN-OFF ────────────────────────────────────────────────
      secHeader("7. Review and Sign-Off"),
      field("Clinical Pharmacy Review", "Pending — Clinical Pharmacogenomics team"),
      field("Physician Champion Review", "Pending — Medical informatics lead"),
      field("Epic Analyst Build Sign-off", "Pending — Willow Application Analyst"),
      field("Integrated Testing Sign-off", "Pending — IS Testing team"),
      field("Go-Live Approval", "Pending — CMIO / CNO"),

      new Paragraph({ spacing: { before: 120, after: 80 }, children: [new TextRun({ text: "" })] }),

      // ── FOOTER NOTE ────────────────────────────────────────────────────────
      new Paragraph({
        spacing: { before: 200, after: 0 },
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: COMP_BDR, space: 8 } },
        children: [new TextRun({ text: "This functional specification was produced as part of the \"From the Big Bang to the Bedside\" pharmacogenomics informatics project — a transdisciplinary portfolio demonstrating Epic Willow analyst documentation skills, cloud-native application development (Azure Cosmos DB), and clinical pharmacogenomics knowledge. github.com/IT-Professional-Kristina", size: 17, font: "Arial", color: "9CA3AF", italics: true })]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("FS-PGX-001_Codeine_CYP2D6_PM.docx", buf);
  console.log("Functional spec created: FS-PGX-001_Codeine_CYP2D6_PM.docx");
});
