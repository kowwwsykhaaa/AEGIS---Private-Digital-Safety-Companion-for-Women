import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String(64), primary_key=True, index=True)
    incident_id = Column(String(64), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    action_type = Column(String(100), default="preserve")  # preserve, report_platform, cybercrime_portal, privacy_lockdown
    description = Column(Text, nullable=False)
    priority = Column(String(50), default="high")  # critical, high, medium, standard
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    incident = relationship("Incident", back_populates="recommendations")

class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(String(64), primary_key=True, index=True)
    incident_id = Column(String(64), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    action = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    incident = relationship("Incident", back_populates="audit_events")

class ComplaintReport(Base):
    __tablename__ = "complaint_reports"

    id = Column(String(64), primary_key=True, index=True)
    incident_id = Column(String(64), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)
    victim_statement = Column(Text, nullable=True)
    suspect_identifiers = Column(Text, nullable=True)
    narrative_text = Column(Text, nullable=False)
    legal_provisions = Column(Text, nullable=True)
    evidence_index_json = Column(Text, nullable=False)
