from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.worker import Worker
from app.models.employer import Employer
from app.models.job import Job, JobStatus
from app.models.application import Application, ApplicationStatus
from typing import List, Optional, Dict
from uuid import UUID
from datetime import datetime

ALLOWED_EMPLOYER_UPDATE_FIELDS = {
    "full_name", 
    "email",
    "phone_number",
    "address", 
    "city", 
    "district", 
    "postal_code"
}

class EmployerService:
    """
    Business login for employer operations
    """
    
    @staticmethod
    def get_employer_by_user(db: Session, user_id: UUID) -> Optional[Employer]:
        return db.query(Employer).filter(Employer.user_id == user_id).first()
    
    @staticmethod
    def get_employer_by_id(db: Session, employer_id: int) -> Optional[Employer]:
        return db.query(Employer).filter(Employer.id == employer_id).first()
    
    @staticmethod
    def create_employer_profile(db: Session, user_id: UUID, profile_data: dict) -> Employer:
        """
        Create employer profile
        """
        # Check if employer profile already exists
        existing = EmployerService.get_employer_by_user(db, user_id)
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Employer profile already exists for this user."
            )
        
        # Clean profile data
        clean_profile_data = {k: v for k, v in profile_data.items() if k != "user_id"}
        
        employer = Employer(user_id=user_id, **clean_profile_data)
        db.add(employer)
        db.commit()
        db.refresh(employer)
        return employer
    
    @staticmethod
    def update_employer_profile(db: Session, employer_id: int, update_data: dict) -> Employer:
        """
        Update employer profile
        """
        employer = db.query(Employer).filter(Employer.id == employer_id).first()
        if not employer:
            raise HTTPException(
                status_code=404,
                detail="Employer profile not found."
            )
        
        # Update only provided fields
        for key, value in update_data.items():
            if key in ALLOWED_EMPLOYER_UPDATE_FIELDS:
                setattr(employer, key, value)
        
        employer.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(employer)
        return employer
    
    @staticmethod
    def get_employer_stats(db: Session, employer_id: int) -> dict:
        """
        Get employer dashboard statistics
        """
        employer = db.query(Employer).filter(Employer.id == employer_id).first()
        if not employer:
            raise HTTPException(
                status_code=404,
                detail="Employer profile not found."
            )
        
        # Count jobs by status
        total_jobs = db.query(Job).filter(Job.employer_id == employer_id).count()

        active_jobs = db.query(Job).filter(
            Job.employer_id == employer_id, 
            Job.status == JobStatus.OPEN
        ).count()
        
        completed_jobs = db.query(Job).filter(
            Job.employer_id == employer_id, 
            Job.status == JobStatus.COMPLETED
        ).count()
        
        # Count applications
        total_applications = db.query(Application).join(Job).filter(
            Job.employer_id == employer_id
        ).count()

        pending_applications = db.query(Application).join(Job).filter(
            Job.employer_id == employer_id,
            Application.status == ApplicationStatus.PENDING
        ).count()
        
        return {
            "total_jobs_posted": total_jobs,
            "active_jobs": active_jobs,
            "completed_jobs": completed_jobs,
            "total_applications": total_applications,
            "pending_applications": pending_applications,
            "rating": employer.rating,
            "is_verified": employer.is_verified
        }

    # ======= Search & Discovery =======
    @staticmethod
    def search_workers(
        db: Session,
        city: Optional[str] = None,
        district: Optional[str] = None,
        skill: Optional[str] = None,
        min_rating: Optional[float] = None,
        is_verified: Optional[bool] = None,
        is_available: bool = True,
        skip: int = 0,
        limit: int = 20
    ) -> List[Worker]:
        """
        Search for workers with filters
        """
        query = db.query(Worker)

        # Apply filters
        if city:
            query = query.filter(Worker.city == city)
        if district:
            query = query.filter(Worker.district == district)
        if skill:
            query = query.filter(Worker.primary_skill == skill)
        if min_rating is not None:
            query = query.filter(Worker.rating >= min_rating)
        if is_verified is not None:
            query = query.filter(Worker.is_verified == is_verified)
        if is_available is not None:
            query = query.filter(Worker.is_available == is_available)

        # Order by rating and recent activity
        query = query.order_by(
            Worker.rating.desc(),
            Worker.last_active.desc()
        )

        return query.offset(skip).limit(limit).all()
        