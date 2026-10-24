import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), default="active")  # active, resolved, archived
    current_stage = Column(String(50), default="UNWANTED_CONTACT")
    risk_level = Column(String(50), default="LOW")  # LOW, MODERATE, HIGH, CRITICAL
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    events = relationship("Event", back_populates="incident", cascade="all, delete-orphan", order_by="Event.timestamp")
    evidence_items = relationship("Evidence", back_populates="incident", cascade="all, delete-orphan")
    accounts = relationship("Account", back_populates="incident", cascade="all, delete-orphan")
    identity_nodes = relationship("IdentityNode", back_populates="incident", cascade="all, delete-orphan")
    threat_signals = relationship("ThreatSignal", back_populates="incident", cascade="all, delete-orphan")
    change_events = relationship("ChangeEvent", back_populates="incident", cascade="all, delete-orphan", order_by="ChangeEvent.created_at.desc()")
    recommendations = relationship("Recommendation", back_populates="incident", cascade="all, delete-orphan")
    audit_events = relationship("AuditEvent", back_populates="incident", cascade="all, delete-orphan")
