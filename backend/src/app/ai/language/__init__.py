"""
Language Module

Language detection and processing for Sinhala, Tamil, and English
"""

from app.ai.language.language_detector import LanguageDetector, detect_lang
from app.ai.language.sinhala_processor import SinhalaProcessor
from app.ai.language.tamil_processor import TamilProcessor
from app.ai.language.translator import Translator

__all__ = [
    'LanguageDetector',
    'detect_lang',
    'SinhalaProcessor', 
    'TamilProcessor',
    'Translator'
]