from pydantic import BaseModel
from typing import List, Optional
import datetime

class TrajectoryStageInfo(BaseModel):
    stage_key: str
    stage_name: str
    order: int
    is_reached: bool
    is_current: bool
    milestone_summary: Optional[str] = None
    reached_at: Optional[datetime.datetime] = None
    evidence_id: Optional[str] = None

class EscalationReport(BaseModel):
    incident_id: str
    current_stage: str
    risk_level: str
    trajectory: List[TrajectoryStageInfo]
    why_it_escalated: str
    escalation_velocity: str  # Slow, Moderate, Accelerated
    key_drivers: List[str]
    disclaimer: str
