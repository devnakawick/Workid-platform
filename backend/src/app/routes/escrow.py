from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from decimal import Decimal

from app.database import get_db
from app.utils.dependencies import get_current_employer
from app.models.user import User
from app.models.wallet import Wallet
from app.models.escrow import Escrow
from app.models.transaction import Transaction
from app.schemas.escrow import FundEscrowRequest
from app.services.wallet_service import debit_wallet
from app.services.wallet_service import credit_wallet
routes = APIRouter(prefix="/escrow", tags=["Escrow"])




@routes.post("/fund")
def fund_job_escrow(
    request: FundEscrowRequest,
    current_user: User = Depends(get_current_employer),
    db: Session = Depends(get_db)
):

    with db.begin():

        # Deduct money safely using wallet service
        debit_wallet(db, current_user.id, request.amount)

        # Create escrow record
        escrow = Escrow(
            job_id=request.job_id,
            employer_id=current_user.id,
            worker_id=request.worker_id,
            amount=request.amount,
            status="held"
        )

        db.add(escrow)

        # Log escrow hold transaction
        transaction = Transaction(
            from_user_id=current_user.id,
            to_user_id=request.worker_id,
            amount=request.amount,
            transaction_type="escrow_hold",
            status="completed"
        )

        db.add(transaction)

    return {
        "message": "Funds successfully placed in escrow",
        "escrow_id": escrow.id
    }


@routes.post("/release/{escrow_id}")
def release_escrow(
    escrow_id: str,
    current_user: User = Depends(get_current_employer),
    db: Session = Depends(get_db)
):

    escrow = db.query(Escrow).filter(
        Escrow.id == escrow_id,
        Escrow.employer_id == current_user.id
    ).first()

    if not escrow:
        raise HTTPException(status_code=404, detail="Escrow not found")

    if escrow.status != "held":
        raise HTTPException(status_code=400, detail="Escrow already processed")

    with db.begin():

        # Credit worker safely
        credit_wallet(db, escrow.worker_id, escrow.amount)

        # Update escrow
        escrow.status = "released"

        from datetime import datetime
        escrow.released_at = datetime.utcnow()

        # Log release transaction
        transaction = Transaction(
            from_user_id=escrow.employer_id,
            to_user_id=escrow.worker_id,
            amount=escrow.amount,
            transaction_type="escrow_release",
            status="completed"
        )

        db.add(transaction)

    return {"message": "Payment released to worker successfully"}