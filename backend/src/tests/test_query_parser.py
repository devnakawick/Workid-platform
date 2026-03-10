"""
Tests for Natural Language Query Parser
"""

import pytest
from app.ai.nlp.query_parser import QueryParser, convert_to_api

class TestQueryParser:
    """Test query parsing functionality"""

    @pytest.fixture
    def parser(self):
        """Create parser instance"""
        return QueryParser()
    
    # ======= Category Extraction =======

    def test_extract_category_plumber(self, parser):
        """Test: Extract plumbing category"""
        result = parser.parse("need plumber urgently")
        assert result['category'] == 'plumbing'
        print("Plumber -> plumbing")

    def test_extract_category_electrician(self, parser):
        """Test: Extract electrical category"""
        result = parser.parse("electrician wanted for wiring")
        assert result['category'] == 'electrical'
        print("Electrician -> electrical")

    def test_extract_category_keyword(self, parser):
        """Test: Extract category from related keywords"""
        result = parser.parse("fix my kitchen sink")
        assert result['category'] == 'plumbing'
        print("'sink' -> plumbing")

    # ======= Location Extraction =======

    def test_extract_colombo(self, parser):
        """Test: Extract Colombo with correct district"""
        result = parser.parse("plumber in colombo")
        assert result['city'] == 'Colombo'
        assert result['district'] == 'Colombo'
        assert result['province'] == 'Western'
        print("Colombo -> Colombo district -> Western province")

    def test_extract_negombo(self, parser):
        """Test: Negombo is in Gampaha district"""
        result = parser.parse("electrician negombo area")
        assert result['city'] == 'Negombo'
        assert result['district'] == 'Gampaha'
        assert result['province'] == 'Western'
        print("Negombo -> Gampaha district -> Western Province")

    def test_extract_galle(self, parser):
        """Test: Galle location info"""
        result = parser.parse("need carpenter galle")
        assert result['city'] == 'Galle'
        assert result['district'] == 'Galle'
        assert result['province'] == 'Southern'
        print("Galle -> Galle district -> Southern province")

    def test_extract_kandy(self, parser):
        """Test: Kandy location info"""
        result = parser.parse("plumber kandy")
        assert result['city'] == 'Kandy'
        assert result['district'] == 'Kandy'
        assert result['province'] == 'Central'
        print("Kandy -> Kandy district -> Central province")

    def test_extract_jaffna(self, parser):
        """Test: Jaffna location info"""
        result = parser.parse("mason jaffna")
        assert result['city'] == 'Jaffna'
        assert result['district'] == 'Jaffna'
        assert result['province'] == 'Northern'
        print("Jaffna -> Jaffna district -> Northern province")

    def test_extract_batticaloa(self, parser):
        """Test: Batticaloa location info"""
        result = parser.parse("painter batticaloa")
        assert result['city'] == 'Batticaloa'
        assert result['district'] == 'Batticaloa'
        assert result['province'] == 'Eastern'
        print("Batticaloa -> Batticaloa district -> Eastern province")

    def test_extract_kurunegala(self, parser):
        """Test: Kurunegala location info"""
        result = parser.parse("cleaner kurunegala")
        assert result['city'] == 'Kurunegala'
        assert result['district'] == 'Kurunegala'
        assert result['province'] == 'North Western'
        print("Kurunegala -> Kurunegala district -> North Western province")

    def test_extract_anuradhapura(self, parser):
        """Test: Anuradhapura location info"""
        result = parser.parse("driver anuradhapura")
        assert result['city'] == 'Anuradhapura'
        assert result['district'] == 'Anuradhapura'
        assert result['province'] == 'North Central' 
        print("Anuradhapura -> Anuradhapura district -> North Central province")

    def test_extract_badulla(self, parser):
        """Test: Badulla location info"""
        result = parser.parse("gardener badulla")
        assert result['city'] == 'Badulla'
        assert result['district'] == 'Badulla'
        assert result['province'] == 'Uva'  
        print("Badulla -> Badulla district -> Uva province")

    def test_extract_ratnapura(self, parser):
        """Test: Ratnapura location info"""
        result = parser.parse("carpenter ratnapura")
        assert result['city'] == 'Ratnapura'
        assert result['district'] == 'Ratnapura'
        assert result['province'] == 'Sabaragamuwa' 
        print("Ratnapura -> Ratnapura district -> Sabaragamuwa province")

    # ======= Budget Extraction =======
    def test_extract_budget(self, parser):
        """Test: Extract specific budget amount"""
        result = parser.parse("need plumber budget 5000")
        assert result['budget'] == 5000.0
        print("Budget 5000 detected")

    def test_extract_budget_pref(self, parser):
        """Test: Extract budget preference"""
        result = parser.parse("cheap plumber needed")
        assert result['budget_preference'] == 'cheap'
        print("'cheap' preference detected")

    # ======= Urgency Extraction =======

    def test_extract_urgency_high(self, parser):
        """Test: Extract high urgency"""
        result = parser.parse("urgent plumber needed")
        assert result['urgency'] == 'high'
        print("Urgency -> high urgency")

    def test_extract_urgency_today(self, parser):
        """Test: 'today' = high urgency"""
        result = parser.parse("need electrician today")
        assert result['urgency'] == 'high'
        print("Today -> high urgency")

    # ======= Complex Queries =======

    def test_complex_query_colombo(self, parser):
        """Test: Full query with Colombo"""
        query = "need urgent plumber colombo cheap today"
        result = parser.parse(query)
        
        assert result['category'] == 'plumbing'
        assert result['city'] == 'Colombo'
        assert result['district'] == 'Colombo'    
        assert result['province'] == 'Western'    
        assert result['budget_preference'] == 'cheap'
        assert result['urgency'] == 'high'
        
        print(f"Complex Colombo query: {result}")

    def test_complex_query_negombo(self, parser):
        """Test: Full query with Negombo"""
        query = "electrician negombo max 4000 rupees urgent"
        result = parser.parse(query)
        
        assert result['category'] == 'electrical'
        assert result['city'] == 'Negombo'
        assert result['district'] == 'Gampaha'    
        assert result['province'] == 'Western'
        assert result['budget'] == 4000.0
        assert result['urgency'] == 'high'
        
        print(f"Complex Negombo query: {result}")

    def test_complex_query_galle(self, parser):
        """Test: Full query with Galle"""
        query = "carpenter galle affordable soon"
        result = parser.parse(query)
        
        assert result['category'] == 'carpentry'
        assert result['city'] == 'Galle'
        assert result['district'] == 'Galle'
        assert result['province'] == 'Southern'   
        assert result['budget_preference'] == 'affordable'
        assert result['urgency'] == 'medium'
        
        print(f"Complex Galle query: {result}")

class TestAPIConversion:
    """Test conversion from parsed query to API parameters"""

    def test_convert_with_location(self):
        """Test: Location conversion includes district"""
        parsed = {
            'category': 'plumbing',
            'city': 'Colombo',
            'district': 'Colombo',    
            'province': 'Western',
            'urgency': 'high'
        }

        api_params = convert_to_api(parsed)

        assert api_params['category'] == 'plumbing'
        assert api_params['city'] == 'Colombo'
        assert api_params['district'] == 'Colombo'  
        assert api_params['urgency'] == 'high'
        
        print(f"API params with location: {api_params}")

    def test_convert_cheap_preference(self):
        """Test: Convert 'cheap' to budget range"""
        parsed = {
            'category': 'plumbing',
            'budget_preference': 'cheap'
        }
        
        api_params = convert_to_api(parsed)
        
        # Should calculate max_budget based on average (3000 * 0.7 = 2100)
        assert 'max_budget' in api_params
        assert api_params['max_budget'] == 2100
        
        print(f"'Cheap' plumbing → max_budget: {api_params['max_budget']}")