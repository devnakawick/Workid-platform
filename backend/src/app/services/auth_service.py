from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from typing import Optional, Tuple
import random
import logging

from app.models.user import User, UserType
#from app.models.worker import Worker
#from app.models.employer import Employer
#from app.models.wallet import Wallet
from app.schemas.auth import (
    SendOTPRequest, VerifyOTPRequest, 
    WorkerSignupRequest, EmployerSignupRequest
)
from app.utils.security import create_access_token, create_refresh_token
from app.services.sms_service import send_otp

logger = logging.getLogger(__name__)

class AuthService:
    """Authentication service"""
    
    OTP_EXPIRY_MINUTES = 5
    MAX_OTP_ATTEMPTS = 3
    
    def __init__(self, db: Session):
        self.db = db
    
    def generate_otp(self) -> str:
        """Generate 6-digit OTP"""
        return str(random.randint(100000, 999999))
    
    def send_otp(self, request: SendOTPRequest) -> dict:
        """Send OTP to phone number"""
        try:
            # Check if user exists
            user = self.db.query(User).filter(
                User.phone_number == request.phone_number
            ).first()
            
            # Generate OTP
            otp_code = self.generate_otp()
            
            # If user doesn't exist, create temporary user
            if not user:
                user = User(
                    phone_number=request.phone_number,
                    user_type=UserType.WORKER,  # Default, will be updated on signup
                    otp_code=otp_code,
                    otp_created_at=datetime.utcnow(),
                    otp_attempts=0
                )
                self.db.add(user)
            else:
                # Update existing user's OTP
                user.otp_code = otp_code
                user.otp_created_at = datetime.utcnow()
                user.otp_attempts = 0
            
            self.db.commit()
            
            # Send OTP via SMS
            sms_sent = send_otp_sms(request.phone_number, otp_code)
            
            if not sms_sent:
                logger.warning(f"Failed to send OTP to {request.phone_number}")
            
            logger.info(f"OTP generated for {request.phone_number}: {otp_code}")
            
            return {
                "message": "OTP sent successfully",
                "phone_number": request.phone_number,
                "expires_in": self.OTP_EXPIRY_MINUTES * 60  # seconds
            }
            
        except Exception as e:
            logger.error(f"Error sending OTP: {str(e)}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send OTP. Please try again."
            )
    
    def verify_otp(self, request: VerifyOTPRequest) -> dict:
        """Verify OTP and return tokens"""
        try:
            # Find user
            user = self.db.query(User).filter(
                User.phone_number == request.phone_number
            ).first()
            
            if not user or not user.otp_code:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid phone number or OTP not sent"
                )
            
            # Check OTP attempts
            if user.otp_attempts >= self.MAX_OTP_ATTEMPTS:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many failed attempts. Please request a new OTP."
                )
            
            # Check OTP expiry
            if user.otp_created_at:
                expiry_time = user.otp_created_at + timedelta(minutes=self.OTP_EXPIRY_MINUTES)
                if datetime.utcnow() > expiry_time:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="OTP has expired. Please request a new one."
                    )
            
            # Verify OTP
            if user.otp_code != request.otp:
                user.otp_attempts += 1
                self.db.commit()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid OTP. {self.MAX_OTP_ATTEMPTS - user.otp_attempts} attempts remaining."
                )
            
            # OTP verified successfully
            user.is_phone_verified = True
            user.otp_code = None
            user.otp_attempts = 0
            user.otp_created_at = None
            user.last_login = datetime.utcnow()
            self.db.commit()
            
            # Generate tokens
            access_token = create_access_token(data={"sub": str(user.id)})
            refresh_token = create_refresh_token(data={"sub": str(user.id)})
            
            logger.info(f"User {user.phone_number} logged in successfully")
            
            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer",
                "user_id": str(user.id),
                "user_type": user.user_type.value,
                "expires_in": 30 * 60  # 30 minutes
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error verifying OTP: {str(e)}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to verify OTP. Please try again."
            )
    
    def worker_signup(self, request: WorkerSignupRequest, user_id: str) -> dict:
        """Complete worker signup"""
        try:
            # Get user
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            
            # Check if worker profile already exists
            existing_worker = self.db.query(Worker).filter(
                Worker.user_id == user.id
            ).first()
            
            if existing_worker:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Worker profile already exists"
                )
            
            # Update user type
            user.user_type = UserType.WORKER
            
            # Create worker profile
            worker = Worker(
                user_id=user.id,
                full_name=request.full_name,
                email=request.email,
                phone_number=user.phone_number,
                city=request.city,
                skills=request.skills or []
            )
            self.db.add(worker)
            
            # Create wallet
            wallet = Wallet(user_id=user.id)
            self.db.add(wallet)
            
            self.db.commit()
            
            logger.info(f"Worker profile created for user {user.id}")
            
            return {
                "message": "Worker profile created successfully",
                "user_id": str(user.id),
                "worker_id": str(worker.id)
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error creating worker profile: {str(e)}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create worker profile"
            )
    
    def employer_signup(self, request: EmployerSignupRequest, user_id: str) -> dict:
        """Complete employer signup"""
        try:
            # Get user
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            
            # Check if employer profile already exists
            existing_employer = self.db.query(Employer).filter(
                Employer.user_id == user.id
            ).first()
            
            if existing_employer:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Employer profile already exists"
                )
            
            # Update user type
            user.user_type = UserType.EMPLOYER
            
            # Create employer profile
            employer = Employer(
                user_id=user.id,
                contact_person=request.full_name,
                company_name=request.company_name,
                email=request.email,
                phone_number=user.phone_number,
                city=request.city
            )
            self.db.add(employer)
            
            # Create wallet
            wallet = Wallet(user_id=user.id)
            self.db.add(wallet)
            
            self.db.commit()
            
            logger.info(f"Employer profile created for user {user.id}")
            
            return {
                "message": "Employer profile created successfully",
                "user_id": str(user.id),
                "employer_id": str(employer.id)
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error creating employer profile: {str(e)}")
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create employer profile"
            )