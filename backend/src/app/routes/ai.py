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
    NLPSearchExecuteResponse
)
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