# AEGIS — Digital Safety Intelligence
> **"Understand what is happening. Decide what happens next."**
> 
> *SafeCase tells her what to do. AEGIS explains what is happening.*

> **Privacy & Boundary Note:** AEGIS operates from a clean, private database. It never contacts the police or submits any complaint automatically; it only prepares a structured draft for the user to review, download, and use herself.

AEGIS is a personal digital safety intelligence desk built for women facing online harassment, cyberstalking, intimidation, coercion, or digital exposure. It synthesizes the rapid-response foundation of **SafeCase** (evidence triage, client-side cryptographic hashing, platform reporting, and cybercrime complaint generation) with the threat-intelligence layer of **AEGIS** (longitudinal threat escalation, digital exposure graph, cross-account threat linkage, case reconstruction, and change detection).

---

## 1. The Problem & The Gap

When women experience digital harassment or extortion, existing tools fall into two unhelpful extremes:
- **Moment-of-danger SOS apps:** Focus exclusively on sirens, GPS pings, or physical emergency buttons. They offer nothing for escalating online harassment, digital stalking, or extortion.
- **Generic AI Chatbots & Classifiers:** Either offer platitudes ("I'm sorry you are feeling upset") or output unexplainable black-box risk numbers ("93% threat") without telling the victim what changed, what pieces of her identity are exposed, or what evidence to preserve.

### How AEGIS Solves This
AEGIS reconstructs how online abuse develops across time, connects fragmented evidence across accounts, detects what changed since the last interaction, and compiles a structured complaint pack for official authorities (National Cyber Crime Reporting Portal 1930 / cybercrime.gov.in) with cryptographic integrity records.

---

## 2. Core Capabilities & Architecture

```text
DETECT ➔ UNDERSTAND ➔ CONNECT ➔ RECONSTRUCT ➔ DETECT CHANGE ➔ PROTECT ➔ PRESERVE ➔ REPORT
```

1. **Threat Escalation Engine:** Analyzes sequential patterns across time:
   `Unwanted Contact` ➔ `Persistence` ➔ `Personal Info Reference` ➔ `Intimidation` ➔ `Coercion`.
2. **Change Detection ("What Changed?"):** The signature differentiator. Compares previous case state $(T-1)$ against current state $(T)$ upon new evidence arrival, highlighting new signals and explaining the *Why* behind escalation shifts (e.g., HIGH ➔ CRITICAL).
3. **Digital Exposure Graph:** Visualizes how user-provided digital identity pieces connect (`You` ➔ `Instagram` ➔ `Public Handle` ➔ `College` ➔ `Location`), identifying key attack-surface vectors without speculative web crawling.
4. **Threat Linkage Engine:** Detects explainable correlations between separate accounts (handle morphology, timing synchronization, phrasing overlap) under strict attribution guardrails (*"Potential connection detected"*, never legal certainty).
5. **Case Reconstruction:** Synthesizes fragmented messages into an objective chronological narrative where every milestone cites verified evidence IDs (`[EV-xxx]`).
6. **Evidence Vault & Integrity Records:** Client-side and server SHA-256 fingerprinting with tap-to-reveal blur protection for sensitive media.
7. **Complaint Pack Generator:** Formatted dossier ready for Indian authorities with provisions that may be relevant (confirm with a lawyer or legal-aid clinic) under Bharatiya Nyaya Sanhita (BNS 2023) and Information Technology Act 2000.
8. **Privacy Sovereignty & Quick Exit:** Universal `Esc` key shortcut and top-right button immediately replacing AEGIS with an innocent daily notes screen, plus a 1-tap zero-trace data wipe.
9. **Emergency Hub:** Direct routing to verified Indian hotlines: **112** (Emergency), **181** (Women Helpline), and **1930** (Cyber Crime).

---

## 3. Technology Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React, React Router v6, Vite.
  - *Aesthetic:* Soft light, warm ivory (`#FBFBF9`), warm surfaces, soft charcoal text, restrained semantic accents (muted terracotta red, warm amber, muted sage, restrained blue), and editorial serif typography.
- **Backend:** FastAPI (Python 3.10+, tested on 3.12), Pydantic v2, SQLAlchemy ORM, Uvicorn.
- **Database:** SQLite (local zero-config, portable for hackathon demos) / PostgreSQL ready.
- **Testing:** Pytest backend suite with automated engine and API route verification.

---

## 4. Project Folder Structure

```text
WOMEN_SAFETY/
├── PRODUCT_DECISIONS.md          # Synthesized product strategy & safety boundaries
├── ARCHITECTURE.md               # Full-stack system architecture & data models
├── IMPLEMENTATION_PLAN.md        # Roadmap & engineering phases
├── README.md                     # Comprehensive project documentation
├── .env.example                  # Environment configuration template
├── aegis-backend/
│   ├── app/
│   │   ├── main.py               # FastAPI entry point, CORS, startup lifecycle
│   │   ├── config.py             # App configuration & verified Indian helplines
│   │   ├── database.py           # SQLite engine & session management
│   │   ├── models/               # SQLAlchemy models (Incident, Event, Evidence, etc.)
│   │   ├── schemas/              # Pydantic v2 request/response schemas
│   │   ├── services/             # Core intelligence engines:
│   │   │   ├── analysis_engine.py
│   │   │   ├── escalation_engine.py
│   │   │   ├── change_detection.py
│   │   │   ├── linkage_engine.py
│   │   │   ├── exposure_graph.py
│   │   │   ├── case_reconstruction.py
│   │   │   ├── evidence_service.py
│   │   │   └── complaint_service.py
│   │   └── routers/              # Clean REST route controllers
│   ├── tests/
│   │   ├── test_engines.py       # Unit tests for all 5 threat engines
│   │   └── test_api.py           # End-to-end API route tests
│   ├── requirements.txt
│   └── run.py                    # Local backend runner
└── aegis-frontend/
    ├── package.json
    ├── tailwind.config.js        # Warm ivory & muted editorial tokens
    ├── vite.config.ts            # Proxying /api to port 8000
    ├── src/
    │   ├── App.tsx               # Main routing & global Esc handler
    │   ├── main.tsx              # React DOM mounting
    │   ├── index.css             # Tailwind base & blur utilities
    │   ├── components/
    │   │   ├── Navigation.tsx     # Header navigation & Quick Exit trigger
    │   │   └── QuickExitModal.tsx # Stealth daily notes disguise screen
    │   ├── views/                # All 15 required screens:
    │   │   ├── WelcomeView.tsx
    │   │   ├── OverviewView.tsx
    │   │   ├── AnalyzeView.tsx
    │   │   ├── EscalationView.tsx
    │   │   ├── TimelineView.tsx
    │   │   ├── WhatChangedView.tsx
    │   │   ├── ExposureGraphView.tsx
    │   │   ├── ThreatLinkageView.tsx
    │   │   ├── CaseReconstructionView.tsx
    │   │   ├── EvidenceVaultView.tsx
    │   │   ├── RapidResponseView.tsx
    │   │   ├── ComplaintView.tsx
    │   │   ├── PrivacyCenterView.tsx
    │   │   └── ImmediateHelpView.tsx
    │   └── lib/
    │       └── api.ts            # Typed client bindings
```

---

## 5. Quickstart & Installation

### Step 1: Run the Backend
```bash
cd aegis-backend
python -m pip install -r requirements.txt
python run.py
```
*The API will start at `http://127.0.0.1:8000`. On first run, it automatically initializes clean SQLite database tables.*

### Step 2: Run the Frontend
```bash
cd aegis-frontend
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 6. Automated Testing

Run the full pytest backend suite covering all 5 engines and API endpoints:
```bash
cd aegis-backend
python -m pytest tests/ -q
```

Expected result:
```text
14 passed in ~2.0s
```

---

## 7. Try It Yourself: Step-by-Step Walkthrough

AEGIS is completely dynamic and starts from an empty database. Follow this 6-message sequence to experience how AEGIS detects escalating threats, maps digital attack surfaces, correlates suspect handles, and prepares a formal complaint pack:

### Step A: Start a Case
1. Open AEGIS at `http://localhost:5173`.
2. Notice the calm empty state on **My Cases**: *"No cases yet. Start a case by adding something that worries you."*
3. Click **"Start a Case"**, name it *"Instagram Harassment"*, and submit.

### Step B: Enter the Six Messages in Order (via "Add Proof")
Navigate to **"Add Proof"** (or use the fast entry button on My Cases) and submit each message in sequence:

| # | Sender Handle | Platform | Message Text | Engine Detection & Progression |
| :-: | :--- | :--- | :--- | :--- |
| **1** | `@unknown_user01` | Instagram Direct | `"Hey, you're cute."` | **Unwanted Contact / Approach (LOW)** · Seals Day 1 evidence with SHA-256 cryptographic stamp in Vault. |
| **2** | `@unknown_user01` | Instagram Direct | `"Why aren't you replying?"` | **Persistence (MODERATE)** · Detects repeated contact following non-response. |
| **3** | `@unknown_user01` | Instagram Direct | `"Tell me where you study."` | **Personal Info Probing (HIGH)** · Flags offline campus/institution solicitation. |
| **4** | `@unknown_user01` | Instagram Direct | `"I know where you live."` | **Intimidation (HIGH)** · Direct reference to physical residence/locality. |
| **5** | `@unknown_user_01` | Instagram Direct | `"Don't ignore me."` | **Persistence & New Handle** · Introduces secondary handle `@unknown_user_01`. |
| **6** | `@unknown_user_01` | Instagram Direct | `"Send the photos or I'll expose you."` | **Coercion / Extortion (CRITICAL)** · Acute threat of non-consensual image exposure. |

### Step C: Explore the Generated Intelligence
- **"What Changed?":** View the differential comparison between before and after the 6th message. It highlights the escalation leap from HIGH to CRITICAL, flags the newly emerged coercive demand signals, and identifies the new secondary handle.
- **"Connected Clues" (Threat Linkage):** Compares `@unknown_user01` and `@unknown_user_01`. Detects high character overlap (~94%) and platform consistency, with the mandatory attribution guardrail: *"This indicates a potential connection and does not establish attribution."*
- **"Exposed Info" (Exposure Graph):** Displays how the conversation points connect personal exposure vectors (Instagram handle ➔ College ➔ Residence ➔ Private media threat).
- **"Evidence Vault":** Inspect each preserved record with its unique, tamper-proof SHA-256 cryptographic stamp. Test the tap-to-reveal blur on sensitive records.
- **"Report Pack":** Review the generated dossier formatted for **1930 / cybercrime.gov.in**, organized with the heading *"Provisions that may be relevant (confirm with a lawyer or legal-aid clinic)"*.
- **Quick Exit (<kbd>Esc</kbd>):** Hit the `Esc` key at any point to instantly replace the interface with an innocent daily notes screen.

---

## 8. Limitations & Assumptions

While AEGIS provides vital structure and clarity for victims of online harassment, several deliberate design choices and technical limitations apply:

1. **Rule-Based Threat Detection:** Detection uses deterministic pattern matching, keyword heuristics, and linguistic rules. It is not an unexplainable deep-learning classifier and does not possess open-ended common sense reasoning.
2. **Files Stored but Not Analysed:** Image screenshots and audio recordings are stored, timestamped, and cryptographically fingerprinted (SHA-256) for evidentiary preservation, but their visual pixels or audio speech streams are not transcribed, OCR'd, or processed by computer vision models.
3. **Free-Tier / In-Memory Data Resets:** When deployed to free-tier cloud hosting (e.g., Render free web services), the filesystem and SQLite database are ephemeral and will reset upon service sleep or redeployment.
4. **No User Authentication:** AEGIS is architected as an anonymous, single-user client companion without account login, passwords, or multi-tenant user isolation. Data confidentiality relies on device access security, immediate local wipe capabilities, and the Quick Exit disguise screen.
5. **Legal Sections Unverified:** Indian statutory references (BNS 2023 §§ 78, 351, 308; IT Act 2000 §§ 66E, 67, 67A) are cited strictly for informational orientation. They have not been reviewed by legal counsel and do not constitute legal advice. Users must confirm all sections with a lawyer or legal-aid clinic before official filing.

---

## 9. Safety & Privacy Guardrails

- **Attribution Disclaimer:** AEGIS never makes definitive forensic claims of attacker identity. It uses strict wording: *"This indicates a potential connection and does not establish attribution"*.
- **No Predictive Violence Scoring:** AEGIS evaluates digital threat trajectories based only on provided evidence; it does not claim to predict physical assault.
- **Evidence Integrity:** SHA-256 hashes are labeled as an *"Evidence Integrity Record"*, not a substitute for forensic court certification.
- **Zero Third-Party Telemetry:** No marketing cookies, Google Analytics, or third-party tracking scripts.
- **One-Tap Wipe:** Clicking "Erase All Case Data" in the Privacy Center permanently deletes all records and disk files immediately.

---

## 10. Indian Legal Context (for orientation only, not legal advice)

Provisions that may be relevant (confirm with a lawyer or legal-aid clinic):

- **112:** National Emergency Service (Police / Ambulance / Fire)
- **181:** Women Helpline (Domestic violence, cyberstalking, counseling)
- **1930:** National Cyber Crime Helpline & reporting portal (cybercrime.gov.in)
- **Statutory Provisions Cited:**
  - *Bharatiya Nyaya Sanhita (BNS) 2023, Section 78:* Stalking (including online)
  - *Bharatiya Nyaya Sanhita (BNS) 2023, Section 351:* Criminal Intimidation
  - *Information Technology Act 2000, Section 66E:* Violation of privacy
  - *Information Technology Act 2000, Section 67 / 67A:* Obscene / sexually explicit electronic material
  - *IT Rules 2021:* platforms must run a grievance process with set deadlines. Confirm the current deadlines on an official government source.
