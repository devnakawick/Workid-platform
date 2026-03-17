"""
AI Service Layer
"""

from typing import Dict, Any
from sqlalchemy.orm import Session

from app.ai.nlp.query_parser import QueryParser, convert_to_api
from app.ai.nlp.skill_tagger import SkillTagger
from app.ai.nlp.multilingual_handler import MultilingualHandler
from app.ai.safety.spam_detector import SpamDetector
from app.ai.safety.fraud_detection import FraudDetector
from app.ai.safety.anomaly_detector import AnomalyDetector
from app.ai.safety.content_moderator import ContentModerator
from app.ai.language.language_detector import LanguageDetector

class AIService:
    """
    Service class for AI operations
    """

    def __init__(self):
        """Initialize AI service with parser"""
        # NLP modules
        self.query_parser = QueryParser()
        self.skill_tagger = SkillTagger()
        self.multilingual_handler = MultilingualHandler()

        # Safery modules
        self.spam_detector = SpamDetector()
        self.fraud_detector = FraudDetector()
        self.anomaly_detector = AnomalyDetector()
        self.contenct_moderator = ContentModerator()

        # Language modules
        self.language_detector = LanguageDetector()

    # ======= Search Parsing =======

    def parse_search_query(
        self, 
        query: str, 
        with_suggestions: bool = False
    ) -> Dict[str, Any]:
        """
        Parse natural language search query
        """
        # Parse the query
        if with_suggestions:
            parsed = self.query_parser.parse_with_suggests(query)
            suggestions = parsed.pop('suggestions', None)
        else:
            parsed = self.query_parser.parse(query)
            suggestions = None

        # Convert to API parameters
        api_params = convert_to_api(parsed)

        return {
            'parsed': parsed,
            'api_params': api_params,
            'suggestions': suggestions
        }
    
    def parse_multilingual_query(
        self,
        query: str,
        with_suggestions: bool = False
    ) -> Dict[str, Any]:
        """
        Parse query in any language
        """
        # Translate to English
        translation = self.multilingual_handler.translate_to_english(query)

        # Parse the English version
        if with_suggestions:
            parsed = self.query_parser.parse_with_suggests(translation['translated'])
            suggestions = parsed.pop('suggestions', None)
        else:
            parsed = self.query_parser.parse(translation['translated'])
            suggestions = None

        # Convert to API params
        api_params = convert_to_api(parsed)

        # Return with language info
        return {
            'original_query': translation['original'],
            'detected_language': translation['language'],
            'language_name': self.language_detector.get_lang_name(query),
            'translated_query': translation['translated'],
            'parsed': parsed,
            'api_params': api_params,
            'suggestions': suggestions
        }
    
    # ======= Skill Extraction =======

    def extract_skills(self, text: str) -> Dict[str, Any]:
        """
        Extract skills from job description
        """
        return self.skill_tagger.extract(text)
    
    def validate_job_category(
        self,
        text: str,
        claimed_category: str
    ) -> Dict[str, Any]:
        """
        Validate if job category matches description
        """
        return self.skill_tagger.validate_category(text, claimed_category)

    def suggest_job_category(self, text: str) -> str:
        """
        Quick category suggestion
        """
        return self.skill_tagger.suggest_category(text)
    
    # ======= Spam and Fraud Detection =======
    
    def check_spam(
        self,
        job_title: str,
        job_description: str,
        budget: float = None
    ) -> Dict[str, Any]:
        """
        Check if job posting is spam
        """
        return self.spam_detector.detect(job_title, job_description, budget)
    
    def check_employer_fraud(
        self,
        db,
        employer_id: int
    ) -> Dict[str, Any]:
        """
        Check employer for fraudulent bahavior
        """
        return self.fraud_detector.check_employer_behavior(db, employer_id)
    
    def check_worker_fraud(
        self,
        db,
        worker_id: int
    ) -> Dict[str, Any]:
        """
        Check worker for fraudulent behavior
        """
        return self.fraud_detector.check_worker_behavior(db, worker_id)
    
    # ======= Anomaly Detection =======

    def check_wage_anomaly(
        self, 
        category: str,
        budget: float
    ) -> Dict[str, Any]:
        """
        Check if wage is anomolous
        """
        return self.anomaly_detector.check_wage_anomaly(category, budget)
    
    def check_budget_pattern(
        self, 
        db: Session,
        user_id: int,
        user_type: str 
    ) -> Dict[str, Any]:
        """
        Check for suspicious budget patterns
        """
        return self.anomaly_detector.check_budget_pattern(db, user_id, user_type)
    
    # ======= Content Moderation =======

    def moderate_content(
        self, 
        text: str,
        text_type: str = "job_description"
    ) -> Dict[str, Any]: 
        """
        Moderate content for appropriateness
        """
        return self.contenct_moderator.moderate(text, text_type)
    
    # ======= Utility Methods =======

    def extract_location_info(self, city: str) -> Dict[str, str]:
        """
        Get district and province from city name
        """
        from app.ai.config import SRI_LANKAN_CITIES
        
        if city in SRI_LANKAN_CITIES:
            return SRI_LANKAN_CITIES[city]
        
        return {"district": None, "province": None}
