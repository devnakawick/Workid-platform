from fastapi import APIRouter, HTTPException, Depends, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.database import get_db
from app.utils.dependencies import get_current_user, get_current_worker, get_current_employer
from app.models.user import User
from app.models.worker import Worker
from app.models.employer import Employer
from app.models.job import Job

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
    FraudCheckResponse,
    WageAnomalyRequest,
    WageAnomalyResponse,
    ContentModerationRequest,
    ContentModerationResponse
)
from app.ai.recommend.job_recommender import JobRecommender
from app.ai.recommend.worker_recommender import WorkerRecommender
from app.ai.utils.scoring import MatchScorer
from app.ai.prediction.wage_predictor import FairWagePredictor
from app.ai.prediction.reputation_scorer import ReputationScorer
from app.models.user import User
from app.utils.dependencies import get_current_user
from app.services.ai_service import AIService
from app.services.job_service import JobService

router = APIRouter(
    prefix="/api/ai",
    tags=["AI & ML - NLP & Search"]
)
# Initialize AI service
job_recommender = JobRecommender()
worker_recommender = WorkerRecommender()
match_scorer = MatchScorer()
wage_predictor = FairWagePredictor()
reputation_scorer = ReputationScorer()

ai_service = AIService()

class WagePredictionRequest(BaseModel):
    category: str
    city: str
    required_skills: List[str] = []
    experience_required: int = 0
    estimated_hours: Optional[float] = None
 
class WageFairnessRequest(BaseModel):
    offered_wage: float
    category: str
    city: str

# ========== JOB RECOMMENDATIONS ==========
@router.get("/jobs/recommended")
async def get_recommended_jobs_for_worker(
    top_n: int = Query(default=10, le=50),
    current_user: User = Depends(get_current_worker),
    db: Session = Depends(get_db)
):
    """
    Get AI-recommended jobs for the current worker
    Uses hybrid recommendation (collaborative + content-based)
    """
    # Get worker profile
    worker = db.query(Worker).filter(Worker.user_id == current_user.id).first()
    
    if not worker:
        raise HTTPException(status_code=404, detail="Worker profile not found")
    
    # Get available jobs
    available_jobs = db.query(Job).filter(
        Job.status == "open"
    ).all()
    
    # Convert to dict
    worker_dict = worker.to_dict()
    jobs_dict = [job.to_dict() for job in available_jobs]
    
    # Get recommendations
    recommended = job_recommender.hybrid_recommend(
        worker_id=str(worker.id),
        worker=worker_dict,
        available_jobs=jobs_dict,
        top_n=top_n
    )
    
    return {
        "recommended_jobs": recommended,
        "count": len(recommended),
        "worker_id": str(worker.id)
    }
 
@router.get("/jobs/trending")
async def get_trending_jobs(
    top_n: int = Query(default=10, le=20),
    days: int = Query(default=7, le=30),
    db: Session = Depends(get_db)
):
    """
    Get trending jobs based on application activity
    """
    available_jobs = db.query(Job).filter(Job.status == "open").all()
    jobs_dict = [job.to_dict() for job in available_jobs]
    
    trending = job_recommender.get_trending_jobs(
        jobs_dict,
        top_n=top_n,
        days=days
    )
    
    return {
        "trending_jobs": trending,
        "count": len(trending),
        "period_days": days
    }

# ========== WORKER RECOMMENDATIONS ==========
 
@router.get("/workers/recommended/{job_id}")
async def get_recommended_workers_for_job(
    job_id: str,
    top_n: int = Query(default=10, le=50),
    current_user: User = Depends(get_current_employer),
    db: Session = Depends(get_db)
):
    """
    Get AI-recommended workers for a specific job
    For employers
    """
    # Get employer profile
    employer = db.query(Employer).filter(Employer.user_id == current_user.id).first()
    
    if not employer:
        raise HTTPException(status_code=404, detail="Employer profile not found")
    
    # Get job
    job = db.query(Job).filter(Job.id == job_id).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Check job belongs to employer
    if str(job.employer_id) != str(employer.id):
        raise HTTPException(status_code=403, detail="Not authorized to access this job")
    
    # Get available workers
    available_workers = db.query(Worker).filter(
        Worker.is_available == True
    ).all()
    
    # Convert to dict
    job_dict = job.to_dict()
    workers_dict = [w.to_dict() for w in available_workers]
    
    # Get recommendations
    recommended = worker_recommender.recommend_workers_hybrid(
        employer_id=str(employer.id),
        job=job_dict,
        available_workers=workers_dict,
        top_n=top_n
    )
    
    return {
        "recommended_workers": recommended,
        "count": len(recommended),
        "job_id": job_id
    }
 
@router.get("/workers/top-rated")
async def get_top_rated_workers(
    category: Optional[str] = None,
    top_n: int = Query(default=10, le=50),
    db: Session = Depends(get_db)
):
    """
    Get top-rated workers, optionally filtered by category
    """
    available_workers = db.query(Worker).all()
    workers_dict = [w.to_dict() for w in available_workers]
    
    top_workers = worker_recommender.get_top_rated_workers(
        workers_dict,
        job_category=category,
        top_n=top_n
    )
    
    return {
        "top_workers": top_workers,
        "count": len(top_workers),
        "category": category
    }
# ========== MATCH SCORING ==========
 
@router.get("/match-score/{job_id}")
async def get_match_score_for_job(
    job_id: str,
    current_user: User = Depends(get_current_worker),
    db: Session = Depends(get_db)
):
    """
    Get match score between current worker and a specific job
    Shows compatibility percentage
    """
    # Get worker
    worker = db.query(Worker).filter(Worker.user_id == current_user.id).first()
    
    if not worker:
        raise HTTPException(status_code=404, detail="Worker profile not found")
    
    # Get job
    job = db.query(Job).filter(Job.id == job_id).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Calculate match score
    match_score = match_scorer.calculate_match_score(
        worker.to_dict(),
        job.to_dict()
    )
    
    return {
        "job_id": job_id,
        "worker_id": str(worker.id),
        "match_score": match_score
    }

# ========== WAGE PREDICTION ==========
 
@router.post("/predict-wage")
async def predict_fair_wage(
    request: WagePredictionRequest
):
    """
    Predict fair wage for a job
    Helps workers know if they're being paid fairly
    """
    if request.estimated_hours:
        # Predict total payment
        prediction = wage_predictor.predict_total_payment(
            category=request.category,
            city=request.city,
            estimated_hours=request.estimated_hours,
            required_skills=request.required_skills,
            experience_required=request.experience_required
        )
    else:
        # Predict hourly wage
        prediction = wage_predictor.predict_hourly_wage(
            category=request.category,
            city=request.city,
            required_skills=request.required_skills,
            experience_required=request.experience_required
        )
    
    return {
        "prediction": prediction,
        "currency": "LKR",
        "note": "Predicted wage based on market rates"
    }
 
@router.post("/check-wage-fairness")
async def check_wage_fairness(
    request: WageFairnessRequest
):
    """
    Check if offered wage is fair
    """
    fairness = wage_predictor.is_wage_fair(
        offered_wage=request.offered_wage,
        category=request.category,
        city=request.city
    )
    
    return {
        "fairness_check": fairness,
        "currency": "LKR"
    }
 
@router.get("/market-rates/{category}")
async def get_market_rates(
    category: str,
    top_n: int = Query(default=5, le=10)
):
    """
    Get market wage rates for a category across cities
    """
    rates = wage_predictor.get_market_rates(category, top_n=top_n)
    
    return {
        "category": category,
        "market_rates": rates,
        "currency": "LKR"
    }
 
# ========== REPUTATION SCORING ==========
 
@router.get("/reputation/worker/{worker_id}")
async def get_worker_reputation(
    worker_id: str,
    db: Session = Depends(get_db)
):
    """
    Get reputation score for a worker
    """
    worker = db.query(Worker).filter(Worker.id == worker_id).first()
    
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    # Prepare data for reputation calculation
    # (In real implementation, fetch from database)
    worker_data = {
        'average_rating': float(worker.rating) if worker.rating else 0,
        'jobs_completed': worker.total_jobs_completed or 0,
        'jobs_accepted': worker.total_jobs_completed or 0,  # TODO: Track separately
        'avg_response_time_hours': 6,  # TODO: Calculate from real data
        'rating_history': [],  # TODO: Fetch from reviews
        'total_jobs_completed': worker.total_jobs_completed or 0,
        'is_verified': worker.is_verified or False,
        'has_background_check': worker.is_background_checked or False
    }
    
    reputation = reputation_scorer.calculate_worker_reputation(worker_data)
    
    return {
        "worker_id": worker_id,
        "reputation": reputation
    }
 
@router.get("/reputation/employer/{employer_id}")
async def get_employer_reputation(
    employer_id: str,
    db: Session = Depends(get_db)
):
    """
    Get reputation score for an employer
    """
    employer = db.query(Employer).filter(Employer.id == employer_id).first()
    
    if not employer:
        raise HTTPException(status_code=404, detail="Employer not found")
    
    # Prepare data
    employer_data = {
        'average_rating': float(employer.rating) if employer.rating else 0,
        'jobs_posted': employer.total_jobs_posted or 0,
        'jobs_completed': employer.total_jobs_completed or 0,
        'on_time_payments': employer.total_jobs_completed or 0,  # TODO: Track
        'total_payments': employer.total_jobs_completed or 0,
        'avg_response_time_hours': 8,  # TODO: Calculate
        'is_verified': employer.is_verified or False
    }
    
    reputation = reputation_scorer.calculate_employer_reputation(employer_data)
    
    return {
        "employer_id": employer_id,
        "reputation": reputation
    }
 
@router.get("/reputation/me")
async def get_my_reputation(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get reputation score for current user
    """
    if current_user.user_type.value == "worker":
        worker = db.query(Worker).filter(Worker.user_id == current_user.id).first()
        if not worker:
            raise HTTPException(status_code=404, detail="Worker profile not found")
        
        worker_data = {
            'average_rating': float(worker.rating) if worker.rating else 0,
            'jobs_completed': worker.total_jobs_completed or 0,
            'jobs_accepted': worker.total_jobs_completed or 0,
            'avg_response_time_hours': 6,
            'rating_history': [],
            'total_jobs_completed': worker.total_jobs_completed or 0,
            'is_verified': worker.is_verified or False,
            'has_background_check': worker.is_background_checked or False
        }
        
        reputation = reputation_scorer.calculate_worker_reputation(worker_data)
        
    elif current_user.user_type.value == "employer":
        employer = db.query(Employer).filter(Employer.user_id == current_user.id).first()
        if not employer:
            raise HTTPException(status_code=404, detail="Employer profile not found")
        
        employer_data = {
            'average_rating': float(employer.rating) if employer.rating else 0,
            'jobs_posted': employer.total_jobs_posted or 0,
            'jobs_completed': employer.total_jobs_completed or 0,
            'on_time_payments': employer.total_jobs_completed or 0,
            'total_payments': employer.total_jobs_completed or 0,
            'avg_response_time_hours': 8,
            'is_verified': employer.is_verified or False
        }
        
        reputation = reputation_scorer.calculate_employer_reputation(employer_data)
    else:
        raise HTTPException(status_code=400, detail="Invalid user type")
    
    return {
        "user_type": current_user.user_type.value,
        "reputation": reputation
    }
# ========== RECORD EVENTS (for ML learning) ==========
 
@router.post("/record/application")
async def record_application(
    job_id: str,
    current_user: User = Depends(get_current_worker),
    db: Session = Depends(get_db)
):
    """
    Record job application for recommendation learning
    Called automatically when worker applies to job
    """
    worker = db.query(Worker).filter(Worker.user_id == current_user.id).first()
    
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    # Record for collaborative filtering
    job_recommender.record_application(
        worker_id=str(worker.id),
        job_id=job_id
    )
    
    return {"message": "Application recorded for ML"}
 
@router.post("/record/hire")
async def record_hire(
    job_id: str,
    worker_id: str,
    current_user: User = Depends(get_current_employer),
    db: Session = Depends(get_db)
):
    """
    Record successful hire for recommendation learning
    Called when employer hires a worker
    """
    employer = db.query(Employer).filter(Employer.user_id == current_user.id).first()
    
    if not employer:
        raise HTTPException(status_code=404, detail="Employer not found")
    
    # Record for collaborative filtering
    worker_recommender.record_hire(
        employer_id=str(employer.id),
        worker_id=worker_id,
        job_id=job_id
    )
    
    return {"message": "Hire recorded for ML"}

# ======= Serch Endpoints =======

@router.post("/search/parse", response_model=NLPSearchResponse)
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
    
@router.post("/search/parse-multilingual", response_model=NLPSearchResponse)
async def parse_multilinguan_search(
    request: NLPSearchRequest,
    db: Session = Depends(get_db)
):
    """
    Parse search query in any language (Sinhala/Tamil/English)
    """
    try:
        result = ai_service.parse_multilingual_query(
            query=request.query,
            with_suggestions=request.with_suggestions
        )

        return NLPSearchResponse(
            parsed=result['parsed'],
            api_params=result['api_params'],
            suggestions=result['suggestions']
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse multilingual query: {str(e)}"
        )
    
@router.get("/search/execute-multilingual")
async def execute_multilingual_search(
    query: str,
    page: int = 1,
    page_size: int = 20,
    db: Session = Depends(get_db)
):
    """
    Execute search in any language
    """
    try:
        # Parse multilingual query
        parse_result = ai_service.parse_multilingual_query(query)
        api_params = parse_result['api_params']

        # Execute search
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

        return {
            "original_query": parse_result['original_query'],
            "detected_language": parse_result['detected_language'],
            "language_name": parse_result['language_name'],
            "translated_query": parse_result['translated_query'],
            "parsed_as": parse_result['parsed'],
            "total": len(jobs),
            "page": page,
            "page_size": page_size,
            "jobs": jobs
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Multilingual search failed: {str(e)}"
        )

# ======= Skill Extraction Endpoints =======

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

# ======= Spam & Fraud Detection Endpoints =======

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
    
# ======= Anomaly Detection Endpoints =======

@router.post("/anomaly/wage", response_model=WageAnomalyResponse)
async def check_wage_anomaly(
    request: WageAnomalyRequest,
    db: Session = Depends(get_db)
):
    """
    Check if wage/budget is anomolous
    """
    try:
        result = ai_service.check_wage_anomaly(
            category=request.category,
            budget=request.budget
        )
        return WageAnomalyResponse(**result)
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Anomaly check failed: {str(e)}"
        )
    
# ======= Content Moderation Endpoints =======

@router.post("/moderate", response_model=ContentModerationResponse)
async def moderate_content(
    request: ContentModerationRequest,
    db: Session = Depends(get_db)
):
    """
    Moderate content for appropriateness
    """
    try:
        result = ai_service.moderate_content(
            text=request.text,
            text_type=request.text_type
        )
        return ContentModerationResponse(**result)
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Content moderation failed: {str(e)}"
        )