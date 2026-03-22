"""
Multilingual Handler

Handles Sinhala, Tamil, and English queries
"""

from typing import Dict, Optional
from app.ai.language.language_detector import LanguageDetector
from app.ai.language.translator import Translator

class MultilingualHandler:
    """
    Handle queries in Sinhala, Tamil, or English
    """

    def __init__(self):
        """Initialize handler"""
        self.language_detector = LanguageDetector()
        self.translator = Translator()

    def translate_to_english(self, text: str) -> Dict[str, str]:
        """
        Translate Sinhala/Tamil to English using Translator
        """
        # Use the Translator class for consistency
        result = self.translator.translate(text, target_language="en")
        
        # Return in the expected format for compatibility
        return {
            'original': result['original'],
            'translated': result['translated'],
            'language': result['source_language']
        }
    
    def process_query(self, query: str) -> Dict[str, str]:
        """
        Process multilingual query
        """
        result = self.translate_to_english(query)
        result['language_name'] = self.language_detector.get_lang_name(query)
        return result
