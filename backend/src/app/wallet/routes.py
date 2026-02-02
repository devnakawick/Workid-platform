from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.wallet import service

router = APIRouter(
    prefix="/wallet",
    tags=["Wallet"]
)


@router.get("/")
def get_wallet(user_id: int, db: Session = Depends(get_db)):
    """
    Get wallet balance for a user.
    """
    balance = service.get_wallet_balance(db, user_id)
    return {
        "user_id": user_id,
        "balance": balance
    }


@router.post("/credit")
def credit_wallet(user_id: int, amount: float, db: Session = Depends(get_db)):
    """
    Add money to wallet.
    """
    if amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Amount must be greater than zero"
        )

    wallet = service.credit_wallet(db, user_id, amount)
    return {
        "message": "Wallet credited successfully",
        "balance": wallet.balance
    }


@router.post("/debit")
def debit_wallet(user_id: int, amount: float, db: Session = Depends(get_db)):
    """
    Remove money from wallet.
    """
    if amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Amount must be greater than zero"
        )

    try:
        wallet = service.debit_wallet(db, user_id, amount)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    return {
        "message": "Wallet debited successfully",
        "balance": wallet.balance
    }
