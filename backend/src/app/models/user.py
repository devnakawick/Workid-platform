from sqlalchemy import Column, String, Boolean, DateTime, Enum as SQLEnum, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum
from app.database import Base

class UserType(str, enum.Enum):
    """User type enumeration"""
    WORKER = "worker"
    EMPLOYER = "employer"
    ADMIN = "admin"

class User(Base):
    """User model - handles authentication for all user types"""
    __tablename__ = "users"
    
    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Authentication
    phone_number = Column(String(15), unique=True, nullable=False, index=True)
    user_type = Column(SQLEnum(UserType), nullable=False)
    preferred_language = Column(String(5), default='en')  # 'en', 'si', 'ta'


    # Status
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    is_phone_verified = Column(Boolean, default=False)
    
    # OTP
    otp_code = Column(String(6), nullable=True)
    otp_created_at = Column(DateTime, nullable=True)
    otp_attempts = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    # Relationships (defined in other models)
    # worker_profile
    # employer_profile
    # wallet
    
    def __repr__(self):
        return f"<User {self.phone_number} ({self.user_type})>"
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": str(self.id),
            "phone_number": self.phone_number,
            "user_type": self.user_type.value,
            "is_verified": self.is_verified,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat(),
        }