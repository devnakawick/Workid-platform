from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.worker import Worker, WorkerDocument, DocumentType, DocumentStatus
from typing import List, Optional, Dict
from datetime import datetime

ALLOWED_WORKER_UPDATE_FIELDS = {
    "full_name",
    "city",
    "district",
    "primary_skill",
    "experience_years",
    "bio"
}

class WorkerService:
    """
    Business logic for woker operations
    """

    @staticmethod
    def get_worker_by_user(db: Session, user_id: int) -> Optional[Worker]:
        return db.query(Worker).filter(Worker.user_id == user_id).first()
    
    @staticmethod
    def get_worker_by_id(db: Session, worker_id: int) -> Optional[Worker]:
        return db.query(Worker).filter(Worker.id == worker_id).first()
    
    @staticmethod
    def create_worker_profile(db:Session, user_id: int, profile_data: dict) -> Worker:
        # Check if worker profile already exists
        existing = WorkerService.get_worker_by_user(db, user_id)
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Worker profile already exists for this user."
            )
        
        # Create new worker
        clean_profile_data = {k: v for k, v in profile_data.items() if k != "user_id"}
        worker = Worker(user_id=user_id, **clean_profile_data)
        db.add(worker)
        db.commit()
        db.refresh(worker)
        return worker
    
    @staticmethod
    def update_worker_profile(db: Session, worker_id: int, update_data: dict) -> Worker:
        worker = db.query(Worker).filter(Worker.id == worker_id).first()
        if not worker:
            raise HTTPException(
                status_code=404,
                detail="Worker profile not found."
            )
        
        # Update only provided fields
        for key, value in update_data.items():
            if key in ALLOWED_WORKER_UPDATE_FIELDS:
                setattr(worker, key, value)

        worker.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(worker)
        return worker
    
    @staticmethod
    def toggle_availability(db: Session, worker_id: int, is_available: bool) -> Worker:
        worker = db.query(Worker).filter(Worker.id == worker_id).first()
        if not worker:
            raise HTTPException(
                status_code=404,
                detail="Worker not found."
            )
        
        worker.is_available = is_available
        worker.last_active = datetime.utcnow()
        db.commit()
        db.refresh(worker)
        return worker
    
    # ======= Document Management =======

    @staticmethod
    def add_document(
        db: Session,
        worker_id: int, 
        document_type: DocumentType,
        file_url:  str,
        file_name: str
    ) -> WorkerDocument:
        """
        Add a document to worker's profile
        """
        worker = db.query(Worker).filter(Worker.id == worker_id).first()
        if not worker:
            raise HTTPException(
                status_code=404,
                detail="Worker not found."
            )

        document = WorkerDocument(
            worker_id=worker_id,
            document_type=document_type,
            file_url=file_url,
            file_name=file_name,
            status=DocumentStatus.PENDING
        )
        db.add(document)
        db.commit()
        db.refresh(document)
        return document
    
    @staticmethod
    def get_worker_documents(db: Session, worker_id: int) -> List[WorkerDocument]:
        """
        Get all documents for a worker
        """
        worker = db.query(Worker).filter(Worker.id == worker_id).first()
        if not worker:
            raise HTTPException(
                status_code=404,
                detail="Worker not found."
            )

        return db.query(WorkerDocument)\
            .filter(WorkerDocument.worker_id == worker_id)\
            .order_by(WorkerDocument.uploaded_at.desc())\
            .all()
    
    @staticmethod
    def delete_document(db:Session, document_id: int, worker_id: int) -> bool:
        """
        Delete a worker's document
        """
        document = db.query(WorkerDocument).filter(
            WorkerDocument.id == document_id,
            WorkerDocument.worker_id == worker_id
        ).first()

        if not document:
            raise HTTPException(
                status_code=404,
                detail="Document not found or you don't have permission to delete it."
            )
        
        db.delete(document)
        db.commit()
        return True
    
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
    
    # ======= Statistics =======

    @staticmethod
    def get_worker_stats(db: Session, worker_id: int) -> Dict:
        """
        Get statistics for a worker 
        """
        worker = db.query(Worker).filter(Worker.id == worker_id).first()
        if not worker:
            raise HTTPException(
                status_code=404,
                detail="Worker not found."
            )
        
        from app.models.application import Application, ApplicationStatus

        # Count applications
        total_applications = db.query(Application)\
            .filter(Application.worker_id == worker_id)\
            .count()
        
        pending_applications = db.query(Application)\
            .filter(
                Application.worker_id == worker_id,
                Application.status == ApplicationStatus.PENDING
            ).count()
        
        accepted_applications = db.query(Application)\
        .filter(
            Application.worker_id == worker_id,
            Application.status == ApplicationStatus.ACCEPTED
        ).count()

        return {
            "total_jobs_completed": worker.total_jobs_completed,
            "rating": worker.rating,
            "total_applications": total_applications,
            "pending_applications": pending_applications,
            "accepted_applications": accepted_applications,
            "is_verified": worker.is_verified,
            "is_available": worker.is_available,
            "experience_years": worker.experience_years
        }