from sqlalchemy.orm import Session
from datetime import datetime
from fastapi import HTTPException, status
from typing import Optional, Dict, Any

from app.models.job_progress import JobProgress, JobProgressStatus
from app.models.job import Job, JobStatus
from app.models.application import Application, ApplicationStatus


class ProgressService:
    """Service for managing job progress and location tracking"""
    
    @staticmethod
    def create_job_progress(
        db: Session,
        job_id: int,
        worker_id: int,
        employer_latitude: Optional[float] = None,
        employer_longitude: Optional[float] = None,
        scheduled_time: Optional[datetime] = None
    ) -> JobProgress:
        """
        Create a new job progress record when employer accepts worker
        Called automatically when application is accepted
        """
        # Check if progress already exists
        existing = db.query(JobProgress).filter(
            JobProgress.job_id == job_id
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Job progress already exists for this job"
            )
        
        # Create job progress
        job_progress = JobProgress(
            job_id=job_id,
            worker_id=worker_id,
            status=JobProgressStatus.ACCEPTED,
            employer_latitude=employer_latitude,
            employer_longitude=employer_longitude,
            scheduled_time=scheduled_time,
            location_sharing_enabled=False
        )
        
        db.add(job_progress)
        
        # Update job status
        job = db.query(Job).filter(Job.id == job_id).first()
        if job:
            job.status = JobStatus.ACCEPTED
        
        db.commit()
        db.refresh(job_progress)
        
        return job_progress
    
    @staticmethod
    def start_travel(
        db: Session,
        job_id: int,
        worker_id: int
    ) -> JobProgress:
        """
        Worker starts traveling to job location
        Enables location sharing
        """
        job_progress = db.query(JobProgress).filter(
            JobProgress.job_id == job_id,
            JobProgress.worker_id == worker_id
        ).first()
        
        if not job_progress:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job progress not found"
            )
        
        if job_progress.status != JobProgressStatus.ACCEPTED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot start travel from status: {job_progress.status}"
            )
        
        # Update status
        job_progress.status = JobProgressStatus.WORKER_TRAVELING
        job_progress.started_travel_at = datetime.utcnow()
        job_progress.location_sharing_enabled = True
        
        db.commit()
        db.refresh(job_progress)
        
        return job_progress
    
    @staticmethod
    def start_job(
        db: Session,
        job_id: int,
        worker_id: int
    ) -> JobProgress:
        """
        Worker arrives and starts the actual job work
        """
        job_progress = db.query(JobProgress).filter(
            JobProgress.job_id == job_id,
            JobProgress.worker_id == worker_id
        ).first()
        
        if not job_progress:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job progress not found"
            )
        
        if job_progress.status != JobProgressStatus.WORKER_TRAVELING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot start job from status: {job_progress.status}"
            )
        
        # Update status
        job_progress.status = JobProgressStatus.IN_PROGRESS
        job_progress.started_job_at = datetime.utcnow()
        
        db.commit()
        db.refresh(job_progress)
        
        return job_progress
    
    @staticmethod
    def complete_job(
        db: Session,
        job_id: int,
        worker_id: int
    ) -> JobProgress:
        """
        Worker marks job as complete
        Waits for employer payment
        """
        job_progress = db.query(JobProgress).filter(
            JobProgress.job_id == job_id,
            JobProgress.worker_id == worker_id
        ).first()
        
        if not job_progress:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job progress not found"
            )
        
        if job_progress.status != JobProgressStatus.IN_PROGRESS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot complete job from status: {job_progress.status}"
            )
        
        # Calculate actual duration
        if job_progress.started_job_at:
            duration = datetime.utcnow() - job_progress.started_job_at
            job_progress.actual_duration_minutes = int(duration.total_seconds() / 60)
        
        # Update status
        job_progress.status = JobProgressStatus.WAITING_PAYMENT
        job_progress.completed_at = datetime.utcnow()
        job_progress.location_sharing_enabled = False  # Stop location sharing
        
        db.commit()
        db.refresh(job_progress)
        
        return job_progress
    
    @staticmethod
    def mark_as_paid(
        db: Session,
        job_id: int
    ) -> JobProgress:
        """
        Called after payment is processed
        Marks job as fully completed
        """
        job_progress = db.query(JobProgress).filter(
            JobProgress.job_id == job_id
        ).first()
        
        if not job_progress:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job progress not found"
            )
        
        if job_progress.status != JobProgressStatus.WAITING_PAYMENT:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot mark as paid from status: {job_progress.status}"
            )
        
        # Update status
        job_progress.status = JobProgressStatus.COMPLETED
        
        # Update job status
        job = db.query(Job).filter(Job.id == job_id).first()
        if job:
            job.status = JobStatus.COMPLETED
        
        db.commit()
        db.refresh(job_progress)
        
        return job_progress
    
    @staticmethod
    def update_worker_location(
        db: Session,
        job_id: int,
        worker_id: int,
        latitude: float,
        longitude: float
    ) -> JobProgress:
        """
        Update worker's current GPS location
        Called periodically while worker is traveling or working
        """
        job_progress = db.query(JobProgress).filter(
            JobProgress.job_id == job_id,
            JobProgress.worker_id == worker_id
        ).first()
        
        if not job_progress:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job progress not found"
            )
        
        if not job_progress.location_sharing_enabled:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Location sharing is not enabled for this job"
            )
        
        # Update location
        job_progress.worker_current_latitude = latitude
        job_progress.worker_current_longitude = longitude
        job_progress.last_location_update = datetime.utcnow()
        
        db.commit()
        db.refresh(job_progress)
        
        return job_progress
    
    @staticmethod
    def get_job_locations(
        db: Session,
        job_id: int
    ) -> Dict[str, Any]:
        """
        Get both worker and employer locations for map tracking
        """
        job_progress = db.query(JobProgress).filter(
            JobProgress.job_id == job_id
        ).first()
        
        if not job_progress:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job progress not found"
            )
        
        return {
            "worker_location": {
                "latitude": job_progress.worker_current_latitude,
                "longitude": job_progress.worker_current_longitude,
                "last_update": job_progress.last_location_update.isoformat() if job_progress.last_location_update else None
            } if job_progress.worker_current_latitude else None,
            "employer_location": {
                "latitude": job_progress.employer_latitude,
                "longitude": job_progress.employer_longitude
            } if job_progress.employer_latitude else None,
            "status": job_progress.status.value,
            "location_sharing_enabled": job_progress.location_sharing_enabled
        }
    
    @staticmethod
    def cancel_job(
        db: Session,
        job_id: int,
        user_id: int,
        cancellation_reason: Optional[str] = None
    ) -> JobProgress:
        """
        Cancel an active job
        Can be done by either employer or worker
        """
        job_progress = db.query(JobProgress).filter(
            JobProgress.job_id == job_id
        ).first()
        
        if not job_progress:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job progress not found"
            )
        
        if job_progress.status in [JobProgressStatus.COMPLETED, JobProgressStatus.CANCELLED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot cancel a completed or already cancelled job"
            )
        
        # Update status
        job_progress.status = JobProgressStatus.CANCELLED
        job_progress.cancelled_at = datetime.utcnow()
        job_progress.location_sharing_enabled = False
        
        # Update job status
        job = db.query(Job).filter(Job.id == job_id).first()
        if job:
            job.status = JobStatus.CANCELLED
        
        db.commit()
        db.refresh(job_progress)
        
        return job_progress
    
    @staticmethod
    def get_worker_active_jobs(
        db: Session,
        worker_id: int
    ):
        """
        Get all active jobs for a worker
        Returns jobs in progress (not yet completed)
        """
        active_statuses = [
            JobProgressStatus.ACCEPTED,
            JobProgressStatus.WORKER_TRAVELING,
            JobProgressStatus.IN_PROGRESS,
            JobProgressStatus.WAITING_PAYMENT
        ]
        
        job_progresses = db.query(JobProgress).filter(
            JobProgress.worker_id == worker_id,
            JobProgress.status.in_(active_statuses)
        ).all()
        
        return job_progresses
