# AEGIS — System Architecture Specification

## 1. Architectural Overview

AEGIS is built with a clear separation of concerns across a modern, responsive web client, a robust Python/FastAPI intelligence backend, a relational SQLite/PostgreSQL persistence layer, and a deterministic safety core.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       AEGIS FRONTEND (Vite / React 18 / TS)                 │
│  - Warm Editorial Design System (Tailwind CSS)                              │
│  - Quick Exit Controller & Global Keyboard Listener (Esc)                   │
│  - Client-Side SHA-256 Evidence Hasher & Tap-to-Reveal Visual Blur          │
│  - Interactive Exposure Graph & Escalation Trajectory Visualizer            │
│  - "What Changed?" State Diff Inspector & Complaint Pack Builder            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ REST API (JSON / FormData)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       FASTAPI BACKEND SERVICE LAYER                         │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐  │
│  │    Analysis Engine    │  │   Escalation Engine   │  │ Change Detector │  │
│  │ (Signals, Heuristics) │  │ (Trajectory & Stages) │  │  (State Diffs)  │  │
│  └───────────────────────┘  └───────────────────────┘  └─────────────────┘  │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐  │
│  │ Threat Linkage Engine │  │ Exposure Graph Engine │  │ Case Reconstruct│  │
│  │ (Similarity & Bursts) │  │  (Identity Vectors)   │  │ (Narrative/Log) │  │
│  └───────────────────────┘  └───────────────────────┘  └─────────────────┘  │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐  │
│  │   Evidence Vault Svc  │  │ Complaint Generator   │  │ Privacy & Audit │  │
│  │ (Integrity & Hashes)  │  │ (1930 / IT Act Form)  │  │ (Zero-Trace Del)│  │
│  └───────────────────────┘  └───────────────────────┘  └─────────────────┘  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ SQLAlchemy ORM / Async Engine
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DATABASE & LOCAL STORAGE LAYER                           │
│  - SQLite (Local Dev / Hackathon zero-config) / PostgreSQL (Production)     │
│  - Encrypted / Local Evidence Vault directory                               │
│  - Audit Logs & Immutable Evidence Integrity Records                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Service Engines

### 2.1 Analysis Engine (`services/analysis_engine.py`)
- **Input:** Raw text, links, OCR extracts, or metadata.
- **Processing:** Hybrid execution.
  - Deterministic keyword and pattern matching for coercion markers, doxxing threats, payment/cryptocurrency/UPI demands, deadlines, and vulgar intimidation.
  - LLM contextual summarizer and rationale generator (with fallbacks if offline/unconfigured).
- **Output:** Explainable signals: `category`, `confidence`, `evidence_excerpt`, `explanation_why`, `recommended_immediate_action`.

### 2.2 Threat Escalation Engine (`services/escalation_engine.py`)
- **Input:** Chronologically ordered sequence of incident events.
- **Trajectory Stages:**
  1. `UNWANTED_CONTACT` (Benign or unsolicited overtures)
  2. `PERSISTENCE` (Repeated messaging after non-response or rejection)
  3. `PII_REFERENCE` (Mention of victim's real name, workplace, college, home)
  4. `INTIMIDATION` (Overt or implied threats of consequences)
  5. `COERCION` (Explicit demands paired with threats of exposure, extortion, or physical harm)
- **Output:** Current stage, escalation slope, timeline milestones, and plain-language reasoning of the trajectory shift.

### 2.3 Change Detection Engine ("What Changed?") (`services/change_detection.py`)
- **Core Innovation:** Compares `State(T-1)` against `State(T)` upon evidence ingestion.
- **Diff Metrics:**
  - New threat signals introduced (e.g. + Coercion demand)
  - Escalation stage change (e.g. HIGH ➔ CRITICAL)
  - New identity nodes exposed (e.g. + Institution, + Location)
  - New linked accounts detected
- **Output:** Structured before/after diff card + plain-language natural explanation of *why* the case escalated.

### 2.4 Threat Linkage Engine (`services/linkage_engine.py`)
- **Signals Evaluated:**
  - Observable handle / username syntactic character overlap via `difflib.SequenceMatcher`
  - Sequential timing proximity in elapsed hours between active accounts
  - Platform consistency (e.g. both accounts active on Instagram)
- **Safety & Attribution Boundary:** Strict output label: *"Potential connection detected"*. Plain explanations and disclaimers explicitly mandate: *"This indicates a potential connection and does not establish attribution."* Never claims definitive forensic or legal certainty.

### 2.5 Digital Exposure Graph Engine (`services/exposure_graph.py`)
- **Model:** Directed node-edge graph mapping:
  `Subject (User)` ➔ `Platform Account` ➔ `Public Handle` ➔ `Linked Institution` ➔ `Physical Location` ➔ `Phone / Contact`.
- **Purpose:** Answers *"What pieces of my digital identity may be connected?"* using only provided evidence.

### 2.6 Case Reconstruction Engine (`services/case_reconstruction.py`)
- **Input:** All evidence records, chronological events, and threat signals.
- **Output:** Cohesive, objective narrative timeline where every factual finding links directly to an immutable evidence ID (`[EV-001]`).

### 2.7 Evidence Vault & Integrity Service (`services/evidence_service.py`)
- Computes SHA-256 cryptographic fingerprints upon evidence ingestion.
- Creates immutable timestamp, file size, MIME type, and capture source metadata.
- Sets `is_sensitive=True` with default client-side visual blur filter.

### 2.8 Complaint Pack Generator (`services/complaint_service.py`)
- Compiles a clean, factual markdown and text dossier formatted for Indian authorities:
  - Incident synopsis & chronological sequence
  - Evidence integrity index with SHA-256 cryptographic fingerprints
  - Provisions that may be relevant (confirm with a lawyer or legal-aid clinic):
    - *Bharatiya Nyaya Sanhita (BNS) 2023:* Section 78 (Stalking), Section 351 (Criminal Intimidation)
    - *Information Technology Act 2000:* Section 66E (Violation of privacy), Section 67 / 67A (Obscene / sexually explicit electronic material)
  - Ready for manual submission to the National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in).
  - **Non-Automated Boundary:** Nothing is ever submitted to police or any authority automatically; all actions are strictly user-initiated.

---

## 3. Data Schema & Models

```sql
-- Core entities
Incident (id, title, status, created_at, updated_at, severity)
Event (id, incident_id, timestamp, stage, summary, source_account_id, evidence_id)
Evidence (id, incident_id, file_path, file_hash_sha256, file_type, source_platform, captured_at, is_sensitive)
Account (id, incident_id, platform, handle, display_name, profile_url, notes)
IdentityNode (id, incident_id, node_type, label, confidence, exposure_level)
Relationship (id, source_node_id, target_node_id, relationship_type, confidence)
ThreatSignal (id, event_id, signal_type, severity, rationale, excerpt)
ThreatState (id, incident_id, current_stage, risk_level, updated_at)
ChangeEvent (id, incident_id, previous_state_json, current_state_json, delta_summary, created_at)
Recommendation (id, incident_id, title, action_type, description, priority, is_completed)
ComplaintReport (id, incident_id, generated_at, content_json, user_statement, is_exported)
AuditEvent (id, incident_id, action_name, actor, timestamp, details)
```

---

## 4. Security, Privacy, and Safe Harbor Architecture

1. **Empty Database Operation:** Operates cleanly from a blank database on startup with zero hardcoded demo data, fake percentages, or simulated personas.
2. **Zero-Tracking:** No third-party marketing pixels, analytics, or behavioral cookies.
3. **Quick Exit:** Persistent button and universal `Esc` key capture:
   - Immediately clears state from viewport
   - Replaces screen with a neutral weather/notes mockup
   - Clears temporary uncommitted clipboard buffers
4. **Emergency Wipe ("Delete Everything"):** Cascades deletion across all tables and securely removes evidence files.
5. **Client-Side Visual Privacy:** Media marked sensitive is automatically rendered behind a CSS blur filter with explicit tap-to-reveal.
6. **No Blind Web Scraping:** Only processes evidence provided directly by the user.
7. **Attribution & Legal Disclaimers:** Explicitly warns that digital correlation does not establish identity attribution, and legal sections must be confirmed with legal aid.
