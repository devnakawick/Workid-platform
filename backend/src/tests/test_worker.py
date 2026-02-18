import pytest
import io
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.models.worker import Worker, SkillCategory
from tests.mock_auth import override_auth

# ======= Profile Tests =======
class TestCreateWorkerProfile:
    """Tests for POST /api/worker/profile"""

    def test_create_profile(self, client: TestClient, worker_user, db: Session):
        """
        Test: Worker can create their profile successfully
        """
        # Logic as worker
        override_auth(app, worker_user)

        # Send profile creation request
        profile_data = {
            "full_name": "John Doe",
            "nic_number": "912345678V",
            "city": "Mount Lavinia",
            "district": "Colombo",
            "primary_skill": "plumbing",
            "other_skills": ["electrical"],
            "experience_years": 5,
            "daily_rate": 2500.00,
            "bio": "Experienced plumber in Mount Lavinia"
        }

        response = client.post("/api/worker/profile", json=profile_data)

        # Check response
        assert response.status_code == 201, f"Expected 201 but got {response.status_code}: {response.json()}"

        data = response.json()
        assert data["full_name"] == "John Doe"
        assert data["city"] == "Mount Lavinia"
        assert data["primary_skill"] == "plumbing"
        assert data["daily_rate"] == 2500.00
        assert data["is_verified"] == False  
        assert data["rating"] == 0.0  

        print("Create profile: Pass")

    def test_create_duplicate_profile(self, client: TestClient, worker_user, worker_profile, db: Session):
        """
        Test: Cannot create a profile twice
        """
        override_auth(app, worker_user)

        profile_data = {
            "full_name": "Jane Doe",
            "nic_number": "987654321V",
            "city": "Galle",
            "district": "Galle",
            "primary_skill": "electrical"
        }

        response = client.post("/api/worker/profile", json=profile_data)

        # Should fail because profile already exists
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"].lower()

        print("Duplicate profile blocked: Pass")

    def test_missing_required_fields(self, client: TestClient, worker_user, db: Session):
        """
        Test: Missing required fields
        """
        override_auth(app, worker_user)

        # Missing required fields
        incomplete_data = {
            "full_name": "John Doe"
            # Missing: nic_number, city, district, primary_skill
        }

        response = client.post("/api/worker/profile", json=incomplete_data)

        assert response.status_code == 422  # Validation error

        print("Missing fields validation: Pass")

    def test_invalid_nic(self, client: TestClient, worker_user, db: Session):
        """
        Test: Invalid NIC format is rejected
        """
        override_auth(app, worker_user)

        profile_data = {
            "full_name": "John Doe",
            "nic_number": "123",  # Invalid
            "city": "Colombo",
            "district": "Colombo",
            "primary_skill": "plumbing"
        }

        response = client.post("/api/worker/profile", json=profile_data)

        assert response.status_code == 422

        print("Invalid NIC rejected: Pass")

class TestGetWorkerProfile:
    """Tests for Get /api/worker/profile"""

    def test_get_profile(self, client: TestClient, worker_user, worker_profile, db: Session):
        """
        Test: Worker can view their own profile
        """

        override_auth(app, worker_user)

        response = client.get("/api/worker/profile")

        assert response.status_code == 200

        data = response.json()
        assert data["full_name"] == "John Doe"
        assert data["city"] == "Dehiwala"
        assert data["primary_skill"] == "plumbing"

        print("Get profile: Pass")

    def test_profile_not_found(self, client: TestClient, worker_user, db: Session):
        """
        Test: Returns 404 if profile doesn't exist
        """
        override_auth(app, worker_user)

        response = client.get("/api/worker/profile")

        assert response.status_code == 404

        print("Profile not found 404: Pass")

class TestUpdateWorkerProfile:
    """Tests for PUT /api/worker/profile"""

    def test_update_profile(self, client: TestClient, worker_user, worker_profile, db: Session):
        """
        Test: Worker can update their profile
        """
        override_auth(app, worker_user)

        update_data = {
            "daily_rate": 3000.00,
            "bio": "Updated bio with 6 years experience",
            "experience_years": 6
        }

        response = client.put("/api/worker/profile", json=update_data)

        assert response.status_code == 200
        db.refresh(worker_profile)  # Refresh from database to get updated values

        data = response.json()
        assert float(data["daily_rate"]) == 2500.00
        assert data["bio"] == "Updated bio with 6 years experience"
        assert data["experience_years"] == 6
        assert data["bio"] == "Updated bio with 6 years experience"
        assert data["experience_years"] == 6
        # Other fields should not change
        assert data["full_name"] == "John Doe"
        assert data["city"] == "Dehiwala"

        print("Update profile: Pass")

class TestToggleAvailability:
    """Tests for PATCH /api/worker/availability"""

    def test_toggle_unavailable(self, client: TestClient, worker_user, worker_profile, db: Session):
        """
        Test: Worker can set themselves as unavailable
        """
        override_auth(app, worker_user)

        response = client.patch(
            "/api/worker/availability",
            json={"is_available": False}
        )

        assert response.status_code == 200
        assert response.json()["is_available"] == False

        print("Toggle unavailable: Pass")

    def test_toggle_available(self, client: TestClient, worker_user, worker_profile, db: Session):
        """
        Test: Worker can set themselves as available
        """
        override_auth(app, worker_user)

        # Set to unavailable first
        client.patch("/api/worker/availability", json={"is_available": False})

        # Set to available
        response = client.patch(
            "/api/worker/availability",
            json={"is_available": True}
        )

        assert response.status_code == 200
        assert response.json()["is_available"] == True

        print("Toggle available: Pass")

# ======= Document Tests =======

class TestDocumentUpload:
    """Tests for POST /api/worker/documents/upload"""

    def test_upload_nic(self, client: TestClient, worker_user, worker_profile, db: Session):
        """
        Test: Worker can upload NIC document
        """
        override_auth(app, worker_user)

        # Create image file
        image = io.BytesIO(b"image for testing")
        image.name = "nic_front.jpg"

        response = client.post(
            "/api/worker/document/upload",
            files={"file": ("nic_front.jpg", image, "image/jpeg")},
            data={"document_type": "nic"}
        )

        assert response.status_code == 201

        data = response.json()
        assert data["document_type"] == "nic"
        assert data["status"] == "pending"  # Starts as pending
        assert data["file_name"] == "nic_front.jpg"

        print("Upload NIC: Pass")

    def test_invalid_file_type(self, client: TestClient, worker_user, worker_profile, db: Session):
        """
        Test: Cannot upload invalid file types
        """
        override_auth(app, worker_user)

        fake_exe = io.BytesIO(b"fake exe content")

        response = client.post(
            "/api/worker/document/upload",
            files={"file": ("virus.exe", fake_exe, "application/octet-stream")},
            data={"document_type": "other"}
        )

        assert response.status_code == 400
        assert "invalid file type" in response.json()["detail"].lower()

        print("Invalid file type blocked: Pass")

    def test_get_documents(self, client: TestClient, worker_user, worker_profile, db: Session):
        """
        Test: Worker can list their uploaded documents
        """
        override_auth(app, worker_user)

        # Upload document
        image = io.BytesIO(b"fake nic image")
        client.post(
            "/api/worker/document/upload",
            files={"file": ("nic.jpg", image, "image/jpeg")},
            data={"document_type": "nic"}
        )

        # Get documents
        response = client.get("/api/worker/documents")

        assert response.status_code == 200
        assert len(response.json()) == 1
        assert response.json()[0]["document_type"] == "nic"

        print("Get documents: Pass")

    def test_delete_document(self, client: TestClient, worker_user, worker_profile, db: Session):
        """
        Test: Worker can delete their document
        """
        override_auth(app, worker_user)

        # Upload document
        fake_image = io.BytesIO(b"fake nic image")
        upload_response = client.post(
            "/api/worker/document/upload",
            files={"file": ("nic.jpg", fake_image, "image/jpeg")},
            data={"document_type": "nic"}
        )
        document_id = upload_response.json()["id"]

        # Delete the doc
        delete_response = client.delete(f"/api/worker/documents/{document_id}")
        assert delete_response.status_code == 204

        # Verify it's gone
        get_response = client.get("/api/worker/documents")
        assert len(get_response.json()) == 0

        print("Delete document: Pass")

# ======= Stats Tests =======

class TestWorkerStats:
    """Tests for GET /api/worker/stats"""

    def test_get_stats(self, client: TestClient, worker_user, worker_profile, db: Session):
        """
        Test: Worker can view their dashboard stats
        """
        override_auth(app, worker_user)

        response = client.get("/api/worker/stats")

        assert response.status_code == 200

        data = response.json()
        assert "experience_years" in data
        assert "is_available" in data
        assert "accepted_applications" in data
        assert "rating" in data
        assert "total_applications" in data
        assert "pending_applications" in data
        assert "is_verified" in data
        assert "is_available" in data

        # Check value matches data
        assert data["total_jobs_completed"] == 10
        assert data["rating"] == 4.5
        assert data["is_verified"] == True

        print("Get worker stats: Pass")