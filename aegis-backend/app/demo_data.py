import uuid
import datetime
from sqlalchemy.orm import Session
from app.models.incident import Incident
from app.models.event import Event
from app.models.evidence import Evidence
from app.models.account import Account
from app.models.identity import IdentityNode, Relationship
from app.models.threat import ThreatSignal, ThreatState
from app.models.change import ChangeEvent
from app.models.audit import Recommendation, AuditEvent
from app.services.evidence_service import evidence_service
from app.services.change_detection import change_engine

DEMO_INCIDENT_ID = "inc-demo-ananya-2026"

def seed_demo_case(db: Session, full_progression: bool = True) -> Incident:
    """
    Seeds a realistic, entirely fictional harassment progression for hackathon demo.
    Uses Ananya persona (SafeCase + AEGIS spec).
    """
    # Clear any previous demo instance
    existing = db.query(Incident).filter(Incident.id == DEMO_INCIDENT_ID).first()
    if existing:
        db.delete(existing)
        db.commit()

    now = datetime.datetime.utcnow()
    day1_time = now - datetime.timedelta(days=7)
    day3_time = now - datetime.timedelta(days=5)
    day5_time = now - datetime.timedelta(days=3)
    day6_time = now - datetime.timedelta(days=2)
    day7_time = now - datetime.timedelta(hours=4)

    # 1. Create Incident
    incident = Incident(
        id=DEMO_INCIDENT_ID,
        title="Social Media Harassment & Extortion Sequence",
        description="Fictional case: Escalating unsolicited contact on Instagram evolving into physical tracking threats and coercive image exposure demands.",
        status="active",
        current_stage="COERCION" if full_progression else "INTIMIDATION",
        risk_level="CRITICAL" if full_progression else "HIGH",
        created_at=day1_time,
        updated_at=now
    )
    db.add(incident)
    db.flush()

    # 2. Suspect Accounts
    acc1 = Account(
        id=f"acc-{uuid.uuid4().hex[:8]}",
        incident_id=incident.id,
        platform="Instagram",
        handle="@unknown_user01",
        display_name="Unknown User",
        profile_url="https://instagram.com/unknown_user01",
        notes="Primary account used for Days 1 to 6 interactions",
        first_seen=day1_time,
        last_seen=day6_time
    )
    db.add(acc1)

    acc2 = None
    if full_progression:
        acc2 = Account(
            id=f"acc-{uuid.uuid4().hex[:8]}",
            incident_id=incident.id,
            platform="Instagram",
            handle="@unknown_user_01",
            display_name="Private",
            profile_url="https://instagram.com/unknown_user_01",
            notes="Secondary account created after primary account was muted",
            first_seen=day7_time,
            last_seen=day7_time
        )
        db.add(acc2)
    db.flush()

    # 3. Evidence Items & Hashes
    evidence_items = []
    
    # Day 1 Evidence
    ev1 = evidence_service.store_text_evidence(
        incident_id=incident.id,
        text_content="Direct Message from @unknown_user01: 'Hey, you're cute.'",
        source_platform="Instagram Direct",
        is_sensitive=False,
        notes="Initial unsolicited direct message"
    )
    ev1.captured_at = day1_time
    evidence_items.append(ev1)

    # Day 3 Evidence
    ev2 = evidence_service.store_text_evidence(
        incident_id=incident.id,
        text_content="Direct Message from @unknown_user01: 'Why aren't you replying?'",
        source_platform="Instagram Direct",
        is_sensitive=False,
        notes="Repeated follow-up after no response"
    )
    ev2.captured_at = day3_time
    evidence_items.append(ev2)

    # Day 5 Evidence
    ev3 = evidence_service.store_text_evidence(
        incident_id=incident.id,
        text_content="Direct Message from @unknown_user01: 'Tell me where you study.'",
        source_platform="Instagram Direct",
        is_sensitive=False,
        notes="Offline college probing"
    )
    ev3.captured_at = day5_time
    evidence_items.append(ev3)

    # Day 6 Evidence
    ev4 = evidence_service.store_text_evidence(
        incident_id=incident.id,
        text_content="Direct Message from @unknown_user01: 'I know where you live.'",
        source_platform="Instagram Direct",
        is_sensitive=False,
        notes="Physical residence tracking claim"
    )
    ev4.captured_at = day6_time
    evidence_items.append(ev4)

    ev5 = None
    if full_progression:
        ev5 = evidence_service.store_text_evidence(
            incident_id=incident.id,
            text_content="Direct Message from @unknown_user_01: 'Send the photos or I'll expose you.'",
            source_platform="Instagram Direct",
            is_sensitive=True,
            notes="Coercive demand with image exposure threat"
        )
        ev5.captured_at = day7_time
        evidence_items.append(ev5)

    for ev in evidence_items:
        db.add(ev)
    db.flush()

    # 4. Events
    event_specs = [
        ("UNWANTED_CONTACT", "First unwanted contact", "Hey, you're cute.", day1_time, "@unknown_user01", ev1.id),
        ("PERSISTENCE", "Repeated contact after no response", "Why aren't you replying?", day3_time, "@unknown_user01", ev2.id),
        ("PII_REFERENCE", "Personal information requested", "Tell me where you study.", day5_time, "@unknown_user01", ev3.id),
        ("INTIMIDATION", "Residence referenced directly", "I know where you live.", day6_time, "@unknown_user01", ev4.id),
    ]
    if full_progression and ev5:
        event_specs.append(
            ("COERCION", "Coercive demand & exposure threat", "Send the photos or I'll expose you.", day7_time, "@unknown_user_01", ev5.id)
        )

    created_events = []
    for stage, summary, raw, ts, handle, eid in event_specs:
        ev_model = Event(
            id=f"evt-{uuid.uuid4().hex[:8]}",
            incident_id=incident.id,
            timestamp=ts,
            stage=stage,
            summary=summary,
            raw_content=raw,
            source_platform="Instagram",
            account_handle=handle,
            evidence_id=eid
        )
        db.add(ev_model)
        created_events.append(ev_model)
    db.flush()

    # 5. Threat Signals
    signal_specs = [
        (created_events[0], "Unsolicited Approach", "LOW", "Initial unsolicited romantic overture without prior interaction", "Hey, you're cute."),
        (created_events[1], "Unwanted Persistence", "MODERATE", "Persistent messaging continuing after boundary non-response", "Why aren't you replying?"),
        (created_events[2], "Personal Information Solicitation", "HIGH", "Inquiry regarding victim's offline study campus", "Tell me where you study."),
        (created_events[3], "Intimidation / Real-World Tracking", "HIGH", "Implicit physical surveillance claim regarding residence", "I know where you live."),
    ]
    if full_progression:
        signal_specs.append(
            (created_events[4], "Coercion / Extortion", "CRITICAL", "Conditional demand paired with non-consensual image distribution threat", "Send the photos or I'll expose you.")
        )

    for parent_evt, stype, sev, rat, exc in signal_specs:
        sig = ThreatSignal(
            id=f"sig-{uuid.uuid4().hex[:8]}",
            incident_id=incident.id,
            event_id=parent_evt.id,
            signal_type=stype,
            severity=sev,
            rationale=rat,
            excerpt=exc,
            detected_at=parent_evt.timestamp
        )
        db.add(sig)

    # 6. Change Event (What Changed?)
    if full_progression:
        change_evt = ChangeEvent(
            id=f"chg-{uuid.uuid4().hex[:8]}",
            incident_id=incident.id,
            event_id=created_events[4].id,
            before_stage="INTIMIDATION",
            after_stage="COERCION",
            before_risk="HIGH",
            after_risk="CRITICAL",
            delta_summary="Threat level escalated from HIGH to CRITICAL. Introduced explicit extortion demand with exposure threat and identified correlated secondary account.",
            reasons_json='["New coercive threat language referencing private photos", "Shift from physical tracking to active digital extortion", "New account (@unknown_user_01) detected with 92% naming similarity", "Acute urgency: non-consensual image distribution risk"]',
            new_signals_json='["Coercion / Extortion Demand", "Potential Account Linkage (@unknown_user_01)", "Private Image Exposure Risk"]',
            created_at=day7_time
        )
        db.add(change_evt)

    # 7. Recommendations
    recs = [
        Recommendation(
            id=f"rec-{uuid.uuid4().hex[:8]}",
            incident_id=incident.id,
            title="Preserve Original Unaltered Messages",
            action_type="preserve",
            description="Ensure screenshots and direct messages remain unedited. Do not delete chats, as digital timestamps are essential evidence.",
            priority="critical",
            is_completed=True
        ),
        Recommendation(
            id=f"rec-{uuid.uuid4().hex[:8]}",
            incident_id=incident.id,
            title="Refuse All Extortion Demands",
            action_type="protect",
            description="Do not comply with demands for photos or funds. Yielding does not stop extortion and often encourages further demands.",
            priority="critical",
            is_completed=False
        ),
        Recommendation(
            id=f"rec-{uuid.uuid4().hex[:8]}",
            incident_id=incident.id,
            title="Audit Account Privacy Settings",
            action_type="privacy_lockdown",
            description="Switch Instagram profile to private, remove college and location check-ins, and restrict direct message requests.",
            priority="high",
            is_completed=False
        ),
        Recommendation(
            id=f"rec-{uuid.uuid4().hex[:8]}",
            incident_id=incident.id,
            title="Download Official Complaint Pack",
            action_type="cybercrime_portal",
            description="Export the pre-formatted dossier from AEGIS for formal submission on cybercrime.gov.in (Helpline 1930).",
            priority="high",
            is_completed=False
        ),
    ]
    for r in recs:
        db.add(r)

    # 8. Audit Event
    audit = AuditEvent(
        id=f"aud-{uuid.uuid4().hex[:8]}",
        incident_id=incident.id,
        action="DEMO_CASE_LOADED",
        details="Seeded complete 7-day realistic Ananya harassment progression for hackathon review.",
        timestamp=now
    )
    db.add(audit)

    db.commit()
    db.refresh(incident)
    return incident
