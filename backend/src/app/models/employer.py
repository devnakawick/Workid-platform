from sqlalchemy import Column, Float, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base

class Employer(Base):
    """
    Employer profile 
    """
    __tablename__ = "employers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)

    # Basic Info
    full_name = Column(String, nullable=False)
    is_business = Column(Boolean, default=False)

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

    # Relationships
    user = relationship("User", back_populates="employer_profile")
    jobs = relationship("Job", back_populates="employer", cascade="all, delete-orphan")