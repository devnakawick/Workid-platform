"""
Spam Detector

Detects fake/spam job postings to protect workers
"""

from typing import Dict, List, Tuple
import re

from app.ai.config import (
    SPAM_KEYWORDS,
    MIN_DESCRIPTION_LENGTH,
    MAX_REASONABLE_BUDGET
)
from app.ai.utils.text_helpers import clean_text, contains_any

class SpamDetector:
    """
    Detect spam/fake job postings
    """

    def __init__(self):
        """Initialize detector with spam patterns"""
        self.spam_keywords = SPAM_KEYWORDS
        self.min_length = MIN_DESCRIPTION_LENGTH
        self.max_budget = MAX_REASONABLE_BUDGET

        # Additional spam patterns
        self.money_patterns = [
            r'earn\s+(\d+k?|\d+,\d+)\s+(rs|rupees|lkr)',  # earn 100k rs
            r'(\d+k?|\d+,\d+)\s+(rs|rupees|lkr)\s+daily',  # 50000 rs daily
            r'lakhs?\s+per\s+(month|week|day)',  # lakhs per month
        ]

        self.scam_indicators = [
            'deposit required',
            'pay first',
            'registration fee',
            'joining fee',
            'investment needed',
            'send money',
            'bank details',
            'advance payment',
            'pay deposit',
            'deposit of',
            'deposit',
            'fee required'
        ]

    def detect(self, job_title: str, job_description: str, budget: float = None) -> Dict:
        """
        Analyze job posting for spam indicators
        """
        reasons = []
        score = 0.0

        # Combine title and description
        full_text = f"{job_title} {job_description}"
        cleaned = clean_text(full_text)

        # Check spam keywords
        if self._check_spam_keywords(cleaned):
            reasons.append('spam_keywords')
            score += 0.4

        # Check scam indicators
        if self._check_scam_indicators(cleaned):
            reasons.append('deposit_required')
            score += 0.5

        # Check unrealistic money promises
        if self._check_unrealistic_money(cleaned):
            reasons.append('unrealistic_pay')
            score += 0.3

        # Check description too short
        if self._check_too_short(job_description):
            reasons.append('description_too_short')
            score += 0.2

        # Check Excessive caps/exclamation
        if self._check_excessive_caps(full_text):
            reasons.append('excessive_caps')
            score += 0.2

        # Check budget check
        if budget and self._check_unrealistic_budget(budget):
            reasons.append('unrealistic_budget')
            score += 0.3

        # Check contact info in description
        if self._check_contact_info(job_description):
            reasons.append('contact_info_in_description')
            score += 0.1

        # Cap score at 1.0
        spam_score = min(score, 1.0)

        # Determine if spam
        is_spam = spam_score >= 0.6

        # Confidence level 
        if spam_score >= 0.8:
            confidence = 'high'
        elif spam_score >= 0.5:
            confidence = 'medium'
        else:
            confidence = 'low'

        return {
            'is_spam': is_spam,
            'spam_score': round(spam_score, 2),
            'confidence': confidence,
            'reasons': reasons,
            'recommendation': self._get_recommendation(is_spam, spam_score)
        }
    
    def _check_spam_keywords(self, text: str) -> bool: 
        """Check for spam keywords from config"""
        return contains_any(text, self.spam_keywords)
    
    def _check_scam_indicators(self, text: str) -> bool:
        """Check for scam indicators"""
        return contains_any(text, self.scam_indicators)
    
    def _check_unrealistic_money(self, text: str) -> bool:
        """
        Check for unrealistic money promises
        """
        text_lower = text.lower()

        # Check for money patterns
        for pattern in self.money_patterns:
            if re.search(pattern, text_lower):
                return True
            
        return False
    
    def _check_too_short(self, description: str) -> bool:
        """Check if description is suspiciously short"""
        return len(description.strip()) < self.min_length
    
    def _check_excessive_caps(self, text: str) -> bool:
        """
        Check for excessive capital letterns and exclamation marks
        """
        if not text:
            return False
        
        # Count caps
        caps_count = sum(1 for c in text if c.isupper())
        total_letters = sum(1 for c in text if c.isalpha())

        if total_letters == 0: 
            return False
        
        caps_ratio = caps_count / total_letters

        # If more than 40% caps = suspicious
        if caps_ratio > 0.4:
            return True
        
        # Count exclamation marks
        exclamation_count = text.count('!')
        if exclamation_count > 3:
            return True
        
        return False
    
    def _check_unrealistic_budget(self, budget: float) -> bool:
        """Check if budget is unrealistically high"""
        return budget > self.max_budget
    
    def _check_contact_info(self, text: str) -> bool:
        """
        Check for phone numbers or emails in description
        """
        # Phone pattern
        phone_pattern = r'(\+?94|0)?7[0-9]{8}'
        if re.search(phone_pattern, text):
            return True
        
        # Email pattern
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        if re.search(email_pattern, text):
            return True
        
        return False
    
    def _get_recommendation(self, is_spam: bool, score: float) -> str:
        """
        Get action recommendation based on spam score
        """
        if score >= 0.8:
            return "Block this job posting immediately"
        elif score >= 0.6:
            return "Flag for manual review before publishing"
        elif score >= 0.4:
            return "Monitor this posting closely"
        else:
            return "Job appears legitimate"
        
    def quick_check(self, job_description: str) -> bool:
        """
        Quick spam check
        """
        result = self.detect("", job_description)
        return result['is_spam']
    
# ======= Helper Functions =======

def is_spam(job_title: str, job_description: str) -> bool:
    """
    Quick utility function to check if job is spam
    """
    detector = SpamDetector()
    result = detector.detect(job_title, job_description)
    return result['is_spam']

def get_spam_score(job_title: str, job_description: str) -> float:
    """
    Get spam score
    """
    detector = SpamDetector()
    result = detector.detect(job_title, job_description)
    return result['spam_score']