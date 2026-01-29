from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
import logging

from app.database import get_db
from app.utils.dependencies import get_current_user, get_current_worker, get_current_employer
from app.models.user import User, UserType
from app.models.worker import Worker
from app.models.employer import Employer
from app.models.job import Job, JobStatus
from app.models.application import Application, ApplicationStatus
from app.models.wallet import Wallet
from app.models.transaction import Transaction

routes = APIRouter()
logger = logging.getLogger(__name__)

@routes.get("/worker/stats")
async def get_worker_dashboard_stats(
    current_user: User = Depends(get_current_worker),
    db: Session = Depends(get_db)
):
    
    """Get dashboard statistics for workers"""
    try:

        #Get worker profile
        worker = db.query(Worker).filter(Worker.user_id == current_user.id).first()
        if not worker:
            return {"error": "Worker profile not found"}

        # Get wallet
        wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
        
        # Get applications count
        total_applications = db.query(func.count(Application.id)).filter(
            Application.worker_id == worker.id
        ).scalar()
        
        pending_applications = db.query(func.count(Application.id)).filter(
            Application.worker_id == worker.id,
            Application.status == ApplicationStatus.PENDING
        ).scalar()
        
        accepted_applications = db.query(func.count(Application.id)).filter(
            Application.worker_id == worker.id,
            Application.status == ApplicationStatus.ACCEPTED
        ).scalar()

        completed_jobs = db.query(func.count(Application.id)).join(Job).filter(
            Application.worker_id == worker.id,
            Application.status == ApplicationStatus.ACCEPTED,
            Job.status == JobStatus.COMPLETED
        ).scalar()

        # Calculate profile completion
        profile_fields = [
            worker.full_name,
            worker.email,
            worker.city,
            worker.skills,
            worker.bio,
            worker.hourly_rate
        ]
        completed_fields = sum(1 for field in profile_fields if field)
        profile_completion = int((completed_fields / len(profile_fields)) * 100)
        
        # Get recent applications (last 5)
        recent_applications = db.query(Application).filter(
            Application.worker_id == worker.id
        ).order_by(Application.applied_at.desc()).limit(5).all()

        recent_activities = []
        for app in recent_applications:
            job = db.query(Job).filter(Job.id == app.job_id).first()
            recent_activities.append({
                "type": "application",
                "job_title": job.title if job else "Unknown",
                "status": app.status.value,
                "date": app.applied_at.isoformat()
            })

        return {
            "profile_completion": profile_completion,
            "statistics": {
                "total_applications": total_applications or 0,
                "pending_applications": pending_applications or 0,
                "accepted_applications": accepted_applications or 0,
                "active_jobs": active_jobs or 0,
                "completed_jobs": completed_jobs or 0
            },
            "earnings": {
                "total": float(wallet.balance) if wallet else 0.0,
                "this_month": 0.0,  # TODO: Calculate from transactions
                "pending": 0.0  # TODO: Calculate from pending payments
            },
            "rating": {
                "average": float(worker.rating) if worker.rating else 0.0,
                "total_reviews": worker.total_reviews or 0
            },
            "recent_activities": recent_activities
        }
    
    except Exception as e:
        logger.error(f"Error getting worker dashboard stats: {str(e)}")
        return {"error": "Failed to fetch dashboard statistics"}
    
@routes.get("/employer/stats")
async def get_employer_dashboard_stats(
    current_user: User = Depends(get_current_employer),
    db: Session = Depends(get_db)
):
    
    """Get employer dashboard statistics"""

    try:
        # Get employer profile
        employer = db.query(Employer).filter(Employer.user_id == current_user.id).first()
        
        if not employer:
            return {"error": "Employer profile not found"}
        
        # Get wallet
        wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
        
        # Get jobs count
        total_jobs = db.query(func.count(Job.id)).filter(
            Job.employer_id == employer.id
        ).scalar()
        
        open_jobs = db.query(func.count(Job.id)).filter(
            Job.employer_id == employer.id,
            Job.status == JobStatus.OPEN
        ).scalar()
        
        in_progress_jobs = db.query(func.count(Job.id)).filter(
            Job.employer_id == employer.id,
            Job.status == JobStatus.IN_PROGRESS
        ).scalar()
        
        completed_jobs = db.query(func.count(Job.id)).filter(
            Job.employer_id == employer.id,
            Job.status == JobStatus.COMPLETED
        ).scalar()
        
        # Get applications count
        total_applications = db.query(func.count(Application.id)).join(Job).filter(
            Job.employer_id == employer.id
        ).scalar()
        
        pending_applications = db.query(func.count(Application.id)).join(Job).filter(
            Job.employer_id == employer.id,
            Application.status == ApplicationStatus.PENDING
        ).scalar()
        
        # Get active workers count
        active_workers = db.query(func.count(func.distinct(Application.worker_id))).join(Job).filter(
            Job.employer_id == employer.id,
            Application.status == ApplicationStatus.ACCEPTED,
            Job.status.in_([JobStatus.OPEN, JobStatus.IN_PROGRESS])
        ).scalar()
        
        # Get recent jobs
        recent_jobs = db.query(Job).filter(
            Job.employer_id == employer.id
        ).order_by(Job.created_at.desc()).limit(5).all()
        
        recent_activities = []
        for job in recent_jobs:
            applications_count = db.query(func.count(Application.id)).filter(
                Application.job_id == job.id
            ).scalar()
            
            recent_activities.append({
                "type": "job",
                "job_title": job.title,
                "status": job.status.value,
                "applications": applications_count or 0,
                "date": job.created_at.isoformat()
            })
        
        return {
            "statistics": {
                "total_jobs": total_jobs or 0,
                "open_jobs": open_jobs or 0,
                "in_progress_jobs": in_progress_jobs or 0,
                "completed_jobs": completed_jobs or 0,
                "total_applications": total_applications or 0,
                "pending_applications": pending_applications or 0,
                "active_workers": active_workers or 0
            },
            "wallet": {
                "balance": float(wallet.balance) if wallet else 0.0,
                "total_spent": 0.0,  # TODO: Calculate from transactions
                "this_month_spent": 0.0  # TODO: Calculate from this month's transactions
            },
            "recent_activities": recent_activities
        }
        
    except Exception as e:
        logger.error(f"Error getting employer dashboard stats: {str(e)}")
        return {"error": "Failed to fetch dashboard statistics"}



