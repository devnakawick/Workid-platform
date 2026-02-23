from sqlalchemy import Column, String, Text, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum
from app.database import Base

class ApplicationStatus(str, enum.Enum):
    """Application status enumeration"""
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"

class Application(Base):
    """Job application model"""
    __tablename__ = "applications"
    
    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Foreign Keys
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=False)
    worker_id = Column(UUID(as_uuid=True), ForeignKey("workers.id"), nullable=False)
    
    # Application Details
    cover_letter = Column(Text, nullable=True)
    proposed_rate = Column(Float, nullable=True)
    proposed_duration = Column(String(50), nullable=True)
    availability = Column(Text, nullable=True)
    
    # Status
    status = Column(SQLEnum(ApplicationStatus), default=ApplicationStatus.PENDING)
    
    # Employer Feedback
    employer_notes = Column(Text, nullable=True)
    
    # Timestamps
    applied_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    responded_at = Column(DateTime, nullable=True)
    
    # Relationships
    job = relationship("Job", back_populates="applications")
    worker = relationship("Worker", back_populates="applications")
    
    def __repr__(self):
        return f"<Application {self.worker_id} -> {self.job_id}>"
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": str(self.id),
            "job_id": str(self.job_id),
            "worker_id": str(self.worker_id),
            "cover_letter": self.cover_letter,
            "proposed_rate": self.proposed_rate,
            "proposed_duration": self.proposed_duration,
            "availability": self.availability,
            "status": self.status.value,
            "employer_notes": self.employer_notes,
            "applied_at": self.applied_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "responded_at": self.responded_at.isoformat() if self.responded_at else None,
        }
