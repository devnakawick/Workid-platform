"""
Tamil Processor

Utilities for processing Tamil text
"""

from typing import List, Dict
import unicodedata

class TamilProcessor:
    """
    Process Tamil text
    """

    def __init__(self):
        """Initialize Tamil processor"""
        # Common Tamil letter mapping
        self.romanization_map = {
            'அ': 'a', 'ஆ': 'aa', 'இ': 'i', 'ஈ': 'ii',
            'உ': 'u', 'ஊ': 'uu', 'எ': 'e', 'ஏ': 'ee',
            'ஐ': 'ai', 'ஒ': 'o', 'ஓ': 'oo', 'ஔ': 'au',
            'க': 'ka', 'ங': 'nga', 'ச': 'cha', 'ஞ': 'nya',
            'ட': 'ta', 'ண': 'na', 'த': 'tha', 'ந': 'na',
            'ப': 'pa', 'ம': 'ma', 'ய': 'ya', 'ர': 'ra',
            'ல': 'la', 'வ': 'va', 'ழ': 'zha', 'ள': 'la',
            'ற': 'ra', 'ன': 'na'
        }

        # Common Tamil words
        self.common_words = {
            'வேண்டும்': 'needed',
            'தொழிலாளி': 'worker',
            'உடனடி': 'urgent',
            'அவசரம்': 'emergency',
            'இன்று': 'today',
            'விலை': 'price',
            'குறைந்த': 'low',
            'அதிக': 'high',
            'மலிவு': 'cheap'
        }

    def normalize(self, text: str) -> str:
        """
        Normalize Tamil text
        """
        # Unicode normalization
        normalized = unicodedata.normalize('NFC', text)

        # Remove zero width characters
        normalized = normalized.replace('\u200d', '')   # zero width joiner
        normalized = normalized.replace('\u200c', '')   # zero width non-joiner

        return normalized
    
    def romanize(self, text: str) -> str:
        """
        Convert Tamil to romanized form
        """
        romanized = []

        for char in text:
            if char in self.romanization_map:
                romanized.append(self.romanization_map[char])
            elif char.isspace():
                romanized.append(' ')
            else:
                romanized.append(char)

        return ''.join(romanized)
    
    def extract_tamil_words(self, text: str) -> List[str]:
        """
        Extract Tamil words from mixed text
        """
        words = text.split()
        tamil_words = []

        for word in words:
            # Check if word contain Tamil characters
            if any(0x0B80 <= ord(c) <= 0x0BFF for c in word):
                tamil_words.append(word)

        return tamil_words
    
    def is_tamil_text(self, text: str, threshold: float = 0.5) -> bool:
        """
        Check if text is predominantly Tamil
        """
        if not text:
            return False
        
        tamil_chars = sum(1 for c in text if 0x0B80 <= ord(c) <= 0x0BFF)
        total_chars = sum(1 for c in text if c.isalpha())

        if total_chars == 0:
            return False
        
        return (tamil_chars / total_chars) >= threshold
    
    def translate_common_words(self, text: str) -> str:
        """
        translate common Tamil words to English
        """
        translated = text

        for tamil_word, english_word in self.common_words.items():
            if tamil_word in translated:
                translated = translated.replace(tamil_word, english_word)

        return translated
    
    def get_character_count(self, text: str) -> Dict[str, int]:
        """
        Get count of different character types
        """
        counts = {
            'tamil': 0,
            'english': 0,
            'numbers': 0,
            'spaces': 0,
            'other': 0
        }

        for char in text:
            if 0x0B80 <= ord(char) <= 0x0BFF:
                counts['tamil'] += 1
            elif char.isalpha():
                counts['english'] += 1
            elif char.isdigit():
                counts['numbers'] += 1
            elif char.isspace():
                counts['spaces'] += 1
            else:
                counts['other'] += 1

        return counts
    
    def clean_tamil_text(self, text: str) -> str:
        """
        Clean Tamil text
        """
        # Normalize Unicode
        cleaned = self.normalize(text)

        # Remove extra spaces
        import re
        cleaned = re.sub(r'\s+', ' ', cleaned)
        cleaned = cleaned.strip()

        return cleaned
    
# ======= Helper Functions =======

def romanize_tamil(text: str) -> str:
    """
    Quick romanization utility
    """
    processor = TamilProcessor()
    return processor.romanize(text)

def is_tamil(text: str) -> bool:
    """
    Quick check if tect is Tamil
    """
    processor = TamilProcessor()
    return processor.is_tamil_text(text)