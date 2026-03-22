from sqlalchemy import Column, String, Text, Float, Integer, DateTime, ForeignKey, Enum as SQLEnum, JSON, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base
from backend.src.app.schemas.worker import SkillCategory

class SkillCategory(str, enum.Enum):
    """Skill category enumeration"""
    PLUMBING = "plumbing"
    ELECTRICAL = "electrical"
    CARPENTRY = "carpentry"
    MASONRY = "masonry"
    PAINTING = "painting"
    GARDENING = "gardening"
    CLEANING = "cleaning"
    DRIVING = "driving"
    GENERAL_LABOR = "general_labor"
    OTHER = "other"

class DocumentType(str, enum.Enum):
    """Document type enumeration"""
    NATIONAL_ID = "national_id"
    PASSPORT = "passport"
    DRIVING_LICENSE = "driving_license"
    PROFESSIONAL_CERTIFICATE = "professional_certificate"
    EDUCATION_CERTIFICATE = "education_certificate"
    OTHER = "other"

class DocumentStatus(str, enum.Enum):
    """Document status enumeration"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXPIRED = "expired"

class Worker(Base):
    """Worker profile model"""
    __tablename__ = "workers"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Key
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    
    # Personal Information
    full_name = Column(String(100), nullable=True)
    email = Column(String(100), nullable=True)
    nic_number = Column(String, unique=True, nullable=False)
    date_of_birth = Column(DateTime)
    phone_number = Column(String, nullable=False)  
    
    # Contact & Location
    address = Column(Text)
    city = Column(String(50), nullable=True)
    district = Column(String, nullable=False, index=True)
    postal_code = Column(String)
    
    bio = Column(Text, nullable=True)
    skills = Column(Text, nullable=True)  # JSON string of skills
    
    # Professional Information
    primary_skill = Column(SQLEnum(SkillCategory, name="skill_category"), nullable=False)
    other_skills = Column(JSON, default=list)  
    experience_years = Column(Integer, default=0)

    # Payment
    daily_rate = Column(Float)
    hourly_rate = Column(Float, nullable=True)
    education = Column(Text, nullable=True)
    
    # Rating
    rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    total_jobs_completed = Column(Integer, default=0)
    
    # Profile Image
    profile_image_url = Column(String(255), nullable=True)
    
    # Status
    is_available = Column(Boolean, default=True)  # True, False
    is_verified = Column(Boolean, default=False)  # True, False
    last_active = Column(DateTime, nullable=True)
    
    # Additional fields for schema compatibility
    profile_photo = Column(String(255), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="worker_profile")
    applications = relationship("Application", back_populates="worker")
    documents = relationship("WorkerDocument", back_populates="worker", cascade="all, delete-orphan")
    active_jobs = relationship("JobProgress", back_populates="worker")
    
    def __repr__(self):
        return f"<Worker {self.full_name or self.user_id}>"
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "full_name": self.full_name,
            "email": self.email,
            "city": self.city,
            "bio": self.bio,
            "skills": self.skills,
            "hourly_rate": self.hourly_rate,
            "experience_years": self.experience_years,
            "education": self.education,
            "rating": self.rating,
            "total_reviews": self.total_reviews,
            "profile_image_url": self.profile_image_url,
            "is_available": self.is_available,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

class WorkerDocument(Base):
    """Worker document model for verification"""
    __tablename__ = "worker_documents"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Keys
    worker_id = Column(Integer, ForeignKey("workers.id"), nullable=False)
    
    # Document Information
    document_type = Column(SQLEnum(DocumentType), nullable=False)
    document_number = Column(String(100), nullable=True)
    issue_date = Column(DateTime, nullable=True)
    expiry_date = Column(DateTime, nullable=True)
    
    # File Information
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=True)
    mime_type = Column(String(100), nullable=True)
    
    # Status
    status = Column(SQLEnum(DocumentStatus), default=DocumentStatus.PENDING)
    rejection_reason = Column(Text, nullable=True)
    verified_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    worker = relationship("Worker", back_populates="documents")
    verifier = relationship("User", foreign_keys=[verified_by])
    
    def __repr__(self):
        return f"<WorkerDocument {self.document_type} - {self.status}>"
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": str(self.id),
            "worker_id": str(self.worker_id),
            "document_type": self.document_type.value,
            "document_number": self.document_number,
            "issue_date": self.issue_date.isoformat() if self.issue_date else None,
            "expiry_date": self.expiry_date.isoformat() if self.expiry_date else None,
            "file_name": self.file_name,
            "file_path": self.file_path,
            "file_size": self.file_size,
            "mime_type": self.mime_type,
            "status": self.status.value,
            "rejection_reason": self.rejection_reason,
            "verified_by": str(self.verified_by) if self.verified_by else None,
            "verified_at": self.verified_at.isoformat() if self.verified_at else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
