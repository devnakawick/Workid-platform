from sqlalchemy.orm import Session
from decimal import Decimal

from app.models.payment import Payment
from app.services.wallet_service import credit_wallet


def create_payment(db: Session, user_id, amount: Decimal, provider="lankaqr"):
    payment = Payment(
        user_id=user_id,
        amount=amount,
        provider=provider,
        status="pending"
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment


def confirm_payment(db: Session, payment_id, provider_reference):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()

    if not payment:
        raise ValueError("Payment not found")

    if payment.status == "success":
        return payment

    payment.status = "success"
    payment.provider_reference = provider_reference

    # Credit wallet AFTER confirmation
    credit_wallet(db, payment.user_id, payment.amount)

    db.commit()
    db.refresh(payment)

    return payment