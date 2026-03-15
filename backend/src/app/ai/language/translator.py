"""
Translation wrapper for Sinhala, Tamil, and English
"""

from typing import Dict, Optional
from app.ai.language.language_detector import LanguageDetector
from app.ai.language.sinhala_processor import SinhalaProcessor
from app.ai.language.tamil_processor import TamilProcessor
from app.ai.config import (
    SINHALA_LOCATIONS,
    TAMIL_LOCATIONS,
    SINHALA_SKILL_KEYWORDS,
    TAMIL_SKILL_KEYWORDS,
    SINHALA_BUDGET_KEYWORDS,
    TAMIL_BUDGET_KEYWORDS,
    SINHALA_URGENCY_KEYWORDS,
    TAMIL_URGENCY_KEYWORDS
)

class Translator:
    """
    Unified translation interface
    """

    def __init__(self):
        """Initialize translator"""
        self.language_detector = LanguageDetector()
        self.sinhala_processor = SinhalaProcessor()
        self.tamil_processor = TamilProcessor()

    def translate(self, text: str, target_language: str = "en") -> Dict[str, str]:
        """
        Translate text to target language
        """
        # Detect source language
        source_lang = self.language_detector.detect(text)

        # If already Enlish return as is
        if source_lang == "en":
            return {
                'original': text,
                'translated': text,
                'source_language': 'en',
                'target_language': target_language,
                'method': 'no_translation_needed'
            }
        
        # Translate based on source language
        if source_lang == "si":
            translated = self._translate_si_to_en(text)
            method = 'keyword_mapping'
        elif source_lang == "ta":
            translated = self._translate_ta_to_en(text)
            method = 'keyword_mapping'
        else:
            translated = text
            method = 'unknown_language'

        return {
            'original': text,
            'translated': translated,
            'source_language': source_lang,
            'target_language': target_language,
            'method': method
        }
    
    def _translate_si_to_en(self, text: str) -> str:
        """Translate Sinhala to English using keyword mapping"""
        translated_words = []
        words = text.split()

        for word in words:
            translated = False

            # Try locations
            if word in SINHALA_LOCATIONS:
                translated_words.append(SINHALA_LOCATIONS[word].lower())
                continue

            # Try skills 
            for category, keywords in SINHALA_SKILL_KEYWORDS.items():
                if word in keywords:
                    translated_words.append(category)
                    translated = True
                    break

            if translated:
                continue

            # Try budget keywords
            if word in SINHALA_BUDGET_KEYWORDS:
                translated_words.append(SINHALA_BUDGET_KEYWORDS[word])
                continue

            # try urgency keywords
            if word in SINHALA_URGENCY_KEYWORDS:
                translated_words.append(SINHALA_URGENCY_KEYWORDS[word])
                continue

            # No translation found, keep the original
            translated_words.append(word)

        return " ".join(translated_words).lower()
    
    def _translate_ta_to_en(self, text: str) -> str:
        """Translate Tamil to English using keyword mapping"""
        translated_words = []
        words = text.split()

        for word in words:
            translated = False

            # Try locations
            if word in TAMIL_LOCATIONS:
                translated_words.append(TAMIL_LOCATIONS[word].lower())
                continue
            
            # Try skills
            for category, keywords in TAMIL_SKILL_KEYWORDS.items():
                if word in keywords:
                    translated_words.append(category)
                    translated = True
                    break
            
            if translated:
                continue
            
            # Try budget keywords
            if word in TAMIL_BUDGET_KEYWORDS:
                translated_words.append(TAMIL_BUDGET_KEYWORDS[word])
                continue
            
            # Try urgency keywords
            if word in TAMIL_URGENCY_KEYWORDS:
                translated_words.append(TAMIL_URGENCY_KEYWORDS[word])
                continue

            # No translation found keep the original
            translated_words.append(word)

        return " ".join(translated_words).lower()

    def romanize(self, text: str) -> str:
        """
        Romanize text
        """
        lang = self.language_detector.detect(text)

        if lang == "si":
            return self.sinhala_processor.romanize(text)
        elif lang == "ta":
            return self.tamil_processor.romanize(text)
        else:
            return text
        
    def detect_and_translate(self, text: str) -> Dict:
        """
        Detect language and translate in one call
        """
        result = self.translate(text, target_language="en")

        # Add romanization
        lang = result['source_language']
        if lang in ['si', 'ta']:
            result['romanized'] = self.romanize(text)

        # Add language name
        result['language_name'] = self.language_detector.get_lang_name(text)

        return result
    
    def batch_translate(self, texts: list) -> list:
        """
        Translate multiple texts
        """
        return [self.translate(text) for text in texts]
    
# ======= Helper Functions =======

def quick_translate(text: str) -> str:
    """
    Quick translation utility
    """
    translator = Translator()
    result = translator.translate(text)
    return result['translated']

def detect_and_translate(text: str) -> Dict:
    """
    Detect and translate in one call
    """
    translator = Translator()
    return translator.detect_and_translate(text)