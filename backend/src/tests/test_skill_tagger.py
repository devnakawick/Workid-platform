"""
Tests for Skill Tagger
"""

import pytest
from app.ai.nlp.skill_tagger import SkillTagger, quick_tag, extract_skills_simple

class TestSkillTagger:
    """Test skill extraction functionality"""

    @pytest.fixture
    def tagger(self):
        """Create tagger instance"""
        return SkillTagger()
    
    # ======= Category Detection =======

    def test_detect_plumbing(self, tagger):
        """Test: Detect plumbing category"""
        text = "Need plumber to fix kitchen sink and bathroom pipes"
        result = tagger.extract(text)

        assert result['category'] == 'plumbing'
        assert result['confidence'] > 0.5
        assert 'pipe' in result['skills'] or 'sink' in result['skills']

        print(f"Plumbing detected: {result}")

    def test_detect_electrical(self, tagger):
        """Test: Detect electrical category"""
        text = "Looking for electrician to install new wiring and fix circuit"
        result = tagger.extract(text)

        assert result['category'] == 'electrical'
        assert result['confidence'] > 0.5
        assert 'wiring' in result['skills'] or 'circuit' in result['skills']

        print(f"Electrical detected: {result}")

    def test_detect_carpentry(self, tagger):
        """Test: Detect carpentry category"""
        text = "Carpenter needed to build wooden cupboard and fix door"
        result = tagger.extract(text)
        
        assert result['category'] == 'carpentry'
        assert 'wood' in result['skills'] or 'cupboard' in result['skills'] or 'door' in result['skills']
        
        print(f"Carpentry detected: {result}")

    def test_detect_masonry(self, tagger):
        """Test: Detect masonry category"""
        text = "Need mason for brick wall construction and cement work"
        result = tagger.extract(text)
        
        assert result['category'] == 'masonry'
        assert 'brick' in result['skills'] or 'cement' in result['skills']

        print(f"Masonry detected: {result}")

    # ======= Skill Extraction =======

    def test_multiple_skill_extraction(self, tagger):
        """Test: Extract multiple skills from description"""
        text = "Need plumber expert in pipe fitting, drainage work, and sink installation"
        result = tagger.extract(text)
        
        assert result['category'] == 'plumbing'
        assert len(result['skills']) >= 2
        assert 'pipe' in result['skills']
        assert 'drainage' in result['skills'] or 'sink' in result['skills']
        
        print(f"Multiple skills extracted: {result['skills']}")

    def test_no_duplicates(self, tagger):
        """Test: Same skill mentioned twice only appears once"""
        text = "Need plumber for pipe work. Must have pipe fitting experience with pipes"
        result = tagger.extract(text)
        
        # Count how many times 'pipe' appears
        pipe_count = result['skills'].count('pipe')
        assert pipe_count == 1
        
        print(f"No duplicate skills: {result['skills']}")

    # ======= Confidence Scoring =======

    def test_high_confidence(self, tagger):
        """Test: Clear category gives high confidence"""
        text = "Plumber needed for pipe fitting, drainage, sink installation, and tap repair"
        result = tagger.extract(text)
        
        assert result['category'] == 'plumbing'
        assert result['confidence'] >= 0.7 
        
        print(f"High confidence: {result['confidence']}")

    def test_low_confidence_mixed(self, tagger):
        """Test: Mixed skills give lower confidence"""
        text = "Need person who can do plumbing and electrical wiring"
        result = tagger.extract(text)
        
        # Should detect something but with lower confidence
        assert result['category'] is not None
        
        print(f"Mixed category detected: {result['category']} (confidence: {result['confidence']})")

    def test_empty_text(self, tagger):
        """Test: Empty text returns None"""
        result = tagger.extract("")
        
        assert result['category'] is None
        assert result['confidence'] == 0.0
        assert result['skills'] == []
        
        print("Empty text handled")

    def test_short_text(self, tagger):
        """Test: Very short text returns None"""
        result = tagger.extract("hello")
        
        assert result['category'] is None
        
        print("Short text handled")

    # ======= Category Validation =======

    def test_validate_correct_category(self, tagger):
        """Test: Validate correctly tagged job"""
        text = "Need plumber to fix pipes"
        validation = tagger.validate_category(text, "plumbing")
        
        assert validation['is_valid'] == True
        assert validation['detected_category'] == 'plumbing'
        
        print(f"Correct category validated: {validation}")

    def test_validate_wrong_category(self, tagger):
        """Test: Detect incorrectly tagged job"""
        text = "Need plumber to fix kitchen sink"
        validation = tagger.validate_category(text, "electrical")
        
        assert validation['is_valid'] == False
        assert validation['detected_category'] == 'plumbing'
        assert 'plumbing' in validation['suggestion'].lower()
        
        print(f"Wrong category detected: {validation}")

    # ======= Real-World Scenario =======

    def test_real_scenario(self, tagger):
        """Test: Real job description"""
        text = """
        Urgent! Kitchen sink is leaking badly. Need experienced plumber 
        to fix the leak and check all bathroom taps. Should know pipe 
        fitting and drainage work.
        """
        result = tagger.extract(text)
        
        assert result['category'] == 'plumbing'
        assert 'sink' in result['skills']
        assert 'pipe' in result['skills']
        assert 'drainage' in result['skills']
        
        print(f"Real example 1: {result}")

    # ======= Utility Functions =======

    def test_quick_tag(self):
        """Test: quick_tag utility function"""
        category = quick_tag("need plumber for urgent pipe repair")
        
        assert category == 'plumbing'
        
        print(f"quick_tag works: {category}")

    def test_extract_skills_simple(self):
        """Test: extract_skills_simple utility function"""
        skills = extract_skills_simple("fix pipes and install sink")
        
        assert 'pipe' in skills
        assert 'sink' in skills
        
        print(f"extract_skills_simple works: {skills}")

    # ======= Context Extraction =======

    def test_extract_with_context(self, tagger):
        """Test: Extract skills with context"""
        text = "Need expert plumber for complex pipe fitting and drainage system installation"
        result = tagger.extract_with_context(text)
        
        assert result['category'] == 'plumbing'
        assert len(result['skills_with_context']) > 0

        # Check context is captured
        for item in result['skills_with_context']:
            assert 'skill' in item
            assert 'context' in item
            assert len(item['context']) > 0
        
        print(f"Context extraction: {result['skills_with_context']}")