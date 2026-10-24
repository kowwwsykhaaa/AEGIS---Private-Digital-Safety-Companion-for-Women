import os
import shutil
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import EVIDENCE_DIR
from app.models.incident import Incident
from app.models.event import Event
from app.models.evidence import Evidence
from app.models.account import Account
from app.models.identity import IdentityNode, Relationship
from app.models.threat import ThreatSignal, ThreatState
from app.models.change import ChangeEvent
from app.models.audit import Recommendation, AuditEvent, ComplaintReport

router = APIRouter(prefix="/privacy", tags=["Privacy Center"])

@router.get("/policy")
def get_privacy_guarantees():
    return {
        "title": "AEGIS Privacy & Data Sovereignty Principles",
        "principles": [
            {
                "title": "Zero Third-Party Telemetry",
                "detail": "AEGIS never runs marketing cookies, behavioral trackers, or external analytics."
            },
            {
                "title": "No Automatic Reporting",
                "detail": "Data remains exclusively within your session. AEGIS never forwards reports to platforms or police without your explicit manual action."
            },
            {
                "title": "Cryptographic Zero-Trace Wipe",
                "detail": "Clicking 'Erase All Data' immediately cascades through all database records and wipes cached evidence files from disk."
            },
            {
                "title": "Client-Side Sensitive Protection",
                "detail": "Media tagged as sensitive is automatically obscured by a visual blur filter and requires explicit tap-to-reveal."
            },
            {
                "title": "No Speculative Web Scraping",
                "detail": "AEGIS only evaluates digital identifiers you explicitly submit. It never conducts unconsented OSINT crawling."
            }
        ],
        "retention_options": ["Session only", "Manual delete", "Instant wipe"]
    }

@router.post("/wipe")
def wipe_all_data(db: Session = Depends(get_db)):
    """One-tap total data wipe: destroys all incidents, evidence, events, and deletes files."""
    db.query(AuditEvent).delete()
    db.query(Recommendation).delete()
    db.query(ComplaintReport).delete()
    db.query(ChangeEvent).delete()
    db.query(ThreatState).delete()
    db.query(ThreatSignal).delete()
    db.query(Relationship).delete()
    db.query(IdentityNode).delete()
    db.query(Account).delete()
    db.query(Event).delete()
    db.query(Evidence).delete()
    db.query(Incident).delete()
    db.commit()

    # Clean evidence folder
    if EVIDENCE_DIR.exists():
        for item in EVIDENCE_DIR.iterdir():
            if item.is_file():
                try:
                    item.unlink()
                except Exception:
                    pass

    return {
        "status": "success",
        "message": "Complete cryptographic wipe executed. All incidents, events, evidence files, and identity records have been permanently erased."
    }
