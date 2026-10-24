import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class ChangeEvent(Base):
    __tablename__ = "change_events"

    id = Column(String(64), primary_key=True, index=True)
    incident_id = Column(String(64), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    event_id = Column(String(64), nullable=True)
    before_stage = Column(String(50), nullable=False)
    after_stage = Column(String(50), nullable=False)
    before_risk = Column(String(50), nullable=False)
    after_risk = Column(String(50), nullable=False)
    delta_summary = Column(Text, nullable=False)
    reasons_json = Column(Text, nullable=False)  # JSON serialized list of reason strings
    new_signals_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    incident = relationship("Incident", back_populates="change_events")
