from sqlalchemy import Column, String, Text, Float, Integer, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum
from app.database import Base

class JobStatus(str, enum.Enum):
    """Job status enumeration"""
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Job(Base):
    """Job model"""
    __tablename__ = "jobs"
    
    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Foreign Key
    employer_id = Column(UUID(as_uuid=True), ForeignKey("employers.id"), nullable=False)
    
    # Job Details
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=True)
    skills_required = Column(Text, nullable=True)  # JSON string of required skills
    
    # Location
    location = Column(String(100), nullable=True)
    is_remote = Column(String(10), default="no")  # yes, no, hybrid
    
    # Compensation
    budget_min = Column(Float, nullable=True)
    budget_max = Column(Float, nullable=True)
    payment_type = Column(String(20), default="fixed")  # fixed, hourly
    
    # Duration
    duration = Column(String(50), nullable=True)  # e.g., "2 weeks", "1 month"
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    
    # Status
    status = Column(SQLEnum(JobStatus), default=JobStatus.OPEN)
    
    # Visibility
    is_featured = Column(String(10), default="no")  # yes, no
    is_urgent = Column(String(10), default="no")  # yes, no
    
    # Application Settings
    max_applications = Column(Integer, nullable=True)
    application_deadline = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    employer = relationship("Employer", back_populates="jobs")
    applications = relationship("Application", back_populates="job")
    
    def __repr__(self):
        return f"<Job {self.title}>"
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": str(self.id),
            "employer_id": str(self.employer_id),
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "skills_required": self.skills_required,
            "location": self.location,
            "is_remote": self.is_remote,
            "budget_min": self.budget_min,
            "budget_max": self.budget_max,
            "payment_type": self.payment_type,
            "duration": self.duration,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "status": self.status.value,
            "is_featured": self.is_featured,
            "is_urgent": self.is_urgent,
            "max_applications": self.max_applications,
            "application_deadline": self.application_deadline.isoformat() if self.application_deadline else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
