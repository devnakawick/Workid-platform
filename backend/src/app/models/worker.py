from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Enum, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum
from app.database import Base

class SkillCategory(str, enum.Enum):
    PLUMBING = "plumbing"
    ELECTRICAL = "electrical"
    CARPENTRY = "carpentry"
    MASONRY = "masonry"
    PAINTING = "painting"
    GARDENING = "gardening"
    CLEANING = "cleaning"
    DRIVING = "driving"
    LABOR = "general_labor"
    OTHER = "other"

class DocumentType(str, enum.Enum):
    NIC = "nic"
    LICENSE = "license"
    PHOTO = "photo"
    OTHER = "other"

class DocumentStatus(str, enum.Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"

class Worker(Base):
    __tablename__ = "workers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)

    # Basic Info
    full_name = Column(String, nullable=False)
    nic_number = Column(String, unique=True, nullable=False)
    date_of_birth = Column(DateTime)

    # Contact & Location
    address = Column(Text)
    city = Column(String, nullable=False, index=True)
    district = Column(String, nullable=False, index=True)
    postal_code = Column(String)

    # Work Details
    primary_skill = Column(Enum(SkillCategory, name="skill_category"), nullable=False)
    other_skills = Column(JSON, default=list)  
    experience_years = Column(Integer, default=0)

    # Payment
    daily_rate = Column(Float)
    hourly_rate = Column(Float, nullable=True)

    # Profile
    bio = Column(Text)
    profile_photo = Column(String)

    # Trust & Verification
    is_verified = Column(Boolean, default=False)
    is_available = Column(Boolean, default=True)
    rating = Column(Float, default=0.0)
    total_jobs_completed = Column(Integer, default=0)

    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_active = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="worker_profile")
    documents = relationship("WorkerDocument", back_populates="worker", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="worker")

class WorkerDocument(Base): 
    """
    Documents uploaded by workers for verification
    """
    __tablename__ = "worker_documents"

    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, ForeignKey("workers.id"), nullable=False)

    document_type = Column(Enum(DocumentType, name="document_type"), nullable=False)
    file_url = Column(String, nullable=False)
    file_name = Column(String)

    # Verification
    status = Column(Enum(DocumentStatus, name="document_status"), default=DocumentStatus.PENDING)
    verified_at = Column(DateTime)
    verified_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    rejection_reason = Column(Text)

    uploaded_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    worker = relationship("Worker", back_populates="documents")