import json
import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.incident import Incident
from app.models.event import Event
from app.models.account import Account
from app.models.threat import ThreatSignal
from app.models.change import ChangeEvent
from app.schemas.analysis import AnalyzeInput, AnalyzeResult
from app.services.analysis_engine import analysis_engine
from app.services.evidence_service import evidence_service
from app.services.change_detection import change_engine

router = APIRouter(prefix="/analyze", tags=["Analyze"])

@router.post("", response_model=AnalyzeResult)
def analyze_message(payload: AnalyzeInput, db: Session = Depends(get_db)):
    if not payload.content or not payload.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty.")

    result = analysis_engine.analyze_text(payload.content, source_platform=payload.source_platform)

    # If user chose to commit this to an incident
    if payload.auto_add_to_case and payload.incident_id:
        incident = db.query(Incident).filter(Incident.id == payload.incident_id).first()
        if incident:
            old_stage = incident.current_stage
            old_risk = incident.risk_level

            # 1. Store evidence with SHA-256 integrity record
            evidence = evidence_service.store_text_evidence(
                incident_id=incident.id,
                text_content=payload.content,
                source_platform=payload.source_platform,
                is_sensitive=result.is_sensitive,
                notes=f"Analyzed input via AEGIS: {payload.content_type}"
            )
            db.add(evidence)
            db.flush()

            # 2. Store event
            new_event = Event(
                id=f"evt-{uuid.uuid4().hex[:8]}",
                incident_id=incident.id,
                timestamp=datetime.datetime.utcnow(),
                stage=result.current_stage,
                summary=result.primary_reason[:150],
                raw_content=payload.content,
                source_platform=payload.source_platform,
                account_handle=payload.account_handle,
                evidence_id=evidence.id
            )
            db.add(new_event)
            db.flush()

            # 3. Store Threat Signals
            for sig in result.signals:
                ts = ThreatSignal(
                    id=f"sig-{uuid.uuid4().hex[:8]}",
                    incident_id=incident.id,
                    event_id=new_event.id,
                    signal_type=sig.signal_type,
                    severity=sig.severity,
                    rationale=sig.rationale,
                    excerpt=sig.excerpt,
                    detected_at=datetime.datetime.utcnow()
                )
                db.add(ts)

            # 4. Check / Update Account
            if payload.account_handle:
                acc = db.query(Account).filter(
                    Account.incident_id == incident.id,
                    Account.handle == payload.account_handle
                ).first()
                if not acc:
                    acc = Account(
                        id=f"acc-{uuid.uuid4().hex[:8]}",
                        incident_id=incident.id,
                        platform=payload.source_platform,
                        handle=payload.account_handle,
                        display_name="User",
                        first_seen=datetime.datetime.utcnow(),
                        last_seen=datetime.datetime.utcnow()
                    )
                    db.add(acc)
                else:
                    acc.last_seen = datetime.datetime.utcnow()

            # 5. Update incident stage & risk if higher
            stage_order = {"UNWANTED_CONTACT": 1, "PERSISTENCE": 2, "PII_REFERENCE": 3, "INTIMIDATION": 4, "COERCION": 5}
            current_order = stage_order.get(incident.current_stage, 1)
            new_order = stage_order.get(result.current_stage, 1)

            if new_order > current_order:
                incident.current_stage = result.current_stage
                incident.risk_level = result.risk_level

            # 6. Change Detection recording
            change_res = change_engine.detect_changes(
                incident=incident,
                new_event=new_event,
                previous_stage=old_stage,
                previous_risk=old_risk,
                newly_detected_signals=[s.signal_type for s in result.signals],
                new_accounts=[payload.account_handle] if payload.account_handle else []
            )

            change_evt = ChangeEvent(
                id=f"chg-{uuid.uuid4().hex[:8]}",
                incident_id=incident.id,
                event_id=new_event.id,
                before_stage=change_res.before_stage,
                after_stage=change_res.after_stage,
                before_risk=change_res.before_risk,
                after_risk=change_res.after_risk,
                delta_summary=change_res.delta_summary,
                reasons_json=json.dumps([change_res.why_it_changed]),
                new_signals_json=json.dumps(change_res.new_threat_signals),
                created_at=datetime.datetime.utcnow()
            )
            db.add(change_evt)

            incident.updated_at = datetime.datetime.utcnow()
            db.commit()

            result.incident_id = incident.id
            result.event_id = new_event.id
            result.evidence_id = evidence.id

    return result
