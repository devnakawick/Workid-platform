"""
AI Service Layer
"""

from typing import Dict, Any
from app.ai.nlp.query_parser import QueryParser, convert_to_api
from app.ai.nlp.skill_tagger import SkillTagger
from app.ai.config import SRI_LANKAN_CITIES

class AIService:
    """
    Service class for AI operations
    """

    def __init__(self):
        """Initialize AI service with parser"""
        self.query_parser = QueryParser()
        self.skill_tagger = SkillTagger()

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
    
    def extract_location_info(self, city: str) -> Dict[str, str]:
        """
        Get district and province from city name
        """
        if city in SRI_LANKAN_CITIES:
            return SRI_LANKAN_CITIES[city]
        
        return {"district": None, "province": None}

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