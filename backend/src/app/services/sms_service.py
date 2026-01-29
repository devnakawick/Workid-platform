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
        #check if Twilio is configured
        if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
            logger.warning("Twilio is not properly configured. OTP not sent via SMS.")
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