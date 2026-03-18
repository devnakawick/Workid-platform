from typing import Dict, List, Optional
import numpy as np
from collections import defaultdict
import logging

logger = logging.getLogger(__name__)

class FairWagePredictor:
    """
    Predict fair wages for jobs based on:
    - Job category/type
    - Location (city)
    - Required skills
    - Experience level
    - Historical wage data
    """
    
    def __init__(self):
        # Store historical wage data for learning
        self.wage_history = defaultdict(list)  # (category, city) -> list of wages
        
        # Base wage rates by category (Sri Lankan Rupees per hour)
        self.base_wages = {
            'cleaning': 500,
            'plumbing': 800,
            'electrical': 1000,
            'carpentry': 900,
            'painting': 700,
            'gardening': 600,
            'cooking': 800,
            'childcare': 700,
            'driving': 900,
            'security': 600,
            'construction': 750,
            'housekeeping': 550,
            'general_labor': 500
        }
        
        # Location multipliers (major Sri Lankan cities)
        self.location_multipliers = {
            'colombo': 1.3,
            'kandy': 1.1,
            'galle': 1.0,
            'negombo': 1.0,
            'jaffna': 0.9,
            'trincomalee': 0.9,
            'batticaloa': 0.9,
            'anuradhapura': 0.85,
            'ratnapura': 0.85,
            'kurunegala': 0.85
        }
        
        # Experience multipliers
        self.experience_multipliers = {
            0: 1.0,      # No experience
            1: 1.1,      # 1 year
            2: 1.2,      # 2 years
            3: 1.3,      # 3 years
            5: 1.5,      # 5 years
            10: 1.8      # 10+ years
        }
    
    def record_wage(self, category: str, city: str, wage: float):
        """Record actual wage paid for learning"""
        key = (category.lower(), city.lower())
        self.wage_history[key].append(wage)
        logger.info(f"Recorded wage: {category} in {city} = Rs.{wage}")
    
    def get_base_wage(self, category: str) -> float:
        """Get base wage for job category"""
        category_lower = category.lower()
        
        # Try exact match first
        if category_lower in self.base_wages:
            return self.base_wages[category_lower]
        
        # Try partial match
        for key, wage in self.base_wages.items():
            if key in category_lower or category_lower in key:
                return wage
        
        # Default to general labor
        return self.base_wages['general_labor']
    
    def get_location_multiplier(self, city: str) -> float:
        """Get location multiplier for city"""
        city_lower = city.lower() if city else ''
        
        # Try exact match
        if city_lower in self.location_multipliers:
            return self.location_multipliers[city_lower]
        
        # Try partial match
        for key, multiplier in self.location_multipliers.items():
            if key in city_lower or city_lower in key:
                return multiplier
        
        # Default multiplier
        return 1.0
    
    def get_experience_multiplier(self, years: int) -> float:
        """Get experience multiplier"""
        # Find closest experience level
        if years >= 10:
            return self.experience_multipliers[10]
        elif years >= 5:
            return self.experience_multipliers[5]
        elif years >= 3:
            return self.experience_multipliers[3]
        elif years >= 2:
            return self.experience_multipliers[2]
        elif years >= 1:
            return self.experience_multipliers[1]
        else:
            return self.experience_multipliers[0]
    
    def get_skills_multiplier(self, required_skills: List[str]) -> float:
        """Calculate multiplier based on number/complexity of skills"""
        if not required_skills:
            return 1.0
        
        num_skills = len(required_skills)
        
        # More skills = higher multiplier
        if num_skills >= 5:
            return 1.3
        elif num_skills >= 3:
            return 1.2
        elif num_skills >= 2:
            return 1.1
        else:
            return 1.0
    
    def predict_hourly_wage(
        self,
        category: str,
        city: str,
        required_skills: List[str] = None,
        experience_required: int = 0,
        use_historical: bool = True
    ) -> Dict:
        """
        Predict fair hourly wage for a job
        
        Args:
            category: Job category
            city: City where job is located
            required_skills: List of required skills
            experience_required: Years of experience required
            use_historical: Use historical data if available
        
        Returns:
            Dictionary with wage prediction and breakdown
        """
        # Check for historical data first
        if use_historical:
            key = (category.lower(), city.lower())
            if key in self.wage_history and len(self.wage_history[key]) >= 3:
                # Use median of historical wages
                wages = self.wage_history[key]
                historical_wage = np.median(wages)
                historical_std = np.std(wages)
                
                return {
                    'predicted_wage_hourly': round(historical_wage, 2),
                    'min_wage': round(historical_wage - historical_std, 2),
                    'max_wage': round(historical_wage + historical_std, 2),
                    'method': 'historical_data',
                    'sample_size': len(wages),
                    'confidence': 'high'
                }
        
        # Calculate using base wage and multipliers
        base_wage = self.get_base_wage(category)
        location_mult = self.get_location_multiplier(city)
        experience_mult = self.get_experience_multiplier(experience_required)
        skills_mult = self.get_skills_multiplier(required_skills or [])
        
        # Calculate final wage
        predicted_wage = base_wage * location_mult * experience_mult * skills_mult
        
        # Calculate range (±15%)
        min_wage = predicted_wage * 0.85
        max_wage = predicted_wage * 1.15
        
        return {
            'predicted_wage_hourly': round(predicted_wage, 2),
            'min_wage': round(min_wage, 2),
            'max_wage': round(max_wage, 2),
            'breakdown': {
                'base_wage': round(base_wage, 2),
                'location_multiplier': location_mult,
                'experience_multiplier': experience_mult,
                'skills_multiplier': skills_mult
            },
            'method': 'calculated',
            'confidence': 'medium'
        }
    
    def predict_total_payment(
        self,
        category: str,
        city: str,
        estimated_hours: float,
        required_skills: List[str] = None,
        experience_required: int = 0
    ) -> Dict:
        """
        Predict total payment for a job
        """
        hourly_prediction = self.predict_hourly_wage(
            category, city, required_skills, experience_required
        )
        
        predicted_hourly = hourly_prediction['predicted_wage_hourly']
        min_hourly = hourly_prediction['min_wage']
        max_hourly = hourly_prediction['max_wage']
        
        total_payment = predicted_hourly * estimated_hours
        min_payment = min_hourly * estimated_hours
        max_payment = max_hourly * estimated_hours
        
        return {
            'predicted_total_payment': round(total_payment, 2),
            'min_payment': round(min_payment, 2),
            'max_payment': round(max_payment, 2),
            'hourly_rate': hourly_prediction,
            'estimated_hours': estimated_hours
        }
    
    def is_wage_fair(
        self,
        offered_wage: float,
        category: str,
        city: str,
        threshold: float = 0.15
    ) -> Dict:
        """
        Check if offered wage is fair
        
        Args:
            offered_wage: Wage offered by employer
            category: Job category
            city: City
            threshold: Acceptable deviation from predicted wage (default 15%)
        
        Returns:
            Dictionary with fairness assessment
        """
        prediction = self.predict_hourly_wage(category, city)
        predicted_wage = prediction['predicted_wage_hourly']
        
        # Calculate deviation
        deviation = abs(offered_wage - predicted_wage) / predicted_wage
        
        # Determine fairness
        if offered_wage >= predicted_wage * (1 - threshold):
            if offered_wage >= predicted_wage * 1.2:
                assessment = 'above_market'
                recommendation = 'Excellent pay'
            elif offered_wage >= predicted_wage:
                assessment = 'fair'
                recommendation = 'Fair market rate'
            else:
                assessment = 'slightly_below'
                recommendation = 'Slightly below market'
        else:
            assessment = 'unfair'
            recommendation = 'Significantly below market rate'
        
        return {
            'offered_wage': offered_wage,
            'predicted_wage': predicted_wage,
            'deviation_percentage': round(deviation * 100, 1),
            'assessment': assessment,
            'recommendation': recommendation,
            'is_fair': assessment in ['fair', 'above_market'],
            'warning': assessment == 'unfair'
        }
    
    def get_market_rates(self, category: str, top_n: int = 5) -> List[Dict]:
        """
        Get market wage rates for a category across different cities
        """
        rates = []
        
        for city in self.location_multipliers.keys():
            prediction = self.predict_hourly_wage(category, city)
            rates.append({
                'city': city.title(),
                'hourly_rate': prediction['predicted_wage_hourly'],
                'wage_range': f"Rs.{prediction['min_wage']} - Rs.{prediction['max_wage']}"
            })
        
        # Sort by hourly rate descending
        rates.sort(key=lambda x: x['hourly_rate'], reverse=True)
        
        return rates[:top_n]