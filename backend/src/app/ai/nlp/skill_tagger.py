"""
Skill Tagger

Automatically extracts skills and job categoris from text
"""

from typing import Dict, List, Optional, Tuple
from collections import Counter
import re

from app.ai.config import SKILL_CATEGORIES, SKILL_KEYWORDS
from app.ai.utils.text_helpers import clean_text, tokenize

class SkillTagger:
    """
    Extract skills from job descriptions
    """

    def __init__(self):
        """Initialize tagger with skill data"""
        self.categories = SKILL_CATEGORIES
        self.keywords = SKILL_KEYWORDS

    def extract(self, text: str) -> Dict:
        """
        Main extraction function
        """
        if not text or len(text.strip()) < 10:
            return {
                'category': None,
                'skills': [],
                'confidence': 0.0,
                'all_matches': {}
            }
        
        # Clean text
        cleaned = clean_text(text)

        # Find all skill matches
        matches = self._find_skill_matches(cleaned)

        # Determine primary category
        category, confidence = self._determine_category(matches)

        # Extract specific skills
        skills = self._extract_skills(cleaned, category)

        return {
            'category': category,
            'skills': skills,
            'confidence': confidence,
            'all_matches': matches
        }
    
    def _find_skill_matches(self, text: str) -> Dict[str, List[str]]:
        """
        Find all skill keyword matches in text
        """
        matches = {}
        text_lower = text.lower()

        for category, keywords in self.keywords.items():
            found = []

            for keyword in keywords:
                # Check if keyword appears in text
                if keyword.lower() in text_lower:
                    found.append(keyword)

            if found:
                matches[category] = found

        return matches
    
    def _determine_category(self, matches: Dict[str, List[str]]) -> Tuple[Optional[str], float]:
        """
        Determine primary category from matches
        """
        if not matches:
            return None, 0.0
        
        # Score each category
        scores = {}

        for category, keywords in matches.items():
            # Basic score: number of matches
            score = len(keywords)

            # Bonus for longer more specific keywords
            for keyword in keywords:
                if len(keyword) > 5:    
                    score += 0.5

            scores[category] = score

        # Find category with highest score
        best_category = max(scores, key=scores.get)
        max_score = scores[best_category]

        # Calculate confidence 
        total_score = sum(scores.values())
        confidence = max_score / total_score if total_score > 0 else 0.0

        # If very close scores, reduce confidence
        if len(scores) > 1:
            sorted_scores = sorted(scores.values(), reverse=True)
            if sorted_scores[0] - sorted_scores[1] < 1:
                confidence *= 0.7   

        return best_category, round(confidence, 2)
    
    def _extract_skills(self, text: str, category: Optional[str]) -> List[str]:
        """
        Extract specific skills mentioned in text
        """
        if not category or category not in self.keywords:
            return []
        
        skills = []
        text_lower = text.lower()

        # Get keywords for this category
        category_keywords = self.keywords[category]

        for keyword in category_keywords:
            if keyword.lower() in text_lower:
                skills.append(keyword)

        # Remove duplicates, keep order
        seen = set()
        unique_skills = []
        for skill in skills:
            if skill not in seen:
                seen.add(skill)
                unique_skills.append(skill)

        return unique_skills
    
    def suggest_category(self, text: str) -> Optional[str]:
        """
        Quick category suggestion
        """
        result = self.extract(text)
        return result['category']
    
    def validate_category(self, text: str, claimed_category: str) -> Dict:
        """
        Check if claimed category matches text content
        """
        result = self.extract(text)
        detected = result['category']

        if detected == claimed_category:
            return {
                'is_valid': True,
                'detected_category': detected,
                'confidence': result['confidence'],
                'suggestion': None
            }
        else:
            return {
                'is_valid': False,
                'detected_category': detected,
                'confidence': result['confidence'],
                'suggestion': f"Consider changing category to {detected}" if detected else "Category unclear from description"
            }
        
    def extract_with_context(self, text: str) -> Dict:
        """
        Extract skills with surrounding context
        """
        result = self.extract(text)
        category = result['category']
        skills = result['skills']

        skills_with_context = []

        for skill in skills:
            # Find context around skill 
            pattern = rf'.{{0,20}}{re.escape(skill)}.{{0,20}}'
            matches = re.findall(pattern, text, re.IGNORECASE)

            if matches:
                context = matches[0].strip()
                skills_with_context.append({
                    'skill': skill,
                    'context': context
                })

        return {
            'category': category,
            'confidence': result['confidence'],
            'skills_with_context': skills_with_context
        }
    
# ======= Helper Functions =======

def quick_tag(text: str) -> Optional[str]:
    """
    Quick utility function to tag a job description
    """
    tagger = SkillTagger()
    return tagger.suggest_category(text)

def extract_skills_simple(text: str) -> List[str]:
    """
    Quick utility to extract just the skills list
    """
    tagger = SkillTagger()
    result = tagger.extract(text)
    return result['skills']