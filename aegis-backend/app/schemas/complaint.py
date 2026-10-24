from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import datetime

class ComplaintDraftRequest(BaseModel):
    user_statement: Optional[str] = None
    suspect_identifiers: Optional[str] = None
    include_evidence_ids: Optional[List[str]] = None

class LegalSection(BaseModel):
    act: str
    section: str
    offense: str
    description: str

class ComplaintPackResponse(BaseModel):
    incident_id: str
    title: str
    generated_at: datetime.datetime
    case_summary: str
    user_statement: Optional[str] = None
    suspect_identifiers: Optional[str] = None
    chronological_timeline: List[Dict[str, Any]]
    evidence_index: List[Dict[str, Any]]
    threat_indicators: List[str]
    connection_signals: List[str]
    legal_provisions: List[LegalSection]
    submission_instructions: Dict[str, str]
    formatted_dossier_text: str
    disclaimer: str
