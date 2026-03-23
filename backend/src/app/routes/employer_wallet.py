from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from decimal import Decimal

from app.database import get_db
from app.models.wallet import Wallet
from app.models.transaction import Transaction
from app.models.user import User, UserType
from app.utils.dependencies import get_current_employer
from app.services.wallet_service import credit_wallet


router = APIRouter(prefix="/api/employer", tags=["Employer Wallet"])

@router.get("/wallet")
def get_employer_wallet(
    current_user: User = Depends(get_current_employer),
    db: Session = Depends(get_db)
):
    """
    Get employer wallet details
    """

    # Get or create wallet
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if not wallet:
        from decimal import Decimal as Dec
        wallet = Wallet(user_id=current_user.id, balance=Dec("0.00"))
        db.add(wallet)
        db.commit()
        db.refresh(wallet)

    # Calculate totals
    total_spent = db.query(func.coalesce(func.sum(Transaction.amount), 0))\
        .filter(
            Transaction.from_user_id == current_user.id,
            Transaction.transaction_type == "payment"
        ).scalar()

    total_deposited = db.query(func.coalesce(func.sum(Transaction.amount), 0))\
        .filter(
            Transaction.to_user_id == current_user.id,
            Transaction.transaction_type == "topup"
        ).scalar()

    return {
        "id": str(wallet.id),
        "balance": float(wallet.balance),
        "currency": "LKR",
        "totalSpent": float(total_spent),
        "totalDeposited": float(total_deposited),
        "lastUpdated": wallet.updated_at.isoformat() if wallet.updated_at else None
    }

@router.get("/transactions")
def get_employer_transactions(
    current_user: User = Depends(get_current_employer),
    db: Session = Depends(get_db)
):
    """
    Get employer transactions
    """

    transactions = db.query(Transaction)\
        .filter(
            (Transaction.from_user_id == current_user.id) |
            (Transaction.to_user_id == current_user.id)
        )\
        .order_by(Transaction.created_at.desc())\
        .all()

    result = []

    for txn in transactions:
        result.append({
            "id": str(txn.id),
            "type": txn.transaction_type,
            "method": "bank",  # temporary default
            "amount": float(txn.amount),
            "description": f"{txn.transaction_type.capitalize()} transaction",
            "date": txn.created_at.isoformat(),
            "status": txn.status,
            "workerName": None,
            "jobTitle": None
        })

    return result

from pydantic import BaseModel

class DepositRequest(BaseModel):
    amount: float
    method: str = "bank"




@router.post("/deposit")
def deposit_to_wallet(
    request: DepositRequest,
    current_user: User = Depends(get_current_employer),
    db: Session = Depends(get_db)
):
    """
    Deposit money to employer wallet (authenticated)
    """

    if request.amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")

    try:
        with db.begin():
            wallet = credit_wallet(
                db=db,
                user_id=current_user.id,
                amount=Decimal(str(request.amount))
            )

        return {
            "success": True,
            "message": f"LKR {request.amount:,.2f} added to wallet!",
            "new_balance": float(wallet.balance)
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))