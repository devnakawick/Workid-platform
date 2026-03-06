"""
SMS Service using Vonage (Nexmo)
"""

import requests
import logging
from app.config import settings

logger = logging.getLogger(__name__)

def send_otp(phone_number: str, otp_code: str, language: str = 'en') -> bool:
    """
    Send OTP SMS via Vonage
    
    Args:
        phone_number: Phone number (e.g., "0771234567")
        otp_code: 6-digit OTP code
        language: Language ('en', 'si', 'ta')
    
    Returns:
        True if SMS sent successfully
    """
    
    # Get message in correct language
    message = _get_otp_message(otp_code, language)
    
    # Development mode - print to console
    if settings.ENVIRONMENT == "development" and not settings.VONAGE_API_KEY:
        logger.info("\n" + "="*60)
        logger.info("📱 OTP SMS (Development Mode - No Vonage credentials)")
        logger.info(f"To: {phone_number}")
        logger.info(f"OTP: {otp_code}")
        logger.info(f"Message: {message}")
        logger.info("="*60 + "\n")
        return True
    
    # Production mode - send via Vonage
    try:
        # Format phone number for Vonage
        formatted_number = _format_phone_number(phone_number)
        
        # Vonage API endpoint
        url = "https://rest.nexmo.com/sms/json"
        
        # Prepare request payload
        payload = {
            'api_key': settings.VONAGE_API_KEY,
            'api_secret': settings.VONAGE_API_SECRET,
            'from': settings.VONAGE_FROM_NUMBER,
            'to': formatted_number,
            'text': message
        }
        
        # Send request
        response = requests.post(url, json=payload, timeout=10)
        
        # Check response
        if response.status_code == 200:
            result = response.json()
            messages = result.get('messages', [])
            
            if messages and messages[0].get('status') == '0':
                logger.info(f"✅ Vonage SMS sent successfully to {phone_number}")
                return True
            else:
                error_text = messages[0].get('error-text', 'Unknown error') if messages else 'No messages in response'
                logger.error(f"❌ Vonage SMS failed: {error_text}")
                return False
        else:
            logger.error(f"❌ Vonage API error: HTTP {response.status_code}")
            return False
            
    except requests.exceptions.Timeout:
        logger.error("❌ Vonage API timeout")
        return False
    except requests.exceptions.RequestException as e:
        logger.error(f"❌ Vonage request failed: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"❌ Vonage SMS exception: {str(e)}")
        return False


def _format_phone_number(phone_number: str) -> str:
    """
    Format phone number for Vonage API
    Converts: 0771234567 → 94771234567
    """
    # Remove any spaces or special characters
    phone_number = phone_number.replace(' ', '').replace('-', '').replace('+', '')
    
    # Convert to international format (Sri Lanka = 94)
    if phone_number.startswith('0'):
        return '94' + phone_number[1:]
    elif phone_number.startswith('94'):
        return phone_number
    else:
        return '94' + phone_number


def _get_otp_message(otp_code: str, language: str) -> str:
    """
    Get OTP message in specified language
    """
    messages = {
        'en': f"Your WorkID verification code is: {otp_code}. Valid for 5 minutes. Do not share this code.",
        'si': f"ඔබගේ WorkID සත්‍යාපන කේතය: {otp_code}. විනාඩි 5ක් සඳහා වලංගුය. මෙම කේතය බෙදා නොගන්න.",
        'ta': f"உங்கள் WorkID சரிபார்ப்பு குறியீடு: {otp_code}. 5 நிமிடங்களுக்கு செல்லுபடியாகும். இந்த குறியீட்டை பகிர வேண்டாம்."
    }
    return messages.get(language, messages['en'])