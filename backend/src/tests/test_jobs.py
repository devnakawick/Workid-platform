"""
Test for job endpoints (Worker side)
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.models.job import JobStatus
from app.models.application import ApplicationStatus
from tests.mock_auth import override_auth

# ======= Browse Jobs Tests =======
class TestBrowseJobs:
    """Tests for GET /api/jobs"""

    def test_browse_all(self, client: TestClient, sample_job, db: Session):
        """
        Test: Anyone can browse all open jobs without authentication
        """
        response = client.get("/api/jobs")

        assert response.status_code == 200

        data = response.json()
        assert data["total"] >= 1
        assert len(data["jobs"]) >= 1
        assert data["page"] == 1

        print("Browse all jobs: Pass")

    def test_filter_by_city(self, client: TestClient, sample_job, db: Session):
        """
        Test: Filter jobs by city
        """
        # Find jobs in Mount Lavinia (where sample_job is located)
        response = client.get("/api/jobs?city=Mount Lavinia")
        assert response.status_code == 200
        assert response.json()["total"] >= 1

        # Find no jobs in Galle
        response = client.get("/api/jobs?city=Galle")
        assert response.status_code == 200
        assert response.json()["total"] == 0

        print("Filter by city: Pass")

    def test_filter_by_category(self, client: TestClient, sample_job, db: Session):
        """
        Test: Filter jobs by category
        """
        # Find plumbing jobs
        response = client.get("/api/jobs?category=plumbing")
        assert response.status_code == 200
        assert response.json()["total"] >= 1

        # Find no electrical jobs
        response = client.get("/api/jobs?category=electrical")
        assert response.status_code == 200
        assert response.json()["total"] == 0

        print("Filter by category: Pass")

    def test_filter_by_budget(self, client: TestClient, sample_job, db: Session): 
        """
        Test: Filter jobs by budget range
        """
        # Find jobs within budget range
        response = client.get("/api/jobs?min_budget=3000&max_budget=4000")
        assert response.status_code == 200
        assert response.json()["total"] >= 1

        # Find no jobs above min budget
        response = client.get("/api/jobs?min_budget=5000")
        assert response.status_code == 200
        assert response.json()["total"] == 0

        print("Filter by budget: Pass")

    def test_pagination(self, client: TestClient, sample_job, db: Session):
        """
        Test: Pagination works correctly
        """
        response = client.get("/api/jobs?page=1&page_size=5")

        assert response.status_code == 200

        data = response.json()
        assert data["page"] == 1
        assert data["page_size"] == 5
        assert "total" in data
        assert "jobs" in data

        print("Pagination: Pass")

# ======= Job Details Tests =======
class TestJobDetails:
    """Tests for GET /api/jobs/{job_id}"""

    def test_get_job_details(self, client: TestClient, sample_job, db: Session):
        """
        Test: Anyone can view job details
        """
        response = client.get(f"/api/jobs/{sample_job.id}")

        assert response.status_code == 200

        data = response.json()
        assert data["id"] == sample_job.id
        assert data["title"] == "Need plumber to fix kitchen sink"
        assert data["category"] == "plumbing"
        assert data["city"] == "Mount Lavinia"
        assert float(data["budget"]) == 3500.00

        print("Get job details: Pass")

    def test_view_increments(self, client: TestClient, sample_job, db: Session):
        """
        Test: View count increases each time job is viewd
        """
        # Check initial count
        initial_views = sample_job.views_count

        # View job 3 times
        for _ in range(3):
            client.get(f"/api/jobs/{sample_job.id}")

        # Refresh from database
        db.refresh(sample_job)

        assert sample_job.views_count == initial_views + 3

        print("View count increments: Pass")
    
    def test_job_not_found(self, client: TestClient, db: Session):
        """
        Test: Returns 404 for non-existing jobs
        """
        response = client.get("/api/jobs/99999")

        assert response.status_code == 404

        print("Job not found 404: Pass")

# ======= Application Test =======

class TestApplyToJob:
    """Tests for POST /api/jobs/{job_id}/apply"""

    def test_apply(self, client: TestClient,
        worker_user, worker_profile,
        sample_job, db: Session
    ):
        """
        Test: Worker can apply to a job
        """
        override_auth(app, worker_user)

        application_data = {
            "message": "I have 5 years of experience. Can fix today.",
            "proposed_rate": 3000.00
        }

        response = client.post(
            f"/api/jobs/{sample_job.id}/apply",
            json=application_data
        )

        assert response.status_code == 201

        data = response.json()
        assert data["job_id"] == sample_job.id
        assert data["worker_id"] == worker_profile.id
        assert data["status"] == "pending"
        assert float(data["proposed_rate"]) == 3000.00

        print("Apply to job: Pass")

    def test_increment_count(
        self, client: TestClient,
        worker_user, worker_profile,
        sample_job, db: Session
    ):
        """
        Test: Application count increases after applying
        """
        override_auth(app, worker_user)

        initial_count = sample_job.applications_count

        client.post(
            f"/api/jobs/{sample_job.id}/apply",
            json={"message": "I can do this job"}
        )

        db.refresh(sample_job)
        assert sample_job.applications_count == initial_count + 1

        print("Application count increments: Pass")

    def test_apply_twice(
        self, client: TestClient,
        worker_user, worker_profile,
        sample_job, db: Session
    ): 
        """
        Test: Worker cannot apply to the same job twice
        """
        override_auth(app, worker_user)

        # First application (should succeed)
        first = client.post(
            f"/api/jobs/{sample_job.id}/apply",
            json={"message": "First application"}
        )
        assert first.status_code == 201

        # Second application (should fail)
        second = client.post(
            f"/api/jobs/{sample_job.id}/apply",
            json={"message": "Second application"}
        )
        assert second.status_code == 400
        assert "already applied" in second.json()["detail"].lower()

        print("Cannot apply twice: Pass")

    def test_apply_to_closed_job(
        self, client: TestClient, 
        worker_user, worker_profile,
        sample_job, db: Session
    ): 
        """
        Test: Worker cannot apply to a closed/cancelled job
        """
        override_auth(app, worker_user)

        # Cancel the job
        sample_job.status = JobStatus.CANCELLED
        db.commit()

        # Try to apply
        response = client.post(
            f"/api/jobs/{sample_job.id}/apply",
            json={"message": "Can I still apply?"}
        )

        assert response.status_code == 404

        print("Cannot apply to closed job: Pass")

class TestMyApplications:
    """Tests for GET /api/jobs/applications/mine"""

    def test_get_my_applications(
        self, client: TestClient,
        worker_user, worker_profile,
        sample_job, db: Session
    ):
        """
        Test: Worker can see their applications
        """
        override_auth(app, worker_user)

        # Apply to the job
        client.post(
            f"/api/jobs/{sample_job.id}/apply",
            json={"message": "I want this job"}
        )

        # Get applications
        response = client.get("/api/jobs/applications/mine")
        
        assert response.status_code == 200
        assert len(response.json()) == 1

        print("Get my applications: Pass")

    def test_filter_by_status(
        self, client: TestClient,
        employer_user, employer_profile,
        sample_job, db: Session
    ):
        """
        Test: Filter my jobs by status
        """
        override_auth(app, employer_user)

        # Filter by open
        open_jobs = client.get("/api/employer/jobs?status=open")
        assert open_jobs.status_code == 200
        assert len(open_jobs.json()) >= 1

        # Filter by completed
        completed_jobs = client.get("/api/employer/jobs?status=completed")
        assert completed_jobs.status_code == 200
        assert len(completed_jobs.json()) == 0

        print("Filter by status: Pass")

class TestUpdateJob:
    """Tests for PUT /api/employer/jobs/{job_id}"""

    def test_update_job(
        self, client: TestClient,
        employer_user, employer_profile, 
        sample_job, db: Session
    ):
        """
        Test: Employer can update their job
        """
        override_auth(app, employer_user)

        update_data = {
            "budget": 4000.00,
            "urgency": "high",
            "description": "Updated with more details"
        }

        response = client.put(
            f"/api/employer/jobs/{sample_job.id}",
            json=update_data
        )

        assert response.status_code == 200

        data = response.json()
        assert float(data["budget"]) == 4000.00
        assert data["urgency"] == "high"

        print("Update job: Pass")

    def test_update_other_jobs(
        self, client: TestClient,
        worker_user, sample_job, db: Session
    ):
        """
        Test: Employer cannot update jobs they do not own
        """
        override_auth(app, worker_user)

        response = client.put(
            f"/api/employer/jobs/{sample_job.id}",
            json={"budget": 4000.00}
        )

        assert response.status_code == 404

        print("Cannot update other jobs: Pass")

class TestJobStatus:
    """Tests for PATCH /api/employer/jobs/{job_id}/status"""

    def test_ongoing_job(
        self, client: TestClient, 
        employer_user, employer_profile,
        sample_job, db: Session
    ):
        """
        Test: Employer can mark job as in progress
        """
        override_auth(app, employer_user)

        response = client.patch(
            f"/api/employer/jobs/{sample_job.id}/status",
            json={"status": "in_progress"}
        )

        assert response.status_code == 200
        assert response.json()["status"] == "in_progress"

        print("Mark in progress: Pass")

    def test_complete_job(
        self, client: TestClient, 
        employer_user, employer_profile,
        sample_job, db: Session
    ): 
        """
        Test: Employer can mark job as completed
        """
        override_auth(app, employer_user)

        response = client.patch(
            f"/api/employer/jobs/{sample_job.id}/status",
            json={"status": "completed"}
        )

        assert response.status_code == 200
        assert response.json()["status"] == "completed"

        print("Mark completed: Pass")

class TestDeleteJob:
    """Tests for DELETE /api/employer/jobs/{job_id}"""

    def test_delete_job(
        self, client: TestClient, 
        employer_user, employer_profile,
        sample_job, db: Session
    ):
        """
        Test: Employer can delete their job
        """
        override_auth(app, employer_user)
        
        response = client.delete(f"/api/employer/jobs/{sample_job.id}")

        assert response.status_code == 200
        assert "cancelled" in response.json()["message"].lower()

        # Verify job is cancelled in db
        db.refresh(sample_job)
        assert sample_job.status == JobStatus.CANCELLED

        print("Delete job: Pass")

class TestViewApplications:
    """Tests for GET /api/employer/jobs/{job_id}/applications"""

    def test_view_application(
        self, client: TestClient,
        employer_user, employer_profile,
        worker_user, worker_profile,
        sample_job, db: Session
    ):
        """
        Test: Employer can see who applied to their job
        """
        # Worker applies to the job
        override_auth(app, worker_user)
        client.post(
            f"/api/jobs/{sample_job.id}/apply",
            json={"message": "I want this job"}
        )

        # Employer views applications
        override_auth(app, employer_user)
        response = client.get(f"/api/employer/jobs/{sample_job.id}/applications")

        assert response.status_code == 200
        assert len(response.json()) == 1
        assert response.json()[0]["worker_id"] == worker_profile.id

        print("View job applications: Pass")

class TestSearchWorkers:
    """Tests for GET /api/employer/workers"""

    def test_search_workers(
        self, client: TestClient, 
        employer_user, employer_profile,
        worker_profile, db: Session
    ):
        """
        Test: Employer can search for available workers
        """
        override_auth(app, employer_user)

        response = client.get("/api/employer/workers")

        assert response.status_code == 200
        assert len(response.json()) >= 1

        print("Search workers: Pass")

    def test_search_by_city(
        self, client: TestClient, 
        employer_user, employer_profile,
        worker_profile, db: Session
    ):
        """
        Test: Filter workers by city
        """
        override_auth(app, employer_user)

        # Should find workers in Dehiwala
        response = client.get("/api/employer/workers?city=Dehiwala")
        assert len(response.json()) >= 1

        # Should not find workers in Kandy
        kandy = client.get("/api/employer/workers?city=Kandy")
        assert len(kandy.json()) == 0

        print("Search workers by city: Pass")
