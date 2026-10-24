from pydantic import BaseModel, ConfigDict
from typing import List, Optional
import datetime

class EventSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    incident_id: str
    timestamp: datetime.datetime
    stage: str
    summary: str
    raw_content: str
    source_platform: str
    account_handle: Optional[str] = None
    evidence_id: Optional[str] = None

class EvidenceSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    incident_id: str
    event_id: Optional[str] = None
    file_name: str
    file_path: str
    file_hash_sha256: str
    mime_type: str
    file_size_bytes: int
    source_platform: str
    captured_at: datetime.datetime
    is_sensitive: bool
    excerpt_text: Optional[str] = None
    notes: Optional[str] = None

class AccountSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    incident_id: str
    platform: str
    handle: str
    display_name: Optional[str] = None
    profile_url: Optional[str] = None
    notes: Optional[str] = None
    first_seen: datetime.datetime
    last_seen: datetime.datetime

class ThreatSignalSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    incident_id: str
    event_id: Optional[str] = None
    signal_type: str
    severity: str
    rationale: str
    excerpt: Optional[str] = None
    detected_at: datetime.datetime

class RecommendationSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    incident_id: str
    title: str
    action_type: str
    description: str
    priority: str
    is_completed: bool

class IncidentCreate(BaseModel):
    title: str
    description: Optional[str] = None

class IncidentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    title: str
    description: Optional[str] = None
    status: str
    current_stage: str
    risk_level: str
    created_at: datetime.datetime
    updated_at: datetime.datetime

class IncidentDetailResponse(IncidentResponse):
    events: List[EventSchema] = []
    evidence_items: List[EvidenceSchema] = []
    accounts: List[AccountSchema] = []
    threat_signals: List[ThreatSignalSchema] = []
    recommendations: List[RecommendationSchema] = []
