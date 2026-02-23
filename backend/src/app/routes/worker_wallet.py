from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from decimal import Decimal

from app.database import get_db
from app.utils.dependencies import get_current_worker
from app.models.user import User
from app.services.wallet_service import debit_wallet

routes = APIRouter(prefix="/wallet", tags=["Worker Wallet"])


@routes.post("/withdraw")
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