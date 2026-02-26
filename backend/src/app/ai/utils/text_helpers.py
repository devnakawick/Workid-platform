"""
Text Processing Utilities
"""

import re
import unicodedata
from typing import List
from unidecode import unidecode
from nltk.corpus import stopwords

def clean_text(text: str) -> str:
    """
    Clean and normalize text by converting to lowercase, removing extra whitespace, 
    and removing special characters.
    """
    if not text:
        return ""
    
    # Convert to lowercase
    text = text.lower()

    # Remoce extra whitespace
    text = re.sub(r'[^\w\s]', '', text, flags=re.UNICODE)   # remove punctuation
    text = re.sub(r'\s+', ' ', text)    # normalize all whitespace to single space

    return text.strip()

def remove_stopwords(text: str, language: str = "en") -> str:
    """
    Remove common stopwords (the, is, are, etc.)
    """

    # Get stopwords for language
    if language == "en":
        stop_words = set(stopwords.words('english'))
    else: 
        # For sinhala and tamil, english will be used for now
        # TODO: Add Sinhala/Tamil stopwords later
        stop_words = set(stopwords.words('english'))

    # Remove stopwords
    words = text.split()
    filtered = [w for w in words if w.lower() not in stop_words]

    return " ".join(filtered)

def extract_numbers(text: str) -> List[float]:
    """
    Extract all numbers from text
    """
    # Find all numbers (integers and decimals)
    numbers = re.findall(r'\d+\.?\d*', text)
    return [float(n) for n in numbers]

def normalize_unicode(text: str) -> str:
    """
    Normalize unicode characters

    Handle Sinhala / Tamil text properly
    """
    if not text:
        return ""
    
    # Normalize unicode
    text = unicodedata.normalize('NFKD', text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    return text

def tokenize(text: str) -> List[str]:
    """
    Split text into tokens (words)
    """
    from nltk.tokenize import word_tokenize
    import nltk

    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        nltk.download('punkt')

    if not text:
        return []
    
    return word_tokenize(text)

def get_word_frequencies(text: str) -> dict[str, int]:
    """
    Count frequency of each word
    """
    words = clean_text(text).split()
    frequency = {}

    for word in words:
        if word:
            frequency[word] = frequency.get(word, 0) + 1

    return frequency

def truncate_text(text: str, max_length: int = 100) -> str:
    """
    Truncate text to max length
    """
    if not text or len(text) <= max_length:
        return text
    
    if max_length <= 3:
        return text[:max_length]
    
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
    words1 = set(clean_text(text1).split())
    words2 = set(clean_text(text2).split())

    if not words1 or not words2:
        return 0.0

    # Jaccard similarity
    intersection = words1.intersection(words2)
    union = words1.union(words2)

    return len(intersection) / len(union)