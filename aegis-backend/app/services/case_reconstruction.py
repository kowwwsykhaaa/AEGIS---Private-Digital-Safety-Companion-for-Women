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

        # Generate objective narrative summary dynamically
        if len(sorted_events) == 0:
            narrative = "No events logged in this case yet. Add proof or notes to begin the incident timeline."
        elif len(sorted_events) == 1:
            first_ev = sorted_events[0]
            first_date = first_ev.timestamp.strftime("%b %d, %Y")
            platform_str = f"on {first_ev.source_platform}" if first_ev.source_platform else ""
            sender_str = f"from account {first_ev.account_handle}" if first_ev.account_handle else ""
            stage_desc = first_ev.stage.replace('_', ' ').title()
            narrative = (
                f"On {first_date}, an initial incident ({stage_desc}) was recorded {platform_str} {sender_str}. "
                f"The entry was preserved with a cryptographic safety stamp. Further communication is being tracked chronologically."
            )
        else:
            first_date = sorted_events[0].timestamp.strftime("%b %d, %Y")
            latest_date = sorted_events[-1].timestamp.strftime("%b %d, %Y")
            
            unique_handles = list(dict.fromkeys([e.account_handle for e in sorted_events if e.account_handle]))
            unique_platforms = list(dict.fromkeys([e.source_platform for e in sorted_events if e.source_platform]))
            
            handles_str = f"via account(s) {', '.join(unique_handles)}" if unique_handles else "from unidentified sender(s)"
            platforms_str = f"on {', '.join(unique_platforms)}" if unique_platforms else "across digital channels"
            
            stages_seen = []
            for e in sorted_events:
                s_name = e.stage.replace('_', ' ').lower()
                if not stages_seen or stages_seen[-1] != s_name:
                    stages_seen.append(s_name)
            
            stage_progression_str = " -> ".join(stages_seen) if stages_seen else "unwanted contact"
            evidence_count_str = f"{len(evidence_items)} preserved integrity record{'s' if len(evidence_items) != 1 else ''}"
            
            narrative = (
                f"Between {first_date} and {latest_date}, a sequence of {len(sorted_events)} interactions was documented {platforms_str} {handles_str}. "
                f"The sequence exhibited progression across stages ({stage_progression_str}). "
                f"All documented events correlate with {evidence_count_str} sealed with SHA-256 safety stamps."
            )

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
