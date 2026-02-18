from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.user import User
from app.models.job import JobStatus
from app.services.job_service import JobService
from app.services.worker_service import WorkerService
from app.schemas.job import (
    JobCreate, 
    JobUpdate, 
    JobStatusUpdate, JobResponse,
    JobListResponse
)
from app.schemas.application import ApplicationResponse
from app.schemas.worker import WorkerSearchResponse
from app.utils.dependencies import get_current_user

router = APIRouter(
    prefix="/api/employer",
    tags=["Employer"]
)

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
    Chenge job status
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

# ======= Application Review =======
@router.get("/jobs/{job_id}/applications", response_model=List[ApplicationResponse])
async def get_job_applications(
    job_id: int, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    View all applications for a specific job
    """
    employer = _get_employer_or_404(db, current_user.id)

    # Verify employer owns this job
    job = JobService.get_job_by_id(db, job_id)
    if not job or job.employer_id != employer.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Get all applications for this job
    from app.models.application import Application
    applications = db.query(Application)\
        .filter(Application.job_id == job_id)\
        .order_by(Application.applied_at.desc())\
        .all()
    
    return applications

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