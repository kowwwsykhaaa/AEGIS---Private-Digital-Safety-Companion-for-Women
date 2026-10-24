from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.incident import Incident
from app.models.evidence import Evidence
from app.schemas.incident import EvidenceSchema
from app.services.evidence_service import evidence_service

router = APIRouter(prefix="/evidence", tags=["Evidence Vault"])

@router.get("/{incident_id}", response_model=List[EvidenceSchema])
def list_incident_evidence(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found.")
    return incident.evidence_items

@router.get("/item/{evidence_id}/integrity")
def get_evidence_integrity_record(evidence_id: str, db: Session = Depends(get_db)):
    evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence item not found.")
    return evidence_service.format_integrity_record(evidence)

@router.post("/{incident_id}", response_model=EvidenceSchema)
def add_text_evidence(
    incident_id: str,
    text_content: str = Form(...),
    source_platform: str = Form("Direct Input"),
    is_sensitive: bool = Form(False),
    notes: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found.")

    evidence = evidence_service.store_text_evidence(
        incident_id=incident_id,
        text_content=text_content,
        source_platform=source_platform,
        is_sensitive=is_sensitive,
        notes=notes
    )
    db.add(evidence)
    db.commit()
    db.refresh(evidence)
    return evidence

@router.delete("/item/{evidence_id}")
def delete_evidence_item(evidence_id: str, db: Session = Depends(get_db)):
    evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence item not found.")
    db.delete(evidence)
    db.commit()
    return {"status": "success", "message": f"Evidence {evidence_id} deleted."}
