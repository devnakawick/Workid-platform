"""
Tests for Spam Detector
"""

import pytest
from app.ai.safety.spam_detector import SpamDetector, is_spam, get_spam_score

class TestSpamDetector:
    """Test spam detection functionality"""

    @pytest.fixture
    def detector(self):
        """Create detector instance"""
        return SpamDetector()
    
    # ======= Spam Detection =======

    def test_detect_obvious_spam(self, detector):
        """Test: Detect obvious spam"""
        result = detector.detect(
            "EARN MONEY FAST",
            "Work from home! Earn 100,000 rupees daily! No experience needed! Pay deposit of 5000 Rs first!",
            10000
        )

        assert result['is_spam'] == True
        assert result['spam_score'] >= 0.8
        assert 'spam_keywords' in result['reasons']
        assert 'deposit_required' in result['reasons']

        print(f"Obvious spam detected: {result}")

    def test_detect_legitimate_job(self, detector):
        """Test: Legitimate job is not flagged"""
        result = detector.detect(
            "Plumber needed for kitchen repair",
            "Need experienced plumber to fix leaking kitchen sink. Should have pipe fitting experience. Budget Rs. 3000.",
            3000
        )

        assert result['is_spam'] == False
        assert result['spam_score'] < 0.6

        print(f"Legitimate job passed: {result}")

    def test_detect_deposit_scam(self, detector):
        """Test: Detect deposit scam"""
        result = detector.detect(
            "Earn money daily",
            "Great opportunity! Just pay registration fee of 2000 Rs and start earning.",
            5000
        )
        
        assert result['is_spam'] == True
        assert 'deposit_required' in result['reasons']

        print(f"Deposit scam detected: {result}")

    def test_detect_unrealistic_pay(self, detector):
        """Test: Detect unrealistic pay promises"""
        result = detector.detect(
            "Easy money",
            "Earn 50,000 rupees per day working from home! No skills required!",
            50000
        )
        
        assert result['is_spam'] == True
        assert 'unrealistic_pay' in result['reasons']

        print(f"Unrealistic pay detected: {result}")

    def test_detect_too_short(self, detector):
        """Test: Detect suspiciously short description"""
        result = detector.detect(
            "Job",
            "Work now",  
            2000
        )
        
        assert 'description_too_short' in result['reasons']

        print(f"Short description flagged: {result}")

    def test_detect_excessive_caps(self, detector):
        """Test: Detect excessive capital letters"""
        result = detector.detect(
            "URGENT WORK FROM HOME!!!",
            "GREAT OPPORTUNITY!!! EARN BIG MONEY NOW!!! APPLY TODAY!!!",
            5000
        )
        
        assert 'excessive_caps' in result['reasons']

        print(f"Excessive caps detected: {result}")

    def test_detect_contact_info(self, detector):
        """Test: Detect phone/email in description"""
        result = detector.detect(
            "Plumber needed",
            "Call me at 0771234567 for details. Email: scam@example.com",
            3000
        )
        
        assert 'contact_info_in_description' in result['reasons']

        print(f"Contact info detected: {result}")

    def test_unrealistic_budget(self, detector):
        """Test: Detect unrealistic budget"""
        result = detector.detect(
            "Simple cleaning job",
            "Need someone to clean one room.",
            150000  # Price is too high for cleaning
        )
        
        assert 'unrealistic_budget' in result['reasons']

        print(f"Unrealistic budget detected: {result}")

    # ======= Confidence Level =======

    def test_high_confidence_spam(self, detector):
        """Test: High confidence spam"""
        result = detector.detect(
            "EARN MONEY",
            "Earn 100k daily! Pay deposit! Work from home guaranteed!",
            10000
        )
        
        assert result['confidence'] == 'high'
        assert result['spam_score'] >= 0.8

        print(f"High confidence: {result['spam_score']}")

    def test_medium_confidence(self, detector):
        """Test: Medium confidence"""
        result = detector.detect(
            "Work opportunity",
            "Good job. Pay is great.",  # Short but not many spam keywords
            3000
        )

        print(f"Medium confidence: {result}")

    # ======= Recommendation =======

    def test_block_recommendation(self, detector):
        """Test: Recommend blocking high spam"""
        result = detector.detect(
            "SCAM",
            "Earn lakhs per day! Pay 10000 deposit first! Guaranteed income!",
            50000
        )
        
        assert 'block' in result['recommendation'].lower()

        print(f"Block recommended: {result['recommendation']}")

    def test_review_recommendation(self, detector):
        """Test: Recommend review for medium spam"""
        result = detector.detect(
            "Job",
            "Quick",  
            2000
        )

        print(f"Recommendation: {result['recommendation']}")

    # ======= Utility Functions =======

    def test_is_spam(self):
        """Test: is_spam() utility function"""
        result = is_spam(
            "EARN MONEY",
            "Pay deposit! Earn daily!"
        )
        
        assert result == True

        print(f"is_spam() works: {result}")

    def test_get_spam_score(self):
        """Test: get_spam_score() utility function"""
        score = get_spam_score(
            "Plumber needed",
            "Need plumber to fix sink. Budget Rs. 3000."
        )
        
        assert 0.0 <= score <= 1.0
        assert score < 0.6

        print(f"get_spam_score() works: {score}")

    # ======= Edge Cases =======

    def test_empty_description(self, detector):
        """Test: Handle empty description"""
        result = detector.detect("Title", "", 1000)
        
        assert 'description_too_short' in result['reasons']

        print(f"Empty description handled: {result}")

    def test_mixed_signals(self, detector):
        """Test: Legitimate job with one spam indicator"""
        result = detector.detect(
            "Plumber needed urgently",
            "Need plumber to fix pipes. Call 0771234567.",  
        )

        # Will flag for contact info but overall not spam
        assert 'contact_info_in_description' in result['reasons']

        print(f"Mixed signals: {result}")