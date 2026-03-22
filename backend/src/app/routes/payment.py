from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from decimal import Decimal

import hmac
import hashlib
from fastapi import Request

from app.database import get_db
from app.utils.dependencies import get_current_employer
from app.models.user import User
from app.services.payment_service import create_payment, confirm_payment
from app.utils.payment_security import verify_signature

from app.utils.payhere import generate_payhere_hash
import os
from app.services.wallet_service import WalletService
from app.utils.dependencies import get_current_user
router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/create")
def create_payment_session(
    amount: Decimal,
    current_user: User = Depends(get_current_employer),
    db: Session = Depends(get_db)
):

    if amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")

    payment = create_payment(db, current_user.id, amount)

    order_id = str(payment.id)

    payment_hash = generate_payhere_hash(order_id, amount)

    return {
        "merchant_id": os.getenv("1234170"),
        "return_url": "http://localhost:3000/payment-success",
        "cancel_url": "http://localhost:3000/payment-cancel",
        "notify_url": "https://owen-illuminable-felinely.ngrok-free.dev",
        "order_id": order_id,
        "items": "Wallet Top Up",
        "currency": "LKR",
        "amount": float(amount),
        "first_name": "Employer",
        "last_name": "User",
        "email": "test@email.com",
        "phone": "0770000000",
        "address": "Colombo",
        "city": "Colombo",
        "country": "Sri Lanka",
        "hash": payment_hash
    }


SECRET_KEY = "MzY4MzU3ODM5NjMzMjM2MDQ3MjYxNDUwNjc3NzU5NDIxOTk0ODk4"


@router.post("/webhook")
async def payment_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    data = await request.json()

    payment_id = data.get("payment_id")
    provider_reference = data.get("provider_reference")
    signature = data.get("signature")

    if not payment_id or not provider_reference or not signature:
        raise HTTPException(status_code=400, detail="Invalid payload")

    # 🔐 Verify signature
    message = f"{payment_id}:{provider_reference}"
    expected_signature = hmac.new(
        SECRET_KEY.encode(),
        message.encode(),
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(signature, expected_signature):
        raise HTTPException(status_code=400, detail="Invalid signature")

    from app.services.payment_service import confirm_payment

    payment = confirm_payment(
        db,
        payment_id,
        provider_reference,
        signature
    )

    return {"message": "Payment confirmed"}

@router.post("/notify")
async def payhere_notify(request: Request, db: Session = Depends(get_db)):
    data = await request.form()

    merchant_id = data.get("merchant_id")
    order_id = data.get("order_id")
    payhere_amount = data.get("payhere_amount")
    payhere_currency = data.get("payhere_currency")
    status_code = data.get("status_code")
    md5sig = data.get("md5sig")

    if not verify_signature(data):
        return {"message": "Invalid signature"}

    if status_code == "2":  # payment success
        confirm_payment(db, order_id, payhere_amount)

    return {"message": "Notification processed"}



@router.get("/history")
def get_payment_history(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    transactions = WalletService.get_payment_history(db, current_user.id)

    result = []

    for t in transactions:
        role = "sent" if t.from_user_id == current_user.id else "received"

        result.append({
            "id": t.id,
            "amount": float(t.amount),
            "type": t.transaction_type,
            "status": t.status,
            "role": role,
            "created_at": t.created_at
        })

    return result