# AEGIS — Product Implementation Plan & Engineering Specifications

## 1. Project Overview & Scope
AEGIS is a personal digital safety intelligence desk built for women facing online harassment, cyberstalking, intimidation, coercion, or digital exposure. It synthesizes the rapid-response foundation of SafeCase (evidence capture, cryptographic integrity records, triage, platform notices, cybercrime complaint generation) with the digital threat-intelligence layer of AEGIS (threat escalation trajectory, identity exposure mapping, account linkage, case reconstruction, and change detection).

The system operates **100% dynamically from an empty database**, computing all graphs, threat trajectories, change diffs, and complaint packs live from user evidence with zero hardcoded demo data or simulated personas.

---

## 2. Technical Stack & Structure

### Tech Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React, React Router v6, Vite.
  - *Design System:* Warm ivory (`#FBFBF9`), soft charcoal typography, restrained semantic accents (terracotta, amber, sage, slate), editorial serif headings, and a zero-emoji aesthetic.
- **Backend:** FastAPI (Python 3.10+, tested on 3.12/3.14), Pydantic v2, SQLAlchemy ORM, Uvicorn.
- **Database:** SQLite (local zero-config, portable for hackathon evaluation; PostgreSQL ready).
- **Evidence Preservation:** Local storage with SHA-256 cryptographic verification fingerprints.
- **Testing:** Pytest with Starlette TestClient covering all threat engines and API endpoints.

### Directory Structure
```text
WOMEN_SAFETY/
├── PRODUCT_DECISIONS.md          # Synthesized product strategy & safety boundaries
├── ARCHITECTURE.md               # Full-stack system architecture & data models
├── IMPLEMENTATION_PLAN.md        # Roadmap & engineering specifications
├── README.md                     # Comprehensive project documentation & user guide
├── run_aegis.bat                 # 1-click startup runner for backend and frontend
├── aegis-backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI entry point, CORS, startup lifecycle
│   │   ├── config.py             # App configuration & verified Indian helplines
│   │   ├── database.py           # SQLite engine & session management
│   │   ├── models/               # SQLAlchemy models
│   │   │   ├── __init__.py
│   │   │   ├── incident.py       # Incidents table
│   │   │   ├── event.py          # Timeline events table
│   │   │   ├── evidence.py       # Evidence vault items with SHA-256
│   │   │   ├── account.py        # Interacting sender handles
│   │   │   ├── identity.py       # Identity & exposure nodes
│   │   │   ├── threat.py         # Threat signals & state
│   │   │   ├── change.py         # Change detection diff records
│   │   │   └── audit.py          # Audit log trail
│   │   ├── schemas/              # Pydantic v2 validation schemas
│   │   │   ├── __init__.py
│   │   │   ├── incident.py
│   │   │   ├── analysis.py
│   │   │   ├── escalation.py
│   │   │   ├── change.py
│   │   │   ├── linkage.py
│   │   │   └── complaint.py
│   │   ├── services/             # Core intelligence engines
│   │   │   ├── __init__.py
│   │   │   ├── analysis_engine.py      # Rule-based linguistic signal extraction
│   │   │   ├── escalation_engine.py    # 5-stage threat escalation classifier
│   │   │   ├── change_detection.py     # State diff engine (What Changed?)
│   │   │   ├── linkage_engine.py       # Cross-account similarity & timing correlation
│   │   │   ├── exposure_graph.py       # Digital attack surface network
│   │   │   ├── case_reconstruction.py  # Factual chronological narrative builder
│   │   │   ├── evidence_service.py     # SHA-256 cryptographic integrity service
│   │   │   └── complaint_service.py    # Formal complaint pack generator
│   │   └── routers/              # Clean REST route controllers
│   │       ├── __init__.py
│   │       ├── analyze.py        # POST /api/analyze
│   │       ├── incidents.py      # GET/POST/DELETE /api/incidents
│   │       ├── escalation.py     # GET /api/escalation/{id}
│   │       ├── changes.py        # GET /api/changes/{id}
│   │       ├── linkage.py        # GET /api/linkage/{id}
│   │       ├── exposure.py       # GET /api/exposure/{id}
│   │       ├── evidence.py       # GET/POST /api/evidence/{id}
│   │       ├── reconstruction.py # GET /api/reconstruction/{id}
│   │       ├── complaint.py      # GET /api/complaint/{id}
│   │       ├── privacy.py        # POST /api/privacy/wipe
│   │       └── help.py           # GET /api/help/helplines
│   ├── tests/
│   │   ├── test_engines.py       # Unit tests for all 5 intelligence engines
│   │   └── test_api.py           # Integration & full-lifecycle empty DB tests
│   ├── requirements.txt
│   └── run.py                    # Local backend runner script
└── aegis-frontend/
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js        # Warm ivory & editorial theme tokens
    ├── vite.config.ts            # Development server & API proxy
    ├── src/
    │   ├── App.tsx               # Primary layout, routing, and global Esc listener
    │   ├── main.tsx              # React DOM mounting
    │   ├── index.css             # Tailwind base & blur utilities
    │   ├── components/
    │   │   ├── Navigation.tsx     # Header navigation & "More Tools" dropdown
    │   │   └── QuickExitModal.tsx # Stealth daily notes disguise screen
    │   ├── views/                # 15 Complete Views
    │   │   ├── WelcomeView.tsx            # Landing & orientation
    │   │   ├── OverviewView.tsx           # Case dashboard & empty states
    │   │   ├── AnalyzeView.tsx            # Evidence intake & signal inspection
    │   │   ├── EscalationView.tsx         # Longitudinal progression tracking
    │   │   ├── TimelineView.tsx           # Chronological event sequence
    │   │   ├── WhatChangedView.tsx        # Differential state comparison
    │   │   ├── ExposureGraphView.tsx      # Attack-surface exposure visualizer
    │   │   ├── ThreatLinkageView.tsx      # Cross-account pattern correlation
    │   │   ├── CaseReconstructionView.tsx # Authoritative factual summary
    │   │   ├── EvidenceVaultView.tsx      # SHA-256 sealed proof & tap-to-reveal
    │   │   ├── RapidResponseView.tsx      # Safety checklist & grievance notice
    │   │   ├── ComplaintView.tsx          # Police dossier generator (1930 / portal)
    │   │   ├── PrivacyCenterView.tsx      # 1-tap zero-trace data wipe
    │   │   ├── ImmediateHelpView.tsx      # Verified emergency hotlines (112, 181, 1930)
    │   │   └── ProfileView.tsx            # Local profile & theme customization
    │   └── lib/
    │       └── api.ts            # Typed client API client
```

---

## 3. Engineering Phases (Completed & Verified)

### Phase 1: Core Architecture & Data Models
- Implemented relational SQLAlchemy schema for `Incident`, `Event`, `Evidence`, `Account`, `IdentityNode`, `ThreatSignal`, `ChangeEvent`, and `AuditEvent`.
- Initialized SQLite database with automatic table creation upon startup.
- Configured Pydantic v2 schemas for strict serialization and deserialization.

### Phase 2: Dynamic Intelligence & Threat Engines
- **Analysis Engine:** Rule-based linguistic signal extraction for coercion, intimidation, PII probing, persistence, and unwanted overtures.
- **Threat Escalation Engine:** 5-stage sequential classifier (`UNWANTED_CONTACT` ➔ `PERSISTENCE` ➔ `PII_REFERENCE` ➔ `INTIMIDATION` ➔ `COERCION`).
- **Change Detection Engine:** Snapshot diff engine comparing previous $(T-1)$ against current $(T)$ case states to explain *why* an incident escalated.
- **Threat Linkage Engine:** Syntactic handle similarity via `difflib.SequenceMatcher`, sequential timing intervals, and platform consistency under strict attribution disclaimers (*"potential connection, does not establish attribution"*).
- **Exposure Graph Engine:** Directed node network mapping exposed identity vectors and personal anchors.
- **Evidence Service:** Cryptographic SHA-256 hashing and integrity metadata generation.
- **Complaint Service:** Formal complaint dossier generation formatted for India's National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in).

### Phase 3: Frontend Responsive Shell & 15 Clean Editorial Views
- Implemented custom Tailwind design system with warm ivory surfaces, dark/light theme switching, and zero emojis.
- Configured client-side routing across 15 views with a responsive "More Tools" dropdown navigation.
- Built universal Quick Exit (<kbd>Esc</kbd>) disguise screen with notes and weather mockup.
- Implemented tap-to-reveal privacy blur for sensitive evidence.

### Phase 4: Eradication of Demo Data & Empty Database Architecture (Step 1)
- Deleted backend demo modules (`demo_data.py`, `routers/demo.py`) and removed startup seeding hooks.
- Removed `/demo/*` endpoints, `loadDemoCase`, and `injectDay7` from frontend API bindings.
- Purged all hardcoded mock personas (`Ananya`, `inc-demo-ananya-2026`, etc.).

### Phase 5: Reassuring Empty States & Attribution/Legal Guardrails (Step 2)
- Added calm, non-crashing empty states across all views when cases = 0 or evidence = 0.
- Standardized attribution language: *"potential connection"* and *"this does not establish attribution"*; eliminated arbitrary percentage numbers.
- Renamed statutory sections in `ComplaintView.tsx` and generated dossiers to *"Provisions that may be relevant (confirm with a lawyer or legal-aid clinic)"*.
- Guaranteed that nothing is ever automatically submitted to authorities; exports require explicit user download or clipboard copy.

### Phase 6: Full Lifecycle Verification & Hardening (Step 3)
- Added `test_full_lifecycle_from_empty_database` in `tests/test_api.py`, proving that starting from 0 cases, creating an incident, uploading evidence, tracking escalation, generating reports, and deleting records works smoothly without 500 errors.
- Verified test suite: **14 passed in ~2.0s**.
- Verified production build: **`tsc && vite build` built in ~5s with 0 errors**.

---

## 4. Verification & Quality Assurance

| Test Scope | Tool | Result |
| :--- | :--- | :--- |
| **Backend Integration & Engine Tests** | `pytest tests/ -q` | 14 passed (100% pass rate) |
| **Frontend Production Build** | `npm run build` | Built in ~5s with 0 errors |
| **Empty Database Reliability** | Automated pytest lifecycle | Confirmed zero crashes or unhandled states |
| **Attribution Guardrail Compliance** | Static grep & API tests | Confirmed zero definitive forensic claims |
| **No Auto-Submission to Police** | Code review | All complaint exports are strictly manual |
