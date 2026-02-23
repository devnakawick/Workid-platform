from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from decimal import Decimal

from app.database import get_db
from app.utils.dependencies import get_current_employer
from app.models.user import User
from app.services.payment_service import create_payment, confirm_payment
from app.utils.payment_security import verify_signature

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/create")
def create_payment_session(
    amount: Decimal,
    current_user: User = Depends(get_current_employer),
    db: Session = Depends(get_db)
):
    payment = create_payment(db, current_user.id, amount)

    # Here in real system you would generate LankaQR request
    return {
        "payment_id": str(payment.id),
        "status": payment.status,
        "message": "Payment session created"
    }


@router.post("/webhook")
def payment_webhook(
    payment_id: str,
    provider_reference: str,
    signature: str,
    db: Session = Depends(get_db)
):
    # Create data string exactly how LankaQR signs it
    data_string = f"{payment_id}:{provider_reference}"

    if not verify_signature(data_string, signature):
        raise HTTPException(status_code=400, detail="Invalid signature")

    payment = confirm_payment(db, payment_id, provider_reference)

    return {"message": "Payment confirmed"}