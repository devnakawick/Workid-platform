"""
Worker Recommender System for Employers
Backend Member 1: AI Module
Branch: feature/backend-member1/ai-recommendation
"""

from typing import List, Dict, Tuple
import numpy as np
from collections import defaultdict
import logging

logger = logging.getLogger(__name__)

class WorkerRecommender:
    """
    Recommend best workers for a job posting
    Helps employers find qualified, reliable workers
    """
    
    def __init__(self):
        # Track successful hires
        self.employer_hires = defaultdict(set)  # employer_id -> set of worker_ids
        self.worker_jobs = defaultdict(set)      # worker_id -> set of job_ids completed
        
    def record_hire(self, employer_id: str, worker_id: str, job_id: str):
        """Record a successful hire"""
        self.employer_hires[employer_id].add(worker_id)
        self.worker_jobs[worker_id].add(job_id)
        logger.info(f"Recorded hire: Employer {employer_id} hired Worker {worker_id}")
    
    def get_similar_employers(
        self,
        employer_id: str,
        top_n: int = 5
    ) -> List[Tuple[str, float]]:
        """
        Find employers with similar hiring patterns
        """
        hired_workers = self.employer_hires.get(employer_id, set())
        
        if not hired_workers:
            return []
        
        similarities = []
        
        for other_employer in self.employer_hires.keys():
            if other_employer == employer_id:
                continue
            
            other_workers = self.employer_hires.get(other_employer, set())
            
            # Jaccard similarity
            intersection = len(hired_workers.intersection(other_workers))
            union = len(hired_workers.union(other_workers))
            
            if union > 0:
                similarity = intersection / union
                similarities.append((other_employer, similarity))
        
        similarities.sort(key=lambda x: x[1], reverse=True)
        return similarities[:top_n]
    
    def recommend_workers_collaborative(
        self,
        employer_id: str,
        available_workers: List[Dict],
        top_n: int = 20
    ) -> List[Dict]:
        """
        Recommend workers based on what similar employers hired
        """
        already_hired = self.employer_hires.get(employer_id, set())
        similar_employers = self.get_similar_employers(employer_id, top_n=5)
        
        if not similar_employers:
            return []
        
        recommended_workers = defaultdict(float)
        
        for similar_employer, similarity in similar_employers:
            similar_hires = self.employer_hires.get(similar_employer, set())
            
            for worker_id in similar_hires:
                if worker_id not in already_hired:
                    recommended_workers[worker_id] += similarity
        
        # Sort by score
        sorted_workers = sorted(
            recommended_workers.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        # Get worker objects
        worker_dict = {w['id']: w for w in available_workers}
        
        result = []
        for worker_id, score in sorted_workers[:top_n]:
            if worker_id in worker_dict:
                worker = worker_dict[worker_id].copy()
                worker['collab_score'] = round(score, 3)
                result.append(worker)
        
        return result
    
    def recommend_workers_content(
        self,
        job: Dict,
        available_workers: List[Dict],
        top_n: int = 20
    ) -> List[Dict]:
        """
        Recommend workers based on job requirements match
        """
        from app.ai.utils.scoring import MatchScorer
        
        scorer = MatchScorer()
        scored_workers = []
        
        for worker in available_workers:
            # Calculate match score
            match_score = scorer.calculate_match_score(worker, job)
            
            worker_copy = worker.copy()
            worker_copy['content_score'] = match_score['overall_score']
            worker_copy['match_breakdown'] = match_score
            scored_workers.append(worker_copy)
        
        # Sort by score
        scored_workers.sort(key=lambda x: x['content_score'], reverse=True)
        
        return scored_workers[:top_n]
    
    def recommend_workers_hybrid(
        self,
        employer_id: str,
        job: Dict,
        available_workers: List[Dict],
        top_n: int = 10,
        collab_weight: float = 0.3,
        content_weight: float = 0.7
    ) -> List[Dict]:
        """
        Hybrid worker recommendation
        Combines collaborative filtering and content-based matching
        """
        # Get collaborative recommendations
        collab_recs = self.recommend_workers_collaborative(
            employer_id,
            available_workers,
            top_n=top_n * 2
        )
        
        # Get content-based recommendations
        content_recs = self.recommend_workers_content(
            job,
            available_workers,
            top_n=top_n * 2
        )
        
        # Combine scores
        combined_scores = {}
        
        # Add collaborative scores
        for worker in collab_recs:
            worker_id = worker['id']
            combined_scores[worker_id] = {
                'worker': worker,
                'collab_score': worker.get('collab_score', 0),
                'content_score': 0
            }
        
        # Add content scores
        for worker in content_recs:
            worker_id = worker['id']
            if worker_id not in combined_scores:
                combined_scores[worker_id] = {
                    'worker': worker,
                    'collab_score': 0,
                    'content_score': worker.get('content_score', 0)
                }
            else:
                combined_scores[worker_id]['content_score'] = worker.get('content_score', 0)
        
        # Calculate hybrid score
        for worker_id in combined_scores:
            collab = combined_scores[worker_id]['collab_score']
            content = combined_scores[worker_id]['content_score']
            
            hybrid_score = (
                collab * collab_weight +
                content * content_weight
            )
            
            combined_scores[worker_id]['hybrid_score'] = hybrid_score
        
        # Sort by hybrid score
        sorted_workers = sorted(
            combined_scores.values(),
            key=lambda x: x['hybrid_score'],
            reverse=True
        )
        
        # Format results
        recommendations = []
        for item in sorted_workers[:top_n]:
            worker = item['worker'].copy()
            worker['recommendation_score'] = round(item['hybrid_score'], 3)
            worker['score_breakdown'] = {
                'collaborative': round(item['collab_score'], 3),
                'content_based': round(item['content_score'], 3),
                'hybrid': round(item['hybrid_score'], 3)
            }
            recommendations.append(worker)
        
        return recommendations
    
    def get_top_rated_workers(
        self,
        available_workers: List[Dict],
        job_category: str = None,
        top_n: int = 10
    ) -> List[Dict]:
        """
        Get top-rated workers, optionally filtered by category
        """
        filtered_workers = available_workers
        
        # Filter by category if specified
        if job_category:
            filtered_workers = [
                w for w in available_workers
                if job_category.lower() in [s.lower() for s in w.get('skills', [])]
            ]
        
        # Sort by rating and experience
        sorted_workers = sorted(
            filtered_workers,
            key=lambda x: (
                x.get('rating', 0),
                x.get('total_jobs_completed', 0),
                x.get('experience_years', 0)
            ),
            reverse=True
        )
        
        return sorted_workers[:top_n]
    
    def get_available_workers_now(
        self,
        available_workers: List[Dict],
        top_n: int = 10
    ) -> List[Dict]:
        """
        Get workers who are currently available
        """
        from datetime import datetime
        
        now = datetime.utcnow()
        
        available_now = [
            w for w in available_workers
            if w.get('is_available', False)
        ]
        
        # Sort by rating
        sorted_workers = sorted(
            available_now,
            key=lambda x: x.get('rating', 0),
            reverse=True
        )
        
        return sorted_workers[:top_n]