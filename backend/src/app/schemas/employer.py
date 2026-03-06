from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID

# ======= Employer Profile Schemas =======

class EmployerProfileCreate(BaseModel):
    """
    Schema for creating employer profile
    """
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr =Field(..., description="Employer email address")

    # Location
    address: str = Field(..., min_length=10, max_length=500, description="Employer address")
    city: str = Field(..., min_length=2, description="City")
    district: str = Field(..., min_length=2, description="District")
    postal_code: Optional[str] = Field(None, max_length=10)

    class Config:
        json_schema_extra = {
            "example": {
                "full_name": "John Doe",
                "email": "john.doe@example.com",
                "address": "123 Main Street",
                "city": "Dehiwala",
                "district": "Colombo",
                "postal_code": ""
            }
        }

class EmployerProfileUpdate(BaseModel):
    """
    Schema for updating employer profile
    """
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    address: Optional[str] = Field(None, max_length=500)
    city: Optional[str] = None
    district: Optional[str] = None
    postal_code: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "full_name": "Rohan Silva", 
                "postal_code": "10350"
            }
        }

class EmployerProfileResponse(BaseModel):
    """
    Schema for employer profile response
    """
    id: int
    user_id: UUID

    full_name: str
    email: str
    phone_number: str

    address: Optional[str]
    city: Optional[str]
    district: Optional[str]
    postal_code: Optional[str]

    is_verified: bool
    rating: float
    total_jobs_posted: int

    created_at: datetime
    updated_at: datetime
    last_active: datetime

    class Config:
        from_attributes = True

class EmployerStatsResponse(BaseModel):
    """
    Schema for employer dashboard stats
    """
    total_jobs_posted: int
    active_jobs: int
    completed_jobs: int
    total_applications: int
    pending_applications: int
    rating: float
    is_verified: bool
    
    class Config:
        json_schema_extra = {
            "example": {
                "total_jobs_posted": 12,
                "active_jobs": 3,
                "completed_jobs": 9,
                "total_applications": 45,
                "pending_applications": 8,
                "rating": 4.2,
                "is_verified": True
            }
        }