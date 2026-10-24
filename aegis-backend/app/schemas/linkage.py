from pydantic import BaseModel
from typing import List, Optional

class LinkageMetric(BaseModel):
    name: str
    level: str  # High, Moderate, Low
    score: float
    description: str

class PotentialConnection(BaseModel):
    account_a: str
    account_b: str
    verdict: str  # e.g., "Potential connection detected"
    confidence_level: str  # High, Moderate, Low
    metrics: List[LinkageMetric]
    shared_signals: List[str]
    plain_explanation: str

class ThreatLinkageResponse(BaseModel):
    incident_id: str
    accounts_evaluated: int
    connections_found: List[PotentialConnection]
    disclaimer: str = "AEGIS detects explainable digital similarities only. This does not constitute legal or forensic attribution."
