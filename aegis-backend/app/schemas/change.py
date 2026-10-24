from pydantic import BaseModel
from typing import List, Optional
import datetime

class ChangeComparisonResponse(BaseModel):
    incident_id: str
    event_id: Optional[str] = None
    before_stage: str
    after_stage: str
    before_risk: str
    after_risk: str
    is_escalated: bool
    new_threat_signals: List[str]
    new_exposure_elements: List[str]
    new_accounts_detected: List[str]
    delta_summary: str
    why_it_changed: str
    recommended_priority_action: str
    created_at: datetime.datetime
