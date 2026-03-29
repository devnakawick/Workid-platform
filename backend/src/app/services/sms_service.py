from twilio.rest import Client
from app.config import settings
import logging
import requests
from app.config import settings
import logging


logger = logging.getLogger(__name__)

def send_otp(phone_number: str, otp_code: str) -> bool:
    try:
        logger.info(f"Sending OTP via Notify.lk to {phone_number}")

        # format number (Sri Lanka)
        if phone_number.startswith("0"):
            phone_number = "94" + phone_number[1:]

        url = "https://app.notify.lk/api/v1/send"

        payload = {
            "user_id": settings.NOTIFY_API_KEY,
            "sender_id": settings.NOTIFY_SENDER_ID,
            "to": phone_number,
            "message": f"Your WorkID OTP is {otp_code}"
        }

        response = requests.post(url, json=payload)

        logger.info(f"Notify.lk response: {response.text}")

        if response.status_code == 200:
            return True
        else:
            return False

    except Exception as e:
        logger.error(f"Notify.lk error: {str(e)}")
        return False