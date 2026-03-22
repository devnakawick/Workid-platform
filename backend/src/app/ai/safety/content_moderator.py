"""
Content Moderator

Filters inappropriate content from job descriptions and user profiles.
"""

from typing import Dict, List
import re
from app.ai.utils.text_helpers import clean_text

class ContentModerator:
    """
    Moderate content for appropriateness
    """

    def __init__(self):
        """Initialize content moderator"""
        # Basic inapropriate keywords
        self.inappropriate_keywords = [
            # TODO: Add keywords
        ]

        # Discriminatory keywords
        self.descriminatory_keywords = [
            "only men", "only women", "no muslims", "no tamils",
            "only sinhala", "only buddhist", "no disabled"
        ]

        # Professional violations
        self.unprofessional_keywords = [
            "attractive", "beautiful girls",
            "handsome boys", "young only", "old not allowed"
        ]

    def moderate(self, text: str, text_type: str = "job_description") -> Dict:
        """
        Moderate text content
        """
        if not text or len(text.strip()) < 5:
            return {
                'is_appropriate': True,
                'issues': [],
                'severity': 'none'
            }
        
        issues = []
        max_severity = 'none'

        cleaned = clean_text(text)
        text_lower = cleaned.lower()

        # Inappropriate keywords
        for keyword in self.inappropriate_keywords:
            if keyword in text_lower:
                issues.append({
                    'type': 'inappropriate_language',
                    'keyword': keyword,
                    'severity': 'high'
                })
                max_severity = 'high'

        # Discriminatory language
        for keyword in self.descriminatory_keywords:
            if keyword in text_lower:
                issues.append({
                    'type': 'discriminatory_language',
                    'keyword': keyword,
                    'severity': 'high'
                })
                max_severity = 'high'

        # Unprofessional language
        for keyword in self.unprofessional_keywords:
            if keyword in text_lower:
                issues.append({
                    'type': 'unprofessional_language',
                    'keyword': keyword,
                    'severity': 'medium'
                })
                if max_severity == 'none':
                    max_severity = 'medium'

        # All caps
        if self._check_all_caps(text):
            issues.append({
                'type': 'excessive_caps',
                'severity': 'low'
            })
            if max_severity == 'none':
                max_severity = 'low'

        # Excessive punctuation
        if self._check_excessive_punctuation(text):
            issues.append({
                'type': 'excessive_punctuation',
                'severity': 'low'
            })

        is_appropriate = len(issues) == 0 or max_severity == 'low'

        return {
            'is_appropriate': is_appropriate,
            'issues': issues,
            'severity': max_severity,
            'issue_count': len(issues),
            'recommendation': self._get_recommendation(max_severity)
        }
    
    def _check_all_caps(self, text: str) -> bool:
        """Check if text is mostly capital"""
        if len(text) < 10:
            return False
        
        caps = sum(1 for c in text if c.isupper())
        letters = sum(1 for c in text if c.isalpha())

        if letters == 0:
            return False
        
        return (caps / letters) > 0.7
        
    def _check_excessive_punctuation(self, text: str) -> bool:
        """Check for excessive punctuation marks"""
        exclamations = text.count('!')
        questions = text.count('?')

        return exclamations > 5 or questions > 5
    
    def _get_recommendation(self, severity: str) -> str:
        """Get moderation recommendation"""
        if severity == 'high': 
            return "Block content immediately"
        elif severity == 'medium':
            return "Flag for manual review before publishing"
        elif severity == 'low': 
            return "Suggest user to rephrase content"
        else:
            return "Content appears appropriate"
        
    def filter_text(self, text: str) -> str:
        """
        Filter inappropriate words from text
        """
        filtered = text
        
        # Replace inappropriate keywords
        for keyword in self.inappropriate_keywords:
            if keyword in filtered.lower():
                filtered = re.sub(
                    re.escape(keyword),
                    '*' * len(keyword),
                    filtered,
                    flags=re.IGNORECASE
                )

        return filtered
    
# ======= Helper Function =======

def is_content_appropriate(text: str) -> bool:
    """Quick check if content is approrpiate"""
    moderator = ContentModerator()
    result = moderator.moderate(text)
    return result['is_appropriate']