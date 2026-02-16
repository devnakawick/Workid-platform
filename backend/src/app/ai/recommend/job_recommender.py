from typing import List, Dict, Tuple
import numpy as np
from collections import defaultdict
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class JobRecommender:

    def __init__(self):
        # Store application history for collaborative filtering
        self.worker_applications = defaultdict(set)  # worker_id -> set of job_ids
        self.job_applications = defaultdict(set)     # job_id -> set of worker_ids
        
        # Weights for hybrid recommendation
        self.collab_weight = 0.4
        self.content_weight = 0.6
    
    def record_application(self, worker_id: str, job_id: str):
        """
        Record a worker's application to a job
        Used for collaborative filtering
        """
        self.worker_applications[worker_id].add(job_id)
        self.job_applications[job_id].add(worker_id)
        logger.info(f"Recorded application: Worker {worker_id} -> Job {job_id}")
    
    def calculate_worker_similarity(
        self,
        worker_id1: str,
        worker_id2: str
    ) -> float:
        """
        Calculate similarity between two workers based on application history
        Uses Jaccard similarity
        """
        jobs1 = self.worker_applications.get(worker_id1, set())
        jobs2 = self.worker_applications.get(worker_id2, set())
        
        if not jobs1 or not jobs2:
            return 0.0
        
        intersection = len(jobs1.intersection(jobs2))
        union = len(jobs1.union(jobs2))
        
        if union == 0:
            return 0.0
        
        return intersection / union
    
    def get_similar_workers(
        self,
        worker_id: str,
        top_n: int = 10
    ) -> List[Tuple[str, float]]:
        """
        Find workers most similar to the given worker
        Returns list of (worker_id, similarity_score) tuples
        """
        similarities = []
        
        for other_worker in self.worker_applications.keys():
            if other_worker == worker_id:
                continue
            
            similarity = self.calculate_worker_similarity(worker_id, other_worker)
            
            if similarity > 0:
                similarities.append((other_worker, similarity))
        
        # Sort by similarity descending
        similarities.sort(key=lambda x: x[1], reverse=True)
        
        return similarities[:top_n]
    
    def collaborative_filtering(
        self,
        worker_id: str,
        available_jobs: List[Dict],
        top_n: int = 20
    ) -> List[Dict]:
        
        # Get jobs this worker already applied to
        applied_jobs = self.worker_applications.get(worker_id, set())
        
        # Find similar workers
        similar_workers = self.get_similar_workers(worker_id, top_n=10)
        
        if not similar_workers:
            logger.info(f"No similar workers found for {worker_id}")
            return []
        
        # Collect jobs that similar workers applied to
        recommended_jobs = defaultdict(float)
        
        for similar_worker, similarity in similar_workers:
            similar_worker_jobs = self.worker_applications.get(similar_worker, set())
            
            for job_id in similar_worker_jobs:
                # Don't recommend jobs already applied to
                if job_id not in applied_jobs:
                    # Score weighted by similarity
                    recommended_jobs[job_id] += similarity
        
        # Sort by score
        sorted_jobs = sorted(
            recommended_jobs.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        # Get actual job objects
        job_dict = {job['id']: job for job in available_jobs}
        
        result = []
        for job_id, score in sorted_jobs[:top_n]:
            if job_id in job_dict:
                job = job_dict[job_id].copy()
                job['collab_score'] = round(score, 3)
                result.append(job)
        
        return result
    
    def content_based_filtering(
        self,
        worker: Dict,
        available_jobs: List[Dict],
        top_n: int = 20
    ) -> List[Dict]:
        """
        Recommend jobs based on worker profile match
        (Content-Based Filtering)
        """
        from app.ai.utils.scoring import MatchScorer
        
        scorer = MatchScorer()
        scored_jobs = []
        
        for job in available_jobs:
            # Calculate match score
            match_score = scorer.calculate_match_score(worker, job)
            
            job_copy = job.copy()
            job_copy['content_score'] = match_score['overall_score']
            job_copy['match_breakdown'] = match_score
            scored_jobs.append(job_copy)
        
        # Sort by content score
        scored_jobs.sort(key=lambda x: x['content_score'], reverse=True)
        
        return scored_jobs[:top_n]
    
    def hybrid_recommend(
        self,
        worker_id: str,
        worker: Dict,
        available_jobs: List[Dict],
        top_n: int = 10
    ) -> List[Dict]:
        
        # Get collaborative recommendations
        collab_recs = self.collaborative_filtering(
            worker_id,
            available_jobs,
            top_n=top_n * 2
        )
        
        # Get content-based recommendations
        content_recs = self.content_based_filtering(
            worker,
            available_jobs,
            top_n=top_n * 2
        )
        
        # Combine scores
        combined_scores = {}
        
        # Add collaborative scores
        for job in collab_recs:
            job_id = job['id']
            combined_scores[job_id] = {
                'job': job,
                'collab_score': job.get('collab_score', 0),
                'content_score': 0
            }
        
        # Add content scores
        for job in content_recs:
            job_id = job['id']
            if job_id not in combined_scores:
                combined_scores[job_id] = {
                    'job': job,
                    'collab_score': 0,
                    'content_score': job.get('content_score', 0)
                }
            else:
                combined_scores[job_id]['content_score'] = job.get('content_score', 0)
        
        # Calculate hybrid score
        for job_id in combined_scores:
            collab = combined_scores[job_id]['collab_score']
            content = combined_scores[job_id]['content_score']
            
            # Weighted combination
            hybrid_score = (
                collab * self.collab_weight +
                content * self.content_weight
            )
            
            combined_scores[job_id]['hybrid_score'] = hybrid_score
        
        # Sort by hybrid score
        sorted_jobs = sorted(
            combined_scores.values(),
            key=lambda x: x['hybrid_score'],
            reverse=True
        )
        
        # Format results
        recommendations = []
        for item in sorted_jobs[:top_n]:
            job = item['job'].copy()
            job['recommendation_score'] = round(item['hybrid_score'], 3)
            job['score_breakdown'] = {
                'collaborative': round(item['collab_score'], 3),
                'content_based': round(item['content_score'], 3),
                'hybrid': round(item['hybrid_score'], 3)
            }
            recommendations.append(job)
        
        return recommendations
    
    def get_trending_jobs(
        self,
        available_jobs: List[Dict],
        top_n: int = 10,
        days: int = 7
    ) -> List[Dict]:
        """
        Get trending jobs based on recent application activity
        """
        from datetime import timedelta
        
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        job_popularity = defaultdict(int)
        
        for job_id, applicants in self.job_applications.items():
            job_popularity[job_id] = len(applicants)
        
        # Sort by popularity
        trending = sorted(
            job_popularity.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        # Get job objects
        job_dict = {job['id']: job for job in available_jobs}
        
        result = []
        for job_id, count in trending[:top_n]:
            if job_id in job_dict:
                job = job_dict[job_id].copy()
                job['application_count'] = count
                job['trending_rank'] = len(result) + 1
                result.append(job)
        
        return result