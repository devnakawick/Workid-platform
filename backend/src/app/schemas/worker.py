from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import date, datetime
from uuid import UUID
from app.models.worker import SkillCategory, DocumentType, DocumentStatus

# ======= Worker Profile Schemas =======

class WorkerProfileCreate(BaseModel):
    """
    Schemas for creating a worker profile 
    """
    full_name: str = Field(..., min_length=3, max_length=100, description="Full name as on NIC")
    nic_number: str = Field(..., min_length=10, max_length=12, description="NIN number (old or new format)")
    date_of_birth: Optional[date] = Field(None, description="Date of birth")

    # Location 
    address: Optional[str] = Field(None, max_length=500)
    city: str = Field(..., min_length=2, description="City (e.g., Colombo, Galle)")
    district: str = Field(..., min_length=2, description="District (e.g., Western, Southern)")
    postal_code: Optional[str] = Field(None, max_length=10)

    # Skills
    primary_skill: SkillCategory = Field(..., description="Main skill")
    other_skills: List[str] = Field(default=[], description="Additional skills")
    experience_years: int = Field(default=0, ge=0, le=50, description="Year of experience")

    # Payment
    daily_rate: Optional[float] = Field(None, gt=0, description="Daily rate in Rs.")
    hourly_rate: Optional[float] = Field(None, gt=0, description="Hourly rate in Rs.")

    # Profile
    bio: Optional[str] = Field(None, max_length=500, description="Short bio/description")

    @field_validator('nic_number')
    @classmethod
    def validate_nic(cls, v):
        """Validate NIC format (basic check)"""
        v = v.strip()
        # Old NIC: 9 digits with V/X
        # New NIC: 12 digits
        if not (len(v) == 10 or len(v) == 12):
            raise ValueError('NIC must be 10 or 12 characters')
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "full_name": "Kasun Perera",
                "nic_number": "912345678V",
                "city": "Colombo",
                "district": "Western",
                "primary_skill": "plumbing",
                "other_skills": ["electrical", "carpentry"],
                "experience_years": 5,
                "daily_rate": 2500.00,
                "bio": "Experienced plumber in Colombo area. Available for emergency calls."
            }
        }

class WorkerProfileUpdate(BaseModel):
    """
    Schemas for updating worker profile
    All fields are optional 
    """
    full_name: Optional[str] = Field(None, min_length=3, max_length=100)
    address: Optional[str] = Field(None, max_length=500)
    city: Optional[str] = None
    district: Optional[str] = None
    postal_code: Optional[str] = None

    primary_skill: Optional[SkillCategory] = None
    other_skills: Optional[List[str]] = None
    experience_years: Optional[int] = Field(None, ge=0, le=50)

    daily_rate: Optional[float] = Field(None, gt=0)
    hourly_rate: Optional[float] = Field(None, gt=0)

    bio: Optional[str] = Field(None, max_length=500)

    class Config:
        json_schema_extra = {
            "example": {
                "daily_rate": 3000.00,
                "bio": "Updated bio with more experience",
                "other_skills": ["plumbing", "electrical", "tile work"]
            }
        }

class WorkerProfileResponse(BaseModel):
    """
    Schema for worker profile response
    """
    id: int
    user_id: UUID

    full_name: str
    nic_number: str
    date_of_birth: Optional[date]

    address: Optional[str]
    city: str
    district: str
    postal_code: Optional[str]

    primary_skill: SkillCategory
    other_skills: List[str]
    experience_years: int

    daily_rate: Optional[float]
    hourly_rate: Optional[float]

    bio: Optional[str]
    profile_photo: Optional[str]

    is_verified: bool
    is_available: bool
    rating: float
    total_jobs_completed: int

    created_at: datetime
    updated_at: datetime
    last_active: datetime

    class Config:
        from_attributes = True  # Allows Pydantic to read from SQLAlchemy models

class WorkerAvailabilityUpdate(BaseModel):
    """
    Schemas for toggling availability
    """
    is_available: bool = Field(..., description="True = looking for work, False = not available")

    class Config:
        json_schema_extra = {
            "example": {
                "is_available": True
            }
        }

# ======= Document Schemas =======

class DocumentUploadResponse(BaseModel):
    """
    Schemas for document upload response
    """
    id: int
    worker_id: UUID
    document_type: DocumentType
    file_name: str
    file_url: str
    status: DocumentStatus
    uploaded_at: datetime

    class Config:
        from_attributes = True

class WorkerStatsResponse(BaseModel):
    """
    Schemas for worker dashboard stats
    """
    total_jobs_completed: int
    rating: float
    total_applications: int
    pending_applications: int
    accepted_applications: int
    is_verified: bool
    is_available: bool
    experience_years: int

    class Config:
        json_schema_extra = {
            "example": {
                "total_jobs_completed": 15, 
                "rating": 4.5,
                "total_applications": 25,
                "accepted_applications": 5,
                "is_verified": True,
                "is_available": True,
                "experience_years": 5
            }
        }

# ======= Worker Search Schemas =======

class WorkerSearchResponse(BaseModel):
    """
    Schemas for worker search results (for employer)
    """
    id: int
    full_name: str
    district: str
    primary_skill: SkillCategory
    other_skills: List[str]
    experience_years: int
    daily_rate: Optional[float]
    hourly_rate: Optional[float]
    rating: float
    total_jobs_completed: int
    is_verified: bool
    is_available: bool
    bio: Optional[str]
    profile_photo: Optional[str]

    class Config:
        from_attributes = True