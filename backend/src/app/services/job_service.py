from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc
from fastapi import HTTPException
from app.models.job import Job, JobStatus, UrgencyLevel
from app.models.application import Application, ApplicationStatus
from app.models.worker import Worker
from typing import List, Optional, Dict
from datetime import datetime, timedelta

class JobService:
    """
    Business logic for
    """
    # ======= Job CRUD =======

    @staticmethod
    def create_job(db: Session, employer_id: int, job_data: dict) -> Job:
        """
        Create a new job posting
        """
        # Set expiration date if not provided
        if 'expires_at' not in job_data:
            job_data['expires_at'] = datetime.utcnow() + timedelta(days=30)

        job = Job(employer_id=employer_id, **job_data)
        db.add(job)
        db.commit()
        db.refresh(job)
        return job
    
    @staticmethod
    def get_job_by_id(db: Session, job_id: int) -> Optional[Job]:
        return db.query(Job).filter(Job.id == job_id).first()
    
    @staticmethod
    def get_employer_jobs(
        db: Session,
        employer_id: int,
        status: Optional[JobStatus] = None,
    ) -> List[Job]:
        """
        Get all jobs posted by an employer
        """
        query = db.query(Job).filter(Job.employer_id == employer_id)

        if status:
            query = query.filter(Job.status == status)

        return query.order_by(Job.created_at.desc()).all()
    
    @staticmethod
    def update_job(
        db: Session,
        job_id: int,
        employer_id: int,
        update_data: dict
    ) -> Job:
        """
        Update job details
        """
        job = db.query(Job).filter(
            Job.id == job_id,
            Job.employer_id == employer_id
        ).first()

        if not job:
            raise HTTPException(
                status_code=404,
                detail="Job not found or you don't have permission"
            )
        
        # Update fields
        for key, value in update_data.items():
            if hasattr(job, key):
                setattr(job, key, value)

        job.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(job)
        return job
    
    @staticmethod
    def update_job_status(
        db: Session,
        job_id: int,
        employer_id: int,
        new_status: JobStatus
    ) -> Job:
        """
        Change job status
        """
        job = db.query(Job).filter(
            Job.id == job_id,
            Job.employer_id == employer_id
        ).first()

        if not job:
            raise HTTPException(
                status_code=404,
                detail="Job not found"
            )
        
        job.status = new_status
        job.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(job)
        return job
    
    @staticmethod
    def delete_job(db: Session, job_id: int, employer_id: int) -> bool:
        """
        Delete a job 
        """
        job = db.query(Job).filter(
            Job.id == job_id,
            Job.employer_id == employer_id
        ).first()

        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        job.status = JobStatus.CANCELLED
        job.updated_at = datetime.utcnow()
        db.commit()
        return True
    
    # ======= Job Search & Discovery =======
    @staticmethod
    def search_jobs(
        db: Session,
        category: Optional[str] = None,
        city: Optional[str] = None,
        district: Optional[str] = None,
        min_budget: Optional[float] = None,
        max_budget: Optional[float] = None, 
        urgency: Optional[UrgencyLevel] = None, 
        status: JobStatus = JobStatus.OPEN,
        skip: int = 0,
        limit: int = 20
    ) -> List[Job]:
        """
        Search jobs with filters
        """
        query = db.query(Job).filter(Job.status == status)

        # Apply filters
        if category:
            query = query.filter(Job.category == category)
        if city:
            query = query.filter(Job.city == city)
        if district:
            query = query.filter(Job.district == district)
        if min_budget:
            query = query.filter(Job.budget >= min_budget)
        if max_budget:
            query = query.filter(Job.budget <= max_budget)
        if urgency:
            query = query.filter(Job.urgency == urgency)

        # Ordered as ugent first then newest
        query = query.order_by(
            Job.urgency.desc(),
            Job.created_at.desc()
        )

        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def increment_view_count(db: Session, job_id: int):
        """
        Increment view count when job is viewed
        """ 
        job = db.query(Job).filter(Job.id == job_id).first()
        if job:
            job.views_count += 1
            db.commit()

    @staticmethod
    def get_recommended_jobs(
        db: Session,
        worker_id: int,
        limit: int = 10
    ) -> List[Job]:
        """
        Get job recommendations for a worker based on:
            - primary skill
            - location
            - experience level
        """
        """ Replace with AI job matching system """
        
        # Get worker info
        worker = db.query(Worker).filter(Worker.id == worker_id).first()
        if not worker:
            return []
        
        # Find jobs matching worker's skill and city
        jobs = db.query(Job).filter(
            Job.status == JobStatus.OPEN,
            Job.category == worker.primary_skill.value,
            Job.city == worker.city
        ).order_by(Job.created_at.desc()).limit(limit).all()

        return jobs
    
    # ======= Application Management =======
    
    @staticmethod
    def apply_to_job(
        db: Session,
        job_id: int, 
        worker_id: int,
        application_data: dict 
    ) -> Application:
        
        # Check if job exists and is open
        job = db.query(Job).filter(
            Job.id == job_id,
            Job.status == JobStatus.OPEN
        ).first()

        if not job:
            raise HTTPException(
                status_code=404,
                detail="Job not found or no longer accepting applications"
            )
        
        # Chech if worker already applied
        existing = db.query(Application).filter(
            Application.job_id == job_id,
            Application.worker_id == worker_id
        ).first() 

        if existing:
            raise HTTPException(
                status_code=400,
                detail="You have already applied to this job"
            )
        
        # Create application
        application = Application(
            job_id=job_id,
            worker_id=worker_id,
            **application_data
        )
        db.add(application)

        # Increment job's application count
        job.applications_count += 1

        db.commit()
        db.refresh(application)
        return application
    
    @staticmethod
    def get_worker_application(
        db: Session,
        worker_id: int,
        status: Optional[ApplicationStatus] = None
    ) -> List[Application]:
        """
        Get all applications submitted by a worker
        """
        query = db.query(Application).filter(Application.worker_id == worker_id)

        if status:
            query = query.filter(Application.status == status)

        return query.order_by(Application.applied_at.desc()).all()
    
    @staticmethod
    def withdraw_application(
        db: Session,
        application_id: int,
        worker_id: int
    ) -> Application:
        application = db.query(Application).filter(
            Application.id == application_id,
            Application.worker_id == worker_id
        ).first()

        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        
        if application.status != ApplicationStatus.PENDING:
            raise HTTPException(
                status_code=400,
                detail="Can only withdraw pending applications"
            )
        
        application.status = ApplicationStatus.WITHDRAWN
        db.commit()
        db.refresh(application)
        return application
    
    # ======= Statistics =======

    @staticmethod
    def get_job_stats(db: Session, job_id: int) -> Dict:
        """
        Get statistics for a job
        """
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        return {
            "view_count": job.views_count,
            "application_count": job.applications_count,
            "status": job.status,
            "created_at": job.created_at,
            "expires_at": job.expires_at
        }