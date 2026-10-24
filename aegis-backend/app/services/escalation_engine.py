from typing import List, Dict, Any, Optional
import datetime
from app.models.event import Event
from app.models.incident import Incident
from app.schemas.escalation import EscalationReport, TrajectoryStageInfo

class ThreatEscalationEngine:
    """
    Longitudinal Threat Trajectory Engine.
    Analyzes the chronological sequence of events rather than isolated messages.
    Explains the evolutionary pattern and why the situation worsened.
    """

    STAGE_HIERARCHY = [
        ("UNWANTED_CONTACT", "Unwanted Contact", 1),
        ("PERSISTENCE", "Persistence", 2),
        ("PII_REFERENCE", "Personal Information Reference", 3),
        ("INTIMIDATION", "Intimidation", 4),
        ("COERCION", "Coercion & Extortion", 5),
    ]

    STAGE_RANKS = {stage: rank for stage, _, rank in STAGE_HIERARCHY}

    def evaluate_trajectory(self, incident: Incident, events: List[Event]) -> EscalationReport:
        if not events:
            # Empty state fallback
            trajectory = [
                TrajectoryStageInfo(
                    stage_key=key,
                    stage_name=name,
                    order=order,
                    is_reached=(order == 1),
                    is_current=(order == 1),
                    milestone_summary="Awaiting initial evidence" if order == 1 else None,
                    reached_at=None,
                    evidence_id=None
                )
                for key, name, order in self.STAGE_HIERARCHY
            ]
            return EscalationReport(
                incident_id=incident.id,
                current_stage="UNWANTED_CONTACT",
                risk_level="LOW",
                trajectory=trajectory,
                why_it_escalated="No events logged yet.",
                escalation_velocity="None",
                key_drivers=["Awaiting evidence"],
                disclaimer="Trajectory is an interpretation of logged digital events and does not constitute a prediction of physical harm."
            )

        # Sort events by timestamp
        sorted_events = sorted(events, key=lambda e: e.timestamp)

        # Track highest stage reached per milestone
        reached_stage_events: Dict[str, Event] = {}
        highest_rank = 1
        current_stage_key = "UNWANTED_CONTACT"

        for ev in sorted_events:
            stage_rank = self.STAGE_RANKS.get(ev.stage, 1)
            if ev.stage not in reached_stage_events:
                reached_stage_events[ev.stage] = ev
            if stage_rank >= highest_rank:
                highest_rank = stage_rank
                current_stage_key = ev.stage

        # Build trajectory milestone objects
        trajectory: List[TrajectoryStageInfo] = []
        for key, name, order in self.STAGE_HIERARCHY:
            is_reached = order <= highest_rank
            is_current = (key == current_stage_key)
            matching_event = reached_stage_events.get(key)

            summary = None
            reached_at = None
            evidence_id = None
            if matching_event:
                summary = matching_event.summary
                reached_at = matching_event.timestamp
                evidence_id = matching_event.evidence_id

            trajectory.append(TrajectoryStageInfo(
                stage_key=key,
                stage_name=name,
                order=order,
                is_reached=is_reached,
                is_current=is_current,
                milestone_summary=summary,
                reached_at=reached_at,
                evidence_id=evidence_id
            ))

        # Risk level determination based on highest reached stage
        risk_map = {
            "UNWANTED_CONTACT": "LOW",
            "PERSISTENCE": "MODERATE",
            "PII_REFERENCE": "HIGH",
            "INTIMIDATION": "HIGH",
            "COERCION": "CRITICAL"
        }
        risk_level = risk_map.get(current_stage_key, "MODERATE")

        # Explain why it escalated
        key_drivers = []
        if "COERCION" in reached_stage_events:
            key_drivers.append("Introduction of non-consensual image distribution threats paired with demands")
        if "INTIMIDATION" in reached_stage_events:
            key_drivers.append("Claimed observation of victim's real-world living premises")
        if "PII_REFERENCE" in reached_stage_events:
            key_drivers.append("Specific solicitation of college and daily schedule details")
        if "PERSISTENCE" in reached_stage_events:
            key_drivers.append("Multiple repeated messages despite no reciprocal interaction")

        # Compute velocity
        if len(sorted_events) >= 2:
            span = (sorted_events[-1].timestamp - sorted_events[0].timestamp).total_seconds() / 86400.0
            if span <= 2 and highest_rank >= 4:
                velocity = "Rapid (under 48 hours)"
            elif span <= 7 and highest_rank >= 4:
                velocity = "Accelerated (7-day progression)"
            else:
                velocity = "Gradual"
        else:
            velocity = "Baseline"

        # Generate natural explanation
        if highest_rank >= 5:
            why_it_escalated = (
                f"The incident escalated to {risk_level} severity due to the introduction of coercive demands. "
                "The sender transitioned from unsolicited contact to probing for physical institutions, followed by direct intimidation and explicit blackmail."
            )
        elif highest_rank >= 4:
            why_it_escalated = (
                f"The incident escalated to {risk_level} severity because the sender introduced real-world location references, "
                "bridging digital contact into physical surveillance claims."
            )
        elif highest_rank >= 3:
            why_it_escalated = (
                f"The incident escalated to {risk_level} severity due to attempts to elicit offline personal identifiers (college / location)."
            )
        elif highest_rank >= 2:
            why_it_escalated = (
                "The incident escalated from initial greeting to repeated persistence after messages were left unacknowledged."
            )
        else:
            why_it_escalated = "The interaction currently remains at initial contact."

        return EscalationReport(
            incident_id=incident.id,
            current_stage=current_stage_key,
            risk_level=risk_level,
            trajectory=trajectory,
            why_it_escalated=why_it_escalated,
            escalation_velocity=velocity,
            key_drivers=key_drivers if key_drivers else ["Single event baseline"],
            disclaimer="AEGIS interprets digital threat trajectory. It does not predict future real-world actions or legal liability."
        )

escalation_engine = ThreatEscalationEngine()
