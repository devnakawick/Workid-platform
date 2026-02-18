from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class ApplicationStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"

class Application(Base): 
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    worker_id = Column(Integer, ForeignKey("workers.id"), nullable=False)

    # Application Message
    message = Column(Text)
    proposed_rate = Column(Float)

    # Availability
    available_from = Column(DateTime)

    # Status
    status = Column(Enum(ApplicationStatus, name="application_status"), default=ApplicationStatus.PENDING, index=True)

    # Review
    reviewed_at = Column(DateTime)
    rejection_reason = Column(Text)

    # Metadata
    applied_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    job = relationship("Job", back_populates="applications")
    worker = relationship("Worker", back_populates="applications")