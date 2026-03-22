from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.user import User
from app.models.job import Job
from app.models.job_progress import JobProgress, JobProgressStatus
from app.models.rating import Rating
from app.services.progress_service import ProgressService
from app.models.worker import DocumentType
from app.services.worker_service import WorkerService
from app.services.file_service import FileService
from app.schemas.worker import (
    WorkerProfileCreate,
    WorkerProfileUpdate,
    WorkerProfileResponse,
    WorkerAvailabilityUpdate,
    DocumentUploadResponse,
    WorkerStatsResponse
)
from app.utils.dependencies import get_current_user
from app.utils.dependencies import get_current_worker 
from pydantic import BaseModel, Field


# ======== PYDANTIC SCHEMAS ========

class ActiveJobResponse(BaseModel):
    """Active job response"""
    job_id: int
    title: str
    status: str
    scheduled_time: str | None
    employer_name: str
    location: dict
    
    class Config:
        from_attributes = True


class JobDetailResponse(BaseModel):
    """Detailed job response"""
    job_id: int
    title: str
    description: str
    budget: float
    status: str
    employer: dict
    location: dict
    progress_status: str | None
    
    class Config:
        from_attributes = True


class RateEmployerRequest(BaseModel):
    """Request to rate employer"""
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5")
    review: str | None = Field(None, max_length=1000, description="Optional review")


# create router
router = APIRouter(
    prefix="/api/worker",
    tags=["Worker"]
)

# ============================================
# ACTIVE JOBS
# ============================================

@router.get("/jobs/active", response_model=List[ActiveJobResponse])
async def get_active_jobs(
    current_user: User = Depends(get_current_worker),
    db: Session = Depends(get_db)
):
    """
    Get all active jobs for the current worker
    
    Returns jobs that are:
    - Accepted
    - In progress (traveling, working)
    - Waiting for payment
    """
    # Get worker
    worker = current_user.worker_profile
    
    # Get active job progress records
    active_progress = db.query(JobProgress).filter(
        JobProgress.worker_id == worker.id,
        JobProgress.status.in_([
            JobProgressStatus.ACCEPTED,
            JobProgressStatus.WORKER_TRAVELING,
            JobProgressStatus.IN_PROGRESS,
            JobProgressStatus.WAITING_PAYMENT
        ])
    ).all()
    
    # Format response
    result = []
    for progress in active_progress:
        job = progress.job
        employer = job.employer
        
        result.append({
            "job_id": job.id,
            "title": job.title,
            "status": progress.status.value,
            "scheduled_time": job.scheduled_time.isoformat() if job.scheduled_time else None,
            "employer_name": employer.company_name if hasattr(employer, 'company_name') else "Employer",
            "location": {
                "lat": job.latitude,
                "lng": job.longitude,
                "address": job.address
            }
        })
    
    return result


# ============================================
# JOB PROGRESS UPDATES
# ============================================

@router.post("/jobs/{job_id}/start-travel")
async def start_travel(
    job_id: int,
    current_user: User = Depends(get_current_worker),
    db: Session = Depends(get_db)
):
    """
    Worker starts traveling to job location
    
    Status: accepted → worker_traveling
    Location sharing starts
    """
    worker = current_user.worker_profile
    
    # Update progress
    progress = ProgressService.start_travel(
        db=db,
        job_id=job_id,
        worker_id=worker.id
    )
    
    return {
        "message": "Travel started successfully",
        "job_id": job_id,
        "status": progress.status.value,
        "location_sharing_enabled": progress.location_sharing_enabled
    }


@router.post("/jobs/{job_id}/start-job")
async def start_job(
    job_id: int,
    current_user: User = Depends(get_current_worker),
    db: Session = Depends(get_db)
):
    """
    Worker starts the job (arrived at location)
    
    Status: worker_traveling → in_progress
    """
    worker = current_user.worker_profile
    
    # Update progress
    progress = ProgressService.start_job(
        db=db,
        job_id=job_id,
        worker_id=worker.id
    )
    
    return {
        "message": "Job started successfully",
        "job_id": job_id,
        "status": progress.status.value,
        "started_at": progress.started_at.isoformat() if progress.started_at else None
    }


@router.post("/jobs/{job_id}/complete-job")
async def complete_job(
    job_id: int,
    current_user: User = Depends(get_current_worker),
    db: Session = Depends(get_db)
):
    """
    Worker marks job as complete
    
    Status: in_progress → waiting_payment
    Worker waits for employer to process payment
    """
    worker = current_user.worker_profile
    
    # Update progress
    progress = ProgressService.complete_job(
        db=db,
        job_id=job_id,
        worker_id=worker.id
    )
    
    return {
        "message": "Job marked as complete. Waiting for payment confirmation.",
        "job_id": job_id,
        "status": progress.status.value,
        "completed_at": progress.completed_at.isoformat() if progress.completed_at else None
    }


# ============================================
# RATING SYSTEM
# ============================================

@router.post("/jobs/{job_id}/rate-employer")
async def rate_employer(
    job_id: int,
    request: RateEmployerRequest,
    current_user: User = Depends(get_current_worker),
    db: Session = Depends(get_db)
):
    """
    Rate an employer after job completion
    
    Can only rate after:
    - Job is completed
    - Payment has been received
    """
    worker = current_user.worker_profile
    
    # Verify job belongs to worker
    progress = db.query(JobProgress).filter(
        JobProgress.job_id == job_id,
        JobProgress.worker_id == worker.id
    ).first()
    
    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found or unauthorized"
        )
    
    # Get employer user ID
    job = progress.job
    employer = job.employer
    
    # Create rating
    rating = ProgressService.create_rating(
        db=db,
        job_id=job_id,
        rater_id=current_user.id,
        rated_user_id=employer.user_id,
        rating_value=request.rating,
        review=request.review
    )
    
    return {
        "message": "Rating submitted successfully",
        "rating_id": rating.id,
        "rating": rating.rating,
        "review": rating.review
    }


# ============================================
# JOB DETAILS
# ============================================

@router.get("/jobs/{job_id}", response_model=JobDetailResponse)
async def get_job_details(
    job_id: int,
    current_user: User = Depends(get_current_worker),
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific job
    
    Includes job details, employer info, and progress status
    """
    # Get job
    job = db.query(Job).filter(Job.id == job_id).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Get progress if exists
    progress = ProgressService.get_job_progress(db, job_id)
    
    # Get employer info
    employer = job.employer
    
    return {
        "job_id": job.id,
        "title": job.title,
        "description": job.description,
        "budget": job.payment,
        "status": job.status,
        "employer": {
            "name": employer.company_name if hasattr(employer, 'company_name') else "Employer",
            "rating": ProgressService.calculate_average_rating(db, employer.user_id)["average_rating"]
        },
        "location": {
            "lat": job.latitude,
            "lng": job.longitude,
            "address": job.address
        },
        "progress_status": progress.status.value if progress else None
    }


# ======= Profile Endpoints =======
@router.get("/profile", response_model=WorkerProfileResponse)
async def get_worker_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current worker's profile
    """
    worker = WorkerService.get_worker_by_user(db, current_user.id)
    if not worker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Worker profile not found. Please create your profile first."
        )
    return worker

@router.post("/profile", response_model=WorkerProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_worker_profile(
    profile_data: WorkerProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create worker profile 
    """
    worker = WorkerService.create_worker_profile(
        db=db,
        user_id=current_user.id,
        profile_data=profile_data.model_dump()
    )
    return worker

@router.put("/profile", response_model=WorkerProfileResponse)
async def update_worker_profile(
    profile_data: WorkerProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update worker profile 
    """
    worker = WorkerService.get_worker_by_user(db, current_user.id)
    if not worker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Worker profile not found"
        )
    
    updated_worker = WorkerService.update_worker_profile(
        db=db,
        worker_id=worker.id,
        update_data=profile_data.model_dump(exclude_unset=True)
    )
    return updated_worker

@router.patch("/availability", response_model=WorkerProfileResponse)
async def toggle_availability(
    availability_data: WorkerAvailabilityUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Toggle worker availability
    """
    worker = WorkerService.get_worker_by_user(db, current_user.id)
    if not worker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Worker profile not found"
        )
    
    updated_worker = WorkerService.toggle_availability(
        db=db,
        worker_id=worker.id,
        is_available=availability_data.is_available
    )
    return updated_worker

# ======= Document Endpoints =======
@router.post("/document/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(..., description="Document file (PDF, JPG, PNG)"),
    document_type: DocumentType = Form(..., description="Document type (nic, license, photo, other)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload worker document (NIC, license, certificates, photos)
    """
    worker = WorkerService.get_worker_by_user(db, current_user.id)
    if not worker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Worker profile not found"
        )
    
    allowed_types = ["application/pdf", "image/jpeg", "image/png"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only PDF, JPG, PNG allowed."
        )
    
    # Save file to disk
    file_info = await FileService.save_file(
        file=file,
        subfolder=f"worker_{worker.id}"
    )

    # Create document record in database
    document = WorkerService.add_document(
        db=db,
        worker_id=worker.id,
        document_type=document_type,
        file_url=file_info["file_url"],
        file_name=file_info["filename"]
    )

    return {
        "id": document.id,
        "worker_id": str(document.worker_id),
        "document_type": document.document_type,
        "file_url": document.file_path,  # Return file_path as file_url for API
        "file_name": document.file_name,
        "status": document.status,
        "uploaded_at": document.created_at.isoformat(),  # Use created_at instead of uploaded_at
        "verified_at": document.verified_at.isoformat() if document.verified_at else None
    }

@router.get("/documents", response_model=List[DocumentUploadResponse])
async def get_worker_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all uploaded documents for current worker
    """
    worker = WorkerService.get_worker_by_user(db, current_user.id)
    if not worker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Worker profile not found"
        )
    
    documents = WorkerService.get_worker_documents(db, worker.id)
    
    # Transform to match schema
    return [
        {
            "id": doc.id,
            "worker_id": doc.worker_id,
            "document_type": doc.document_type,
            "file_name": doc.file_name,
            "file_url": doc.file_path,  # Return file_path as file_url
            "status": doc.status,
            "uploaded_at": doc.created_at.isoformat(),
            "verified_at": doc.verified_at.isoformat() if doc.verified_at else None
        }
        for doc in documents
    ]

@router.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: int, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete an uploaded document
    """
    worker = WorkerService.get_worker_by_user(db, current_user.id)
    if not worker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Worker profile not found"
        )
    
    # Delete from database
    WorkerService.delete_document(db, document_id, worker.id)

    return None

# ======= Stats & Dashboard =======

@router.get("/stats", response_model=WorkerStatsResponse)
async def get_worker_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get worker dashboard statistics
    """
    worker = WorkerService.get_worker_by_user(db, current_user.id)
    if not worker:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Worker profile not found"
        )
    
    stats = WorkerService.get_worker_stats(db, worker.id)
    return stats