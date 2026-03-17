"""
Safety Module

Spam detection, fraud detection, and content moderation
"""

from app.ai.safety.spam_detector import SpamDetector, is_spam, get_spam_score
from app.ai.safety.fraud_detection import FraudDetector, check_employer, check_worker
from app.ai.safety.anomaly_detector import AnomalyDetector
from app.ai.safety.content_moderator import ContentModerator

__all__ = [
    'SpamDetector',
    'is_spam',
    'get_spam_score',
    'FraudDetector',
    'check_employer',
    'check_worker',
    'AnomalyDetector',
    'ContentModerator'
]