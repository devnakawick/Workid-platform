"""
Pydantic schemas for AI endpoints
"""

from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List

# ======= Natural Language Search =======

class NLPSearchRequest(BaseModel):
    """
    Request schema for natural language search parsing
    """
    query: str = Field(
        ...,
        min_length=3,
        max_length=500,
        description="Natural language search query"
    )
    with_suggestions: bool = Field(
        default=False,
        description="Include search suggestions if query is incomplete"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "query": "need urgent plumber colombo cheap",
                "with_suggestions": False
            }
        }

class ParsedQuery(BaseModel):
    """
    Parsed components of natural language query
    """
    category: Optional[str] = Field(None, description="Job category")
    city: Optional[str] = Field(None, description="City name")
    district: Optional[str] = Field(None, description="District name")
    province: Optional[str] = Field(None, description="Province name")
    budget: Optional[float] = Field(None, description="Specific budget amount")
    budget_preference: Optional[str] = Field(None, description="Budget preference")
    urgency: Optional[str] = Field(None, description="Urgency level")
    keywords: Optional[List[str]] = Field(default=[], description="Extracted keywords")
    original_query: Optional[str] = Field(None, description="Original query text")

class APIParameters(BaseModel):
    """
    API-ready search parameters
    """
    category: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    min_budget: Optional[float] = None
    max_budget: Optional[float] = None
    urgency: Optional[str] = None
    keywords: Optional[List[str]] = None

class SearchSuggestions(BaseModel):
    """
    Suggestions for incomplete queries
    """
    cities: Optional[List[str]] = Field(None, description="Suggested cities")
    add_filters: Optional[List[str]] = Field(None, description="Suggested filters to add")

class NLPSearchResponse(BaseModel):
    """
    Response schema for natural language search parsing
    """
    parsed: ParsedQuery
    api_params: APIParameters
    suggestions: Optional[SearchSuggestions] = None

    class Config:
        json_schema_extra = {
            "example": {
                "parsed": {
                    "category": "plumbing",
                    "city": "Colombo",
                    "district": "Colombo",
                    "province": "Western",
                    "budget_preference": "cheap",
                    "urgency": "high",
                    "keywords": ["urgent", "plumber", "colombo", "cheap"],
                    "original_query": "need urgent plumber colombo cheap"
                },
                "api_params": {
                    "category": "plumbing",
                    "city": "Colombo",
                    "district": "Colombo",
                    "max_budget": 2100,
                    "urgency": "high",
                    "keywords": ["urgent", "plumber", "colombo", "cheap"]
                },
                "suggestions": None
            }
        }

class NLPSearchExecuteResponse(BaseModel):
    """
    Response schema execute search
    """
    query: str
    parsed_as: ParsedQuery
    total: int
    page: int
    page_size: int
    jobs: List[Any] 

    class Config:
        json_schema_extra = {
            "example": {
                "query": "urgent plumber colombo",
                "parsed_as": {
                    "category": "plumbing",
                    "city": "Colombo",
                    "district": "Colombo",
                    "province": "Western",
                    "urgency": "high"
                },
                "total": 5,
                "page": 1,
                "page_size": 20,
                "jobs": []
        }
    }