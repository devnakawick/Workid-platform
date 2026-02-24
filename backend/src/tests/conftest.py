"""Shared test setup"""

import sys
from pathlib import Path

# Add parent directory to path so 'app' can be imported
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app.models.user import User
from app.models.worker import Worker, SkillCategory
from app.models.employer import Employer
from app.models.job import Job, JobStatus, UrgencyLevel

# ======= Test Database Setup =======

SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def override_get_db():
    """
    Replace the real database with test database
    """
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# ======= Fixture =======
# Reusable pieces of setup code

@pytest.fixture(scope="function")
def db():
    """
    Create a fresh database for each test
    """
    # Create all tables
    Base.metadata.create_all(bind=engine)

    # Override the database dependency
    app.dependency_overrides[get_db] = override_get_db

    db = TestingSessionLocal()

    yield db    

    db.close()
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def client(db):
    """
    Create test HTTP client
    """
    def get_db_override():
        return db
    
    app.dependency_overrides[get_db] = get_db_override
    test_client = TestClient(app)
    yield test_client
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def worker_user(db):
    """
    Create a fake worker for testing
    """
    user = User(
        phone_number="+94771234567",
        is_active=True,
        user_type="worker"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture(scope="function")
def employer_user(db):
    """
    Create a fake employer for testing
    """
    user = User(
        phone_number="+94779876543",
        is_active=True,
        user_type="employer"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture(scope="function")
def worker_profile(db, worker_user):
    """
    Create a fake worker profile for testing
    """
    worker = Worker(
        user_id=worker_user.id,
        full_name="John Doe",
        nic_number="912345678V",
        city="Dehiwala",
        district="Colombo",
        primary_skill=SkillCategory.PLUMBING,
        other_skills=["electrical"],
        experience_years=5,
        daily_rate=2500.00,
        bio="Experienced plumber in Dehiwala",
        is_available=True,
        is_verified=True,
        rating=4.5,
        total_jobs_completed=10
    )
    db.add(worker)
    db.commit()
    db.refresh(worker)
    return worker

@pytest.fixture(scope="function")
def employer_profile(db, employer_user):
    """
    Create a fake employer profile for testing
    """
    employer = Employer(
        user_id=employer_user.id,
        full_name="Jane Doe",
        city="Ratmalana",
        district="Colombo",
        is_verified=True,
        total_jobs_posted=0
    )
    db.add(employer)
    db.commit()
    db.refresh(employer)
    return employer

@pytest.fixture(scope="function")
def sample_job(db, employer_profile):
    """
    Create a sample job for testing
    """
    from datetime import datetime, timedelta

    job = Job(
        employer_id=employer_profile.id,
        title="Need plumber to fix kitchen sink",
        description="Kitchen sink has been leaking for 2 days. Need urgent fix.",
        category="plumbing",
        location="45 Galle Road, Mount Lavinia",
        city="Mount Lavinia",
        district="Colombo",
        estimated_duration_hours=2,
        urgency=UrgencyLevel.HIGH,
        budget=3500.00,
        payment_type="fixed",
        status=JobStatus.OPEN,
        expires_at=datetime.utcnow() + timedelta(days=30)
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job