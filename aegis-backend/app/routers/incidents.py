import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.incident import Incident
from app.schemas.incident import IncidentCreate, IncidentResponse, IncidentDetailResponse

router = APIRouter(prefix="/incidents", tags=["Incidents"])

@router.get("", response_model=List[IncidentResponse])
def list_incidents(db: Session = Depends(get_db)):
    return db.query(Incident).order_by(Incident.updated_at.desc()).all()

@router.get("/active", response_model=IncidentDetailResponse)
def get_active_incident(db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.status == "active").order_by(Incident.updated_at.desc()).first()
    if not incident:
        raise HTTPException(status_code=404, detail="No active case found.")
    return incident

@router.get("/{incident_id}", response_model=IncidentDetailResponse)
def get_incident(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found.")
    return incident

@router.post("", response_model=IncidentResponse)
def create_incident(payload: IncidentCreate, db: Session = Depends(get_db)):
    inc_id = f"inc-{uuid.uuid4().hex[:8]}"
    incident = Incident(
        id=inc_id,
        title=payload.title,
        description=payload.description,
        status="active",
        current_stage="UNWANTED_CONTACT",
        risk_level="LOW",
        created_at=datetime.datetime.utcnow(),
        updated_at=datetime.datetime.utcnow()
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident

@router.delete("/{incident_id}")
def delete_incident(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found.")
    db.delete(incident)
    db.commit()
    return {"status": "success", "message": f"Incident {incident_id} and all related records deleted."}
