"""
Tests for employer endpoints
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.models.job import JobStatus
from tests.mock_auth import override_auth

# ======= Profile Tests =======

class TestEmployerProfile:
    """Tests for employer profile operations"""

    def test_create_profile(
        self, client: TestClient,
        employer_user, db: Session
    ):
        """Test: Employer can create profile"""
        override_auth(app, employer_user)

        profile_data = {
            "full_name": "John Doe",
            "email": "john.doe@example.com",
            "phone_number": "+94771234567",
            "city": "Dehiwala",
            "district": "Colombo",
            "address": "123 Main St"
        }

        response = client.post("/api/employer/profile", json=profile_data)

        assert response.status_code == 201
        data = response.json()
        assert data["full_name"] == "John Doe"
        assert data["city"] == "Dehiwala"
        assert data["is_verified"] == False

        print("Create employer profile: Pass")

    def test_get_profile(
        self, client: TestClient,
        employer_user, employer_profile, db: Session
    ):
        """Test: Employer can view their profile"""
        override_auth(app, employer_user)
        
        response = client.get("/api/employer/profile")
        
        assert response.status_code == 200
        data = response.json()
        assert data["full_name"] == "Jane Doe"
        
        print("Get employer profile: Pass")

    def test_update_profile(
        self, client: TestClient,
        employer_user, employer_profile, db: Session
    ):
        """Test: Employer can update their profile"""
        override_auth(app, employer_user)
        
        update_data = {
            "full_name": "John Smith",
            "address": "456 Main St"
        }
        
        response = client.put("/api/employer/profile", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["full_name"] == "John Smith"
        assert data["address"] == "456 Main St"
        
        print("Update employer profile: Pass")

    def test_get_stats(
        self, client: TestClient, 
        employer_user, employer_profile, db: Session
    ):
        """Test: Employer can view dashboard stats"""
        override_auth(app, employer_user)

        response = client.get("/api/employer/stats")

        assert response.status_code == 200
        data = response.json()

        assert "total_jobs_posted" in data
        assert "active_jobs" in data
        assert "completed_jobs" in data
        assert "total_applications" in data
        assert "rating" in data

        print(f"Employer stats: {data}")

# ======= Job Posting Tests =======

class TestPostJob:
    """Test for POST /api/employer/jobs"""

    def test_post_job(
            self, client: TestClient,
            employer_user, employer_profile, db: Session
    ):
        """Test: Employer can post a new job"""
        override_auth(app, employer_user)

        job_data = {
            "title": "Need electrician to fix wiring",
            "description": "Living room lights are not working. Need experienced electrician.",
            "category": "electrical",
            "location": "12 Temple Road, Nugegoda",
            "city": "Nugegoda",
            "district": "Colombo",
            "estimated_duration_hours": 3,
            "urgency": "medium",
            "budget": 5000.00,
            "payment_type": "fixed"
        }

        response = client.post("/api/employer/jobs", json=job_data)

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Need electrician to fix wiring"
        assert data["status"] == "open"

        print("Post job: Pass")