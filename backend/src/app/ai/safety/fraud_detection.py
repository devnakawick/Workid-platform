"""
Fraud Detection

Detects suspicious user behaviour patterns
"""

from typing import Dict, List, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.models.job import Job
from app.models.employer import Employer
from app.models.worker import Worker
from app.models.application import Application, ApplicationStatus

from app.ai.config import (
    MAX_JOBS_PER_DAY,
    MAX_APPLICATIONS_PER_DAY,
    MIN_APPLICATION_INTERVAL
)

class FraudDetector:
    """
    Detect fradulent user behavior
    """

    def __init__(self):
        """Initialize detector with thresholds"""
        self.max_jobs_per_day = MAX_JOBS_PER_DAY
        self.max_applications_per_day = MAX_APPLICATIONS_PER_DAY
        self.min_application_interval = MIN_APPLICATION_INTERVAL
        
    def check_employer_behavior(
        self,
        db: Session,
        employer_id: int
    ) -> Dict:
        """
        Check employer for suspicious behavior
        """
        flags = []
        score = 0.0

        employer = db.query(Employer).filter(Employer.id == employer_id).first()
        if not employer:
            return {'is_suspicious': False, 'fraud_score': 0.0, 'flags': []}
        
        # Check jobs posted in last 24 hours
        yesterday = datetime.utcnow() - timedelta(days=1)
        recent_jobs = db.query(Job).filter(
            Job.employer_id == employer_id,
            Job.created_at >= yesterday
        ).count()

        if recent_jobs > self.max_applications_per_day:
            flags.append('excessive_posting')
            score += 0.5

        # Check total jobs vs accepted applications
        total_jobs = employer.total_jobs_posted

        if total_jobs > 5:  
            accepted_count = db.query(Application).join(Job).filter(
                Job.employer_id == employer_id,
                Application.status == ApplicationStatus.ACCEPTED
            ).count()

            acceptence_rate = accepted_count / total_jobs if total_jobs > 0 else 0

            if acceptence_rate < 0.1:   # if less than 10% acceptence
                flags.append('no_hires')
                score += 0.3

        # Check if same job posted multiple times
        last_week = datetime.utcnow() - timedelta(days=7)
        recent_jobs_list = db.query(Job).filter(
            Job.employer_id == employer_id,
            Job.created_at >= last_week
        ).all()

        if len(recent_jobs_list) > 3:
            titles = [job.title.lower() for job in recent_jobs_list]
            # Check for duplicate titles
            if len(titles) != len(set(titles)):
                flags.append('duplicate_jobs')
                score += 0.3

        # Check account age vs activity
        account_age_days = (datetime.utcnow() - employer.created_at).days
        if account_age_days < 1 and total_jobs > 3: 
            flags.append('new_account_high_activity')
            score += 0.4

        # Cap score
        fraud_score = min(score, 1.0)
        is_suspicious = fraud_score >= 0.6

        return {
            'is_suspicious': is_suspicious,
            'fraud_score': round(fraud_score, 2),
            'flags': flags,
            'details': {
                'recent_jobs_24h': recent_jobs,
                'total_jobs': total_jobs,
                'account_age_days': account_age_days
            },
            'recommendation': self._get_recommendation(fraud_score)
        }
    
    def check_worker_behavior(
        self,
        db: Session,
        worker_id: int
    ) -> Dict:
        """
        Check worker for suspicious behavior
        """
        flags = []
        score = 0.0

        worker = db.query(Worker).filter(Worker.id == worker_id).first()
        if not worker:
            return {'is_suspicious': False, 'fraud_score': 0.0, 'flags': []}
        
        # Check applications in last 24 hours
        yesterday = datetime.utcnow() - timedelta(days=1)
        recent_applications = db.query(Application).filter(
            Application.worker_id == worker_id,
            Application.applied_at >= yesterday
        ).count()

        if recent_applications > self.max_applications_per_day:
            flags.append('exessive_applications')
            score += 0.5

        # Check application speed
        last_ten_apps = db.query(Application).filter(
            Application.worker_id == worker_id
        ).order_by(Application.applied_at.desc()).limit(10).all()

        if len(last_ten_apps) >= 5:
            # Check time between applications
            fast_apps = 0
            for i in range(len(last_ten_apps) - 1):
                time_diff = (last_ten_apps[i].applied_at - last_ten_apps[i+1].applied_at).total_seconds()
                if time_diff < self.min_application_interval:
                    fast_apps += 1

            if fast_apps >= 3:  # if 3+ applications within 20 seconds
                flags.append('bot_pattern')
                score += 0.6

        # Check application acceptance rate
        total_applications = db.query(Application).filter(
            Application.worker_id == worker_id
        ).count()

        if total_applications > 10:
            accepted = db.query(Application).filter(
                Application.worker_id == worker_id,
                Application.status == 'accepted'
            ).count()

            acceptance_rate = accepted / total_applications if total_applications > 0 else 0

            if acceptance_rate < 0.05:  # less than 5% accepted
                flags.append('low_acceptance_rate')
                score += 0.2

        # Check account age vs activity
        account_age_days = (datetime.utcnow() - worker.created_at).days
        if account_age_days < 1 and total_applications > 10:
            flags.append('new_account_high_activity')
            score += 0.3

        # Cap score
        fraud_score = min(score, 1.0)
        is_suspicious = fraud_score >= 0.6

        return {
            'is_suspicious': is_suspicious,
            'fraud_score': round(fraud_score, 2),
            'flags': flags,
            'details': {
                'recent_applications_24h': recent_applications,
                'total_applications': total_applications,
                'account_age_days': account_age_days
            },
            'recommendation': self._get_recommendation(fraud_score)
        }
    
    def _get_recommendation(self, score: float) -> str:
        """Get action recommendation"""
        if score >= 0.8:
            return "Suspend acccount immediately and review"
        elif score >= 0.6:
            return "Flag account for manual review"
        elif score >= 0.4:
            return "Monitor account activity closely"
        else:
            return "Account behavior appears normal"
        
# ======= Helper Functions =======

def check_employer(db: Session, employer_id: int) -> bool:
    """
    Quick check if employer is suspicious
    """
    detector = FraudDetector()
    result = detector.check_employer_behavior(db, employer_id)
    return result['is_suspicious']

def check_worker(db: Session, worker_id: int) -> bool:
    """
    Quick check if worker is suspicious
    """
    detector = FraudDetector()
    result = detector.check_worker_behavior(db, worker_id)
    return result['is_suspicious']