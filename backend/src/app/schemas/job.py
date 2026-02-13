from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime
from decimal import Decimal
from app.models.job import JobStatus, UrgencyLevel, PaymentType

# ======= Job Create / Update =======

class JobCreate(BaseModel):
    """
    Schema for creating a new job posting
    """
    # Required fields
    title: str = Field(
        ...,
        min_length=10,
        max_length=200,
        description="Clear job title"
    )
    description: str = Field(
        ...,
        min_length=20,
        max_length=2000,
        description="Detailed job description"
    )
    category: str = Field(
        ...,
        description="Job category: plumbing, electrical, carpentry, etc."
    )

    # Location (REQUIRED)
    location: str = Field(
        ...,
        min_length=5,
        max_length=500,
        description="Exact location/address"
    )
    city: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="City"
    )
    district: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="District"
    )
    latitude: Optional[float] = Field(
        None,
        ge=-90,
        le=90,
        description="GPS latitude (optional)"
    )
    longitude: Optional[float] = Field(
        None,
        ge=-180,
        le=180,
        description="GPS longitude (optional)"
    )

    # Job Details
    estimated_duration_hours: Optional[int] = Field(
        None, 
        ge=1,
        le=240,
        description="Estimated hours to complete"
    )
    start_date: Optional[datetime] = Field(
        None,
        description="UTC datetime"
    )
    urgency: UrgencyLevel = Field(
        default=UrgencyLevel.MEDIUM,
        description="How urgent is this job?"
    )

    # Payment
    budget: Decimal = Field(
        ...,
        gt=0,
        description="Total budget in Rs."
    )
    payment_type: PaymentType = Field(
        default=PaymentType.FIXED,
        description="fixed, daily, or negotiable"
    )

    @field_validator('category')
    @classmethod
    def validate_category(cls, v):
        allowed = [
            "plumbing", "electrical", "carpentry", 
            "masonry", "painting", "gardening",
            "cleaning", "driving", "general_labor", "other"
        ]
        if v.lower() not in allowed:
            raise ValueError(f"category must be one of: {allowed}")
        return v.lower()
    
    class Config:
        extra = "forbid"
        json_schema_extra = {
            "example": {
                "title": "Need plumber to fix kitchen sink", 
                "description": "My kitchen sink has been leaking for 2 days. Need someone experienced to fix it. Preferably today or tomorrow.",
                "category": "plumbing",
                "location": "45 Galle Road, Mount Lavinia",
                "city": "Dehiwala",
                "district": "Colombo",
                "estimated_duration_hours": 2,
                "urgency": "high",
                "budget": 3500.00,
                "payment_type": "fixed"
            }
        }

class JobUpdate(BaseModel):
    """
    Schema for updating a job
    """
    title: Optional[str] = Field(None, min_length=10, max_length=200)
    description: Optional[str] = Field(None, min_length=20, max_length=2000)
    category: Optional[str] = None

    location: Optional[str] = Field(None, min_length=5, max_length=500)
    city: Optional[str] = Field(None, min_length=2, max_length=100)
    district: Optional[str] = Field(None, min_length=2, max_length=100)
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)

    estimated_duration_hours: Optional[int] = Field(None, ge=1, le=240)
    start_date: Optional[datetime] = None
    urgency: Optional[UrgencyLevel] = None

    budget: Optional[Decimal] = Field(None, gt=0)
    payment_type: Optional[PaymentType] = None

    @field_validator('category')
    @classmethod
    def validate_category(cls, v):
        if v is None:
            return v
        allowed = [
            "plumbing", "electrical", "carpentry", 
            "masonry", "painting", "gardening",
            "cleaning", "driving", "general_labor", "other"
        ]
        if v.lower() not in allowed:
            raise ValueError(f"category must be one of: {allowed}")
        return v.lower()

    class Config:
        extra = "forbid"
        json_schema_extra = {
            "example": {
                "budget": 4000.00,
                "urgency": "high",
                "description": "Updated: Need experienced plumber. Emergency."
            }
        }

class JobStatusUpdate(BaseModel):
    """
    Schema for changing job status
    """
    status: JobStatus = Field(
        ...,
        description="New status: open, in_progress, completed, cancelled"
    )

    class Config:
        extra = "forbid"
        json_schema_extra = {
            "example": {
                "status": "completed"
            }
        }

# ======= Job Response =======

class EmployerBasicInfo(BaseModel):
    """Basic employer info to embed in job response"""
    id: int
    full_name: str
    city: str
    rating: float
    is_verified: bool
    total_job_posted: int

    class Config:
        from_attributes = True 

class JobResponse(BaseModel):
    """
    Full job details
    Used when viewing a single job
    """

    id: int
    employer_id: int

    title: str
    description: str
    category: str

    location: str
    city: str
    district: str
    latitude: Optional[float]
    longitude: Optional[float]

    estimated_duration_hours: Optional[int]
    start_date: Optional[datetime]
    urgency: UrgencyLevel

    budget: Decimal
    payment_type: PaymentType

    status: JobStatus
    views_count: int
    applications_count: int

    created_at: datetime
    updated_at: datetime
    expires_at: Optional[datetime]

    # Embed employer info
    employer: Optional[EmployerBasicInfo] = None

    class Config:
        extra = "forbid"
        from_attributes = True 

class JobListResponse(BaseModel):
    """
    Simplified job info for list views
    """
    id: int
    title: str
    category: str
    city: str
    district: str
    urgency: UrgencyLevel
    budget: Decimal
    payment_type: PaymentType
    status: JobStatus
    applications_count: int
    created_at: datetime
    expires_at: Optional[datetime]

    class Config:
        extra = "forbid"
        from_attributes = True 

class JobSearchResponse(BaseModel):
    """
    Response for job search endpoint
    """
    total: int
    page: int
    page_size: int
    jobs: List[JobListResponse]