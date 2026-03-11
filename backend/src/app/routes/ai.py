"""
API endpoints for AI features
"""

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.ai import (
    NLPSearchRequest,
    NLPSearchResponse,
    NLPSearchExecuteResponse,
    SkillExtractionRequest,
    SkillExtractionResponse,
    CategoryValidationRequest,
    CategoryValidationResponse,
    SpamCheckRequest,
    SpamCheckResponse,
    FraudCheckResponse
)
from app.models.user import User
from app.utils.dependencies import get_current_user
from app.services.ai_service import AIService
from app.services.job_service import JobService

router = APIRouter(
    prefix="/api/ai",
    tags=["AI - NLP & Search"]
)

# Initialize AI service
ai_service = AIService()

# ======= Endpoints =======

@router.post("/search/parse", response_model=NLPSearchExecuteResponse)
async def parse_search_query(
    request: NLPSearchRequest, 
    db: Session = Depends(get_db)
):
    """
    Parse natural language search query
    """
    try:
        result = ai_service.parse_search_query(
            query=request.query,
            with_suggestions=request.with_suggestions
        )

        return NLPSearchResponse(**result)
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse query: {str(e)}"
        )
    
@router.get("/search/execute", response_model=NLPSearchExecuteResponse)
async def execute_nl_search(
    query: str,
    page: int = 1,
    page_size: int = 20,
    db: Session = Depends(get_db)
):
    """
    Execute natural language search
    """
    try:
        # Parse the query using AI service
        parse_result = ai_service.parse_search_query(query=query)
        parsed = parse_result['parsed']
        api_params = parse_result['api_params']

        # Execute search using JobService
        skip = (page - 1) * page_size

        jobs = JobService.search_jobs(
            db=db,
            category=api_params.get('category'),
            city=api_params.get('city'),
            district=api_params.get('district'),
            min_budget=api_params.get('min_budget'),
            max_budget=api_params.get('max_budget'),
            urgency=api_params.get('urgency'),
            skip=skip,
            limit=page_size
        )

        return NLPSearchExecuteResponse(
            query=query,
            parsed_as=parsed,
            total=len(jobs),
            page=page,
            page_size=page_size,
            jobs=jobs
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Search failed: {str(e)}"
        )
    
@router.post("/skills/extract", response_model=SkillExtractionResponse)
async def extract_skills(
    request: SkillExtractionRequest,
    db: Session = Depends(get_db)
):
    """
    Extract skills from job description
    """
    try:
        result = ai_service.extract_skills(request.text)
        return SkillExtractionResponse(**result)
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to extract skills: {str(e)}"
        )
    
@router.post("/category/validate", response_model=CategoryValidationResponse)
async def validate_category(
    request: CategoryValidationRequest,
    db: Session = Depends(get_db)
):
    """
    Validate if job catefory matches description
    """
    try:
        result = ai_service.validate_job_category(
            text=request.text,
            claimed_category=request.claimed_category
        )
        return CategoryValidationResponse(**result)
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to validate category: {str(e)}"
        )
    
@router.get("/category/suggest")
async def suggest_category(
    text: str,
    db: Session = Depends(get_db)
):
    """
    Quick category suggestion
    """
    try:
        category = ai_service.suggest_job_category(text)
        return {
            "suggested_category": category,
            "text_analyzed": text[:100]  # Show first 100 chars
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to suggest category: {str(e)}"
        )
    
@router.post("/spam/check", response_model=SpamCheckResponse)
async def check_spam(
    request: SpamCheckRequest,
    db: Session = Depends(get_db)
):
    """
    Check if job posting is spam/fake
    """
    try:
        result = ai_service.check_spam(
            job_title=request.job_title,
            job_description=request.job_description,
            budget=request.budget
        )
        return SpamCheckResponse(**result)
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Spam check failed: {str(e)}"
        )
    
@router.get("/fraud/check-employer/{employer_id}", response_model=FraudCheckResponse)
async def check_employer_fraud(
    employer_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Check employer account for fraudulent behavior
    """
    try:
        result = ai_service.check_employer_fraud(db, employer_id)
        return FraudCheckResponse(**result)
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Fraud check failed: {str(e)}"
        )
    
@router.get("/fraud/check-worker/{worker_id}", response_model=FraudCheckResponse)
async def check_worker_fraud(
    worker_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Check worker account for fraudulent behavior
    """
    try:
        result = ai_service.check_worker_fraud(db, worker_id)
        return FraudCheckResponse(**result)
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Fraud check failed: {str(e)}"
        )