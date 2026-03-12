
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import List, Optional
from datetime import datetime
import re

class SendOTPRequest(BaseModel):
    phone_number: str

    @field_validator('phone_number')
    @classmethod
    def validate_phone(cls, v):
        v = v.replace(' ', '').replace('-', '')

        if not v.isdigit():
            raise ValueError('Phone number must contain only digits')

        if not 10 <= len(v) <= 15:
            raise ValueError('Phone number must be between 10 and 15 digits')

        return v

class VerifyOTPRequest(BaseModel):
    """Request schema for verifying OTP"""
    phone_number: str = Field(..., min_length=9, max_length=15)
    otp: str = Field(..., min_length=4, max_length=6)

class SignupRequest(BaseModel):
    """Base signup request schema"""
    phone_number: str = Field(..., min_length=9, max_length=15)
    full_name: str = Field(..., min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if v:
            pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(pattern, v):
                raise ValueError('Invalid email format')
        return v

class WorkerSignupRequest(SignupRequest):
    """Worker signup request"""
    full_name: str
    email: Optional[str] = None
    phone_number: str
    password: str
    city: Optional[str] = None
    district: Optional[str] = None
    nic_number: str = Field(..., min_length=10, max_length=12)
    primary_skill: str = Field(..., description="Primary skill category")
    other_skills: Optional[List[str]] = []
    experience_years: Optional[int] = Field(0, ge=0)
    daily_rate: Optional[float] = Field(None, ge=0)
    hourly_rate: Optional[float] = Field(None, ge=0)
    bio: Optional[str] = None

class EmployerSignupRequest(SignupRequest):
    """Employer signup request"""
    full_name: str
    email: str
    phone_number: str
    password: str
    city: Optional[str] = None
    district: Optional[str] = None
    address: Optional[str] = None

class TokenResponse(BaseModel):
    """Token response schema"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user_id: str
    user_type: str
    expires_in: int

class UserResponse(BaseModel):
    """User response schema"""
    id: str
    phone_number: str
    user_type: str
    is_verified: bool
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True