from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.incident import Incident
from app.schemas.complaint import ComplaintDraftRequest, ComplaintPackResponse
from app.services.complaint_service import complaint_service

router = APIRouter(prefix="/complaint", tags=["Complaint Pack"])

@router.get("/{incident_id}", response_model=ComplaintPackResponse)
def get_complaint_pack(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found.")

    events = incident.events
    evidence_items = incident.evidence_items
    return complaint_service.build_complaint_pack(incident, events, evidence_items)

@router.post("/{incident_id}/generate", response_model=ComplaintPackResponse)
def generate_custom_complaint_pack(incident_id: str, payload: ComplaintDraftRequest, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found.")

    events = incident.events
    evidence_items = incident.evidence_items

    if payload.include_evidence_ids:
        evidence_items = [e for e in evidence_items if e.id in payload.include_evidence_ids]

    return complaint_service.build_complaint_pack(
        incident=incident,
        events=events,
        evidence_items=evidence_items,
        user_statement=payload.user_statement,
        suspect_identifiers=payload.suspect_identifiers
    )
