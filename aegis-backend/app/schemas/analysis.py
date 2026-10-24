from pydantic import BaseModel
from typing import List, Optional

class AnalyzeInput(BaseModel):
    content: str
    content_type: str = "text"  # text, link, profile, note, email, phone
    source_platform: str = "Instagram"
    account_handle: Optional[str] = None
    incident_id: Optional[str] = None
    auto_add_to_case: bool = False

class DetectedSignal(BaseModel):
    signal_type: str
    severity: str
    rationale: str
    excerpt: Optional[str] = None

class AnalyzeResult(BaseModel):
    content_preview: str
    risk_level: str
    current_stage: str
    signals: List[DetectedSignal]
    primary_reason: str
    why_it_matters: str
    recommended_actions: List[str]
    is_sensitive: bool
    incident_id: Optional[str] = None
    event_id: Optional[str] = None
    evidence_id: Optional[str] = None
