from sqlalchemy import Column, String, Text, Float, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base

class Worker(Base):
    """Worker profile model"""
    __tablename__ = "workers"
    
    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Foreign Key
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    
    # Personal Information
    full_name = Column(String(100), nullable=True)
    email = Column(String(100), nullable=True)
    city = Column(String(50), nullable=True)
    bio = Column(Text, nullable=True)
    skills = Column(Text, nullable=True)  # JSON string of skills
    
    # Professional Information
    hourly_rate = Column(Float, nullable=True)
    experience_years = Column(Integer, nullable=True)
    education = Column(Text, nullable=True)
    
    # Rating
    rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    
    # Profile Image
    profile_image_url = Column(String(255), nullable=True)
    
    # Status
    is_available = Column(String(10), default="yes")  # yes, no, busy
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="worker_profile")
    applications = relationship("Application", back_populates="worker")
    
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
