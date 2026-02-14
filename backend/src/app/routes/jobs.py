from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.user import User
from app.models.job import UrgencyLevel, JobStatus
from app.models.application import ApplicationStatus
from app.services.job_service import JobService
from app.services.worker_service import WorkerService
from app.schemas.job import (
    JobResponse,
    JobListResponse,
    JobSearchResponse
)
from app.schemas.application import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicationListResponse
)
from app.utils.dependencies import get_current_user

router = APIRouter(
    prefix="/api/jobs",
    tags=["Jobs - Worker Side"]
)

# ======= Browse Jobs =======

@router.get("", response_model=JobSearchResponse)
async def search_jobs(
    # Filter parameters (all optional)
    category: Optional[str] = Query(
        None, 
        description="Filter by category: plumbing, electrical, etc."
    ),
    city: Optional[str] = Query(
        None, 
        description="Filter by city"
    ),
    district: Optional[str] = Query(
        None, 
        description="Filter by district"
    ),
    min_budget: Optional[float] = Query(
        None, 
        description="Minimum budget in RS."
    ),
    max_budget: Optional[float] = Query(
        None, 
        description="Maximum budget in Rs."
    ),
    urgency: Optional[UrgencyLevel] = Query(
        None, description="Filter by urgency: low, medium, high"
    ),
    # Pagination
    page: int = Query(
        default=1,
        ge=1,
        description="Page number"
    ),
    page_size: int = Query(
        default=20,
        ge=1,
        le=100,
        description="Results per page"
    ),
    db: Session = Depends(get_db)
):
    """
    Browse and search all open jobs
    """
    # Calculate pagination offset
    skip = (page - 1) * page_size

    # Search jobs
    jobs = JobService.search_jobs(
        db=db,
        category=category,
        city=city,
        district=district,
        min_budget=min_budget,
        max_budget=max_budget,
        urgency=urgency,
        skip=skip,
        limit=page_size
    )

    return JobSearchResponse(
        total=len(jobs),
        page=page,
        page_size=page_size,
        jobs=jobs
    )

@router.get("/recommended", response_model=List[JobListResponse])
async def get_recommended_jobs(
    limit: int = Query(
        default=10,
        ge=1,
        le=50,
        description="Number of recommendations"
    ),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get job recommendations for the current worker
    """
    # Get worker profile
    worker = WorkerService.get_worker_by_user_id(db, current_user.id)
    if not worker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Worker profile not found. Please create your profile first."
        )

    jobs = JobService.get_recommended_jobs(
        db=db,
        worker_id=worker.id,
        limit=limit
    )
    return jobs

@router.get("/{job_id}", response_model=JobListResponse)
async def get_job_details(
    job_id: int, 
    db: Session = Depends(get_db)
):
    """
    Get full details of a specific job
    """
    job = JobService.get_job_by_id(db, job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job #{job_id} not found"
        )
    
    # Track view
    JobService.increment_view_count(db, job_id)

    return job

# ======= Applications (Worker Side) =======

@router.post("/{job_id}/applu", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def apply_to_job(
    job_id: int,
    application_data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Apply to a job
    """
    # Get worker profile
    worker = WorkerService.get_worker_by_user(db, current_user.id)
    if not worker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Worker profile not found. Please create your profile first."
        )
    
    # Submit application
    application = JobService.apply_to_job(
        db=db,
        job_id=job_id,
        worker_id=worker.id,
        application_data=application_data.model_dump(exclude_unset=True)
    )

    return application

@router.get("/applications/mine", response_model=List[ApplicationListResponse])
async def get_my_applications(
    status_filter: Optional[ApplicationStatus] = Query(
        None,
        alias="status",
        description="Filter by status: pending, accepted, rejected, withdrawn"
    ),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    get all applications submitted by the current worker
    """
    worker = WorkerService.get_worker_by_user(db, current_user.id)
    if not worker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Worker profile not found"
        )
    
    applications = JobService.get_worker_application(
        db=db,
        worker_id=worker.id,
        status=status_filter
    )

    return applications

@router.delete("/applications/{application_id}/withdraw", status_code=status.HTTP_200_OK)
async def withdraw_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Withdraw a job application
    """
    worker = WorkerService.get_worker_by_user(db, current_user.id)
    if not worker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Worker profile not found"
        )
    
    application = JobService.withdraw_application(
        db=db,
        application_id=application_id,
        worker_id=worker.id
    )
    
    return {
        "message": "Application withdrawn successfully",
        "application_id": application_id,
        "status": application.status
    }