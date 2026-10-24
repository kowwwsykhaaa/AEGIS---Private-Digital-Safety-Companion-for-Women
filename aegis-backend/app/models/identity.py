from sqlalchemy import Column, String, Integer, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database import Base

class IdentityNode(Base):
    __tablename__ = "identity_nodes"

    id = Column(String(64), primary_key=True, index=True)
    incident_id = Column(String(64), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    node_type = Column(String(50), nullable=False)  # root, platform, identifier, institution, location, contact
    label = Column(String(150), nullable=False)
    value = Column(String(255), nullable=False)
    exposure_level = Column(String(50), default="LOW")  # LOW, MODERATE, HIGH, EXPOSED

    incident = relationship("Incident", back_populates="identity_nodes")

class Relationship(Base):
    __tablename__ = "relationships"

    id = Column(String(64), primary_key=True, index=True)
    incident_id = Column(String(64), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    source_node_id = Column(String(64), nullable=False)
    target_node_id = Column(String(64), nullable=False)
    relationship_type = Column(String(100), default="connects_to")
    confidence = Column(Float, default=1.0)
