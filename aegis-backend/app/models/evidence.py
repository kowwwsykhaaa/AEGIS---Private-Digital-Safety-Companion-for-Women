import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String(64), primary_key=True, index=True)
    incident_id = Column(String(64), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    event_id = Column(String(64), nullable=True)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    file_hash_sha256 = Column(String(64), nullable=False, index=True)
    mime_type = Column(String(100), default="text/plain")
    file_size_bytes = Column(Integer, default=0)
    source_platform = Column(String(100), default="Direct Input")
    captured_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_sensitive = Column(Boolean, default=False)
    excerpt_text = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)

    incident = relationship("Incident", back_populates="evidence_items")
