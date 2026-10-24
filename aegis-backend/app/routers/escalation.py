from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.incident import Incident
from app.schemas.escalation import EscalationReport
from app.services.escalation_engine import escalation_engine

router = APIRouter(prefix="/escalation", tags=["Threat Escalation"])

@router.get("/{incident_id}", response_model=EscalationReport)
def get_escalation_trajectory(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found.")
    
    events = incident.events
    return escalation_engine.evaluate_trajectory(incident, events)
