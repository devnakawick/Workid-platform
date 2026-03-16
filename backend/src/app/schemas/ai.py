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

# ======= Skill Extraction =======

class SkillExtractionRequest(BaseModel):
    """Request schema for skill extraction"""
    text: str = Field(
        ...,
        min_length=10,
        max_length=5000,
        description="Text to extract skills from  job description"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "text": "Need plumber to fix kitchen sink and bathroom pipes. Should have drainage experience."
            }
        }

class SkillExtractionResponse(BaseModel):
    """
    Response schema for skill extraction
    """
    category: Optional[str] = Field(None, description="Detected job category")
    skills: List[str] = Field(default=[], description="List of skills found")
    confidence: float = Field(default=0.0, description="Confidence score (0-1)")
    all_matches: Dict[str, List[str]] = Field(default={}, description="All category matches found")
    
    class Config:
        json_schema_extra = {
            "example": {
                "category": "plumbing",
                "skills": ["pipe", "sink", "drainage"],
                "confidence": 0.85,
                "all_matches": {
                    "plumbing": ["pipe", "sink", "drainage", "bathroom"]
                }
            }
        }

class CategoryValidationRequest(BaseModel):
    """
    Request schema for category validation
    """
    text: str = Field(..., min_length=10, description="Job description")
    claimed_category: str = Field(..., description="Category employer selected")
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "Need plumber to fix pipes",
                "claimed_category": "plumbing"
            }
        }

class CategoryValidationResponse(BaseModel):
    """
    Response schema for category validation
    """
    is_valid: bool = Field(..., description="Is the claimed category correct?")
    detected_category: Optional[str] = Field(None, description="Category detected from text")
    confidence: float = Field(default=0.0, description="Confidence in detection")
    suggestion: Optional[str] = Field(None, description="Suggestion if category is wrong")
    
    class Config:
        json_schema_extra = {
            "example": {
                "is_valid": True,
                "detected_category": "plumbing",
                "confidence": 0.85,
                "suggestion": None
            }
        }

# ======= Spam & Fraud Detection =======

class SpamCheckRequest(BaseModel):
    """Request for spam detection"""
    job_title: str = Field(..., min_length=3, max_length=200)
    job_description: str = Field(..., min_length=10, max_length=5000)
    budget: Optional[float] = Field(None, description="Job budget")
    
    class Config:
        json_schema_extra = {
            "example": {
                "job_title": "Plumber needed",
                "job_description": "Need plumber to fix kitchen sink",
                "budget": 3000
            }
        }

class SpamCheckResponse(BaseModel):
    """Response for spam detection"""
    is_spam: bool
    spam_score: float = Field(..., ge=0.0, le=1.0)
    confidence: str     # high, medium, low
    reasons: List[str]
    recommendation: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "is_spam": False,
                "spam_score": 0.15,
                "confidence": "low",
                "reasons": [],
                "recommendation": "Job appears legitimate"
            }
        }

class FraudCheckResponse(BaseModel):
    """Response for fraud detection"""
    is_suspicious: bool
    fraud_score: float = Field(..., ge=0.0, le=1.0)
    flags: List[str]
    details: Dict[str, Any]
    recommendation: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "is_suspicious": False,
                "fraud_score": 0.25,
                "flags": [],
                "details": {
                    "recent_jobs_24h": 2,
                    "total_jobs": 5,
                    "account_age_days": 30
                },
                "recommendation": "Account behavior appears normal"
            }
        }

# ======= Anomaly Detection =======

class WageAnomalyRequest(BaseModel):
    """Request for wage anomaly detection"""
    category: str = Field(..., description="Job category")
    budget: float = Field(..., description="Proposed budget")

    class Config:
        json_schema_extra = {
            "example": {
                "category": "plumbing",
                "budget": 3000
            }
        }

class WageAnomalyResponse(BaseModel):
    """Response for wage anomalt detection"""
    is_anomaly: bool
    reason: str
    severity: str
    details: Optional[Dict[str, Any]] = None
    recommendation: Optional[str] = None

# ======= Content Moderation =======

class ContentModerationRequest(BaseModel):
    """Request for content moderation"""
    text: str = Field(..., min_length=5, max_length=5000)
    text_type: str = Field(default="job_description", description="Type of content")

    class Config: 
        json_schema_extra = {
            "example": {
                "text": "Need experienced worker for construction",
                "text_type": "job_description"
            }
        }

class ContentModerationResponse(BaseModel):
    """Response for content moderation"""
    is_appropriate: bool
    issues: List[Dict[str, Any]]
    severity: str
    issue_count: int
    recommendation: str
