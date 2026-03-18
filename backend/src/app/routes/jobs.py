import json

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status, Query
from sqlalchemy.orm import Session
from typing import Dict, List, Optional
from uuid import UUID
from datetime import datetime
import uuid


from app.database import get_db
from app.models.user import User
from app.models.job_progress import JobProgress, JobProgressStatus
from app.services.progress_service import ProgressService
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
from pydantic import BaseModel, Field

location_storage: Dict[str, Dict] = {}

# WebSocket connections
websocket_connections: Dict[str, WebSocket] = {}

class LocationUpdate(BaseModel):
    """Location update request"""
    lat: float = Field(..., ge=-90, le=90, description="Latitude")
    lng: float = Field(..., ge=-180, le=180, description="Longitude")


class LocationResponse(BaseModel):
    """Location response"""
    worker_location: dict | None
    employer_location: dict | None
    last_updated: str | None

router = APIRouter(
    prefix="/api/jobs",
    tags=["Jobs - Worker Side"]
)
router = APIRouter(prefix="/api/jobs", tags=["jobs"])

# =========== LOCATION TRACKING ==========

@router.post("/{job_id}/location/update")
async def update_location(
    job_id: uuid.UUID,
    location: LocationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update worker's current location during job
    
    Worker sends GPS coordinates periodically
    Location sharing only works when job status is:
    - worker_traveling
    - in_progress
    """
    # Get job progress
    progress = JobProgressService.get_job_progress(db, job_id)
    
    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job progress not found"
        )
    
    # Verify user is the worker
    if progress.worker.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the assigned worker can update location"
        )
    
    # Check if location sharing is enabled
    if not progress.location_sharing_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Location sharing is not enabled for this job"
        )
    
    # Check job status
    if progress.status not in [
        JobProgressStatus.WORKER_TRAVELING,
        JobProgressStatus.IN_PROGRESS
    ]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Location updates only allowed during travel or job execution"
        )
    
    # Store location
    job_id_str = str(job_id)
    location_storage[job_id_str] = {
        "worker": {
            "lat": location.lat,
            "lng": location.lng,
            "updated_at": datetime.utcnow().isoformat()
        }
    }
    
    # Notify employer via WebSocket if connected
    employer_ws_key = f"employer_{str(progress.job.employer_id)}"
    if employer_ws_key in websocket_connections:
        try:
            await websocket_connections[employer_ws_key].send_json({
                "type": "location_update",
                "job_id": job_id_str,
                "worker_location": {
                    "lat": location.lat,
                    "lng": location.lng
                }
            })
        except:
            # Connection might be closed
            del websocket_connections[employer_ws_key]
    
    return {
        "message": "Location updated successfully",
        "lat": location.lat,
        "lng": location.lng,
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/{job_id}/location", response_model=LocationResponse)
async def get_job_locations(
    job_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get worker and employer locations for a job
    
    Returns:
    - Worker's current location (if location sharing enabled)
    - Employer's location (job location)
    
    Both worker and employer can access this
    """
    # Get job progress
    progress = JobProgressService.get_job_progress(db, job_id)
    
    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job progress not found"
        )
    
    # Verify user is involved in this job
    job = progress.job
    is_worker = progress.worker.user_id == current_user.id
    is_employer = job.employer.user_id == current_user.id
    
    if not (is_worker or is_employer):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view location"
        )
    
    # Get worker location from storage
    job_id_str = str(job_id)
    worker_location = None
    
    if progress.location_sharing_enabled and job_id_str in location_storage:
        worker_location = location_storage[job_id_str].get("worker")
    
    # Get employer location (job location)
    employer_location = {
        "lat": job.latitude,
        "lng": job.longitude,
        "address": job.address
    }
    
    return {
        "worker_location": worker_location,
        "employer_location": employer_location,
        "last_updated": worker_location.get("updated_at") if worker_location else None
    }


# ============== WEBSOCKET FOR REAL-TIME LOCATION ==============

@router.websocket("/{job_id}/location/ws")
async def location_websocket(
    websocket: WebSocket,
    job_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    """
    WebSocket endpoint for real-time location updates
    
    Employer connects to receive live worker location updates
    Worker connects to send location updates (alternative to POST)
    
    Message format:
    {
        "type": "location_update",
        "lat": 6.9271,
        "lng": 79.8612
    }
    """
    await websocket.accept()
    
    # Store connection
    # You'll need to add authentication to get user_id
    # For now, using job_id as key
    connection_key = f"job_{str(job_id)}"
    websocket_connections[connection_key] = websocket
    
    try:
        while True:
            # Receive message
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "location_update":
                # Store location
                job_id_str = str(job_id)
                location_storage[job_id_str] = {
                    "worker": {
                        "lat": message.get("lat"),
                        "lng": message.get("lng"),
                        "updated_at": datetime.utcnow().isoformat()
                    }
                }
                
                # Broadcast to connected clients
                await websocket.send_json({
                    "type": "location_updated",
                    "lat": message.get("lat"),
                    "lng": message.get("lng"),
                    "timestamp": datetime.utcnow().isoformat()
                })
    
    except WebSocketDisconnect:
        # Clean up connection
        if connection_key in websocket_connections:
            del websocket_connections[connection_key]
    
    except Exception as e:
        # Handle errors
        await websocket.close(code=1011, reason=str(e))
        if connection_key in websocket_connections:
            del websocket_connections[connection_key]


# ============== HELPER FUNCTIONS =============

def clear_job_location(job_id: uuid.UUID):
    """
    Clear location data when job is completed
    Called by progress service
    """
    job_id_str = str(job_id)
    if job_id_str in location_storage:
        del location_storage[job_id_str]


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

@router.get("/{job_id}", response_model=JobListResponse)
async def get_job_details(
    job_id: UUID, 
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

@router.post("/{job_id}/apply", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def apply_to_job(
    job_id: UUID,
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


@router.delete("/applications/{application_id}/withdraw", status_code=status.HTTP_200_OK)
async def withdraw_application(
    application_id: UUID,
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