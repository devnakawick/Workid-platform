import hmac
import hashlib

SECRET_KEY = "your_lankaqr_secret_here"


def verify_signature(data: str, signature: str) -> bool:
    computed = hmac.new(
        SECRET_KEY.encode(),
        data.encode(),
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(computed, signature)