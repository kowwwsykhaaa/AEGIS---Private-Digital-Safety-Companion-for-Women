import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class ThreatSignal(Base):
    __tablename__ = "threat_signals"

    id = Column(String(64), primary_key=True, index=True)
    incident_id = Column(String(64), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    event_id = Column(String(64), ForeignKey("events.id", ondelete="CASCADE"), nullable=True)
    signal_type = Column(String(100), nullable=False)  # coercion, intimidation, persistence, pii_exposure, etc.
    severity = Column(String(50), default="MODERATE")  # LOW, MODERATE, HIGH, CRITICAL
    rationale = Column(Text, nullable=False)
    excerpt = Column(Text, nullable=True)
    detected_at = Column(DateTime, default=datetime.datetime.utcnow)

    incident = relationship("Incident", back_populates="threat_signals")
    event = relationship("Event", back_populates="signals")

class ThreatState(Base):
    __tablename__ = "threat_states"

    id = Column(String(64), primary_key=True, index=True)
    incident_id = Column(String(64), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    stage = Column(String(50), nullable=False)
    risk_level = Column(String(50), nullable=False)
    why_summary = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
