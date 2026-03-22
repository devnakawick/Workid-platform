"""
Natural Language Query Parser

Convert plain language job searches into structured filters
"""

import re
from typing import Dict, List, Optional, Any
from app.ai.config import (
    SKILL_CATEGORIES,
    SKILL_KEYWORDS,
    SRI_LANKAN_CITIES,
    ALL_DISTRICTS,
    SRI_LANKAN_PROVINCES,
    BUDGET_KEYWORDS, 
    URGENCY_KEYWORDS
)
from app.ai.utils.text_helpers import (
    clean_text,
    remove_stopwords,
    extract_numbers
)

class QueryParser:
    """
    Parse natural language search queries into structured filters
    """

    def __init__(self):
        """Initialize parser with skill and location data"""
        self.skill_categories = SKILL_CATEGORIES
        self.skill_keywords = SKILL_KEYWORDS
        self.cities = SRI_LANKAN_CITIES
        self.districts = ALL_DISTRICTS
        self.provinces = SRI_LANKAN_PROVINCES
        self.budget_keywords = BUDGET_KEYWORDS
        self.urgency_keywords = URGENCY_KEYWORDS

    def parse(self, query: str) -> Dict[str, Any]:
        """
        Main parsing function
        """
        # Clean the query
        cleaned = clean_text(query)

        # Extract location first 
        city = self._extract_city(cleaned)
        district = self._extract_district(cleaned)
        location_info = self._get_location_info(city)

        # Extract different components
        result = {
            'category': self._extract_category(cleaned),
            'city': city,
            'district': district or location_info.get('district'),
            'province': location_info.get('province'),
            'budget': self._extract_budget(cleaned),
            'budget_preference': self._extract_budget_preference(cleaned),
            'urgency': self._extract_urgency(cleaned),
            'keywords': self._extract_keywords(cleaned),
            'original_query': query
        }

        # Remove None values
        return {k: v for k, v in result.items() if v is not None}
    
    def _extract_category(self, text: str) -> Optional[str]:
        """
        Extract job categories from text
        """
        text_lower = text.lower()

        # Check each category's keyword
        category_scores = {}

        for category, keywords in self.skill_keywords.items():
            score = 0
            for keyword in keywords:
                if keyword in text_lower:
                    score += 1

            if score > 0:
                category_scores[category] = score

        # Return category with highest score
        if category_scores:
            return max(category_scores, key=category_scores.get)
        
        return None
    
    def _extract_city(self, text: str) -> Optional[str]:
        """
        Extract city name from text
        """
        text_lower = text.lower()

        # Check for exact city matches
        for city in self.cities.keys():
            if re.search(rf"\b{re.escape(city.lower())}\b", text_lower):
                return city
            
        return None
    
    def _get_location_info(self, city: Optional[str]) -> Dict[str, Optional[str]]:
        """
        Get district and province from city name
        """
        if not city or city not in self.cities:
            return {"district": None, "province": None}
        
        return {
            "district": self.cities[city]["district"],
            "province": self.cities[city]["province"]
        }
    
    def _extract_district(self, text: str) -> Optional[str]:
        """
        Extract district directly from text
        """
        text_lower = text.lower()

        for district in self.districts:
            if district in text_lower:
                return district.capitalize()
            
        return None
    
    def _extract_budget(self, text: str) -> Optional[float]:
        """
        Extract specific budget amount from text
        """
        # Extract all numbers
        numbers = extract_numbers(text)

        if not numbers: 
            return None
        
        # Look for budget related keywords near numbers
        budget_indicators = {
            "budget", "rs", "rupees", "lkr", "price", 
            "pay", "cost", "max", "upto", "under", "maximum"
        }

        text_lower = text.lower()

        # If budget keywords present, use the larged number (assuming it's not duration or quantity)
        if any(indicator in text_lower for indicator in budget_indicators):
            # Filter out small numbers 
            valid_budgets = [n for n in numbers if n >= 500]
            if valid_budgets:
                return max(valid_budgets)
            
        # If no keywords but numbers > 1000, assume it's budget
        large_numbers = [n for n in numbers if n >= 1000]
        if large_numbers:
            return max(large_numbers)
        
        return None
    
    def _extract_budget_preference(self, text: str) -> Optional[str]:
        """
        Extract budget preferences (cheap, expensive, etc.)
        """
        text_lower = text.lower()

        for keyword in self.budget_keywords.keys():
            if keyword in text_lower:
                return keyword
            
        return None
    
    def _extract_urgency(self, text: str) -> Optional[str]:
        """
        Extract urgency level from text
        """
        text_lower = text.lower()

        for keyword, urgency_level in self.urgency_keywords.items():
            if keyword in text_lower:
                return urgency_level
            
        return None
    
    def _extract_keywords(self, text: str) -> List[str]:
        """
        Extract meaningful keywords from query
        """
        # Remove stopwords
        filtered = remove_stopwords(text)

        # Split into words
        words = filtered.split()

        # Remove very short words 
        keywords = [w for w in words if len(w) >= 3]

        return keywords
    
    def parse_with_suggests(self, query: str) -> Dict[str, Any]:
        """
        Parse query and provide suggestions if incomplete
        """
        parsed = self.parse(query)
        suggestions = {}

        # Suggest cities if none found
        if 'city' not in parsed:
            # Suggest top cities from each province 
            top_cities = [
                'Colombo', 'Galle', 'Kandy', 'Jaffna',
                'Batticaloa', 'Kurunegala', 'Anuradhapura'
            ]
            suggestions['cities'] = top_cities

        # Suggest adding filters
        missing_filters = []
        if 'budget' not in parsed and 'budget_preference' not in parsed:
            missing_filters.append('budget')
        if 'urgency' not in parsed:
            missing_filters.append('urgency')

        if missing_filters:
            suggestions['add_filters'] = missing_filters

        parsed['suggestions'] = suggestions
        return parsed
    
# ======= Helper Functions =======

def convert_to_api(parsed_query: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert parsed query to API query parameters
    """
    api_params = {}

    # Direct mappings
    if 'category' in parsed_query:
        api_params['category'] = parsed_query['category']

    if 'city' in parsed_query:
        api_params['city'] = parsed_query['city']

    if 'district' in parsed_query:
        api_params['district'] = parsed_query['district']

    if 'urgency' in parsed_query:
        api_params['urgency'] = parsed_query['urgency']

    # Convert budget
    if 'budget' in parsed_query:
        # Specific budget given
        api_params['max_budget'] = parsed_query['budget']

    elif 'budget_preference' in parsed_query:
        # Budget preferences (cheap, expensive, etc.)
        preference = parsed_query['budget_preference']

        # Estimate average budget by category
        category = parsed_query.get('category')
        avg_budget = _estimate_average_budget(category)

        if preference in ['cheap', 'low', 'affordable']:
            # 70-85% of average
            multiplier = BUDGET_KEYWORDS.get(preference, {}).get('max_multiplier', 0.8)
            api_params['max_budget'] = int(avg_budget * multiplier)

        elif preference in ['expensive', 'high', 'premium']:
            # 120-150% of average
            multiplier = BUDGET_KEYWORDS.get(preference, {}).get('min_multiplier', 1.2)
            api_params['min_budget'] = int(avg_budget * multiplier)

    # Add keywords for text search 
    if 'keywords' in parsed_query:
        api_params['keywords'] = parsed_query['keywords']

    return api_params

def _estimate_average_budget(category: Optional[str]) -> float:
    """
    Estimate average budget for a job category
    """
    # Average daily rates by category 
    averages = {
        "plumbing": 3000.0,
        "electrical": 3500.0,
        "carpentry": 3000.0,
        "masonry": 2500.0,
        "painting": 2500.0,
        "gardening": 2000.0,
        "cleaning": 1500.0,
        "driving": 2500.0,
        "general_labor": 1500.0,
        "other": 2500.0
    }

    return averages.get(category, 2500.0)   