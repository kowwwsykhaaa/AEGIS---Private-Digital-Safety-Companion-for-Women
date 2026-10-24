# AEGIS — Digital Safety Intelligence
> **"Understand what is happening. Decide what happens next."**
> 
> *SafeCase tells her what to do. AEGIS explains what is happening.*

AEGIS is a personal digital safety intelligence desk built for women facing online harassment, cyberstalking, intimidation, coercion, or digital exposure. It synthesizes the rapid-response foundation of **SafeCase** (evidence triage, client-side cryptographic hashing, platform reporting, and cybercrime complaint generation) with the threat-intelligence layer of **AEGIS** (longitudinal threat escalation, digital exposure graph, cross-account threat linkage, case reconstruction, and change detection).

---

## 1. The Problem & The Gap

When women experience digital harassment or extortion, existing tools fall into two unhelpful extremes:
- **Moment-of-danger SOS apps:** Focus exclusively on sirens, GPS pings, or physical emergency buttons. They offer nothing for escalating online harassment, digital stalking, or extortion.
- **Generic AI Chatbots & Classifiers:** Either offer platitudes ("I'm sorry you are feeling upset") or output unexplainable black-box risk numbers ("93% threat") without telling the victim what changed, what pieces of her identity are exposed, or what evidence to preserve.

### How AEGIS Solves This
AEGIS reconstructs how online abuse develops across time, connects fragmented evidence across accounts, detects what changed since the last interaction, and compiles a legally structured complaint pack for official authorities (National Cyber Crime Reporting Portal 1930 / cybercrime.gov.in) with cryptographic integrity records.

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
7. **Complaint Pack Generator:** Formatted dossier ready for Indian authorities with applicable statutory sections under Bharatiya Nyaya Sanhita (BNS 2023) and Information Technology Act 2000.
8. **Privacy Sovereignty & Quick Exit:** Universal `Esc` key shortcut and top-right button immediately replacing AEGIS with an innocent daily notes screen, plus a 1-tap zero-trace data wipe.
9. **Emergency Hub:** Direct routing to verified Indian hotlines: **112** (Emergency), **181** (Women Helpline), and **1930** (Cyber Crime).

---

## 3. Technology Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React, React Router v6, Vite.
  - *Aesthetic:* Soft light, warm ivory (`#FBFBF9`), warm surfaces, soft charcoal text, restrained semantic accents (muted terracotta red, warm amber, muted sage, restrained blue), and editorial serif typography.
- **Backend:** FastAPI (Python 3.14+), Pydantic v2, SQLAlchemy ORM, Uvicorn.
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
│   │   ├── routers/              # Clean REST route controllers
│   │   └── demo_data.py          # 7-day reproducible Ananya scenario
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
*The API will start at `http://127.0.0.1:8000`. On first run, it automatically creates SQLite tables and seeds the baseline demo incident.*

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
python -m pytest tests/ -v
```

Expected result:
```text
tests/test_api.py ........ [ 50%]
tests/test_engines.py ........ [100%]
16 passed in 2.20s
```

---

## 7. The 3-Minute Hackathon Demo Flow

The prototype includes a built-in, reproducible fictional harassment case (**Ananya, 22**):

1. **0:00–0:30 (Problem & Thesis):**
   - Open AEGIS. Explain: *"SafeCase tells her what to do. AEGIS explains what is happening."*
   - Show the **Overview** screen with current state: `HIGH` escalation, trajectory milestones through Day 6.
2. **0:30–1:00 (Threat Linkage & Exposure):**
   - Click **Threat Linkage**: show correlation between primary account `@unknown_user01` and secondary account `@unknown_user_01` (92% naming similarity, timing burst correlation).
   - Click **Digital Exposure**: show how public Instagram tags connected to College and residential locality without external web scraping.
3. **1:00–1:50 (The Winning Moment: "What Changed?"):**
   - In the top bar, click **"Simulate Day 7 Escalation"** (or go to Analyze and submit: *"Send the photos or I'll expose you"* from `@unknown_user_01`).
   - Open **"What Changed?"**:
     - View **BEFORE (HIGH)** ➔ **NEW EVIDENCE** ➔ **AFTER (CRITICAL)**.
     - Highlight the newly surfaced signals (+ Coercive Demand, + Exposure threat).
     - Read the plain-language explanation of *Why* the situation escalated.
4. **1:50–2:30 (Preservation & Reconstruction):**
   - Open **Evidence Vault**: show the SHA-256 cryptographic integrity hash for the Day 7 message and demonstrate the **Tap-to-Reveal** privacy blur.
   - Open **Case Reconstruction**: show the objective chronological narrative where every statement cites `[EV-xxx]` evidence tags.
5. **2:30–3:00 (Complaint Pack & Privacy Sovereignty):**
   - Open **Complaint Pack**: review the pre-formatted dossier citing Bharatiya Nyaya Sanhita 2023 (Sec 78 Cyberstalking, Sec 351 Intimidation) and IT Act 2000 (Sec 66E, 67A) ready for **1930 / cybercrime.gov.in**.
   - Press **`Esc`** key: demonstrate the instant stealth disguise screen (**Daily Notes & Weather**).
   - Show **Immediate Help** (112, 181, 1930).

---

## 8. Safety & Privacy Guardrails

- **Attribution Disclaimer:** AEGIS never makes definitive forensic claims of attacker identity. It uses strict wording: *"Potential connection detected"*.
- **No Predictive Violence Scoring:** AEGIS evaluates digital threat trajectories based only on provided evidence; it does not claim to predict physical assault.
- **Evidence Integrity:** SHA-256 hashes are labeled as an *"Evidence Integrity Record"*, not a substitute for forensic court certification.
- **Zero Third-Party Telemetry:** No marketing cookies, Google Analytics, or third-party tracking scripts.
- **One-Tap Wipe:** Clicking "Erase All Case Data" in the Privacy Center permanently deletes all records and disk files immediately.

---

## 9. Statutory Indian Legal Context

- **112:** National Emergency Service (Police / Ambulance / Fire)
- **181:** Women Helpline (Domestic violence, cyberstalking, counseling)
- **1930:** National Cyber Crime Helpline & reporting portal (cybercrime.gov.in)
- **Statutory Provisions Cited:**
  - *Bharatiya Nyaya Sanhita (BNS) 2023, Section 78:* Cyberstalking
  - *Bharatiya Nyaya Sanhita (BNS) 2023, Section 351:* Criminal Intimidation
  - *Information Technology Act 2000, Section 66E:* Violation of privacy
  - *Information Technology Act 2000, Section 67 / 67A:* Obscene / sexually explicit electronic material
  - *IT Rules 2021, Rule 3(2)(b):* Mandatory 72-hour intermediary takedown for harassment and intimate imagery.
