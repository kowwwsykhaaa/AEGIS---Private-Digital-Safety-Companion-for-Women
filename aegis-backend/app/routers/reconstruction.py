from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.incident import Incident
from app.services.case_reconstruction import reconstruction_engine

router = APIRouter(prefix="/reconstruction", tags=["Case Reconstruction"])

@router.get("/{incident_id}")
def get_case_reconstruction(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found.")

    events = incident.events
    evidence_items = incident.evidence_items
    return reconstruction_engine.reconstruct(incident, events, evidence_items)
