from sqlalchemy import Column, Float, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Employer(Base):
    """Employer profile model"""
    __tablename__ = "employers"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Foreign Key
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)

    # Basic Info
    full_name = Column(String(100), nullable=True)
    email = Column(String(100), nullable=True)
    phone_number = Column(String(20), nullable=True)

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
    district = Column(String(50), nullable=True)
    postal_code = Column(String(20), nullable=True)
    country = Column(String(50), nullable=True)

    # Company Logo
    logo_url = Column(String(255), nullable=True)

    # Trust Indicators
    is_verified = Column(Boolean, default=False)
    rating = Column(Float, default=0.0)
    total_jobs_posted = Column(Integer, default=0)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_active = Column(DateTime, default=datetime.utcnow, nullable=True)

    # Relationships
    user = relationship("User", back_populates="employer_profile")
    jobs = relationship("Job", back_populates="employer")

    def __repr__(self):
        return f"<Employer {self.full_name or self.company_name or self.user_id}>"

    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "full_name": self.full_name,
            "email": self.email,
            "phone_number": self.phone_number,
            "company_name": self.company_name,
            "company_description": self.company_description,
            "industry": self.industry,
            "company_size": self.company_size,
            "contact_email": self.contact_email,
            "contact_phone": self.contact_phone,
            "website": self.website,
            "address": self.address,
            "city": self.city,
            "district": self.district,
            "country": self.country,
            "logo_url": self.logo_url,
            "is_verified": self.is_verified,
            "rating": self.rating,
            "total_jobs_posted": self.total_jobs_posted,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
