import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_send_otp():
    """Test sending OTP"""
    response = client.post(
        "/api/auth/send-otp",
        json={"phone_number": "0771234567"}
    )
    assert response.status_code == 200
    assert "message" in response.json()

def test_verify_otp_invalid():
    """Test verifying invalid OTP"""
    response = client.post(
        "/api/auth/verify-otp",
        json={
            "phone_number": "0771234567",
            "otp": "000000"
        }
    )
    assert response.status_code == 400

def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"