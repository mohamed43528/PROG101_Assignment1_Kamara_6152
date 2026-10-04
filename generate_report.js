const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  TableOfContents, PageBreak, ImageRun, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, LevelFormat, convertInchesToTwip,
  VerticalAlign, Header, Footer, PageNumber, NumberFormat
} = require("docx");

const FONT = "Tahoma";
const BODY_SIZE = 20; // 10pt in half-points
const LINE_SPACING = { line: 276, lineRule: "auto" }; // 1.15 lines

// ---------- helpers ----------
function body(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { ...LINE_SPACING, after: 160 },
    children: [new TextRun({ text, font: FONT, size: BODY_SIZE, ...opts })],
  });
}

function bulletPara(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { ...LINE_SPACING, after: 80 },
    numbering: { reference: "bullet-list", level: 0 },
    children: [new TextRun({ text, font: FONT, size: BODY_SIZE, ...opts })],
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, font: FONT, bold: true, size: 28, color: "1F3864" })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, font: FONT, bold: true, size: 24, color: "2E5395" })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 100 },
    children: [new TextRun({ text, font: FONT, bold: true, italics: true, size: 22, color: "444444" })],
  });
}

function mono(text) {
  return new Paragraph({
    spacing: { line: 240, lineRule: "auto", after: 0 },
    children: [new TextRun({ text, font: "Consolas", size: 18 })],
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function labelValueRow(label, value) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 30, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: "EDEDED" },
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 100, bottom: 100, left: 150, right: 150 },
        children: [new Paragraph({ children: [new TextRun({ text: label, font: FONT, bold: true, size: BODY_SIZE })] })],
      }),
      new TableCell({
        width: { size: 70, type: WidthType.PERCENTAGE },
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 100, bottom: 100, left: 150, right: 150 },
        children: [new Paragraph({ children: [new TextRun({ text: value, font: FONT, size: BODY_SIZE })] })],
      }),
    ],
  });
}

// ---------- images ----------
// Each figure is sized to fit the page (max width 620, max height 880 "units",
// matching docx-js's pixel-based ImageRun scale) so the printed text stays large
// and legible, rather than cramming the whole system into one diagram.
function fitImage(path, nativeW, nativeH, maxW = 600, maxH = 760) {
  const scale = Math.min(maxW / nativeW, maxH / nativeH);
  return {
    data: fs.readFileSync(path),
    width: Math.round(nativeW * scale),
    height: Math.round(nativeH * scale),
  };
}

const fig1 = fitImage("diagrams/fig1_drawio.png", 3450, 2325);
const fig2 = fitImage("diagrams/fig2_drawio.png", 2460, 2235);
const fig3 = fitImage("diagrams/fig3_drawio.png", 2340, 2595);
const fig4 = fitImage("diagrams/fig4_drawio.png", 2460, 3315);
const fig5 = fitImage("diagrams/fig5_drawio.png", 2580, 2925);

function figureParagraph(fig, caption) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [new ImageRun({ type: "png", data: fig.data, transformation: { width: fig.width, height: fig.height } })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { ...LINE_SPACING, after: 160 },
      children: [new TextRun({ text: caption, font: FONT, size: 18, italics: true })],
    }),
  ];
}

// ========================================================================
// COVER PAGE
// ========================================================================
const coverPage = [
  new Paragraph({ spacing: { before: 400 }, children: [] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "LIMKOKWING UNIVERSITY OF CREATIVE TECHNOLOGY", font: FONT, bold: true, size: 30, color: "1F3864" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text: "SIERRA LEONE", font: FONT, bold: true, size: 24, color: "1F3864" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    children: [new TextRun({ text: "Department of Information and Communication Technology", font: FONT, size: 22, italics: true })],
  }),
  new Paragraph({ spacing: { before: 400, after: 200 }, children: [] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({ text: "PROG101: PRINCIPLES OF PROGRAMMING LOGIC AND DESIGN", font: FONT, bold: true, size: 26 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    children: [new TextRun({ text: "Individual Assignment 1", font: FONT, size: 24 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 300, after: 100 },
    children: [new TextRun({ text: "Designing Logical Solutions for Sierra Leone Community Challenges", font: FONT, bold: true, size: 24 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 500 },
    children: [new TextRun({ text: "Project: Community Health Access and Referral System (CHARS)", font: FONT, italics: true, size: 24, color: "2E5395" })],
  }),
  new Paragraph({ spacing: { before: 600 }, children: [] }),
  new Table({
    width: { size: 80, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.CENTER,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
      left: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
      right: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
    },
    rows: [
      labelValueRow("Student Name:", "Mohamed [Your Surname]"),
      labelValueRow("Student ID:", "[Your Student ID]"),
      labelValueRow("Examiner:", "Elijah Fullah"),
      labelValueRow("Checked by:", "Sheik Umar Kanu"),
      labelValueRow("Semester:", "01, September 2026 to January 2027"),
      labelValueRow("Submission Deadline:", "Week 4"),
      labelValueRow("Date Submitted:", "[Insert submission date]"),
    ],
  }),
  pageBreak(),
];

// ========================================================================
// TABLE OF CONTENTS
// ========================================================================
function tocLine(label, pageNum) {
  return new Paragraph({
    spacing: { after: 140 },
    tabStops: [{ type: "right", position: convertInchesToTwip(6.3), leader: "dot" }],
    children: [
      new TextRun({ text: label, font: FONT, size: BODY_SIZE }),
      new TextRun({ text: `\t${pageNum}`, font: FONT, size: BODY_SIZE }),
    ],
  });
}

const tocSection = [
  h1("Table of Contents"),
  tocLine("1. Rationale", 3),
  tocLine("    1.1 Problem Description", 3),
  tocLine("    1.2 Background", 3),
  tocLine("    1.3 Who Is Affected", 3),
  tocLine("    1.4 Proposed Solution", 3),
  tocLine("    1.5 Community Impact", 3),
  tocLine("    1.6 Computational Thinking Process", 4),
  tocLine("    1.7 Algorithm Design Summary", 4),
  tocLine("    1.8 SDG Alignment", 4),
  tocLine("    1.9 Open Source Justification", 4),
  tocLine("    1.10 Digital Public Goods (DPG) Justification", 5),
  tocLine("    1.11 Long-Term Sustainability", 5),
  tocLine("2. Step-by-Step Algorithm", 6),
  tocLine("3. Pseudocode", 7),
  tocLine("4. Flowchart", 11),
  tocLine("    Figure 1 — System Overview", 12),
  tocLine("    Figure 2 — Check Clinic Availability", 13),
  tocLine("    Figure 3 — Check Medicine Stock", 14),
  tocLine("    Figure 4 — Book Appointment", 15),
  tocLine("    Figure 5 — Emergency Referral", 16),
  tocLine("5. Functional Modules", 17),
  tocLine("6. Expected Outputs — Sample Scenarios", 18),
  tocLine("7. GitHub Repository Evidence", 20),
  tocLine("8. References", 21),
  pageBreak(),
];

// ========================================================================
// 1. RATIONALE
// ========================================================================
const rationale = [
  h1("1. Rationale"),

  h2("1.1 Problem Description"),
  body("In many rural and peri-urban communities across Sierra Leone, residents routinely travel long distances to the nearest health clinic only to discover, on arrival, that no doctor is on duty, that the clinic has no open appointment slots, or that it has run out of the specific medicine they need (for example malaria treatment, basic antibiotics, or maternal health supplies). Because clinics have no shared, real-time way of publishing their availability, patients and Community Health Workers (CHWs) must travel first and find out second. This wastes scarce transport money and time, discourages people from seeking care at all, and in urgent cases can delay treatment long enough to become life-threatening."),

  h2("1.2 Background"),
  body("Sierra Leone's health system is constrained by limited road and transport infrastructure, an uneven distribution of health workers between urban and rural areas, and inconsistent medicine supply chains between the central medical stores and peripheral health units. At the same time, mobile phone penetration is comparatively high even in areas with poor internet coverage, because basic (non-smartphone) handsets are affordable and GSM network coverage reaches most districts. This combination -- poor physical and information infrastructure, but reasonably good basic mobile coverage -- is the starting point for the proposed solution: a system that does not depend on smartphones, continuous data connectivity, or new hardware, but instead works over the mobile network that already exists."),

  h2("1.3 Who Is Affected"),
  bulletPara("Rural and peri-urban patients, particularly pregnant women, children under five, and people with chronic conditions who cannot afford repeated wasted trips."),
  bulletPara("Community Health Workers (CHWs), who need a fast way to check which nearby facility can actually receive a referral before sending a patient there."),
  bulletPara("Clinic and district health administrators, who currently have no simple channel to broadcast capacity, staffing, or stock status to the community they serve."),

  h2("1.4 Proposed Solution"),
  body("CHARS -- the Community Health Access and Referral System -- is a logical system design for a USSD/SMS-based service that lets a patient or CHW dial a short code from any basic mobile phone and, within seconds, (1) check which nearby clinic currently has an available appointment slot and a doctor on duty, (2) check whether a specific clinic has a given medicine in stock, (3) book an appointment at a clinic with capacity, or (4) trigger an emergency referral that searches outward from the patient's location until a clinic able to receive them is found. Clinic staff maintain each facility's status (doctor on duty, open slots, medicine stock) through a simple administrative interface. Because the patient-facing side runs over USSD/SMS rather than a smartphone app, it works on the handsets people in these communities already own, and it works even where data connectivity is weak or absent."),

  h2("1.5 Community Impact"),
  body("By letting patients and CHWs check availability before travelling, CHARS is designed to reduce wasted journeys and the transport costs and lost income that come with them, shorten the time between the onset of an emergency and a patient reaching a clinic that can actually treat them, give clinic staff better visibility into incoming demand so they can plan staffing and stock, and give district health administrators aggregated, anonymised usage data (which problems are searched for most, which clinics are consistently out of stock) that can inform resource allocation. The direct beneficiaries are rural and peri-urban patients and the CHWs who support them; the indirect beneficiaries are clinic administrators and the wider district health system, which gains a low-cost early-warning signal for stock-outs and capacity gaps."),

  h2("1.6 Computational Thinking Process"),
  body("The design followed the four standard computational thinking steps:"),
  bulletPara("Decomposition -- the broad problem (\"people cannot find available, stocked healthcare nearby\") was broken into four independent sub-problems: checking appointment availability, checking medicine stock, booking an appointment, and handling an emergency referral, each implemented as its own module."),
  bulletPara("Pattern recognition -- all four sub-problems share the same underlying pattern: search outward from a location, over an expanding radius, for a clinic that satisfies a condition (open slot, medicine in stock, doctor present). This pattern was generalised into a single repeated \"expanding radius search\" structure reused by the availability and emergency modules."),
  bulletPara("Abstraction -- each module hides its internal detail behind a simple function signature (for example checkMedicineStock(location, medicineName)), so the main menu and the emergency module can call it without needing to know how the search is implemented."),
  bulletPara("Algorithm design -- each sub-problem was translated into an explicit, step-by-step algorithm using sequence, selection (IF/ELSE), and repetition (WHILE/FOR EACH) structures, shown in full in Sections 2 and 3."),

  h2("1.7 Algorithm Design Summary"),
  body("The full step-by-step algorithm and pseudocode appear in Sections 2 and 3. In summary, the system presents a main menu, routes the user's choice to one of four modules using a decision structure, and each module uses a repetition structure to search outward from the user's location for a clinic that meets the required condition, stopping either when a match is found or when a maximum search radius is reached."),

  h2("1.8 SDG Alignment"),
  body("CHARS is designed primarily to support Sustainable Development Goal 3 -- Good Health and Well-Being -- and specifically Target 3.8, which calls for access to quality essential health-care services. By removing a key information barrier (not knowing whether a clinic can actually help before travelling there) and by speeding up emergency referral, CHARS addresses a concrete, local obstacle to universal health coverage in Sierra Leone."),

  h2("1.9 Open Source Justification"),
  body("The proposed solution should be built on open source components for three practical reasons specific to Sierra Leone:"),
  bulletPara("Cost: the Ministry of Health, NGOs, and district health offices operate on constrained budgets; building on open source USSD/SMS gateway frameworks and open source databases (for example PostgreSQL) removes recurring licence fees and lets the system scale to more districts without a proportional rise in cost."),
  bulletPara("Local capacity: releasing the source lets Sierra Leonean computer science and ICT students and graduates (including at Limkokwing) maintain, audit, and extend the system themselves, rather than the country depending on a single foreign vendor."),
  bulletPara("Community contribution: an open codebase invites contributions such as translating the USSD menus into Krio, Mende, or Temne, adding new modules (for example maternal health or immunisation reminders), or adapting the system for other districts or countries facing the same access problem."),

  h2("1.10 Digital Public Goods (DPG) Justification"),
  body("If released under an open licence (for example MIT or GPL) with open data schemas, clear documentation, platform independence, and no built-in collection of unnecessary personal data, CHARS would align with the core criteria of the Digital Public Goods Standard: relevance to the Sustainable Development Goals, open licensing, and a do-no-harm design. Because the patient-facing interface works over USSD/SMS rather than requiring a smartphone or a data plan, it is accessible to the great majority of the population from day one. Publishing CHARS as a Digital Public Good would let other Ministries of Health, NGOs, or universities in similarly resourced countries adopt and adapt it at no licensing cost, multiplying its public-health benefit well beyond Sierra Leone."),

  h2("1.11 Long-Term Sustainability"),
  body("Because CHARS runs over basic USSD/SMS (no smartphone, app installation, or data plan required for patients) and is built on open source components (no recurring licence fees), it does not depend on continued external funding to keep running. Ongoing maintenance could reasonably be handed to a local university ICT department or a Ministry of Health digital health unit, and the modular design (Section 5) means new SDG-aligned features can be added -- for example a maternal health check-in module -- without redesigning the whole system."),

  pageBreak(),
];

// ========================================================================
// 2. STEP-BY-STEP ALGORITHM
// ========================================================================
const algorithmSteps = [
  "Start.",
  "Patient or CHW dials the USSD short code; the system displays the main menu (Check Availability, Check Medicine, Book Appointment, Emergency Referral).",
  "Get the user's menu selection.",
  "IF selection = Emergency Referral THEN get the patient's location and symptom description; IF the symptoms match a recognised emergency keyword THEN search outward, radius by radius, for the nearest clinic with a doctor on duty; IF one is found, display an urgent-referral message and notify that clinic, ELSE (maximum radius reached) display the district hospital hotline number.",
  "ELSE IF selection = Check Availability THEN get the patient's location, then search outward for the nearest clinic that has both a doctor on duty and at least one open appointment slot, and display the result.",
  "ELSE IF selection = Check Medicine THEN get the medicine name and the patient's location, then check nearby clinics' stock records and display every clinic that currently holds that medicine.",
  "ELSE IF selection = Book Appointment THEN IF the patient is not yet registered, register them; get the preferred clinic and date; IF a slot is available, confirm the booking, reduce the clinic's open-slot count by one, and send an SMS confirmation; ELSE suggest the next available date.",
  "ELSE display an invalid-option message and return to Step 2.",
  "Log the interaction (choice made and outcome) for later clinic reporting and resource planning.",
  "End.",
];

const algorithmSection = [
  h1("2. Step-by-Step Algorithm"),
  body("The algorithm below describes, in plain steps, how CHARS responds to a single USSD session from the moment a patient or CHW dials in to the moment the session ends."),
  ...algorithmSteps.map((s, i) => bulletPara(`${i + 1}. ${s}`)),
  pageBreak(),
];

// ========================================================================
// 3. PSEUDOCODE
// ========================================================================
const pseudocodeText = fs.readFileSync("docs/pseudocode.txt", "utf8");
const pseudocodeSection = [
  h1("3. Pseudocode"),
  body("The pseudocode below implements the algorithm in Section 2 as a set of modules (functions), each using variables, constants, decision structures (IF / ELSE IF / ELSE) and repetition structures (WHILE, FOR EACH), as required by the assignment brief."),
  ...pseudocodeText.split("\n").map((line) => mono(line.length ? line : " ")),
  pageBreak(),
];

// ========================================================================
// 4. FLOWCHART
// ========================================================================
const flowchartSection = [
  h1("4. Flowchart"),
  body("The flowcharts below are the visual equivalent of the pseudocode in Section 3, built in diagrams.net (Draw.io) -- one of the flowcharting tools named in the assignment brief. To keep every box and label legible when printed, the system is shown as one simple overview diagram (Figure 1) plus one full-page diagram per module (Figures 2-5), rather than a single diagram with all branches combined. The source file (diagrams/CHARS.drawio, containing all five diagrams as separate pages) is included in the project's GitHub repository and can be opened and edited directly at https://app.diagrams.net (File > Open From > Device)."),
  body("The same logic was additionally rebuilt as an executable flowchart in Flowgorithm (diagrams/CHARS.fprg, also in the repository), with each module as its own linked flowchart using Flowgorithm's Declare, Input, Output, If, While, For, and Call symbols. Because Flowgorithm has no record/struct data type, each clinic's details are represented as parallel arrays (clinicName, clinicDoctorOnDuty, clinicOpenSlots, clinicACTStock) rather than the Clinic record shown in Section 3 -- the decision and repetition logic is otherwise identical. This version can be run directly to produce the sample outputs in Section 6.", { italics: true }),
  body("Insert a screenshot of the Flowgorithm flowchart below before printing.", { italics: true, color: "A05A00" }),
  new Paragraph({ spacing: { before: 100, after: 200 }, children: [new TextRun({ text: "[ Insert Flowgorithm screenshot here ]", font: FONT, size: BODY_SIZE, italics: true, color: "888888" })] }),
  pageBreak(),

  h2("Figure 1 — System Overview"),
  ...figureParagraph(fig1, "Figure 1: Main menu and routing to each module."),
  pageBreak(),

  h2("Figure 2 — Check Clinic Availability"),
  ...figureParagraph(fig2, "Figure 2: checkAvailability() — expanding-radius search for a clinic with a doctor on duty and an open slot."),
  pageBreak(),

  h2("Figure 3 — Check Medicine Stock"),
  ...figureParagraph(fig3, "Figure 3: checkMedicineStock() — scans nearby clinics' stock records for the requested medicine."),
  pageBreak(),

  h2("Figure 4 — Book Appointment"),
  ...figureParagraph(fig4, "Figure 4: bookAppointment() — registers the patient if needed, then confirms or suggests an alternative date."),
  pageBreak(),

  h2("Figure 5 — Emergency Referral"),
  ...figureParagraph(fig5, "Figure 5: referEmergency() — bypasses the open-slot requirement and searches only for a doctor on duty."),
  pageBreak(),
];

// ========================================================================
// 5. FUNCTIONAL MODULES
// ========================================================================
function moduleRow(name, purpose, inputs, outputs) {
  return new TableRow({
    children: [
      new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: name, font: FONT, size: 18, bold: true })] })] }),
      new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: purpose, font: FONT, size: 18 })] })] }),
      new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: inputs, font: FONT, size: 18 })] })] }),
      new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: outputs, font: FONT, size: 18 })] })] }),
    ],
  });
}

function headerRow(cells) {
  return new TableRow({
    tableHeader: true,
    children: cells.map((t) => new TableCell({
      shading: { type: ShadingType.CLEAR, fill: "1F3864" },
      margins: { top: 80, bottom: 80, left: 100, right: 100 },
      children: [new Paragraph({ children: [new TextRun({ text: t, font: FONT, size: 18, bold: true, color: "FFFFFF" })] })],
    })),
  });
}

const modulesTable = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: {
    top: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
    bottom: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
    left: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
    right: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
    insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
  },
  rows: [
    headerRow(["Module", "Purpose", "Inputs", "Outputs"]),
    moduleRow("mainMenu()", "Displays the menu and routes the user's choice.", "userChoice", "Calls routeRequest()"),
    moduleRow("routeRequest(choice)", "Decision structure that calls the correct module for the selected option.", "choice", "Module call"),
    moduleRow("checkClinicAvailability()", "Searches outward for a clinic with a doctor on duty and an open slot.", "patientLocation", "List of available clinics"),
    moduleRow("checkMedicineStock()", "Searches nearby clinics' stock records for a named medicine.", "patientLocation, medicineName", "List of clinics with stock"),
    moduleRow("bookAppointment()", "Registers the patient if needed and books a confirmed slot.", "patientPhone, clinicID, date", "Appointment confirmation / SMS"),
    moduleRow("referEmergency()", "Flags emergency keywords and searches outward for the nearest staffed clinic.", "patientLocation, symptoms", "Urgent referral / hotline message"),
    moduleRow("registerPatient()", "Creates a new patient record.", "name, age, phone, location", "patientID"),
    moduleRow("sendNotification(phone, msg)", "Sends a confirmation or alert SMS.", "phone, message", "SMS sent"),
    moduleRow("logInteraction()", "Stores each session's outcome for reporting.", "choice, outcome, timestamp", "Log entry"),
  ],
});

const modulesSection = [
  h1("5. Functional Modules"),
  body("The system is decomposed into ten independent, reusable modules, each with a single responsibility. This modular design means any one module (for example the emergency search logic) can be tested, maintained, or improved without affecting the others."),
  modulesTable,
  pageBreak(),
];

// ========================================================================
// 6. EXPECTED OUTPUTS (sample scenarios)
// ========================================================================
const sampleDataTable = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: {
    top: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
    bottom: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
    left: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
    right: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
    insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
  },
  rows: [
    headerRow(["#", "Clinic", "Doctor on duty", "Open slots", "ACT stock"]),
    moduleRow("1", "Njala Health Post", "Yes", "0", "0"),
    moduleRow("2", "Gondama Health Post", "Yes", "3", "0"),
    moduleRow("3", "Kenema Government Hospital", "Yes", "5", "12"),
    moduleRow("4", "Bo Government Hospital", "No", "2", "0"),
    moduleRow("5", "Serabu Health Centre", "No", "0", "6"),
  ],
});

const scenariosSection = [
  h1("6. Expected Outputs — Sample Scenarios"),
  body("The scenarios below use the fixed five-clinic sample dataset built into the Flowgorithm program (diagrams/CHARS.fprg), so they can be reproduced exactly by running that file -- these are not illustrative-only figures."),
  sampleDataTable,
  body(" ", {}),

  h2("Scenario A: Routine availability check (Menu option 1)"),
  body("Input: Select \"1. Check Clinic Availability\".", {}),
  body("Processing: The system scans clinics nearest-first for the first one with both a doctor on duty and an open slot. Njala (#1) has a doctor but 0 open slots, so it is skipped; Gondama (#2) has a doctor and 3 open slots.", {}),
  body("Output: \"Gondama Health Post - 3 slot(s) available\"", { bold: true }),

  h2("Scenario B: Medicine stock check (Menu option 2)"),
  body("Input: Select \"2. Check ACT (Malaria Medicine) Stock\".", {}),
  body("Processing: The system checks every clinic's ACT stock level, not just the nearest.", {}),
  body("Output: \"Kenema Government Hospital has 12 unit(s) of ACT in stock\" and \"Serabu Health Centre has 6 unit(s) of ACT in stock\"", { bold: true }),

  h2("Scenario C: Successful appointment booking (Menu option 3)"),
  body("Input: Select \"3. Book Appointment\", then enter clinic number 2 (Gondama Health Post).", {}),
  body("Processing: Gondama has 3 open slots, so the booking is confirmed.", {}),
  body("Output: \"Appointment confirmed at Gondama Health Post\"", { bold: true }),

  h2("Scenario D: Emergency referral (Menu option 4)"),
  body("Input: Select \"4. Emergency Referral\", then enter true when asked whether this is an emergency.", {}),
  body("Processing: Unlike Scenario A, this search only requires a doctor on duty -- it does not require an open slot, because an emergency cannot wait for a routine booking slot to free up. Njala (#1) is the nearest clinic with a doctor, so it is selected immediately even though Scenario A had to skip it for being full.", {}),
  body("Output: \"URGENT REFERRAL: Proceed to Njala Health Post immediately\"", { bold: true }),
  body("This contrast between Scenario A and Scenario D is deliberate: it demonstrates why the emergency branch is a separate module with its own, less restrictive condition, rather than reusing the availability-check logic.", { italics: true }),

  pageBreak(),
];

// ========================================================================
// 7. GITHUB EVIDENCE (placeholder instructions)
// ========================================================================
const githubSection = [
  h1("7. GitHub Repository Evidence"),
  body("This project's report, pseudocode, and flowchart source (both the diagrams.net/Draw.io file behind the five figures in Section 4, CHARS.drawio, and the runnable Flowgorithm program, CHARS.fprg) are version-controlled in a GitHub repository named using the required convention PROG101_Assignment1_StudentName_StudentID. The repository contains a README.md describing the project, the pseudocode file, the flowchart source files, and this report, with regular commits made during development."),
  body("Repository URL: [insert your GitHub repository URL here after pushing]", { italics: true }),
  body("Insert a screenshot of the repository's file listing and a screenshot of the commit history below before printing/submitting.", { italics: true, color: "A05A00" }),
  new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "[ Insert repository screenshot here ]", font: FONT, size: BODY_SIZE, italics: true, color: "888888" })] }),
  new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "[ Insert commit history screenshot here ]", font: FONT, size: BODY_SIZE, italics: true, color: "888888" })] }),
  pageBreak(),
];

// ========================================================================
// 8. REFERENCES
// ========================================================================
const referencesSection = [
  h1("8. References"),
  bulletPara("United Nations. (2015). Sustainable Development Goal 3: Good Health and Well-Being. https://sdgs.un.org/goals/goal3"),
  bulletPara("Digital Public Goods Alliance. (n.d.). Digital Public Goods Standard. https://digitalpublicgoods.net/standard/"),
  bulletPara("World Bank. (2022). Sierra Leone Health Sector and Digital Health Overview. https://www.worldbank.org"),
  bulletPara("GSMA. (2023). The Mobile Economy: Sub-Saharan Africa. https://www.gsma.com"),
  bulletPara("Limkokwing University of Creative Technology, Sierra Leone. (2026). PROG101: Principles of Programming Logic and Design — Assignment Brief."),
  bulletPara("JGraph Ltd (diagrams.net / Draw.io). (n.d.). Documentation. https://www.drawio.com/doc/"),
];

// ========================================================================
// DOCUMENT ASSEMBLY
// ========================================================================
const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullet-list",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: convertInchesToTwip(0.35), hanging: convertInchesToTwip(0.2) } } } },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "PROG101 — CHARS Assignment Report", font: FONT, size: 16, color: "888888" })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Page ", font: FONT, size: 16, color: "888888" }),
              new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: "888888" }),
              new TextRun({ text: " of ", font: FONT, size: 16, color: "888888" }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 16, color: "888888" }),
            ],
          })],
        }),
      },
      children: [
        ...coverPage,
        ...tocSection,
        ...rationale,
        ...algorithmSection,
        ...pseudocodeSection,
        ...flowchartSection,
        ...modulesSection,
        ...scenariosSection,
        ...githubSection,
        ...referencesSection,
      ],
    },
  ],
  styles: {
    default: {
      document: {
        run: { font: FONT, size: BODY_SIZE },
      },
    },
  },
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("CHARS_Assignment_Report.docx", buffer);
  console.log("Report written.");
});
