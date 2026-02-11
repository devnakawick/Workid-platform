from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.user import User
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

# create router
router = APIRouter(
    prefix="/api/worker",
    tags=["Worker"]
)

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
        file_name=file_info["file_name"]
    )

    return document

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
    return documents

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