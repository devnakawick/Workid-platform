

import hashlib
import os

MERCHANT_ID = os.getenv("1234170")
MERCHANT_SECRET = os.getenv("MzY4MzU3ODM5NjMzMjM2MDQ3MjYxNDUwNjc3NzU5NDIxOTk0ODk4")


def generate_payhere_hash(order_id, amount, currency="LKR"):
    amount_formatted = "{:.2f}".format(float(amount))

    hashed_secret = hashlib.md5(
        MERCHANT_SECRET.encode()
    ).hexdigest().upper()

    hash_string = (
        MERCHANT_ID +
        order_id +
        amount_formatted +
        currency +
        hashed_secret
    )

    return hashlib.md5(hash_string.encode()).hexdigest().upper()