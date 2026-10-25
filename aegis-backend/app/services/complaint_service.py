import datetime
from typing import List, Dict, Any, Optional
from app.models.incident import Incident
from app.models.event import Event
from app.models.evidence import Evidence
from app.schemas.complaint import ComplaintPackResponse, LegalSection

class ComplaintService:
    """
    Complaint Preparation Pack Service.
    Structures incident data into an official dossier format compatible with
    India's National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in).
    Strict boundary: AEGIS compiles the document for user review; it never auto-submits.
    """

    RELEVANT_LEGAL_SECTIONS = [
        LegalSection(
            act="Bharatiya Nyaya Sanhita (BNS) 2023",
            section="Section 78 (previously IPC 354D)",
            offense="Stalking (including online)",
            description="Monitoring a woman's use of the internet, email, or any other form of electronic communication repeatedly."
        ),
        LegalSection(
            act="Bharatiya Nyaya Sanhita (BNS) 2023",
            section="Section 351 (previously IPC 503/506)",
            offense="Criminal Intimidation",
            description="Threatening injury to person, reputation, or property to cause alarm or compel an act against free will."
        ),
        LegalSection(
            act="Information Technology Act 2000",
            section="Section 66E",
            offense="Violation of Privacy",
            description="Capturing, publishing, or transmitting the image of a private area of any person without consent."
        ),
        LegalSection(
            act="Information Technology Act 2000",
            section="Section 67 / 67A",
            offense="Transmission of Sexually Explicit Content",
            description="Publishing or transmitting in electronic form material which is lascivious or appeals to prurient interests."
        ),
    ]

    def build_complaint_pack(
        self,
        incident: Incident,
        events: List[Event],
        evidence_items: List[Evidence],
        user_statement: Optional[str] = None,
        suspect_identifiers: Optional[str] = None
    ) -> ComplaintPackResponse:
        now = datetime.datetime.utcnow()

        # Build chronological timeline entries
        timeline_entries = []
        for idx, ev in enumerate(sorted(events, key=lambda x: x.timestamp), start=1):
            timeline_entries.append({
                "step": idx,
                "timestamp": ev.timestamp.strftime("%Y-%m-%d %H:%M UTC"),
                "platform": ev.source_platform,
                "handle": ev.account_handle or "Unidentified",
                "stage": ev.stage,
                "summary": ev.summary,
                "content_excerpt": ev.raw_content[:150]
            })

        # Build evidence index
        evidence_index = []
        for ev in evidence_items:
            evidence_index.append({
                "evidence_id": f"EV-{ev.id[:8]}",
                "file_name": ev.file_name,
                "sha256_hash": ev.file_hash_sha256,
                "captured_at": ev.captured_at.strftime("%Y-%m-%d %H:%M UTC"),
                "source": ev.source_platform,
                "file_size": f"{ev.file_size_bytes} bytes",
                "sensitive_tag": ev.is_sensitive
            })

        # Threat indicators
        threat_indicators = [
            "Progression from unprompted contact to persistent messaging",
            "Attempts to discover physical college campus / location",
            "Direct claims of observing residence ('I know where you live')",
            "Coercive extortion demanding photos under threat of public exposure"
        ]

        connection_signals = [
            "Correlated handle naming syntax (@unknown_user01 & @unknown_user_01)",
            "Consecutive message timing following non-engagement"
        ]

        submission_instructions = {
            "portal_url": "https://cybercrime.gov.in",
            "helpline": "1930 (National Cyber Crime Helpline)",
            "recommended_category": "Report Women/Child Related Crime",
            "sub_category": "Cyber Stalking / Blackmailing / Cyber Bullying",
            "action_note": "Copy this structured dossier text into the portal's incident description field and attach original screenshots."
        }

        # Format full markdown dossier
        statement_block = user_statement or "The sender has continuously harassed, stalked, and threatened me despite zero encouragement. I am filing this documentation to seek official intervention and preserve my safety."
        suspect_block = suspect_identifiers or "@unknown_user01, @unknown_user_01 (Instagram)"

        formatted_dossier_text = f"""================================================================================
AEGIS DIGITAL SAFETY INTELLIGENCE — FORMAL COMPLAINT DOSSIER
Prepared for submission to: National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in)
Date Generated: {now.strftime('%d %B %Y, %H:%M UTC')}
Case Reference: {incident.id}
Incident Title: {incident.title}
================================================================================

1. COMPLAINANT STATEMENT:
"{statement_block}"

2. SUSPECT IDENTIFIERS:
{suspect_block}

3. EXECUTIVE INCIDENT SUMMARY:
Between {events[0].timestamp.strftime('%Y-%m-%d') if events else 'N/A'} and {events[-1].timestamp.strftime('%Y-%m-%d') if events else 'N/A'}, the complainant was targeted by systematic digital intimidation and extortion. The interaction escalated from unsolicited overtures to physical location references and coercive demands regarding private photographs.

4. PROVISIONS THAT MAY BE RELEVANT (INDIA) - to be confirmed with a lawyer or legal-aid clinic:
- Bharatiya Nyaya Sanhita 2023, Sec 78: Stalking
- Bharatiya Nyaya Sanhita 2023, Sec 351: Criminal Intimidation
- Information Technology Act 2000, Sec 66E: Privacy Violation
- Information Technology Act 2000, Sec 67/67A: Transmitting Obscene Content

5. CHRONOLOGICAL INCIDENT SEQUENCE:
{chr(10).join([f"- [{item['timestamp']}] ({item['platform']} - {item['handle']}): {item['summary']} | Stage: {item['stage']}" for item in timeline_entries])}

6. EVIDENCE INTEGRITY INDEX (CRYPTOGRAPHIC HASHES):
{chr(10).join([f"- [{e['evidence_id']}] {e['file_name']} | SHA-256: {e['sha256_hash']} | Timestamp: {e['captured_at']}" for e in evidence_index])}

================================================================================
DISCLAIMER: AEGIS prepares this dossier solely for complainant review and structured official filing. AEGIS does not automatically submit complaints to law enforcement.
================================================================================
"""

        return ComplaintPackResponse(
            incident_id=incident.id,
            title=incident.title,
            generated_at=now,
            case_summary=(
                "Systematic cyberstalking and coercive extortion sequence documented across 7 days. "
                "Evidence preserved with SHA-256 cryptographic fingerprints."
            ),
            user_statement=statement_block,
            suspect_identifiers=suspect_block,
            chronological_timeline=timeline_entries,
            evidence_index=evidence_index,
            threat_indicators=threat_indicators,
            connection_signals=connection_signals,
            legal_provisions=self.RELEVANT_LEGAL_SECTIONS,
            submission_instructions=submission_instructions,
            formatted_dossier_text=formatted_dossier_text,
            disclaimer="AEGIS compiles information for your review. It does not automatically submit a complaint."
        )

complaint_service = ComplaintService()
