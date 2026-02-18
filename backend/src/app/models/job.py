from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Enum, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class JobStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class UrgencyLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class PaymentType(str, enum.Enum):
    FIXED = "fixed"
    HOURLY = "hourly"
    NEGOTIABLE = "negotiable"

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    employer_id = Column(Integer, ForeignKey("employers.id"), nullable=False)

    # Job Details
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False, index=True)

    # Location
    location = Column(Text, nullable=False)
    city = Column(String, nullable=False, index=True)
    district = Column(String, nullable=False, index=True)
    latitude = Column(Float)
    longitude = Column(Float)

    # Duration
    estimated_duration_hours = Column(Integer)
    start_date = Column(DateTime)
    urgency = Column(Enum(UrgencyLevel, name="urgency_level"), default=UrgencyLevel.MEDIUM)

    # Payment
    budget = Column(Float, nullable=False)
    payment_type = Column(Enum(PaymentType), default=PaymentType.FIXED)

    # Status
    status = Column(Enum(JobStatus, name="job_status"), default=JobStatus.OPEN, index=True)

    # Engagement
    views_count = Column(Integer, default=0)
    applications_count = Column(Integer, default=0)

    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expires_at = Column(DateTime)

    # Relationships
    employer = relationship("Employer", back_populates="jobs")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")