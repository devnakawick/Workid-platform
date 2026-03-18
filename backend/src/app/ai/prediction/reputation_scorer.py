from typing import Dict, List
import numpy as np
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class ReputationScorer:
    """
    Calculate reputation/trust scores for workers and employers
    Based on multiple behavioral and performance factors
    """
    
    def __init__(self):
        # Weights for score calculation
        self.worker_weights = {
            'rating': 0.30,
            'completion_rate': 0.25,
            'response_time': 0.15,
            'consistency': 0.15,
            'experience': 0.10,
            'verification': 0.05
        }
        
        self.employer_weights = {
            'rating': 0.35,
            'payment_punctuality': 0.30,
            'job_clarity': 0.20,
            'response_time': 0.10,
            'verification': 0.05
        }
    
    # ========== WORKER REPUTATION ==========
    
    def calculate_worker_reputation(
        self,
        worker_data: Dict
    ) -> Dict:
        """
        Calculate overall reputation score for a worker
        
        Args:
            worker_data: Dictionary containing:
                - average_rating: float (0-5)
                - jobs_completed: int
                - jobs_accepted: int
                - avg_response_time_hours: float
                - rating_history: List[Dict] with 'rating' and 'date'
                - total_jobs_completed: int
                - is_verified: bool
                - has_background_check: bool
        
        Returns:
            Dictionary with reputation score and breakdown
        """
        try:
            # Calculate individual components
            rating_score = self._score_rating(
                worker_data.get('average_rating', 0)
            )
            
            completion_score = self._score_completion_rate(
                worker_data.get('jobs_completed', 0),
                worker_data.get('jobs_accepted', 0)
            )
            
            response_score = self._score_response_time(
                worker_data.get('avg_response_time_hours', 24)
            )
            
            consistency_score = self._score_consistency(
                worker_data.get('rating_history', [])
            )
            
            experience_score = self._score_experience(
                worker_data.get('total_jobs_completed', 0)
            )
            
            verification_score = self._score_verification(
                worker_data.get('is_verified', False),
                worker_data.get('has_background_check', False)
            )
            
            # Calculate weighted overall score
            overall_score = (
                rating_score * self.worker_weights['rating'] +
                completion_score * self.worker_weights['completion_rate'] +
                response_score * self.worker_weights['response_time'] +
                consistency_score * self.worker_weights['consistency'] +
                experience_score * self.worker_weights['experience'] +
                verification_score * self.worker_weights['verification']
            )
            
            # Convert to 0-100 scale
            reputation_score = overall_score * 100
            
            return {
                'reputation_score': round(reputation_score, 2),
                'tier': self._get_tier(reputation_score),
                'trust_level': self._get_trust_level(reputation_score),
                'breakdown': {
                    'rating': round(rating_score * 100, 2),
                    'completion_rate': round(completion_score * 100, 2),
                    'response_time': round(response_score * 100, 2),
                    'consistency': round(consistency_score * 100, 2),
                    'experience': round(experience_score * 100, 2),
                    'verification': round(verification_score * 100, 2)
                },
                'strengths': self._identify_strengths(worker_data, 'worker'),
                'improvements': self._identify_improvements(worker_data, 'worker')
            }
            
        except Exception as e:
            logger.error(f"Error calculating worker reputation: {str(e)}")
            return {
                'reputation_score': 0,
                'tier': 'New',
                'error': str(e)
            }
    
    # ========== EMPLOYER REPUTATION ==========
    
    def calculate_employer_reputation(
        self,
        employer_data: Dict
    ) -> Dict:
        """
        Calculate reputation score for an employer
        
        Args:
            employer_data: Dictionary containing:
                - average_rating: float (0-5)
                - jobs_posted: int
                - jobs_completed: int
                - on_time_payments: int
                - total_payments: int
                - avg_response_time_hours: float
                - is_verified: bool
        
        Returns:
            Dictionary with reputation score and breakdown
        """
        try:
            rating_score = self._score_rating(
                employer_data.get('average_rating', 0)
            )
            
            payment_score = self._score_payment_punctuality(
                employer_data.get('on_time_payments', 0),
                employer_data.get('total_payments', 0)
            )
            
            clarity_score = self._score_job_clarity(
                employer_data.get('jobs_completed', 0),
                employer_data.get('jobs_posted', 0)
            )
            
            response_score = self._score_response_time(
                employer_data.get('avg_response_time_hours', 24)
            )
            
            verification_score = self._score_verification(
                employer_data.get('is_verified', False),
                False  # Employers don't need background check
            )
            
            # Calculate weighted score
            overall_score = (
                rating_score * self.employer_weights['rating'] +
                payment_score * self.employer_weights['payment_punctuality'] +
                clarity_score * self.employer_weights['job_clarity'] +
                response_score * self.employer_weights['response_time'] +
                verification_score * self.employer_weights['verification']
            )
            
            reputation_score = overall_score * 100
            
            return {
                'reputation_score': round(reputation_score, 2),
                'tier': self._get_tier(reputation_score),
                'trust_level': self._get_trust_level(reputation_score),
                'breakdown': {
                    'rating': round(rating_score * 100, 2),
                    'payment_punctuality': round(payment_score * 100, 2),
                    'job_clarity': round(clarity_score * 100, 2),
                    'response_time': round(response_score * 100, 2),
                    'verification': round(verification_score * 100, 2)
                },
                'strengths': self._identify_strengths(employer_data, 'employer'),
                'improvements': self._identify_improvements(employer_data, 'employer')
            }
            
        except Exception as e:
            logger.error(f"Error calculating employer reputation: {str(e)}")
            return {
                'reputation_score': 0,
                'tier': 'New',
                'error': str(e)
            }
    
    # ========== SCORING COMPONENTS ==========
    
    def _score_rating(self, average_rating: float) -> float:
        """Convert 0-5 rating to 0-1 score"""
        if average_rating < 0 or average_rating > 5:
            return 0.0
        return average_rating / 5.0
    
    def _score_completion_rate(self, completed: int, accepted: int) -> float:
        """Score job completion rate"""
        if accepted == 0:
            return 0.8  # Neutral for new workers
        return min(1.0, completed / accepted)
    
    def _score_response_time(self, avg_hours: float) -> float:
        """Score response time (faster = better)"""
        if avg_hours <= 1:
            return 1.0
        elif avg_hours >= 48:
            return 0.0
        else:
            return max(0.0, 1.0 - (avg_hours - 1) / 47)
    
    def _score_consistency(self, rating_history: List[Dict]) -> float:
        """Score rating consistency over time"""
        if not rating_history or len(rating_history) < 3:
            return 0.7  # Neutral for new workers
        
        ratings = [r['rating'] for r in rating_history]
        std_dev = np.std(ratings)
        
        # Lower std_dev = more consistent = higher score
        consistency = max(0.0, 1.0 - (std_dev / 2.0))
        return consistency
    
    def _score_experience(self, total_jobs: int) -> float:
        """Score experience level (logarithmic)"""
        if total_jobs == 0:
            return 0.0
        
        # Logarithmic scaling
        # 10 jobs ≈ 0.5, 50 jobs ≈ 0.8, 100+ jobs ≈ 1.0
        score = np.log1p(total_jobs) / np.log1p(100)
        return min(1.0, score)
    
    def _score_verification(self, is_verified: bool, has_background_check: bool) -> float:
        """Score verification status"""
        if is_verified and has_background_check:
            return 1.0
        elif is_verified:
            return 0.7
        else:
            return 0.3
    
    def _score_payment_punctuality(self, on_time: int, total: int) -> float:
        """Score employer payment punctuality"""
        if total == 0:
            return 0.8  # Neutral for new employers
        return min(1.0, on_time / total)
    
    def _score_job_clarity(self, completed: int, posted: int) -> float:
        """Score job posting clarity (completion rate)"""
        if posted == 0:
            return 0.8
        return min(1.0, completed / posted)
    
    # ========== UTILITIES ==========
    
    def _get_tier(self, score: float) -> str:
        """Get reputation tier"""
        if score >= 90:
            return 'Excellent'
        elif score >= 75:
            return 'Very Good'
        elif score >= 60:
            return 'Good'
        elif score >= 40:
            return 'Fair'
        elif score >= 20:
            return 'Poor'
        else:
            return 'New'
    
    def _get_trust_level(self, score: float) -> str:
        """Get trust level"""
        if score >= 80:
            return 'Highly Trusted'
        elif score >= 60:
            return 'Trusted'
        elif score >= 40:
            return 'Moderate Trust'
        else:
            return 'Building Trust'
    
    def _identify_strengths(self, data: Dict, user_type: str) -> List[str]:
        """Identify user's strengths"""
        strengths = []
        
        if user_type == 'worker':
            if data.get('average_rating', 0) >= 4.5:
                strengths.append('Highly rated by employers')
            if data.get('avg_response_time_hours', 24) <= 2:
                strengths.append('Very responsive')
            if data.get('total_jobs_completed', 0) >= 50:
                strengths.append('Experienced worker')
            if data.get('has_background_check', False):
                strengths.append('Background verified')
        else:  # employer
            if data.get('average_rating', 0) >= 4.5:
                strengths.append('Highly rated by workers')
            on_time_rate = data.get('on_time_payments', 0) / max(data.get('total_payments', 1), 1)
            if on_time_rate >= 0.95:
                strengths.append('Always pays on time')
            if data.get('is_verified', False):
                strengths.append('Verified employer')
        
        return strengths
    
    def _identify_improvements(self, data: Dict, user_type: str) -> List[str]:
        """Identify areas for improvement"""
        improvements = []
        
        if user_type == 'worker':
            if data.get('average_rating', 0) < 3.5:
                improvements.append('Improve service quality')
            completion_rate = data.get('jobs_completed', 0) / max(data.get('jobs_accepted', 1), 1)
            if completion_rate < 0.8:
                improvements.append('Complete more accepted jobs')
            if data.get('avg_response_time_hours', 24) > 12:
                improvements.append('Respond to job offers faster')
            if not data.get('is_verified', False):
                improvements.append('Complete profile verification')
        else:  # employer
            if data.get('average_rating', 0) < 3.5:
                improvements.append('Improve job descriptions and treatment of workers')
            on_time_rate = data.get('on_time_payments', 0) / max(data.get('total_payments', 1), 1)
            if on_time_rate < 0.8:
                improvements.append('Pay workers on time')
            if not data.get('is_verified', False):
                improvements.append('Complete business verification')
        
        return improvements
    
    def predict_reliability(self, reputation_score: float) -> Dict:
        """
        Predict if user is reliable based on reputation
        """
        is_reliable = reputation_score >= 60
        confidence = abs(reputation_score - 60) / 40
        
        return {
            'is_reliable': is_reliable,
            'confidence': round(min(1.0, confidence), 2),
            'recommendation': 'Recommended' if is_reliable else 'Proceed with caution'
        }