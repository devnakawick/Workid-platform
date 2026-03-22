"""
Anomaly Detector

Detects unusual patterns in wages, budgets, and behaviors
"""

from typing import Dict, List, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

class AnomalyDetector:
    """
    Detect anomalies in wages and behavior
    """

    def __init__(self):
        """Initial anomaly detector"""
        # Category-based wage ranges 
        self.normal_wage_ranges = {
            "plumbing": {"min": 1500, "max": 8000, "avg": 3000},
            "electrical": {"min": 2000, "max": 10000, "avg": 3500},
            "carpentry": {"min": 1500, "max": 8000, "avg": 3000},
            "masonry": {"min": 1200, "max": 6000, "avg": 2500},
            "painting": {"min": 1200, "max": 6000, "avg": 2500},
            "gardening": {"min": 1000, "max": 5000, "avg": 2000},
            "cleaning": {"min": 800, "max": 4000, "avg": 1500},
            "driving": {"min": 1500, "max": 7000, "avg": 2500},
            "general_labor": {"min": 800, "max": 4000, "avg": 1500}
        }

    def check_wage_anomaly(self, category: str, budget: float) -> Dict:
        """
        Check if wage/budget is anomalous
        """
        if category not in self.normal_wage_ranges:
            return {
                'is_anomaly': False,
                'reason': 'unknown_category',
                'severity': 'low'
            }
        
        ranges = self.normal_wage_ranges[category]
        min_wage = ranges['min']
        max_wage = ranges['max']
        avg_wage = ranges['avg']

        # Check if suspiciously low
        if budget < min_wage * 0.5:
            return {
                'is_anomaly': True,
                'reason': 'suspiciously_low',
                'severity': 'high',
                'details': {
                    'budget': budget,
                    'expected_min': min_wage,
                    'deviation': ((min_wage - budget) / min_wage) * 100
                },
                'recommendation': f"Budget is {int(((min_wage - budget) / min_wage) * 100)}% below minimum. Possible exploitation."
            }
        
        # Check if suspiciously high
        if budget > max_wage * 2:
            return {
                'is_anomaly': True,
                'reason': 'suspiciously_high',
                'severity': 'medium',
                'details': {
                    'budget': budget,
                    'expected_max': max_wage,
                    'deviation': ((budget - max_wage) / max_wage) * 100
                },
                'recommendation': f"Budget is {int(((budget - max_wage) / max_wage) * 100)}% above maximum. Possible scam or error."
            }
        
        # Within normal range
        return {
            'is_anomaly': False,
            'reason': 'normal',
            'severity': 'none',
            'details': {
                'budget': budget,
                'range': f"{min_wage}-{max_wage}",
                'avg': avg_wage
            }
        }
    
    def check_budget_pattern(self, db: Session, user_id: int, user_type: str) -> Dict:
        """
        Check for suspicious budget patterns
        """
        from app.models.job import Job
        from app.models.application import Application

        anomalies = []

        if user_type == 'employer': 
            # Check employer's job budget
            jobs = db.query(Job).filter(Job.employer_id == user_id).limit(20).all()

            if len(jobs) >= 5:
                budgets = [job.budget for job in jobs if job.budget]

                # All same budget
                if len(set(budgets)) == 1:
                    anomalies.append({
                        'type': 'identical_budgets',
                        'severity': 'medium',
                        'details': f"All {len(budgets)} jobs have same budget: Rs. {budgets[0]}"
                    })

                # Suspiciously round numbers
                round_budgets = [b for b in budgets if b % 1000 == 0]
                if len(round_budgets) / len(budgets) > 0.8:
                    anomalies.append({
                        'type': 'round_numbers_pattern',
                        'severity': 'low',
                        'details': f"{len(round_budgets)}/{len(budgets)} budgets are round thousands"
                    })

        return {
            'has_anomalies': len(anomalies) > 0,
            'anomaly_count': len(anomalies),
            'anomalies': anomalies
        }
    
    def get_statistical_summary(self, db: Session, category: str) -> Dict:
        """
        Get statustical summary of wages for a category
        """
        from app.models.job import Job

        # Get recent jobs in this category
        last_month = datetime.utcnow() - timedelta(days=30)
        jobs = db.query(Job).filter(
            Job.category == category,
            Job.created_at >= last_month,
            Job.budget.isnot(None)
        ).all()

        if not jobs:
            return {
                'category': category,
                'sample_size': 0,
                'statistics': None
            }
        
        budgets = [job.budget for job in jobs]

        return {
            'category': category,
            'sample_size': len(budgets),
            'statistics': {
                'min': min(budgets),
                'max': max(budgets),
                'avg': sum(budgets) / len(budgets),
                'median': sorted(budgets)[len(budgets)//2]
            }
        }
    
# ======= Helper Function =======

def is_wage_anomaly(category: str, budget: float) -> bool: 
    """Quick check if wage is anomolous"""
    detector = AnomalyDetector()
    result = detector.check_wage_anomaly(category, budget)
    return result['is_anomaly']