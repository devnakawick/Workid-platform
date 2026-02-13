"""
Test worker endpoints
"""
import requests

BASE_URL = "http://localhost:8000"

def test_create_profile():
    """Test creating worker"""

    # Get JWT token 
    token = "JWT_TOKEN_HERE"     # Replace with real token

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # Create worker profile
    profile_data = {
        "full_name": "John Doe",
        "nic_number": "912345678V",
        "city": "Dehiwala",
        "district": "Colombo",
        "primary_skill": "plumbing",
        "other_skills": ["electrical"],
        "experience_years": 5,
        "daily_rate": 2500.00,
        "bio": "Experienced plumber in Colombo"
    }

    response = requests.post(
        f"{BASE_URL}/api/worker/profile",
        json=profile_data,
        headers=headers
    )

    print(f"Status: {response.status_code}")
    print(f"Respose: {response.json()}")

    if response.status_code == 201:
        print("Profile created successfully!")
    else:
        print("Failed to create profile")

if __name__ == "__main__": 
    print("Worker Endpoint Tests")
    print("=" * 50)