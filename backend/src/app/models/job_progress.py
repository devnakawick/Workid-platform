from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base


class JobProgressStatus(str, enum.Enum):
    """Job progress status values"""
    ACCEPTED = "accepted"
    WORKER_TRAVELING = "worker_traveling"
    IN_PROGRESS = "in_progress"
    WAITING_PAYMENT = "waiting_payment"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class JobProgress(Base):
    """
    Tracks the real-time progress of an active job
    Created when employer accepts a worker's application
    """
    __tablename__ = "job_progress"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False, unique=True)
    worker_id = Column(Integer, ForeignKey("workers.id"), nullable=False)
    
    # Job status tracking
    status = Column(
        SQLEnum(JobProgressStatus),
        default=JobProgressStatus.ACCEPTED,
        nullable=False,
        index=True
    )
    
    # Timestamps for each stage
    accepted_at = Column(DateTime, default=datetime.utcnow)
    started_travel_at = Column(DateTime, nullable=True)
    started_job_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    cancelled_at = Column(DateTime, nullable=True)
    
    # Location tracking
    location_sharing_enabled = Column(Boolean, default=False)
    worker_current_latitude = Column(Float, nullable=True)
    worker_current_longitude = Column(Float, nullable=True)
    last_location_update = Column(DateTime, nullable=True)
    
    # Employer location (stored when job starts)
    employer_latitude = Column(Float, nullable=True)
    employer_longitude = Column(Float, nullable=True)
    
    # Additional metadata
    scheduled_time = Column(DateTime, nullable=True)
    estimated_duration_minutes = Column(Integer, nullable=True)
    actual_duration_minutes = Column(Integer, nullable=True)
    
    # Notes and updates
    worker_notes = Column(String, nullable=True)
    employer_notes = Column(String, nullable=True)
    
    # Relationships
    job = relationship("Job", back_populates="progress")
    worker = relationship("Worker", back_populates="active_jobs")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<JobProgress(id={self.id}, job_id={self.job_id}, status={self.status})>"

    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            "id": self.id,
            "job_id": self.job_id,
            "worker_id": self.worker_id,
            "status": self.status.value,
            "accepted_at": self.accepted_at.isoformat() if self.accepted_at else None,
            "started_travel_at": self.started_travel_at.isoformat() if self.started_travel_at else None,
            "started_job_at": self.started_job_at.isoformat() if self.started_job_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "location_sharing_enabled": self.location_sharing_enabled,
            "scheduled_time": self.scheduled_time.isoformat() if self.scheduled_time else None,
            "estimated_duration_minutes": self.estimated_duration_minutes,
            "actual_duration_minutes": self.actual_duration_minutes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def to_dict_with_location(self):
        """Include location data in response"""
        data = self.to_dict()
        data["worker_location"] = {
            "latitude": self.worker_current_latitude,
            "longitude": self.worker_current_longitude,
            "last_update": self.last_location_update.isoformat() if self.last_location_update else None
        } if self.worker_current_latitude and self.worker_current_longitude else None
        
        data["employer_location"] = {
            "latitude": self.employer_latitude,
            "longitude": self.employer_longitude
        } if self.employer_latitude and self.employer_longitude else None
        
        return data
