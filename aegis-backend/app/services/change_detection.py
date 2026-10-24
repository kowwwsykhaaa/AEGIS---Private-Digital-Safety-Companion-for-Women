import json
import datetime
from typing import List, Dict, Any, Optional
from app.models.incident import Incident
from app.models.event import Event
from app.models.change import ChangeEvent
from app.schemas.change import ChangeComparisonResponse

class ChangeDetectionEngine:
    """
    AEGIS Signature Feature: "What Changed?"
    Compares the prior case state T-1 against current state T when new evidence arrives.
    Highlights new signals, state transitions, account linkage, and explains the 'Why'.
    """

    STAGE_RANKS = {
        "UNWANTED_CONTACT": 1,
        "PERSISTENCE": 2,
        "PII_REFERENCE": 3,
        "INTIMIDATION": 4,
        "COERCION": 5
    }

    def detect_changes(
        self,
        incident: Incident,
        new_event: Optional[Event] = None,
        previous_stage: Optional[str] = None,
        previous_risk: Optional[str] = None,
        newly_detected_signals: Optional[List[str]] = None,
        new_accounts: Optional[List[str]] = None,
        new_exposure_elements: Optional[List[str]] = None
    ) -> ChangeComparisonResponse:
        before_stage = previous_stage or "HIGH"
        after_stage = incident.current_stage
        before_risk = previous_risk or "HIGH"
        after_risk = incident.risk_level

        signals = newly_detected_signals or []
        accounts = new_accounts or []
        exposure = new_exposure_elements or []

        # If not passed explicitly, derive from new_event content
        if new_event and not signals:
            lower = new_event.raw_content.lower()
            if "expose" in lower or "photo" in lower or "send" in lower:
                signals.append("Coercive Demand (Image distribution threat)")
            if "know where you live" in lower or "find you" in lower:
                signals.append("Physical Location Reference")
            if "study" in lower or "college" in lower:
                signals.append("Institutional Identifier Solicitation")
            if "replying" in lower or "answer" in lower:
                signals.append("Persistence Pattern")

        rank_before = self.STAGE_RANKS.get(before_stage, 1)
        rank_after = self.STAGE_RANKS.get(after_stage, 1)
        is_escalated = rank_after > rank_before or (before_risk != "CRITICAL" and after_risk == "CRITICAL")

        # Plain language explanation of Why
        reasons: List[str] = []
        if is_escalated:
            if after_stage == "COERCION":
                reasons.append("The newest evidence introduces a coercive demand paired with threats to leak private material.")
            elif after_stage == "INTIMIDATION":
                reasons.append("The sender claimed awareness of physical address or real-world movements.")
            elif after_stage == "PII_REFERENCE":
                reasons.append("The interaction progressed to eliciting sensitive offline academic or workplace anchors.")
        
        if accounts:
            reasons.append(f"A newly appearing account was detected ({', '.join(accounts)}) showing potential correlation.")

        if exposure:
            reasons.append(f"Newly referenced identity vectors: {', '.join(exposure)}.")

        if not reasons:
            reasons.append("New corroborating evidence recorded without altering overall threat tier.")

        why_it_changed = " ".join(reasons)

        # Delta summary bullet string
        delta_summary = (
            f"Escalation level shifted from {before_risk} ({before_stage}) to {after_risk} ({after_stage}). "
            f"{len(signals)} new threat indicator(s) identified."
        )

        # Recommended priority action
        if after_risk == "CRITICAL":
            priority_action = "Preserve original file in Evidence Vault and prepare official Cyber Crime (1930) Complaint Pack."
        elif after_risk == "HIGH":
            priority_action = "Review identity exposure settings and restrict public social media profile visibility."
        else:
            priority_action = "Record timestamped screenshot and maintain zero engagement."

        return ChangeComparisonResponse(
            incident_id=incident.id,
            event_id=new_event.id if new_event else None,
            before_stage=before_stage,
            after_stage=after_stage,
            before_risk=before_risk,
            after_risk=after_risk,
            is_escalated=is_escalated,
            new_threat_signals=signals,
            new_exposure_elements=exposure,
            new_accounts_detected=accounts,
            delta_summary=delta_summary,
            why_it_changed=why_it_changed,
            recommended_priority_action=priority_action,
            created_at=datetime.datetime.utcnow()
        )

change_engine = ChangeDetectionEngine()
