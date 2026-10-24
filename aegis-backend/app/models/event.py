import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(String(64), primary_key=True, index=True)
    incident_id = Column(String(64), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    stage = Column(String(50), default="UNWANTED_CONTACT")
    summary = Column(String(255), nullable=False)
    raw_content = Column(Text, nullable=False)
    source_platform = Column(String(100), default="Instagram")
    account_handle = Column(String(100), nullable=True)
    evidence_id = Column(String(64), nullable=True)

    incident = relationship("Incident", back_populates="events")
    signals = relationship("ThreatSignal", back_populates="event", cascade="all, delete-orphan")
