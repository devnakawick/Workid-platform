from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base

class Employer(Base):
    """Employer profile model"""
    __tablename__ = "employers"
<<<<<<< HEAD
    
    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Foreign Key
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    
    # Company Information
    company_name = Column(String(100), nullable=True)
    company_description = Column(Text, nullable=True)
    industry = Column(String(50), nullable=True)
    company_size = Column(String(20), nullable=True)  # small, medium, large
    
    # Contact Information
    contact_email = Column(String(100), nullable=True)
    contact_phone = Column(String(20), nullable=True)
    website = Column(String(100), nullable=True)
    
    # Address
    address = Column(Text, nullable=True)
    city = Column(String(50), nullable=True)
    country = Column(String(50), nullable=True)
    
    # Company Logo
    logo_url = Column(String(255), nullable=True)
    
    # Verification
    is_verified = Column(String(10), default="pending")  # pending, verified, rejected
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
=======

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)

    # Basic Info
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    phone_number = Column(String, nullable=False)

    # Contact & Location
    address = Column(Text)
    city = Column(String, nullable=False, index=True)
    district = Column(String, nullable=False, index=True)
    postal_code = Column(String)

    # Trust Indicators
    is_verified = Column(Boolean, default=False)
    rating = Column(Float, default=0.0)
    total_jobs_posted = Column(Integer, default=0)

    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_active = Column(DateTime, default=datetime.utcnow)

>>>>>>> 1fb5c6ad02bb1f37949f4eb99509eaf2d133737f
    # Relationships
    user = relationship("User", back_populates="employer_profile")
    jobs = relationship("Job", back_populates="employer")
    
    def __repr__(self):
        return f"<Employer {self.company_name or self.user_id}>"
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "company_name": self.company_name,
            "company_description": self.company_description,
            "industry": self.industry,
            "company_size": self.company_size,
            "contact_email": self.contact_email,
            "contact_phone": self.contact_phone,
            "website": self.website,
            "address": self.address,
            "city": self.city,
            "country": self.country,
            "logo_url": self.logo_url,
            "is_verified": self.is_verified,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
