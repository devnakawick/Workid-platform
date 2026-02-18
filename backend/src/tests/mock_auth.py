"""
Mock authentication for testing
"""

from app.models.user import User
from sqlalchemy.orm import Session

def create_mock_auth(mock_user: User):
    """
    Create a mock authentication function
    """
    async def mock_get_current_user():
        return mock_user
    
    return mock_get_current_user

def override_auth(app, mock_user: User):
    """
    Override authentication to use mock_user
    """
    from app.utils.dependencies import get_current_user
    
    async def mock_get_current_user():
        return mock_user
    
    app.dependency_overrides[get_current_user] = mock_get_current_user