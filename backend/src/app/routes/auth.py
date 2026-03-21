from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session, joinedload
import logging

from app.database import get_db
from app.schemas.auth import (SendOTPRequest, VerifyOTPRequest, WorkerSignupRequest, EmployerSignupRequest, TokenResponse, UserResponse, LoginRequest)

from app.services.auth_service import AuthService
from app.utils.dependencies import get_current_user
from app.models.user import User
from app.utils.security import verify_token, create_access_token

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/send-otp", status_code=status.HTTP_200_OK)
def send_otp(request: SendOTPRequest, db: Session = Depends(get_db)):

    """
    Send OTP to phone number
    """
    auth_service = AuthService(db)
    return auth_service.send_otp(request)

@router.post("/verify-otp", response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def verify_otp(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    """
    Verify OTP and get authentication tokens
    """
    auth_service = AuthService(db)
    return auth_service.verify_otp(request)

@router.post("/login", response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Login with phone number and password
    """
    auth_service = AuthService(db)
    return auth_service.login_with_password(request.phone_number, request.password)

@router.post("/worker/signup", status_code=status.HTTP_201_CREATED)
async def worker_signup(request: WorkerSignupRequest,current_user: User = Depends(get_current_user),db: Session = Depends(get_db)):
    """
    Complete worker profile signup
    
    Requires authentication (must verify OTP first)
    """
    auth_service = AuthService(db)
    return auth_service.worker_signup(request, str(current_user.id))

@router.post("/employer/signup", status_code=status.HTTP_201_CREATED)
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

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_token: str = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    """
    Refresh access token using refresh token
    
    -refresh_token: Valid refresh token
    """
    try:
        # Verify refresh token
        payload = verify_token(refresh_token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        # Check if it's a refresh token
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not a refresh token"
            )
        
        # Get user from payload
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        # Verify user still exists and is active
        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        # Generate new access token
        new_access_token = create_access_token(data={"sub": str(user.id)})
        
        return {
            "access_token": new_access_token,
            "refresh_token": refresh_token,  # Return same refresh token
            "token_type": "bearer",
            "user_id": str(user.id),
            "user_type": user.user_type.value,
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Refresh token error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Failed to refresh token"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current authenticated user information with profile details"""
    # Reload user with profile data using joinedload
    user = db.query(User).options(
        joinedload(User.worker_profile),
        joinedload(User.employer_profile)
    ).filter(User.id == current_user.id).first()
    
    # Get full_name from worker or employer profile
    full_name = None
    if user.user_type.value == "worker" and user.worker_profile:
        full_name = user.worker_profile.full_name
    elif user.user_type.value == "employer" and user.employer_profile:
        full_name = user.employer_profile.full_name
    
    # Build response with full_name
    user_data = {
        "id": str(user.id),
        "phone_number": user.phone_number,
        "user_type": user.user_type.value,
        "is_verified": user.is_verified,
        "is_active": user.is_active,
        "created_at": user.created_at,
        "full_name": full_name
    }
    
    return user_data

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """
    Logout current user
    
    Note: Since we're using JWT, logout is handled client-side by removing the token
    """
    return {"message": "Logged out successfully"}