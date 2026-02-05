from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
import logging

from app.database import get_db
from app.schemas.auth import (SendOTPRequest, VerifyOTPRequest, WorkerSignupRequest, EmployerSignupRequest, TokenResponse, UserResponse)

from app.services.auth_service import AuthService
from app.utils.dependencies import get_current_user
from app.models.user import User

routes = APIRouter()
logger = logging.getLogger(__name__)

@routes.post("/send-otp", status_code=status.HTTP_200_OK)
async def send_otp(request: SendOTPRequest, db: Session = Depends):

    """
    Send OTP to phone number
    """
    auth_service = AuthService(db)
    return auth_service.send_otp(request)

@routes.post("/verify-otp", response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def verify_otp(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    """
    Verify OTP and get authentication tokens
    """
    auth_service = AuthService(db)
    return auth_service.verify_otp(request)

@routes.post("/worker/signup", status_code=status.HTTP_201_CREATED)
async def worker_signup(request: WorkerSignupRequest,current_user: User = Depends(get_current_user),db: Session = Depends(get_db)):
    """
    Complete worker profile signup
    
    Requires authentication (must verify OTP first)
    """
    auth_service = AuthService(db)
    return auth_service.worker_signup(request, str(current_user.id))

@routes.post("/employer/signup", status_code=status.HTTP_201_CREATED)
async def employer_signup(
    request: EmployerSignupRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Complete employer profile signup
    
    Requires authentication (must verify OTP first)
    """
    auth_service = AuthService(db)
    return auth_service.employer_signup(request, str(current_user.id))

@routes.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_token: str,
    db: Session = Depends(get_db)
):
    """
    Refresh access token using refresh token
    
    -refresh_token: Valid refresh token
    """
    
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Refresh token endpoint not yet implemented"
    )

@routes.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Get current authenticated user information"""
    return current_user

@routes.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """
    Logout current user
    
    Note: Since we're using JWT, logout is handled client-side by removing the token
    """
    return {"message": "Logged out successfully"}