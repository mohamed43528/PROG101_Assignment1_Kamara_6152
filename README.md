# CHARS — Community Health Access and Referral System

**PROG101: Principles of Programming Logic and Design — Individual Assignment 1**
Limkokwing University of Creative Technology, Sierra Leone
Department of Information and Communication Technology
Semester 01, September 2026 – January 2027

> ⚠️ Before you push this repo, rename it to match the required convention:
> `PROG101_Assignment1_<YourStudentName>_<YourStudentID>`
> and fill in your name/ID in `docs/CHARS_Assignment_Report.docx` (cover page) and below.

## Overview

CHARS is a **logical system design** (no source code required by the assignment brief) for a
USSD/SMS-based service that helps patients and Community Health Workers (CHWs) in rural and
peri-urban Sierra Leone:

- Check which nearby clinic currently has an open appointment slot and a doctor on duty
- Check whether a specific clinic has a given medicine in stock
- Book a confirmed appointment
- Trigger an emergency referral that searches outward from the patient's location for the
  nearest clinic able to receive them

It is designed to work over basic USSD/SMS rather than a smartphone app, because that is what
is reliably accessible across Sierra Leone's rural communities, even where data connectivity is
weak.

## Why this problem

Patients in rural Sierra Leone often travel long distances to a clinic only to find no doctor on
duty, no open appointment slots, or no stock of the medicine they need. This wastes transport
money and time and, in urgent cases, delays life-saving treatment. See the full problem analysis,
rationale, and SDG/Open Source/Digital Public Goods justification in the report.

## SDG Alignment

**SDG 3 — Good Health and Well-Being** (Target 3.8: access to quality essential health-care
services).

## Repository Contents

| Path | Description |
|---|---|
| `docs/CHARS_Assignment_Report.docx` | Full assignment report: rationale, algorithm, pseudocode, flowchart, modules, sample outputs, SDG/Open Source/DPG justification, references |
| `docs/pseudocode.txt` | Pseudocode for all system modules (plain text) |
| `diagrams/CHARS.drawio` | **Flowchart built in diagrams.net (Draw.io)** — one of the three flowcharting tools named in the assignment brief. Contains all five diagrams below as separate pages/tabs in one file. Open it free at https://app.diagrams.net (File > Open From > Device) to view or edit |
| `diagrams/fig1_drawio.png` … `fig5_drawio.png` | Rendered PNG export of each Draw.io page (same five, used in the report) — one overview diagram (Figure 1) plus one full-page diagram per module (Figures 2-5), split up so every box and label stays legible when printed |
| `diagrams/CHARS.fprg` | **Runnable flowchart built in Flowgorithm** — open directly in the Flowgorithm app and press Run to reproduce the Section 6 sample outputs |
| `generate_report.js` | Script used to generate the .docx report (Node.js, `docx` npm package) |
| `generate_drawio_flowchart.py` | Script used to generate `diagrams/CHARS.drawio` and the five rendered PNGs |
| `generate_flowgorithm.py` | Script used to generate `diagrams/CHARS.fprg` |

### Running the Flowgorithm version

1. Install [Flowgorithm](http://www.flowgorithm.org/) if you don't already have it.
2. Open `diagrams/CHARS.fprg`.
3. Press **Run** (F5). Choose option 1–4 at the prompt to see each module execute.
4. The five-clinic sample dataset is hard-coded in `Main` (parallel arrays, since
   Flowgorithm has no record/struct type) — the same dataset documented in Section 6 of
   the report, so the output you see matches the report exactly.

## System Modules (Modular Design)

| Module | Purpose |
|---|---|
| `mainMenu()` | Displays the menu and routes the user's choice |
| `routeRequest(choice)` | Decision structure that calls the correct module |
| `checkClinicAvailability()` | Searches outward for a clinic with a doctor on duty and an open slot |
| `checkMedicineStock()` | Searches nearby clinics' stock records for a named medicine |
| `bookAppointment()` | Registers the patient if needed and books a confirmed slot |
| `referEmergency()` | Flags emergency keywords and searches outward for the nearest staffed clinic |
| `registerPatient()` | Creates a new patient record |
| `sendNotification(phone, msg)` | Sends a confirmation or alert SMS |
| `logInteraction()` | Stores each session's outcome for reporting |

Full pseudocode: [`docs/pseudocode.txt`](docs/pseudocode.txt)
Flowcharts: [`diagrams/CHARS.drawio`](diagrams/CHARS.drawio) (diagrams.net/Draw.io source, one diagram per module) and [`diagrams/CHARS.fprg`](diagrams/CHARS.fprg) (runnable Flowgorithm version)

## Open Source & Digital Public Good

This solution is designed to be built on open source components (open USSD/SMS gateway
frameworks, open source databases) so it can be maintained and extended by local Sierra Leonean
developers without recurring licence costs, and so it can eventually be published as a Digital
Public Good for adoption by other under-resourced health systems. See report Sections 1.9–1.10
for the full justification.

## Author

- **Name:** Mohamed [Your Surname]
- **Student ID:** [Your Student ID]
- **Examiner:** Elijah Fullah
- **Checked by:** Sheik Umar Kanu

## License

This academic project is released under the MIT License (see `LICENSE`), in keeping with the
Open Source justification in the report.
