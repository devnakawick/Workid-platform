"""
Language Detector

Detects which language text is written in:
- English 
- Sinhala
- Tamil
"""

from typing import Optional

class LanguageDetector:
    """
    Detect language from text
    """

    def __init__(self):
        """Initialize detector"""
        # Unicode ranges
        self.sinhala_range = (0x0D80, 0x0DFF)  # Sinhala Unicode block
        self.tamil_range = (0x0B80, 0x0BFF)    # Tamil Unicode block

    def detect(self, text: str) -> str:
        """
        Detect language from text
        """
        if not text or not text.strip():
            return "en" # Default to English
        
        # Count characters in each script
        sinhala_count = 0
        tamil_count = 0
        english_count = 0

        for char in text:
            code_point = ord(char)

            # Check Sinhala
            if self.sinhala_range[0] <= code_point <= self.sinhala_range[1]:
                sinhala_count += 1

            # Check Tamil
            elif self.tamil_range[0] <= code_point <= self.tamil_range[1]:
                tamil_count += 1

            # Check English
            elif char.isalpha() and (ord('a') <= code_point <= ord('z') or ord('A') <= code_point <= ord('Z')):
                english_count += 1

        # Determine language majority
        if sinhala_count > tamil_count and sinhala_count > english_count:
            return "si"
        
        elif tamil_count > sinhala_count and tamil_count > english_count:
            return "ta"
        
        else:
            return "en"
        
    def is_sinhala(self, text: str) -> bool:
        """Check if text is Sinhala"""
        return self.detect(text) == "si"
    
    def is_tamil(self, text: str) -> bool: 
        return self.detect(text) == "ta"
    
    def is_english(self, text: str) -> bool:
        return self.detect(text) == "en"
    
    def get_lang_name(self, text: str) -> str:
        """
        Get full language name
        """
        lang_code = self.detect(text)

        names = {
            "si": "Sinhala",
            "ta": "Tamil",
            "en": "English"
        }

        return names.get(lang_code, "English")
    
# ======= Helper Functions =======

def detect_lang(text: str) -> str:
    """
    Quick utility to detect language
    """
    detector = LanguageDetector()
    return detector.detect(text)