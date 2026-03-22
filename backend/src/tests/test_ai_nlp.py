"""
AI NLP-Safety Tests
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

# NLP imports
from app.ai.nlp.query_parser import QueryParser, convert_to_api
from app.ai.nlp.skill_tagger import SkillTagger
from app.ai.nlp.multilingual_handler import MultilingualHandler
from app.ai.nlp.text_processor import TextProcessor

# Safety imports
from app.ai.safety.spam_detector import SpamDetector
from app.ai.safety.fraud_detection import FraudDetector
from app.ai.safety.anomaly_detector import AnomalyDetector
from app.ai.safety.content_moderator import ContentModerator

# Language imports
from app.ai.language.language_detector import LanguageDetector
from app.ai.language.sinhala_processor import SinhalaProcessor
from app.ai.language.tamil_processor import TamilProcessor
from app.ai.language.translator import Translator

# Service import
from app.services.ai_service import AIService


# ==================== FIXTURES ====================

@pytest.fixture
def query_parser():
    """Query parser instance"""
    return QueryParser()


@pytest.fixture
def skill_tagger():
    """Skill tagger instance"""
    return SkillTagger()


@pytest.fixture
def multilingual_handler():
    """Multilingual handler instance"""
    return MultilingualHandler()


@pytest.fixture
def text_processor():
    """Text processor instance"""
    return TextProcessor()


@pytest.fixture
def spam_detector():
    """Spam detector instance"""
    return SpamDetector()


@pytest.fixture
def fraud_detector():
    """Fraud detector instance"""
    return FraudDetector()


@pytest.fixture
def anomaly_detector():
    """Anomaly detector instance"""
    return AnomalyDetector()


@pytest.fixture
def content_moderator():
    """Content moderator instance"""
    return ContentModerator()


@pytest.fixture
def language_detector():
    """Language detector instance"""
    return LanguageDetector()


@pytest.fixture
def sinhala_processor():
    """Sinhala processor instance"""
    return SinhalaProcessor()


@pytest.fixture
def tamil_processor():
    """Tamil processor instance"""
    return TamilProcessor()


@pytest.fixture
def translator():
    """Translator instance"""
    return Translator()


@pytest.fixture
def ai_service():
    """AI service instance"""
    return AIService()


# ==================== NLP TESTS ====================

class TestQueryParser:
    """Test natural language query parser"""
    
    def test_parse_category(self, query_parser):
        """Test category extraction"""
        result = query_parser.parse("need plumber urgently")
        assert result['category'] == 'plumbing'
    
    def test_parse_city(self, query_parser):
        """Test city extraction"""
        result = query_parser.parse("electrician in colombo")
        assert result['city'] == 'Colombo'
        assert result['district'] == 'Colombo'
        assert result['province'] == 'Western'
    
    def test_parse_budget_number(self, query_parser):
        """Test budget number extraction"""
        result = query_parser.parse("carpenter budget 5000")
        assert result['budget'] == 5000.0
    
    def test_parse_budget_preference(self, query_parser):
        """Test budget preference extraction"""
        result = query_parser.parse("cheap plumber needed")
        assert result['budget_preference'] == 'cheap'
    
    def test_parse_urgency(self, query_parser):
        """Test urgency extraction"""
        result = query_parser.parse("urgent electrician needed")
        assert result['urgency'] == 'high'
    
    def test_parse_complex_query(self, query_parser):
        """Test complex query with multiple elements"""
        result = query_parser.parse("need urgent plumber colombo cheap today")
        
        assert result['category'] == 'plumbing'
        assert result['city'] == 'Colombo'
        assert result['district'] == 'Colombo'
        assert result['province'] == 'Western'
        assert result['budget_preference'] == 'cheap'
        assert result['urgency'] == 'high'
    
    def test_convert_to_api_params(self, query_parser):
        """Test conversion to API parameters"""
        parsed = query_parser.parse("plumber colombo cheap")
        api_params = convert_to_api(parsed)
        
        assert api_params['category'] == 'plumbing'
        assert api_params['city'] == 'Colombo'
        assert api_params['district'] == 'Colombo'
        assert 'max_budget' in api_params
    
    def test_parse_with_suggestions(self, query_parser):
        """Test parsing with suggestions"""
        result = query_parser.parse_with_suggests("need electrician")
        
        assert 'suggestions' in result
        assert result['category'] == 'electrical'


class TestSkillTagger:
    """Test skill extraction"""
    
    def test_extract_plumbing_skills(self, skill_tagger):
        """Test plumbing skill extraction"""
        result = skill_tagger.extract("Need plumber to fix kitchen sink and bathroom pipes")
        
        assert result['category'] == 'plumbing'
        assert 'pipe' in result['skills'] or 'sink' in result['skills']
        assert result['confidence'] > 0.5
    
    def test_extract_electrical_skills(self, skill_tagger):
        """Test electrical skill extraction"""
        result = skill_tagger.extract("Electrician needed for wiring and circuit installation")
        
        assert result['category'] == 'electrical'
        assert 'wiring' in result['skills'] or 'circuit' in result['skills']
    
    def test_extract_carpentry_skills(self, skill_tagger):
        """Test carpentry skill extraction"""
        result = skill_tagger.extract("Carpenter needed to build wooden furniture")
        
        assert result['category'] == 'carpentry'
        assert 'wood' in result['skills'] or 'furniture' in result['skills']
    
    def test_validate_correct_category(self, skill_tagger):
        """Test category validation - correct"""
        result = skill_tagger.validate_category(
            "Need plumber to fix pipes",
            "plumbing"
        )
        
        assert result['is_valid'] == True
        assert result['detected_category'] == 'plumbing'
    
    def test_validate_wrong_category(self, skill_tagger):
        """Test category validation - wrong"""
        result = skill_tagger.validate_category(
            "Need plumber to fix pipes",
            "electrical"
        )
        
        assert result['is_valid'] == False
        assert result['detected_category'] == 'plumbing'
        assert 'plumbing' in result['suggestion'].lower()
    
    def test_suggest_category(self, skill_tagger):
        """Test quick category suggestion"""
        category = skill_tagger.suggest_category("fix my kitchen sink")
        assert category == 'plumbing'
    
    def test_empty_text(self, skill_tagger):
        """Test empty text handling"""
        result = skill_tagger.extract("")
        
        assert result['category'] is None
        assert result['skills'] == []
        assert result['confidence'] == 0.0


class TestMultilingualHandler:
    """Test multilingual query handling"""
    
    def test_detect_sinhala(self, multilingual_handler):
        """Test Sinhala language detection"""
        result = multilingual_handler.translate_to_english("කොළඹ ජලනල")
        
        assert result['language'] == 'si'
        assert 'colombo' in result['translated'].lower()
    
    def test_detect_tamil(self, multilingual_handler):
        """Test Tamil language detection"""
        result = multilingual_handler.translate_to_english("கொழும்பு குழாய்")
        
        assert result['language'] == 'ta'
        assert 'colombo' in result['translated'].lower()
    
    def test_english_passthrough(self, multilingual_handler):
        """Test English text passes through unchanged"""
        result = multilingual_handler.translate_to_english("plumber colombo")
        
        assert result['language'] == 'en'
        assert result['translated'] == result['original']
    
    def test_translate_sinhala_location(self, multilingual_handler):
        """Test Sinhala location translation"""
        result = multilingual_handler.translate_to_english("කොළඹ")
        
        assert 'colombo' in result['translated'].lower()
    
    def test_translate_tamil_location(self, multilingual_handler):
        """Test Tamil location translation"""
        result = multilingual_handler.translate_to_english("கொழும்பு")
        
        assert 'colombo' in result['translated'].lower()
    
    def test_process_query(self, multilingual_handler):
        """Test full query processing"""
        result = multilingual_handler.process_query("කොළඹ ජලනල")
        
        assert result['language'] == 'si'
        assert result['language_name'] == 'Sinhala'
        assert 'translated' in result


class TestTextProcessor:
    """Test text processing utilities"""
    
    def test_split_sentences(self, text_processor):
        """Test sentence splitting"""
        text = "Need plumber. Fix sink. Urgent work."
        sentences = text_processor.split_sentences(text)
        
        assert len(sentences) == 3
    
    def test_extract_phrases(self, text_processor):
        """Test phrase extraction"""
        text = "need plumber colombo"
        phrases = text_processor.extract_phrases(text, min_words=2, max_words=2)
        
        assert 'need plumber' in phrases
        assert 'plumber colombo' in phrases
    
    def test_normalize_for_search(self, text_processor):
        """Test search normalization"""
        text = "  NEED   Plumber!!!  "
        normalized = text_processor.normalize_for_search(text)
        
        assert normalized == "need plumber"
    
    def test_extract_entities(self, text_processor):
        """Test entity extraction"""
        text = "Need plumber in Colombo. Budget is 5000 rupees."
        entities = text_processor.extract_entities(text)
        
        assert 'Colombo' in entities['locations']
        assert len(entities['numbers']) > 0


# ==================== SAFETY TESTS ====================

class TestSpamDetector:
    """Test spam detection"""
    
    def test_detect_legitimate_job(self, spam_detector):
        """Test legitimate job is not flagged"""
        result = spam_detector.detect(
            "Plumber needed",
            "Need plumber to fix kitchen sink. Budget Rs. 3000.",
            3000
        )
        
        assert result['is_spam'] == False
        assert result['spam_score'] < 0.6
    
    def test_detect_obvious_spam(self, spam_detector):
        """Test obvious spam is detected"""
        result = spam_detector.detect(
            "EARN MONEY FAST!!!",
            "Work from home! Earn 100,000 rupees daily! No experience needed! Pay deposit 5000 Rs first!",
            10000
        )
        
        assert result['is_spam'] == True
        assert result['spam_score'] >= 0.6
        assert 'spam_keywords' in result['reasons']
    
    def test_detect_deposit_scam(self, spam_detector):
        """Test deposit scam detection"""
        result = spam_detector.detect(
            "Great opportunity",
            "Pay registration fee of 2000 Rs and start earning!",
            5000
        )
        
        assert result['is_spam'] == True
        assert 'deposit_required' in result['reasons']
    
    def test_detect_short_description(self, spam_detector):
        """Test short description flagging"""
        result = spam_detector.detect(
            "Job",
            "Work now",  # Very short
            2000
        )
        
        assert 'description_too_short' in result['reasons']
    
    def test_detect_excessive_caps(self, spam_detector):
        """Test excessive caps detection"""
        result = spam_detector.detect(
            "URGENT WORK!!!",
            "GREAT OPPORTUNITY!!! EARN BIG MONEY NOW!!!",
            5000
        )
        
        assert 'excessive_caps' in result['reasons']
    
    def test_detect_contact_info(self, spam_detector):
        """Test contact info detection"""
        result = spam_detector.detect(
            "Plumber needed",
            "Call me at 0771234567 for details",
            3000
        )
        
        assert 'contact_info_in_description' in result['reasons']
    
    def test_quick_check(self, spam_detector):
        """Test quick spam check"""
        is_spam = spam_detector.quick_check("Earn money fast! Pay deposit first!")
        assert is_spam == True


class TestAnomalyDetector:
    """Test anomaly detection"""
    
    def test_normal_wage(self, anomaly_detector):
        """Test normal wage is not flagged"""
        result = anomaly_detector.check_wage_anomaly("plumbing", 3000)
        
        assert result['is_anomaly'] == False
        assert result['reason'] == 'normal'
        assert hasattr(anomaly_detector, 'normal_wage_ranges')
    
    def test_suspiciously_low_wage(self, anomaly_detector):
        """Test suspiciously low wage detection"""
        result = anomaly_detector.check_wage_anomaly("plumbing", 500)
        
        assert result['is_anomaly'] == True
        assert result['reason'] == 'suspiciously_low'
        assert result['severity'] == 'high'
    
    def test_suspiciously_high_wage(self, anomaly_detector):
        """Test suspiciously high wage detection"""
        result = anomaly_detector.check_wage_anomaly("plumbing", 20000)
        
        assert result['is_anomaly'] == True
        assert result['reason'] == 'suspiciously_high'
        assert result['severity'] == 'medium'
    
    def test_unknown_category(self, anomaly_detector):
        """Test unknown category handling"""
        result = anomaly_detector.check_wage_anomaly("unknown_category", 5000)
        
        assert result['is_anomaly'] == False
        assert result['reason'] == 'unknown_category'


class TestContentModerator:
    """Test content moderation"""
    
    def test_appropriate_content(self, content_moderator):
        """Test appropriate content passes"""
        result = content_moderator.moderate(
            "Need experienced worker for construction work"
        )
        
        assert result['is_appropriate'] == True
        assert result['severity'] == 'none'
    
    def test_all_caps_detection(self, content_moderator):
        """Test all caps detection"""
        result = content_moderator.moderate(
            "THIS IS ALL CAPS TEXT SHOUTING"
        )
        
        assert any(issue['type'] == 'excessive_caps' for issue in result['issues'])
    
    def test_excessive_punctuation(self, content_moderator):
        """Test excessive punctuation detection"""
        result = content_moderator.moderate(
            "Great job!!!!! Apply now!!!!!"
        )
        
        assert any(issue['type'] == 'excessive_punctuation' for issue in result['issues'])
    
    def test_empty_text(self, content_moderator):
        """Test empty text handling"""
        result = content_moderator.moderate("")
        
        assert result['is_appropriate'] == True
    
    def test_filter_text(self, content_moderator):
        """Test text filtering"""
        filtered = content_moderator.filter_text("Normal text here")
        assert filtered == "Normal text here"


# ==================== LANGUAGE TESTS ====================

class TestLanguageDetector:
    """Test language detection"""
    
    def test_detect_english(self, language_detector):
        """Test English detection"""
        result = language_detector.detect("need plumber in colombo")
        assert result == "en"
    
    def test_detect_sinhala(self, language_detector):
        """Test Sinhala detection"""
        result = language_detector.detect("කොළඹ ජලනල කාර්මිකයෙක් අවශ්‍යයි")
        assert result == "si"
    
    def test_detect_tamil(self, language_detector):
        """Test Tamil detection"""
        result = language_detector.detect("கொழும்பு குழாய் பழுது")
        assert result == "ta"
    
    def test_is_sinhala(self, language_detector):
        """Test is_sinhala method"""
        assert language_detector.is_sinhala("කොළඹ") == True
        assert language_detector.is_sinhala("colombo") == False
    
    def test_is_tamil(self, language_detector):
        """Test is_tamil method"""
        assert language_detector.is_tamil("கொழும்பு") == True
        assert language_detector.is_tamil("colombo") == False
    
    def test_is_english(self, language_detector):
        """Test is_english method"""
        assert language_detector.is_english("colombo") == True
        assert language_detector.is_english("කොළඹ") == False
    
    def test_get_language_name(self, language_detector):
        """Test language name retrieval"""
        assert language_detector.get_lang_name("කොළඹ") == "Sinhala"
        assert language_detector.get_lang_name("கொழும்பு") == "Tamil"
        assert language_detector.get_lang_name("colombo") == "English"


class TestSinhalaProcessor:
    """Test Sinhala text processing"""
    
    def test_normalize(self, sinhala_processor):
        """Test Sinhala normalization"""
        text = "කොළඹ"
        normalized = sinhala_processor.normalize(text)
        assert normalized == text
    
    def test_is_sinhala_text(self, sinhala_processor):
        """Test Sinhala text detection"""
        assert sinhala_processor.is_sinhala_text("කොළඹ ජලනල") == True
        assert sinhala_processor.is_sinhala_text("colombo") == False
    
    def test_extract_sinhala_words(self, sinhala_processor):
        """Test Sinhala word extraction"""
        words = sinhala_processor.extract_sinhala_words("කොළඹ plumber නගරය")
        assert len(words) > 0
        assert "කොළඹ" in words
    
    def test_clean_sinhala_text(self, sinhala_processor):
        """Test Sinhala text cleaning"""
        cleaned = sinhala_processor.clean_sinhala_text("  කොළඹ   ජලනල  ")
        assert cleaned == "කොළඹ ජලනල"


class TestTamilProcessor:
    """Test Tamil text processing"""
    
    def test_normalize(self, tamil_processor):
        """Test Tamil normalization"""
        text = "கொழும்பு"
        normalized = tamil_processor.normalize(text)
        assert normalized == text
    
    def test_is_tamil_text(self, tamil_processor):
        """Test Tamil text detection"""
        assert tamil_processor.is_tamil_text("கொழும்பு குழாய்") == True
        assert tamil_processor.is_tamil_text("colombo") == False
    
    def test_extract_tamil_words(self, tamil_processor):
        """Test Tamil word extraction"""
        words = tamil_processor.extract_tamil_words("கொழும்பு plumber நகரம்")
        assert len(words) > 0
        assert "கொழும்பு" in words
    
    def test_clean_tamil_text(self, tamil_processor):
        """Test Tamil text cleaning"""
        cleaned = tamil_processor.clean_tamil_text("  கொழும்பு   குழாய்  ")
        assert cleaned == "கொழும்பு குழாய்"


class TestTranslator:
    """Test translation"""
    
    def test_translate_sinhala_to_english(self, translator):
        """Test Sinhala to English translation"""
        result = translator.translate("කොළඹ ජලනල", target_language="en")
        
        assert result['source_language'] == 'si'
        assert result['target_language'] == 'en'
        assert 'colombo' in result['translated'].lower()
    
    def test_translate_tamil_to_english(self, translator):
        """Test Tamil to English translation"""
        result = translator.translate("கொழும்பு குழாய்", target_language="en")
        
        assert result['source_language'] == 'ta'
        assert result['target_language'] == 'en'
        assert 'colombo' in result['translated'].lower()
    
    def test_english_no_translation(self, translator):
        """Test English needs no translation"""
        result = translator.translate("colombo plumbing", target_language="en")
        
        assert result['source_language'] == 'en'
        assert result['method'] == 'no_translation_needed'
        assert result['translated'] == result['original']
    
    def test_detect_and_translate(self, translator):
        """Test detect and translate"""
        result = translator.detect_and_translate("කොළඹ")
        
        assert 'language_name' in result
        assert result['language_name'] == 'Sinhala'


# ==================== INTEGRATION TESTS ====================

class TestAIService:
    """Test AI service integration"""
    
    def test_parse_search_query(self, ai_service):
        """Test search query parsing"""
        result = ai_service.parse_search_query("plumber colombo cheap")
        
        assert 'parsed' in result
        assert 'api_params' in result
        assert result['parsed']['category'] == 'plumbing'
    
    def test_parse_multilingual_query(self, ai_service):
        """Test multilingual query parsing"""
        result = ai_service.parse_multilingual_query("කොළඹ ජලනල")
        
        assert result['detected_language'] == 'si'
        assert result['language_name'] == 'Sinhala'
        assert 'parsed' in result
        assert 'api_params' in result
    
    def test_extract_skills(self, ai_service):
        """Test skill extraction via service"""
        result = ai_service.extract_skills("Need plumber to fix pipes and sink")
        
        assert result['category'] == 'plumbing'
        assert len(result['skills']) > 0
    
    def test_check_spam(self, ai_service):
        """Test spam check via service"""
        result = ai_service.check_spam(
            "Plumber needed",
            "Need plumber to fix sink",
            3000
        )
        
        assert 'is_spam' in result
        assert result['is_spam'] == False
    
    def test_check_wage_anomaly(self, ai_service):
        """Test wage anomaly check via service"""
        result = ai_service.check_wage_anomaly("plumbing", 3000)
        
        assert 'is_anomaly' in result
        assert result['is_anomaly'] == False
    
    def test_moderate_content(self, ai_service):
        """Test content moderation via service"""
        result = ai_service.moderate_content("Need experienced worker")
        
        assert 'is_appropriate' in result
        assert result['is_appropriate'] == True


# ==================== API ENDPOINT TESTS ====================

class TestAIEndpoints:
    """Test AI API endpoints"""
    
    def test_parse_endpoint(self, client: TestClient):
        """Test parse search endpoint"""
        response = client.post(
            "/api/ai/search/parse",
            json={
                "query": "plumber colombo cheap",
                "with_suggestions": False
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert 'parsed' in data
        assert 'api_params' in data
    
    def test_multilingual_parse_endpoint(self, client: TestClient):
        """Test multilingual parse endpoint"""
        response = client.post(
            "/api/ai/search/parse-multilingual",
            json={
                "query": "කොළඹ ජලනල",
                "with_suggestions": False
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert 'parsed' in data
    
    def test_extract_skills_endpoint(self, client: TestClient):
        """Test skill extraction endpoint"""
        response = client.post(
            "/api/ai/skills/extract",
            json={
                "text": "Need plumber to fix pipes"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert 'category' in data
        assert data['category'] == 'plumbing'
    
    def test_spam_check_endpoint(self, client: TestClient):
        """Test spam check endpoint"""
        response = client.post(
            "/api/ai/spam/check",
            json={
                "job_title": "Plumber needed",
                "job_description": "Need plumber to fix sink",
                "budget": 3000
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert 'is_spam' in data
        assert data['is_spam'] == False
    
    def test_wage_anomaly_endpoint(self, client: TestClient):
        """Test wage anomaly endpoint"""
        response = client.post(
            "/api/ai/anomaly/wage",
            json={
                "category": "plumbing",
                "budget": 3000
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert 'is_anomaly' in data
        assert data['is_anomaly'] == False

# ==================== EDGE CASES ====================

class TestEdgeCases:
    """Test edge cases and error handling"""
    
    def test_empty_query(self, query_parser):
        """Test empty query handling"""
        result = query_parser.parse("")
        assert result == {'keywords': [], 'original_query': ''}
    
    def test_very_long_query(self, query_parser):
        """Test very long query"""
        long_query = "plumber " * 100
        result = query_parser.parse(long_query)
        assert result['category'] == 'plumbing'
    
    def test_special_characters(self, query_parser):
        """Test special characters in query"""
        result = query_parser.parse("plumber @#$% colombo!!")
        assert result['category'] == 'plumbing'
    
    def test_mixed_language(self, multilingual_handler):
        """Test mixed language text"""
        result = multilingual_handler.translate_to_english("කොළඹ plumber urgent")
        assert result['language'] in ['si', 'en']
    
    def test_numbers_only(self, query_parser):
        """Test numbers only query"""
        result = query_parser.parse("12345")
        # Should handle gracefully
        assert 'original_query' in result
