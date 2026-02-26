"""
Tests for AI Utility functions
"""

import pytest
from app.ai.utils.text_helpers import (
    clean_text,
    remove_stopwords,
    extract_numbers,
    tokenize,
    contains_any,
    calculate_text_similarity
)

class TestTextHelpers:
    """Test text processing utilities"""

    def test_clean_text(self):
        """Test text cleaning"""
        assert clean_text("  Hello!!!  World  ") == "hello world"
        assert clean_text("Test@#123") == "test123"
        assert clean_text("") == ""

    def test_remove_stopwords(self):
        """Test stopword removal"""
        result = remove_stopwords("I need a plumber in the city")
        # Should remove: I, a, in, the
        assert "plumber" in result
        assert "city" in result
        assert "the" not in result

    def test_extract_numbers(self):
        """Test number extraction"""
        numbers = extract_numbers("Need 2 workers for 3 days, Rs.5000")
        assert 2.0 in numbers
        assert 3.0 in numbers
        assert 5000.0 in numbers

        def test_tokenize(self):
            """Test tokenization"""
            tokens = tokenize("Need plumber today")
            assert len(tokens) == 3
            assert "plumber" in tokens

        def test_contains_any(self):
            """Test keyword detection"""
            text = "need plumber urgently"
            assert contains_any(text, ["plumber", "electrician"]) == True
            assert contains_any(text, ["carpenter", "painter"]) == False

        def test_calculate_text_similarity(self):
            """Test text similarity"""
            sim = calculate_text_similarity("need plumber", "plumber needed")
            assert sim > 0.5    # should be similar

            sim = calculate_text_similarity("plumber", "electrician")
            assert sim == 0.0   # no overlap