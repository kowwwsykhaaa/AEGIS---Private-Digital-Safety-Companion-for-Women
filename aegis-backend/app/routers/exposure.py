from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.incident import Incident
from app.models.event import Event
from app.models.account import Account
from app.models.evidence import Evidence
from app.services.exposure_graph import exposure_engine

router = APIRouter(prefix="/exposure", tags=["Digital Exposure Graph"])

@router.get("/{incident_id}")
def get_digital_exposure_graph(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found.")

    events = db.query(Event).filter(Event.incident_id == incident_id).all()
    accounts = db.query(Account).filter(Account.incident_id == incident_id).all()
    evidence_items = db.query(Evidence).filter(Evidence.incident_id == incident_id).all()

    return exposure_engine.generate_graph(incident, events, accounts, evidence_items)

