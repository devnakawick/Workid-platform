"""
Text Processing Utilities

Helper functions for text cleaning, normalization, and processing
"""

import re
import unicodedata
from typing import List, Set


def clean_text(text: str) -> str:   
    """
    Clean and normalize text 
    """
    if not text:
        return ""
    
    # Normalize Unicode
    text = unicodedata.normalize('NFC', text)
    
    # Convert to lowercase
    text = text.lower()

    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text) 
    text = text.strip()   

    return text

def remove_stopwords(text: str, language: str = "en") -> str:
    """
    Remove common stopwords (the, is, are, etc.)
    """
    # English stopwords
    english_stopwords = {
        'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves',
        'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him',
        'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its',
        'itself', 'they', 'them', 'their', 'theirs', 'themselves',
        'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
        'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing',
        'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as',
        'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about',
        'against', 'between', 'into', 'through', 'during', 'before',
        'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in',
        'out', 'on', 'off', 'over', 'under', 'again', 'further',
        'then', 'once', 'need', 'want', 'looking'
    }

    # Remove stopwords
    words = text.split()
    filtered = [w for w in words if w.lower() not in english_stopwords]

    return " ".join(filtered)

def extract_numbers(text: str) -> List[float]:
    """
    Extract all numbers from text
    """
    # Pattern got numbers
    pattern = r'\d+(?:,\d{3})*(?:\.\d+)?'
    matches = re.findall(pattern, text)

    # Convert to float
    numbers = []
    for match in matches:
        try:
            # Remove commas
            num = float(match.replace(',', ''))
            numbers.append(num)
        except ValueError:
            continue

    return numbers

def normalize_unicode(text: str) -> str:
    """
    Normalize unicode characters

    Handle Sinhala / Tamil text properly
    """
    return unicodedata.normalize('NFC', text)

def tokenize(text: str) -> List[str]:
    """
    Split text into tokens (words)
    """
    tokens = re.findall(r'\b\w+\b', text.lower())
    return tokens

def get_word_frequencies(text: str) -> dict:
    """
    Count frequency of each word
    """
    words = tokenize(text)
    frequency = {}

    for word in words:
        if word:
            frequency[word] = frequency.get(word, 0) + 1

    return frequency

def truncate_text(text: str, max_length: int = 100) -> str:
    """
    Truncate text to max length
    """
    if len(text) <= max_length:
        return text
    
    return text[:max_length - 3] + "..."

def contains_any(text: str, keywords: List[str]) -> bool:
    """
    Check if text contains any of the keywords
    """
    text_lower = text.lower()
    return any(keyword.lower() in text_lower for keyword in keywords)

def calculate_text_similarity(text1: str, text2: str) -> float:
    """
    Calculate similarity between two texts
    """
    tokens1 = set(tokenize(text1))
    tokens2 = set(tokenize(text2))

    if not tokens1 or not tokens2:
        return 0.0

    # Jaccard similarity
    intersection = tokens1.intersection(tokens2)
    union = tokens1.union(tokens2)

    similarity = len(intersection) / len(union) if union else 0.0
    return similarity