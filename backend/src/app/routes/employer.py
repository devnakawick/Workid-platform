from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.user import User
from app.models.job import Job
from app.models.job import JobStatus
from app.models.application import Application, ApplicationStatus
from app.models.job_progress import JobProgress
from app.models.rating import Rating
from app.services.progress_service import ProgressService
from app.services.job_service import JobService
from app.services.worker_service import WorkerService
from app.services.employer_service import EmployerService
from app.schemas.job import (
    JobCreate, 
    JobUpdate, 
    JobStatusUpdate, JobResponse,
    JobListResponse
)
from app.schemas.employer import (
    EmployerProfileCreate,
    EmployerProfileUpdate, 
    EmployerProfileResponse,
    EmployerStatsResponse
)
from app.schemas.application import ApplicationResponse
from app.schemas.worker import WorkerSearchResponse
from app.utils.dependencies import get_current_user
from app.utils.dependencies import get_current_employer

from pydantic import BaseModel, Field

# ========= PYDANTIC SCHEMAS =========

class ApplicationResponse(BaseModel):
    """Application response schema"""
    id: int
    job_id: int
    worker_id: int
    worker_name: str
    worker_rating: float
    status: str
    applied_at: str
    cover_letter: str | None
    
    class Config:
        from_attributes = True


class AcceptApplicationRequest(BaseModel):
    """Request to accept application"""
    pass


class RateWorkerRequest(BaseModel):
    """Request to rate worker"""
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5")
    review: str | None = Field(None, max_length=1000, description="Optional review")


router = APIRouter(
    prefix="/api/employer",
    tags=["Employer"]
)

router = APIRouter(prefix="/api/employer", tags=["employer"])

# ======= APPLICATION MANAGEMENT =======

@router.get("/jobs/{job_id}/applications", response_model=List[ApplicationResponse])
async def get_job_applications(
    job_id: int,
    current_user: User = Depends(get_current_employer),
    db: Session = Depends(get_db)
):
    """
    Get all applications for a specific job
    
    Only the employer who posted the job can view applications
    """
    # Verify job belongs to employer
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.employer_id == current_user.id
    ).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found or unauthorized"
        )
    
    # Get applications
    applications = db.query(Application).filter(
        Application.job_id == job_id
    ).all()
    
    # Format response
    result = []
    for app in applications:
        # Get worker info
        worker = app.worker
        
        # Calculate worker rating
        rating_info = ProgressService.calculate_average_rating(db, worker.user_id)
        
        result.append({
    
            "id": app.id,
            "job_id": app.job_id,
            "worker_id": app.worker_id,
            "worker_name": worker.full_name,
            "worker_rating": rating_info["average_rating"],
            "status": app.status.value,
            "applied_at": app.applied_at.isoformat(),
            "cover_letter": app.cover_letter
        })
    
    return result


@router.post("/applications/{application_id}/accept")
async def accept_application(
    application_id: int,
    current_user: User = Depends(get_current_employer),
    db: Session = Depends(get_db)
):
    """
    Accept a worker's application
    
    Actions performed:
    1. Update application status to 'accepted'
    2. Assign worker to job
    3. Create job progress record
    4. Update job status to 'accepted'
    """
    # Get application
    application = db.query(Application).filter(
        Application.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Verify job belongs to employer
    job = db.query(Job).filter(
        Job.id == application.job_id,
        Job.employer_id == current_user.id
    ).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to accept this application"
        )
    
    # Check if already accepted
    if application.status == ApplicationStatus.ACCEPTED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Application already accepted"
        )
    
    # Update application
    application.status = ApplicationStatus.ACCEPTED
    
    # Assign worker to job
    job.assigned_worker_id = application.worker_id
    job.status = "accepted"  # Update job status
    
    # Create job progress record
    job_progress = ProgressService.create_job_progress(
        db=db,
        job_id=job.id,
        worker_id=application.worker_id
    )
    
    # Reject all other applications for this job
    other_applications = db.query(Application).filter(
        Application.job_id == application.job_id,
        Application.id != application.id,
        Application.status == ApplicationStatus.PENDING
    ).all()
    
    for other_app in other_applications:
        other_app.status = ApplicationStatus.REJECTED
    
    db.commit()
    
    return {
        "message": "Application accepted successfully",
        "job_id": job.id,
        "worker_id": application.worker_id,
        "progress_id": job_progress.id,
        "status": job_progress.status.value
    }


@router.post("/applications/{application_id}/reject")
async def reject_application(
    application_id: int,
    current_user: User = Depends(get_current_employer),
    db: Session = Depends(get_db)
):
    """
    Reject a worker's application
    """
    # Get application
    application = db.query(Application).filter(
        Application.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Verify job belongs to employer
    job = db.query(Job).filter(
        Job.id == application.job_id,
        Job.employer_id == current_user.id
    ).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to reject this application"
        )
    
    # Update application
    application.status = ApplicationStatus.REJECTED
    
    db.commit()
    
    return {
        "message": "Application rejected successfully",
        "application_id": application.id
    }

# ============================================
# RATING SYSTEM
# ============================================

@router.post("/jobs/{job_id}/rate-worker")
async def rate_worker(
    job_id: int,
    request: RateWorkerRequest,
    current_user: User = Depends(get_current_employer),
    db: Session = Depends(get_db)
):
    """
    Rate a worker after job completion
    
    Can only rate after:
    - Job is completed
    - Payment has been made
    """
    # Verify job belongs to employer
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.employer_id == current_user.id
    ).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found or unauthorized"
        )
    
    # Get job progress
    progress = ProgressService.get_job_progress(db, job_id)
    
    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job progress not found"
        )
    
    # Get worker user ID
    worker = progress.worker
    
    # Create rating
    rating = ProgressService.create_rating(
        db=db,
        job_id=job_id,
        rater_id=current_user.id,
        rated_user_id=worker.user_id,
        rating_value=request.rating,
        review=request.review
    )
    
    return {
        "message": "Rating submitted successfully",
        "rating_id": str(rating.id),
        "rating": rating.rating,
        "review": rating.review
    }



# ======= Employer Profile Endpoints =======

@router.get("/profile", response_model=EmployerProfileResponse)
async def get_employer_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get employer profile
    """
    employer = EmployerService.get_employer_by_user(db, current_user.id)
    if not employer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employer profile not found. Please create your profile first."
        )
    
    return employer

@router.post("/profile", response_model=EmployerProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_employer_profile(
    profile_data: EmployerProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create employer profile
    """
    employer = EmployerService.create_employer_profile(
        db=db,
        user_id=current_user.id,
        profile_data=profile_data.model_dump()
    )

    return employer

@router.put("/profile", response_model=EmployerProfileResponse)
async def update_employer_profile(
    profile_data: EmployerProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update employer profile
    """
    employer = EmployerService.get_employer_by_user(db, current_user.id)
    if not employer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employer profile not found."
        )

    updated_employer = EmployerService.update_employer_profile(
        db=db,
        employer_id=employer.id,
        update_data=profile_data.model_dump(exclude_unset=True)
    )

    return updated_employer

@router.get("/stats", response_model=EmployerStatsResponse)
async def get_employer_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get employer dashboard statistics
    """
    employer = EmployerService.get_employer_by_user(db, current_user.id)
    if not employer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employer profile not found."
        )
    
    stats = EmployerService.get_employer_stats(db, employer.id)
    
    return stats
    
# ======= Employer Job Management =======
@router.post("/jobs", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(
    job_data: JobCreate, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Post a new job
    Employer creates a job posting for workers to apply
    """
    # Get employer profile
    employer = _get_employer_or_404(db, current_user.id)

    # Create job
    job = JobService.create_job(
        db=db,
        employer_id=employer.id,
        job_data=job_data.model_dump()
    )

    # Update employer's total jobs count
    employer.total_jobs_posted += 0
    db.commit()

    return job

@router.get("/jobs", response_model=List[JobListResponse])
async def get_my_jobs(
    status_filter: Optional[JobStatus] = Query(
        None, 
        alias="status",
        description="Filter: open, in_progress, completed, cancelled"
    ),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all jobs posted by the current employer
    """
    employer = _get_employer_or_404(db, current_user.id)

    jobs = JobService.get_employer_jobs(
        db=db,
        employer_id=employer.id,
        status=status_filter
    )

    return jobs

@router.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job_detail(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get full details of a specific job
    """
    employer = _get_employer_or_404(db, current_user.id)

    job = JobService.get_job_by_id(db, job_id)
    if not job or job.employer_id != employer.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    return job

@router.put("/jobs/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: int,
    job_data: JobUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a job posting
    """
    employer = _get_employer_or_404(db, current_user.id)

    job = JobService.update_job(
        db=db,
        job_id=job_id,
        employer_id=employer.id,
        update_data=job_data.model_dump(exclude_unset=True)
    )

    return job

@router.patch("/jobs/{job_id}/status", response_model=JobResponse)
async def update_job_status(
    job_id: int, 
    status_data: JobStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Change job status
    """
    employer = _get_employer_or_404(db, current_user.id)

    job = JobService.update_job_status(
        db=db,
        job_id=job_id,
        employer_id=employer.id,
        new_status=status_data.status
    )

    return job

@router.delete("/jobs/{job_id}", status_code=status.HTTP_200_OK)
async def delete_job(
    job_id: int, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a job posting (set status to cancelled)
    """
    employer = _get_employer_or_404(db, current_user.id)

    JobService.delete_job(
        db=db,
        job_id=job_id,
        employer_id=employer.id
    )

    return {"message": f"Job #{job_id} has been cancelled successfully"}

# ======= Worker Discovery =======

@router.get("/workers", response_model=List[WorkerSearchResponse])
async def search_workers(
    city: Optional[str] = Query(None, description="Filter by city"),
    district: Optional[str] = Query(None, description="Filter by district"),
    skill: Optional[str] = Query(None, description="Filter by skill"),
    min_rating: Optional[float] = Query(None, description="Minimun rating"),
    is_verified: Optional[bool] = Query(None, description="Only verified workers"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Search for available workers
    """
    _get_employer_or_404(db, current_user.id)

    skip = (page - 1) * page_size

    workers = WorkerService.search_workers(
        db=db,
        city=city,
        district=district,
        skill=skill,
        min_rating=min_rating,
        is_verified=is_verified,
        is_available=True,
        skip=skip,
        limit=page_size
    )

    return workers

@router.get("/workers/{worker_id}", response_model=WorkerSearchResponse)
async def get_worker_profile(
    worker_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    View a specific worker's profile
    """
    _get_employer_or_404(db, current_user.id)

    worker = WorkerService.get_worker_by_id(db, worker_id)
    if not worker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Worker not found"
        )
    
    return worker

# ======= Helper Functions =======
def _get_employer_or_404(db: Session, user_id: int):
    """
    Get employer profile or raise 404
    """
    from app.models.employer import Employer

    employer = db.query(Employer)\
        .filter(Employer.user_id == user_id)\
        .first()
    
    if not employer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employer profile not found. Please complete your profile setup."
        )
    
    return employer