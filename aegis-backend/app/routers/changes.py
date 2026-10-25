import json
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.incident import Incident
from app.models.change import ChangeEvent
from app.schemas.change import ChangeComparisonResponse
from app.services.change_detection import change_engine

router = APIRouter(prefix="/changes", tags=["Change Detection"])

@router.get("/{incident_id}", response_model=ChangeComparisonResponse)
def get_latest_change(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found.")

    latest_change = db.query(ChangeEvent).filter(ChangeEvent.incident_id == incident_id).order_by(ChangeEvent.created_at.desc()).first()

    if latest_change:
        try:
            reasons = json.loads(latest_change.reasons_json)
        except Exception:
            reasons = [latest_change.reasons_json]

        try:
            new_signals = json.loads(latest_change.new_signals_json) if latest_change.new_signals_json else []
        except Exception:
            new_signals = []

        is_escalated = (
            latest_change.before_risk != latest_change.after_risk or
            latest_change.before_stage != latest_change.after_stage
        )

        actual_accounts = [a.handle for a in incident.accounts] if incident.accounts else []
        new_acc = [actual_accounts[-1]] if len(actual_accounts) > 1 else actual_accounts

        return ChangeComparisonResponse(
            incident_id=incident.id,
            event_id=latest_change.event_id,
            before_stage=latest_change.before_stage,
            after_stage=latest_change.after_stage,
            before_risk=latest_change.before_risk,
            after_risk=latest_change.after_risk,
            is_escalated=is_escalated,
            new_threat_signals=new_signals if new_signals else [],
            new_exposure_elements=[],
            new_accounts_detected=new_acc,
            delta_summary=latest_change.delta_summary,
            why_it_changed=" ".join(reasons) if reasons else "Corroborating record added to active case.",
            recommended_priority_action="Preserve evidence in vault with safety stamps and review recommended protective steps.",
            created_at=latest_change.created_at
        )

    # If no saved change event, compute dynamically
    events = incident.events
    last_event = events[-1] if events else None
    return change_engine.detect_changes(
        incident=incident,
        new_event=last_event,
        previous_stage=incident.current_stage,
        previous_risk=incident.risk_level
    )
