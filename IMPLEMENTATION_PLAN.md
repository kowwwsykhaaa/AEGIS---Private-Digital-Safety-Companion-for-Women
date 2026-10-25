# AEGIS — Product Implementation Plan

## 1. Project Overview & Scope
AEGIS is a personal digital safety intelligence desk built for a women's safety hackathon. It combines the rapid-response foundation of SafeCase (evidence capture, integrity records, triage, platform notices, cybercrime reporting) with the digital threat-intelligence layer of AEGIS (threat escalation trajectory, identity exposure mapping, account linkage, case reconstruction, and change detection).

---

## 2. Technical Stack & Structure

### Tech Stack
- **Frontend:** Next.js 14 / React 18 / TypeScript / Tailwind CSS / Lucide React / Canvas-Confetti (optional) / Framer Motion (restrained, subtle transitions).
- **Backend:** FastAPI (Python 3.10+) / Pydantic v2 / SQLAlchemy / Uvicorn.
- **Database:** SQLite (local zero-config, portable for hackathon demo) with standard SQLAlchemy relational schema.
- **Evidence Storage:** Local file system with SHA-256 cryptographic verification.
- **Testing:** Pytest for backend engines, Jest/React Testing Library / Node scripts for frontend validation.

### Directory Structure
```text
WOMEN_SAFETY/
├── PRODUCT_DECISIONS.md
├── ARCHITECTURE.md
├── IMPLEMENTATION_PLAN.md
├── README.md
├── aegis-backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── incident.py
│   │   │   ├── event.py
│   │   │   ├── evidence.py
│   │   │   ├── account.py
│   │   │   ├── identity.py
│   │   │   ├── threat.py
│   │   │   └── audit.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── incident.py
│   │   │   ├── analysis.py
│   │   │   ├── escalation.py
│   │   │   ├── change.py
│   │   │   ├── linkage.py
│   │   │   └── complaint.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── analysis_engine.py
│   │   │   ├── escalation_engine.py
│   │   │   ├── change_detection.py
│   │   │   ├── linkage_engine.py
│   │   │   ├── exposure_graph.py
│   │   │   ├── case_reconstruction.py
│   │   │   ├── evidence_service.py
│   │   │   └── complaint_service.py
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── analyze.py
│   │   │   ├── incidents.py
│   │   │   ├── escalation.py
│   │   │   ├── changes.py
│   │   │   ├── linkage.py
│   │   │   ├── exposure.py
│   │   │   ├── evidence.py
│   │   │   ├── complaint.py
│   │   │   ├── privacy.py
│   │   │   └── demo.py
│   │   └── demo_data.py
│   ├── tests/
│   │   ├── test_analysis.py
│   │   ├── test_escalation.py
│   │   ├── test_change_detection.py
│   │   ├── test_linkage.py
│   │   └── test_evidence.py
│   ├── requirements.txt
│   └── run.py
└── aegis-frontend/
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── next.config.mjs
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx               # 01 Landing / Welcome
    │   │   ├── overview/page.tsx      # 02 Overview / Dashboard
    │   │   ├── analyze/page.tsx       # 03 & 04 Analyze & Analysis Result
    │   │   ├── escalation/page.tsx    # 05 Threat Escalation
    │   │   ├── timeline/page.tsx      # 06 Incident Timeline
    │   │   ├── changes/page.tsx       # 07 What Changed? (Before/After)
    │   │   ├── exposure/page.tsx      # 08 Digital Exposure Graph
    │   │   ├── linkage/page.tsx       # 09 Threat Linkage Engine
    │   │   ├── reconstruction/page.tsx# 10 Case Reconstruction
    │   │   ├── vault/page.tsx         # 11 Evidence Vault & Integrity
    │   │   ├── rapid-response/page.tsx# 12 Rapid Response Next Steps
    │   │   ├── complaint/page.tsx     # 13 Complaint Pack Preparation
    │   │   ├── privacy/page.tsx       # 14 Privacy Center
    │   │   └── help/page.tsx          # 15 Immediate Help (112, 181, 1930)
    │   ├── components/
    │   │   ├── Navigation.tsx
    │   │   ├── QuickExitModal.tsx
    │   │   ├── EscalationTimeline.tsx
    │   │   ├── ExposureCanvas.tsx
    │   │   ├── ChangeDiffCard.tsx
    │   │   ├── LinkageCard.tsx
    │   │   ├── EvidenceViewer.tsx
    │   │   └── DemoBanner.tsx
    │   ├── lib/
    │   │   ├── api.ts
    │   │   ├── crypto.ts
    │   │   └── formatters.ts
    │   └── styles/
    │       └── globals.css
```

---

## 3. Implementation Phases

- **Phase 1: Backend Architecture & Data Models**
  - Setup FastAPI project, database connection, and SQLAlchemy ORM models.
  - Implement Pydantic request/response schemas.
  - Initialize SQLite database with automated migration/table creation.

- **Phase 2: Core Intelligence & Threat Engines**
  - Build `analysis_engine.py`: Rule-based extraction + explainable signal mapping.
  - Build `escalation_engine.py`: Trajectory stage classification and reasoning.
  - Build `change_detection.py`: Snapshot diff engine comparing T-1 and T states.
  - Build `linkage_engine.py`: Similarity metrics (Jaro-Winkler, timing, repeated phrases).
  - Build `exposure_graph.py`: Node-edge graph generation and privacy recommendations.
  - Build `case_reconstruction.py`: Factual narrative builder linked to evidence IDs.
  - Build `evidence_service.py`: SHA-256 integrity record generation.
  - Build `complaint_service.py`: Markdown/PDF compliant summary with Indian legal mappings (IT Act 66E/67A, BNS 2023).

- **Phase 3: Demo Engine & One-Click Scenario**
  - Implement `/api/demo/load` endpoint with the 7-day realistic Ananya case.
  - Enable step-by-step injection to clearly demonstrate "What Changed?" in the live hackathon pitch.

- **Phase 4: Frontend Design System & Responsive Shell**
  - Configure warm ivory / soft charcoal / restrained accent color tokens.
  - Editorial typography configuration (Serif headings + Sans-serif data UI).
  - Global Quick Exit trigger (`Esc` key and top navigation button).

- **Phase 5: Screen Implementation (15 Essential Screens)**
  - Overview, Analyze, Escalation, What Changed, Exposure Graph, Linkage, Reconstruction, Vault, Complaint Pack, Privacy Center, Help.

- **Phase 6: Verification & Testing**
  - Comprehensive unit tests across all 5 engines.
  - End-to-end demo flow testing.

---

## 4. Dependencies & Prerequisites
- Python 3.10+ (Verified: Python 3.14.5 present)
- Node.js 18+ (Verified: Node v22.23.0, npm 10.9.8 present)
- Fast, zero-external-API fallback execution ensuring complete reliability without internet connection during hackathon presentations.

---

## 5. Identified Risks & Mitigations
1. **Risk:** Overclaiming AI intelligence or legal admissibility.
   - *Mitigation:* Clear disclaimers throughout: "Potential connection detected", "Evidence Integrity Record", no legal certification claims.
2. **Risk:** Anxiety-inducing UI design.
   - *Mitigation:* Warm ivory tones, muted alerts, calm microcopy, no flashing alarms or dark cyber aesthetics.
3. **Risk:** Demo failure due to missing API keys.
   - *Mitigation:* Hybrid architecture with high-fidelity deterministic heuristics as default, LLM as enhancement.
4. **Risk:** Accidental exposure if someone walks by during use.
   - *Mitigation:* Instant Quick Exit with `Esc` or button click, tap-to-reveal on sensitive attachments.
