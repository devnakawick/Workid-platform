from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import hashlib

from app.database import get_db
from app.services.payment_service import confirm_payment

router = APIRouter(prefix="/mock-gateway", tags=["Mock Gateway"])


@router.post("/simulate-success")
def simulate_payment_success(
    payment_id: str,
    db: Session = Depends(get_db)
):
    """
    Simulates payment provider calling webhook
    """

    provider_reference = "BANK_REF_12345"

    # Create fake signature
    data = f"{payment_id}:{provider_reference}"
    signature = hashlib.sha256(data.encode()).hexdigest()

    payment = confirm_payment(
        db,
        payment_id,
        provider_reference,
        signature
    )

    return {
        "message": "Mock payment confirmed",
        "payment_id": str(payment.id)
    }