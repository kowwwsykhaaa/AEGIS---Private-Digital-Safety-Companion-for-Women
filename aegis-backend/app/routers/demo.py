import uuid
import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.incident import Incident
from app.models.event import Event
from app.models.account import Account
from app.models.threat import ThreatSignal
from app.models.change import ChangeEvent
from app.demo_data import seed_demo_case, DEMO_INCIDENT_ID
from app.services.evidence_service import evidence_service
from app.services.change_detection import change_engine

router = APIRouter(prefix="/demo", tags=["Demo Mode"])

@router.post("/load")
def load_demo(full: bool = Query(True, description="Load full 7-day progression or 6-day baseline"), db: Session = Depends(get_db)):
    incident = seed_demo_case(db, full_progression=full)
    return {
        "status": "success",
        "incident_id": incident.id,
        "title": incident.title,
        "current_stage": incident.current_stage,
        "risk_level": incident.risk_level,
        "total_events": len(incident.events),
        "total_evidence": len(incident.evidence_items),
        "mode": "Full 7-day progression" if full else "6-day baseline (ready for Day 7 injection)"
    }

@router.post("/inject-day7")
def inject_day7_escalation(db: Session = Depends(get_db)):
    """
    Demonstrates the live 'What Changed?' transition:
    Injects Day 7 coercive message from secondary account @unknown_user_01,
    shifting case from HIGH (Intimidation) to CRITICAL (Coercion).
    """
    incident = db.query(Incident).filter(Incident.id == DEMO_INCIDENT_ID).first()
    if not incident:
        # Seed baseline first if missing
        incident = seed_demo_case(db, full_progression=False)

    old_stage = incident.current_stage
    old_risk = incident.risk_level

    # 1. Add secondary account
    acc2 = db.query(Account).filter(Account.incident_id == incident.id, Account.handle == "@unknown_user_01").first()
    if not acc2:
        acc2 = Account(
            id=f"acc-{uuid.uuid4().hex[:8]}",
            incident_id=incident.id,
            platform="Instagram",
            handle="@unknown_user_01",
            display_name="Private",
            profile_url="https://instagram.com/unknown_user_01",
            notes="Secondary account detected in Day 7 escalation",
            first_seen=datetime.datetime.utcnow(),
            last_seen=datetime.datetime.utcnow()
        )
        db.add(acc2)
        db.flush()

    # 2. Store Day 7 Evidence with SHA-256 hash
    ev5 = evidence_service.store_text_evidence(
        incident_id=incident.id,
        text_content="Direct Message from @unknown_user_01: 'Send the photos or I'll expose you.'",
        source_platform="Instagram Direct",
        is_sensitive=True,
        notes="Day 7 Coercive demand with image exposure threat"
    )
    db.add(ev5)
    db.flush()

    # 3. Create Day 7 Event
    evt5 = Event(
        id=f"evt-{uuid.uuid4().hex[:8]}",
        incident_id=incident.id,
        timestamp=datetime.datetime.utcnow(),
        stage="COERCION",
        summary="Coercive demand & exposure threat",
        raw_content="Send the photos or I'll expose you.",
        source_platform="Instagram",
        account_handle="@unknown_user_01",
        evidence_id=ev5.id
    )
    db.add(evt5)
    db.flush()

    # 4. Add Threat Signal
    sig5 = ThreatSignal(
        id=f"sig-{uuid.uuid4().hex[:8]}",
        incident_id=incident.id,
        event_id=evt5.id,
        signal_type="Coercion / Extortion",
        severity="CRITICAL",
        rationale="Conditional demand paired with non-consensual image distribution threat",
        excerpt="Send the photos or I'll expose you.",
        detected_at=datetime.datetime.utcnow()
    )
    db.add(sig5)

    # 5. Update Incident State
    incident.current_stage = "COERCION"
    incident.risk_level = "CRITICAL"
    incident.updated_at = datetime.datetime.utcnow()

    # 6. Change Detection
    change_res = change_engine.detect_changes(
        incident=incident,
        new_event=evt5,
        previous_stage=old_stage,
        previous_risk=old_risk,
        newly_detected_signals=["Coercive Demand (Image distribution threat)"],
        new_accounts=["@unknown_user_01"],
        new_exposure_elements=["Private photographs", "Online audience exposure"]
    )

    change_evt = ChangeEvent(
        id=f"chg-{uuid.uuid4().hex[:8]}",
        incident_id=incident.id,
        event_id=evt5.id,
        before_stage=old_stage,
        after_stage="COERCION",
        before_risk=old_risk,
        after_risk="CRITICAL",
        delta_summary=change_res.delta_summary,
        reasons_json=f'["{change_res.why_it_changed}"]',
        new_signals_json='["Coercive Demand (Image distribution threat)", "Secondary Account Correlation (@unknown_user_01)"]',
        created_at=datetime.datetime.utcnow()
    )
    db.add(change_evt)

    db.commit()

    return {
        "status": "escalated",
        "message": "Day 7 evidence injected successfully. Case escalated to CRITICAL.",
        "before": {"stage": old_stage, "risk": old_risk},
        "after": {"stage": "COERCION", "risk": "CRITICAL"},
        "what_changed": change_res
    }
