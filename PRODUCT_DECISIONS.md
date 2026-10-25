# AEGIS — Product Decisions & Synthesis Specification

## 1. Product Thesis & Positioning

> **"Understand what is happening. Decide what happens next."**
> 
> *The word comes from the Greek aigís (goatskin), referring to the magical shield or breastplate carried by Zeus or Athena in ancient Greek mythology. [[1](https://en.wikipedia.org/wiki/Aegis), [2](https://www.merriam-webster.com/dictionary/aegis), [3](https://www.britannica.com/topic/aegis)]*

AEGIS is a **personal digital safety intelligence desk** designed for women facing online harassment, cyberstalking, intimidation, coercion, or digital exposure. Serving as a modern digital shield, it unifies two essential pillars into one seamless product:
1. **The Rapid-Response Foundation:** Urgent triage, client-side cryptographic hashing, evidence preservation, platform report drafting, cybercrime complaint generation, and immediate privacy controls (Quick Exit, local data ownership).
2. **The Digital Threat-Intelligence Layer:** Multi-event threat escalation trajectory, identity exposure mapping, cross-account threat linkage, longitudinal case reconstruction, and before-and-after change detection ("What Changed?").

### What AEGIS Is NOT
- **Not an SOS/panic app:** Does not rely on fake panic buttons, siren alarms, or physical shake-to-alert gimmicks.
- **Not a cybersecurity SOC:** Does not look like a dark-mode hacker terminal or enterprise intrusion detection system.
- **Not an opaque AI chatbot:** Does not give generic, platitudinous advice without evidence or provenance.
- **Not a police reporting surrogate:** Does not pretend to dispatch police or submit complaints automatically without user consent.
- **Not an uncontrolled OSINT crawler:** Never performs unconsented web scraping or claims omniscient knowledge of attackers.

---

## 2. Synthesized Product Loop

The core lifecycle of an incident in AEGIS follows a deliberate, reassuring loop:

```text
       ┌───────────────┐
       │    DETECT     │ ➔ User provides message, screenshot, link, or note
       └───────┬───────┘
               ▼
       ┌───────────────┐
       │  UNDERSTAND   │ ➔ Extract explainable signals (coercion, doxxing, persistence)
       └───────┬───────┘
               ▼
       ┌───────────────┐
       │    CONNECT    │ ➔ Map identity exposure & evaluate potential threat linkage
       └───────┬───────┘
               ▼
       ┌───────────────┐
       │  RECONSTRUCT  │ ➔ Sequence events into a chronological case narrative
       └───────┬───────┘
               ▼
       ┌───────────────┐
       │ DETECT CHANGE │ ➔ Compare against previous state: What changed? Why?
       └───────┬───────┘
               ▼
       ┌───────────────┐
       │    PROTECT    │ ➔ Actionable, calm next steps (platform notice, settings)
       └───────┬───────┘
               ▼
       ┌───────────────┐
       │   PRESERVE    │ ➔ Evidence Vault with SHA-256 integrity records
       └───────┬───────┘
               ▼
       ┌───────────────┐
       │    REPORT     │ ➔ Export factual Complaint Pack for 1930 / portal
       └───────────────┘
```

---

## 3. Visual & UX Decisions

### Tone & Visual Aesthetic
- **Soft, Calm, Trustworthy, Human, Private.**
- A woman using AEGIS is likely stressed, anxious, or overwhelmed. The interface must de-escalate anxiety, not amplify it.
- Styled as an **editorial digital safety desk** rather than an AI tech dashboard.

### Color Palette
- **Background:** Warm ivory / very light neutral (`#FBFBF9`, `#F7F6F2`).
- **Surfaces/Cards:** Crisp warm white (`#FFFFFF`) with subtle borders (`#E5E5E0`).
- **Typography:** Soft charcoal (`#1E2022`) for body text, deep warm slate (`#141618`) for headings.
- **Semantic Accents (Meaningful, Desaturated):**
  - *Serious Threat / Critical:* Muted rose / restrained terracotta red (`#BE3A34`, `#991B1B`).
  - *Warning / Elevated:* Warm amber / ochre (`#B45309`, `#D97706`).
  - *Informational / Context:* Muted slate blue (`#2563EB`, `#3B82F6`).
  - *Completed / Safe:* Muted sage green (`#2D7A58`, `#059669`).
- **Strictly Avoided:**
  - Dark-mode cyber SOC green/neon
  - Purple/violet gradient "AI sparkles"
  - Childish pink stereotypical tropes
  - Blinking warnings, pulsing red badges, or loud alarm icons

### Typography Hierarchy
- **Editorial Headings:** Serif font pairing (such as *Lora*, *Newsreader*, or *Merriweather*) for page titles, case names, and milestone narratives.
- **Interface & Data:** Clean, modern sans-serif (*Inter*, *Plus Jakarta Sans*, or system sans) for timestamps, hashes, metadata, and tables.

---

## 4. Key Feature Decisions & Boundaries

| Feature | Architectural Decision | Strict Safety Boundary |
| :--- | :--- | :--- |
| **Analysis Engine** | Hybrid: Deterministic heuristics + LLM contextual extraction. Explains *what* was detected and *why*. | Never output arbitrary raw probability numbers (e.g. "93% risk") without concrete linguistic evidence. |
| **Threat Escalation** | Evaluates sequential transitions (Unwanted contact ➔ Persistence ➔ PII reference ➔ Intimidation ➔ Coercion). | Never claim to predict physical assault or certainty of future harm. Frame as *threat trajectory*. |
| **Change Detection ("What Changed?")** | Computes deterministic diffs of case state: signals added, accounts linked, escalation level shift (e.g., HIGH ➔ CRITICAL), with plain-language explanation of *why*. | Must highlight exact new signals introduced by the latest evidence. |
| **Digital Exposure Graph** | Visualizes relationship between user-provided digital identity nodes (Username, Email, Phone, Institution, Location). | Uses language: *"Potentially exposed information"*, never *"Attacker knows this"*. No external scraping. |
| **Threat Linkage Engine** | Compares accounts across handle similarity, timing correlation, repeated phrases, and identifiers. | Outputs *"Potential connection detected"*; explicitly mandates: *"This indicates a potential connection and does not establish attribution."* |
| **Case Reconstruction** | Synthesizes fragmented evidence into an objective chronological narrative where every milestone cites evidence IDs. | Retains factual neutral tone without editorializing or creating speculative stories. |
| **Evidence Vault** | Browser-side SHA-256 hash generation, immutable timestamping, tap-to-reveal for sensitive media. | Titled *"Evidence Integrity Record"*; explicitly disclaims legal certification or court admissibility guarantees. |
| **Complaint Preparation** | Generates pre-formatted complaint pack for platforms, National Cyber Crime Reporting Portal (1930), and provisions that may be relevant (confirm with a lawyer or legal-aid clinic). | Strictly user-controlled export. Nothing is ever submitted to police or any authority automatically. |
| **Quick Exit & Privacy** | Subtle `Esc` key shortcut and top-right "Quick Exit" button immediately replacing the screen with a neutral weather/notes screen; one-tap "Erase All Case Data". | Local storage fallback, PIN-lock readiness, no tracking telemetry. |

---

## 5. Official Indian Helplines & Context

AEGIS provides direct, unembellished emergency assistance routing:
- **112:** National Emergency Service (Police, Fire, Ambulance)
- **181:** Women Helpline (Domestic abuse, harassment, crisis counseling)
- **1930:** National Cyber Crime Helpline & reporting portal (cybercrime.gov.in)

No fabricated APIs or simulated police dispatch are permitted.
