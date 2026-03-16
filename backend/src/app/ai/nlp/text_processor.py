"""
Text Processor

Handle English, Sinhala, and Tamil Text
"""

import re
from typing import List, Dict, Tuple
from app.ai.utils.text_helpers import clean_text, tokenize, normalize_unicode

class TextProcessor:
    """
    Advanced text processing for NLP
    """

    def __init__(self):
        """Initialize text processor"""
        pass

    def split_sentences(self, text: str) -> List[str]:
        """
        Split text into sentences
        """
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        return sentences
    
    def extract_phrases(self, text: str, min_words: int = 2, max_words: int = 4) -> List[str]:
        """
        Extract meaningful phrases from text
        """
        words = text.split()
        phrases = []

        for n in range(min_words, max_words + 1):
            for i in range(len(words) - n + 1):
                phrase = ' '.join(words[i:i+n])
                phrases.append(phrase)

        return phrases
    
    def normalize_for_search(self, text: str) -> str:
        """
        Normalize text for search/matching
        """
        # Clean
        text = clean_text(text)

        # Normalize Unicode 
        text = normalize_unicode(text)

        # Remove special characters
        text = re.sub(r'[^\w\s]', ' ', text)

        # Remove extra space
        text = re.sub(r'\s+', ' ', text).strip()

        return text
    
    def extract_entities(self, text: str) -> Dict[str, List[str]]:
        """
        Basic entity extraction
        """
        from app.ai.config import SRI_LANKAN_CITIES

        entities = {
            'numbers': [],
            'currencies': [],
            'locations': []
        }

        # Extract numbers
        numbers = re.findall(r'\d+(?:,\d{3})*(?:\.\d+)?', text)
        entities['numbers'] = numbers

        # Extract currency mentions
        currency_pattern = r'(\d+(?:,\d{3})*(?:\.\d+)?)\s*(rs|rupees|lkr)'
        currencies = re.findall(currency_pattern, text.lower())
        entities['currencies'] = [c[0] for c in currencies]

        # Extrct locations
        text_lower = text.lower()
        for city in SRI_LANKAN_CITIES.keys():
            if city.lower() in text_lower:
                entities['locations'].append(city)

        return entities

    def highlight_keywords(self, text: str, keywords: List[str]) -> str:
        """
        Highligh keywords in text 
        """ 
        highlighted = text
        for keyword in keywords:
            pattern = re.compile(re.escape(keyword), re.IGNORECASE)
            highlighted = pattern.sub(f'++{keyword}**', highlighted)

            return highlighted
        
# ======= Helper Functions =======

def preprocess_query(query: str) -> str:
    """
    Preprocess search query
    """
    processor = TextProcessor()
    return processor.normalize_for_search(query)