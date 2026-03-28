from twilio.rest import Client
from app.config import settings
import logging

logger = logging.getLogger(__name__)

def send_otp(phone_number: str, otp_code: str) -> bool:
    """
    Send OTP via Twilio SMS
    Return True if successful, False otherwise
    """
    try:
        logger.info(f"Attempting to send OTP to {phone_number}")
        
        #check if Twilio is configured
        twilio_sid = getattr(settings, "TWILIO_ACCOUNT_SID", None)
        twilio_token = getattr(settings, "TWILIO_AUTH_TOKEN", None)
        twilio_phone = getattr(settings, "TWILIO_PHONE_NUMBER", None)

        if not twilio_sid or not twilio_token or not twilio_phone:
            logger.warning("Twilio not configured → using DEV MODE")
            logger.info(f"OTP for {phone_number}: {otp_code}")
            return True

        #Initialize Twilio client
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

        if not phone_number.startswith('+'):
            phone_number = '+94' + phone_number

        #Send SMS
        message = client.messages.create(
            body=f"Your WorkID verification code is: {otp_code}. Valid for 5 minutes.",
            from_=settings.TWILIO_PHONE_NUMBER,
            to=phone_number
        )

        logger.info(f"SMS sent successfully to {phone_number}. SID: {message.sid}")
        return True
    
    except Exception as e:
        logger.error(f"Failed to send SMS to {phone_number}: {str(e)}")
        return False