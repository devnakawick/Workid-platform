"""
Utilities for processing Sinhala text
"""

from typing import List, Dict
import unicodedata

class SinhalaProcessor:
    """
    Process Sinhala text
    """

    def __init__(self):
        """Initialize Sinhala processor"""
        # Common Sinhala letter mapping
        self.romanization_map = {
            'අ': 'a', 'ආ': 'aa', 'ඇ': 'ae', 'ඈ': 'aae',
            'ඉ': 'i', 'ඊ': 'ii', 'උ': 'u', 'ඌ': 'uu',
            'එ': 'e', 'ඒ': 'ee', 'ඓ': 'ai',
            'ඔ': 'o', 'ඕ': 'oo', 'ඖ': 'au',
            'ක': 'ka', 'ඛ': 'kha', 'ග': 'ga', 'ඝ': 'gha', 'ඞ': 'nga',
            'ච': 'cha', 'ඡ': 'chha', 'ජ': 'ja', 'ඣ': 'jha', 'ඤ': 'nya',
            'ට': 'ta', 'ඨ': 'tha', 'ඩ': 'da', 'ඪ': 'dha', 'ණ': 'na',
            'ත': 'ta', 'ථ': 'tha', 'ද': 'da', 'ධ': 'dha', 'න': 'na',
            'ප': 'pa', 'ඵ': 'pha', 'බ': 'ba', 'භ': 'bha', 'ම': 'ma',
            'ය': 'ya', 'ර': 'ra', 'ල': 'la', 'ව': 'va',
            'ශ': 'sha', 'ෂ': 'sha', 'ස': 'sa', 'හ': 'ha', 'ළ': 'la',
            'ෆ': 'fa'
        }

        # Common Sinhala words
        self.common_words = {
            'අවශ්‍යයි': 'needed',
            'කාර්මිකයෙක්': 'worker',
            'වහා': 'immediately',
            'ඉක්මන්': 'urgent',
            'හදිසි': 'emergency',
            'අද': 'today',
            'මිල': 'price',
            'අඩු': 'low',
            'ඉහළ': 'high'
        }

    def normalize(self, text: str) -> str:
        """
        Normalize Sinhala text
        """
        # Unicode normalization
        normalized = unicodedata.normalize('NFC', text)

        # Remove zero-width characters
        normalized = normalized.replace('\u200d', '')   # zero-width joiner
        normalized = normalized.replace('\u200c', '')   # zerp-width non-joiner

        return normalized
    
    def romanize(self, text: str) -> str:
        """
        Convert Sinhala to romanized form
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
    
    def extract_sinhala_words(self, text: str) -> List[str]:
        """
        Extract Sinhala words from mixed text
        """
        words = text.split()
        sinhala_words = []

        for word in words:
            # Check if word contains Sinhala characters
            if any(0x0D80 <= ord(c) <= 0x0DFF for c in word):
                sinhala_words.append(word)

        return sinhala_words
    
    def is_sinhala_text(self, text: str, threshold: float = 0.5) -> bool:
        """
        Check if text is predominantly Sinhala
        """
        if not text:
            return False
        
        sinhala_chars = sum(1 for c in text if 0x0D80 <= ord(c) <= 0x0DFF)
        total_chars = sum(1 for c in text if c.isalpha())

        if total_chars == 0:
            return False
        
        return (sinhala_chars / total_chars) >= threshold
    
    def translate_common_words(self, text: str) -> str:
        """
        Translate common Sinhala words to English
        """
        translated = text

        for sinhala_word, english_word in self.common_words.items():
            if sinhala_word in translated:
                translated = translated.replace(sinhala_word, english_word)

        return translated
    
    def get_character_count(self, text: str) -> Dict[str, int]:
        """
        Get count of different character types
        """
        counts = {
            'sinhala': 0,
            'english': 0,
            'numbers': 0,
            'spaces': 0,
            'other': 0
        }

        for char in text:
            if 0x0D80 <= ord(char) <= 0x0DFF:
                counts['sinhala'] += 1
            elif char.isalpha():
                counts['english'] += 1
            elif char.isdigit():
                counts['numbers'] += 1
            elif char.isspace():
                counts['spaces'] += 1
            else:
                counts['other']

        return counts
    
    def clean_sinhala_text(self, text: str) -> str:
        """
        Clean Sinhala text
        """
        # Normalize Unicode
        cleaned = self.normalize(text)

        # Remove extra space
        import re
        cleaned = re.sub(r'\s+', ' ', cleaned)
        cleaned = cleaned.strip()

        return cleaned
    
# ======= Helper Functions =======

def romanize_sinhala(text: str) -> str:
    """
    Quick romanization utility
    """
    processor = SinhalaProcessor()
    return processor.romanize(text)

def is_sinhala(text: str) -> bool:
    """
    Quick check if text is Sinhala
    """
    processor = SinhalaProcessor()
    return processor.is_sinhala_text(text)