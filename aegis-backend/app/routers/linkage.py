from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.incident import Incident
from app.schemas.linkage import ThreatLinkageResponse
from app.services.linkage_engine import linkage_engine

router = APIRouter(prefix="/linkage", tags=["Threat Linkage"])

@router.get("/{incident_id}", response_model=ThreatLinkageResponse)
def get_threat_linkage(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found.")

    accounts = incident.accounts
    return linkage_engine.evaluate_accounts(incident_id, accounts)
