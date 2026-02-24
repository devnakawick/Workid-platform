from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from app.models.application import ApplicationStatus

# ======= Application Create =======

class ApplicationCreate(BaseModel):
    """
    Schema for applying to a job
    """
    message: Optional[str] = Field(
        None,
        max_length=500,
        description="Message to employer (optional)"
    )
    proposed_rate: Optional[Decimal] = Field(
        None,
        gt=0,
        description="Your proposed rate if different from job budget"
    )
    available_from: Optional[datetime] = Field(
        None, 
        description="When can you start?"
    )

    class Config:
        extra = "forbid"
        json_schema_extra = {
            "example": {
                "message": "I have 5 years of plumbing experience in Colombo. I can fix your sink today.",
                "proposed_rate": 3000.00,
                "available_from": "2024-01-15T08:00:00"
            }
        }

# ======= Application Response =======

class WorkerBasicInfo(BaseModel):
    """Basic worker info to embed in application response"""
    id: int
    full_name: str
    city: str
    primary_skill: str
    experience_years: int
    daily_rate: Optional[Decimal]
    rating: float
    total_jobs_completed: int
    is_verified: bool

    class Config:
        from_attributes = True

class JobBasicInfo(BaseModel):
    """Basic job info to embed in application response"""
    id: int
    title: str
    category: str
    city: str
    budget: Decimal
    status: str

    class Config:
        from_attributes = True

class ApplicationResponse(BaseModel):
    """
    Full application details
    """
    id: int
    job_id: int
    worker_id: int

    message: Optional[str]
    proposed_rate: Optional[Decimal]
    available_from: Optional[datetime]

    status: ApplicationStatus
    reviewed_at: Optional[datetime]
    rejection_reason: Optional[str]

    applied_at: datetime

    # Embed related info
    worker: Optional[WorkerBasicInfo] = None
    job: Optional[JobBasicInfo] = None

    class Config:
        from_attributes = True

class ApplicationListResponse(BaseModel):
    """Simplified application for list views"""
    id: int
    job_id: int
    worker_id: int
    status: ApplicationStatus
    proposed_rate: Optional[Decimal]
    applied_at: datetime
    job: Optional[JobBasicInfo] = None

    class Config:
        from_attributes = True