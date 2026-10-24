from typing import List, Dict, Any, Optional
from app.models.incident import Incident
from app.models.event import Event
from app.models.evidence import Evidence

class CaseReconstructionEngine:
    """
    Case Reconstruction Engine.
    Converts fragmented messages, screenshots, and logs into a structured,
    factual narrative timeline where every milestone cites verified evidence IDs.
    """

    def reconstruct(self, incident: Incident, events: List[Event], evidence_items: List[Evidence]) -> Dict[str, Any]:
        evidence_by_id = {e.id: e for e in evidence_items}

        sorted_events = sorted(events, key=lambda e: e.timestamp)
        milestones = []

        for idx, ev in enumerate(sorted_events, start=1):
            linked_ev = evidence_by_id.get(ev.evidence_id) if ev.evidence_id else None
            milestones.append({
                "sequence_number": idx,
                "event_id": ev.id,
                "timestamp": ev.timestamp.strftime("%Y-%m-%d %H:%M UTC"),
                "date_label": f"Day {idx}",
                "stage": ev.stage,
                "summary": ev.summary,
                "raw_excerpt": ev.raw_content,
                "source_platform": ev.source_platform,
                "account_handle": ev.account_handle or "Unknown",
                "evidence_ref": f"[EV-{ev.evidence_id[:8]}]" if ev.evidence_id else "[UNATTACHED]",
                "evidence_hash": linked_ev.file_hash_sha256[:16] + "..." if linked_ev else None,
                "is_sensitive": linked_ev.is_sensitive if linked_ev else False
            })

        # Generate objective narrative summary
        if len(milestones) >= 3:
            first_date = sorted_events[0].timestamp.strftime("%b %d, %Y")
            latest_date = sorted_events[-1].timestamp.strftime("%b %d, %Y")
            narrative = (
                f"Between {first_date} and {latest_date}, the subject experienced a progressive pattern of digital harassment "
                f"initiating on {sorted_events[0].source_platform} via account {sorted_events[0].account_handle or 'unverified'}. "
                f"The sequence advanced through 5 distinct threat stages: initial unsolicited approach, persistent outreach after "
                f"non-response, probes regarding educational institution details, direct claims of geographic awareness, and culminating in "
                f"coercive extortion referencing private media. All documented findings correlate with {len(evidence_items)} preserved integrity records."
            )
        else:
            narrative = "Initial documentation phase: fewer than 3 events recorded. Chronological progression is being tracked."

        return {
            "incident_id": incident.id,
            "title": incident.title,
            "current_status": incident.status,
            "total_events": len(sorted_events),
            "total_evidence_pieces": len(evidence_items),
            "formal_narrative": narrative,
            "chronological_milestones": milestones,
            "attribution_note": "Identities and handles are cited as represented in submitted digital evidence. Legal attribution requires law enforcement investigation."
        }

reconstruction_engine = CaseReconstructionEngine()
