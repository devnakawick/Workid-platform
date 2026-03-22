from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from decimal import Decimal

from app.database import get_db
from app.utils.dependencies import get_current_user, get_current_worker
from app.models.user import User
from app.services.wallet_service import debit_wallet, WalletService

router = APIRouter(prefix="/wallet", tags=["Worker Wallet"])

@router.get("/")
def get_worker_wallet(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    wallet = WalletService.get_wallet(db, current_user.id)

    return {
        "balance": float(wallet.balance),
        "updated_at": wallet.updated_at
    }

@router.post("/withdraw")
def withdraw_money(
    amount: Decimal,
    current_user: User = Depends(get_current_worker),
    db: Session = Depends(get_db)
):
    try:
        wallet = debit_wallet(db, current_user.id, amount)
        return {
            "message": "Withdrawal successful",
            "new_balance": wallet.balance
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/transactions")
def get_worker_transactions(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    transactions = WalletService.get_transactions(db, current_user.id)

    result = []

    for t in transactions:
        # Determine type relative to current user
        if t.to_user_id == current_user.id:
            tx_type = "credit"
        elif t.from_user_id == current_user.id:
            tx_type = "debit"
        else:
            tx_type = "unknown"

        result.append({
            "id": t.id,
            "amount": float(t.amount),
            "type": tx_type,
            "transaction_type": t.transaction_type,
            "status": t.status,
            "created_at": t.created_at
        })

    return result