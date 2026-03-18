from typing import Dict, List, Tuple
import math
import logging

logger = logging.getLogger(__name__)

class MatchScorer:
    """
    Calculate match score between worker and job based on multiple factors:
    - Skills match
    - Location proximity
    - Experience level
    - Availability
    - Reputation/Rating
    """
    
    def __init__(self):
        # Configurable weights for different factors
        self.weights = {
            'skills': 0.35,
            'location': 0.25,
            'experience': 0.15,
            'rating': 0.15,
            'availability': 0.10
        }
    
    def calculate_skills_score(
        self,
        worker_skills: List[str],
        job_required_skills: List[str]
    ) -> float:
        """
        Calculate skills match using Jaccard similarity
        Score: 0.0 to 1.0
        """
        if not worker_skills or not job_required_skills:
            return 0.0
        
        # Convert to lowercase sets
        worker_set = set(s.lower().strip() for s in worker_skills)
        job_set = set(s.lower().strip() for s in job_required_skills)
        
        # Jaccard similarity: intersection / union
        intersection = len(worker_set.intersection(job_set))
        union = len(worker_set.union(job_set))
        
        if union == 0:
            return 0.0
        
        return intersection / union
    
    def calculate_location_score(
        self,
        worker_lat: float,
        worker_lon: float,
        job_lat: float,
        job_lon: float,
        max_distance_km: float = 50.0
    ) -> float:
        """
        Calculate location proximity score using Haversine formula
        Score: 1.0 (very close) to 0.0 (far away)
        """
        if not all([worker_lat, worker_lon, job_lat, job_lon]):
            return 0.5  # Neutral score if coordinates missing
        
        # Haversine formula to calculate distance
        distance_km = self._haversine_distance(
            worker_lat, worker_lon,
            job_lat, job_lon
        )
        
        # Convert distance to score
        # Within 5km = 1.0 score
        # Beyond max_distance_km = 0.0 score
        if distance_km <= 5:
            return 1.0
        elif distance_km >= max_distance_km:
            return 0.0
        else:
            # Linear decay from 5km to max_distance_km
            return 1.0 - ((distance_km - 5) / (max_distance_km - 5))
    
    def _haversine_distance(
        self,
        lat1: float,
        lon1: float,
        lat2: float,
        lon2: float
    ) -> float:
        """
        Calculate distance between two points using Haversine formula
        Returns distance in kilometers
        """
        # Earth radius in kilometers
        R = 6371.0
        
        # Convert degrees to radians
        lat1_rad = math.radians(lat1)
        lon1_rad = math.radians(lon1)
        lat2_rad = math.radians(lat2)
        lon2_rad = math.radians(lon2)
        
        # Differences
        dlat = lat2_rad - lat1_rad
        dlon = lon2_rad - lon1_rad
        
        # Haversine formula
        a = (math.sin(dlat / 2)**2 + 
             math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        
        distance = R * c
        return distance
    
    def calculate_experience_score(
        self,
        worker_experience_years: int,
        job_required_experience: int
    ) -> float:
        """
        Calculate experience match score
        Score: 1.0 if meets requirement, scaled if less
        """
        if job_required_experience == 0:
            return 1.0  # No experience required
        
        if worker_experience_years >= job_required_experience:
            return 1.0  # Meets or exceeds requirement
        else:
            # Partial credit for partial experience
            ratio = worker_experience_years / job_required_experience
            return max(0.0, ratio)
    
    def calculate_rating_score(
        self,
        worker_rating: float,
        worker_total_jobs: int,
        min_jobs_for_boost: int = 10
    ) -> float:
        """
        Calculate reputation score based on rating and experience
        Score: 0.0 to 1.0
        """
        if worker_rating < 0 or worker_rating > 5:
            logger.warning(f"Invalid rating: {worker_rating}")
            return 0.5
        
        # Normalize rating to 0-1 scale
        rating_score = worker_rating / 5.0
        
        # Boost score for experienced workers
        if worker_total_jobs >= min_jobs_for_boost:
            experience_boost = min(0.1, worker_total_jobs * 0.005)
            rating_score = min(1.0, rating_score + experience_boost)
        
        return rating_score
    
    def calculate_availability_score(
        self,
        is_available: bool,
        worker_available_from: str = None,
        job_start_date: str = None
    ) -> float:
        """
        Calculate availability match score
        Score: 1.0 if available now, 0.5 if available soon, 0.0 if not available
        """
        if not is_available:
            return 0.0
        
        # If both dates provided, check overlap
        if worker_available_from and job_start_date:
            from datetime import datetime
            
            try:
                worker_date = datetime.fromisoformat(worker_available_from.replace('Z', '+00:00'))
                job_date = datetime.fromisoformat(job_start_date.replace('Z', '+00:00'))
                
                # If worker available before job starts
                if worker_date <= job_date:
                    return 1.0
                else:
                    # Penalize if worker available too late
                    days_late = (worker_date - job_date).days
                    if days_late > 7:
                        return 0.0
                    else:
                        return 1.0 - (days_late / 7.0)
            except Exception as e:
                logger.error(f"Error parsing dates: {e}")
                return 0.5
        
        # Default: available now
        return 1.0
    
    def calculate_match_score(
        self,
        worker: Dict,
        job: Dict
    ) -> Dict:
        """
        Calculate overall match score between worker and job
        
        Args:
            worker: Worker profile dictionary
            job: Job posting dictionary
        
        Returns:
            Dictionary with overall score and breakdown
        """
        try:
            # Calculate individual scores
            skills_score = self.calculate_skills_score(
                worker.get('skills', []),
                job.get('required_skills', [])
            )
            
            location_score = self.calculate_location_score(
                worker.get('latitude', 0),
                worker.get('longitude', 0),
                job.get('latitude', 0),
                job.get('longitude', 0)
            )
            
            experience_score = self.calculate_experience_score(
                worker.get('experience_years', 0),
                job.get('experience_required', 0)
            )
            
            rating_score = self.calculate_rating_score(
                worker.get('rating', 0),
                worker.get('total_jobs_completed', 0)
            )
            
            availability_score = self.calculate_availability_score(
                worker.get('is_available', False),
                worker.get('available_from'),
                job.get('start_date')
            )
            
            # Calculate weighted overall score
            overall_score = (
                skills_score * self.weights['skills'] +
                location_score * self.weights['location'] +
                experience_score * self.weights['experience'] +
                rating_score * self.weights['rating'] +
                availability_score * self.weights['availability']
            )
            
            # Return detailed breakdown
            return {
                'overall_score': round(overall_score, 3),
                'skills_score': round(skills_score, 3),
                'location_score': round(location_score, 3),
                'experience_score': round(experience_score, 3),
                'rating_score': round(rating_score, 3),
                'availability_score': round(availability_score, 3),
                'match_percentage': round(overall_score * 100, 1),
                'match_tier': self._get_match_tier(overall_score)
            }
            
        except Exception as e:
            logger.error(f"Error calculating match score: {str(e)}")
            return {
                'overall_score': 0.0,
                'error': str(e)
            }
    
    def _get_match_tier(self, score: float) -> str:
        """
        Convert numeric score to qualitative tier
        """
        if score >= 0.8:
            return 'Excellent Match'
        elif score >= 0.6:
            return 'Good Match'
        elif score >= 0.4:
            return 'Fair Match'
        elif score >= 0.2:
            return 'Poor Match'
        else:
            return 'Not Recommended'
    
    def batch_calculate_scores(
        self,
        worker: Dict,
        jobs: List[Dict]
    ) -> List[Dict]:
        """
        Calculate match scores for multiple jobs efficiently
        
        Returns:
            List of jobs with match scores, sorted by score
        """
        scored_jobs = []
        
        for job in jobs:
            score = self.calculate_match_score(worker, job)
            job_copy = job.copy()
            job_copy['match_score'] = score
            scored_jobs.append(job_copy)
        
        # Sort by overall score descending
        scored_jobs.sort(key=lambda x: x['match_score']['overall_score'], reverse=True)
        
        return scored_jobs