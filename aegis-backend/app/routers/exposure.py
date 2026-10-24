from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.incident import Incident
from app.services.exposure_graph import exposure_engine

router = APIRouter(prefix="/exposure", tags=["Digital Exposure Graph"])

@router.get("/{incident_id}")
def get_digital_exposure_graph(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found.")

    return exposure_engine.get_default_graph(incident_id)
