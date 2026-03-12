from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.job import Job
from app.models.transaction import Transaction

router = APIRouter(prefix="/api/admin", tags=["Admin"])


# Get all users
@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


# Get all jobs
@router.get("/jobs")
def get_jobs(db: Session = Depends(get_db)):
    return db.query(Job).all()


# Get all transactions
@router.get("/transactions")
def get_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).all()


# Simple analytics
@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):

    total_users = db.query(User).count()
    total_jobs = db.query(Job).count()
    total_transactions = db.query(Transaction).count()

    return {
        "total_users": total_users,
        "total_jobs": total_jobs,
        "total_transactions": total_transactions
    }