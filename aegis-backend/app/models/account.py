import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Account(Base):
    __tablename__ = "accounts"

    id = Column(String(64), primary_key=True, index=True)
    incident_id = Column(String(64), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    platform = Column(String(100), default="Instagram")
    handle = Column(String(100), nullable=False)
    display_name = Column(String(200), nullable=True)
    profile_url = Column(String(512), nullable=True)
    notes = Column(Text, nullable=True)
    first_seen = Column(DateTime, default=datetime.datetime.utcnow)
    last_seen = Column(DateTime, default=datetime.datetime.utcnow)

    incident = relationship("Incident", back_populates="accounts")
