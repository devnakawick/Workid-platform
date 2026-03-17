import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    """Create test client with test database"""
    from app.database import Base, get_db
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from sqlalchemy.pool import StaticPool
    
    # Create test database
    engine = create_engine('sqlite:///:memory:', connect_args={'check_same_thread': False}, poolclass=StaticPool)
    Base.metadata.create_all(bind=engine)
    
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    # Clean up
    app.dependency_overrides.clear()

def test_send_otp(client: TestClient):
    """Test sending OTP"""
    response = client.post(
        "/api/auth/send-otp",
        json={"phone_number": "0771234567"}
    )
    assert response.status_code == 200
    assert "message" in response.json()

def test_verify_otp_invalid(client: TestClient):
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
    response = TestClient(app).get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"