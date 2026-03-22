from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from decimal import Decimal

from app.models.wallet import Wallet
from app.models.transaction import Transaction
from app.models.user import User

from fastapi import HTTPException

class WalletService:

    @staticmethod
    def get_wallet(db: Session, user_id):
        wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()

        if not wallet:
            raise HTTPException(status_code=404, detail="Wallet not found")

        return wallet

    @staticmethod
    def get_transactions(db: Session, user_id):
        transactions = (
            db.query(Transaction)
            .filter(
                or_(
                    Transaction.from_user_id == user_id,
                    Transaction.to_user_id == user_id
                )
            )
            .order_by(Transaction.created_at.desc())
            .all()
        )

        return transactions

def get_wallet(db: Session, user_id):
    """
    Retrieve a user's wallet.
    If it doesn't exist, create one automatically.
    """

    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()

    if not wallet:
        wallet = Wallet(user_id=user_id, balance=Decimal("0.00"))
        db.add(wallet)
        db.flush()
       

    return wallet


    @staticmethod
    def get_payment_history(db: Session, user_id):
        transactions = (
            db.query(Transaction)
            .filter(
                or_(
                    Transaction.from_user_id == user_id,
                    Transaction.to_user_id == user_id
                )
            )
            .filter(Transaction.transaction_type == "payment")
            .order_by(Transaction.created_at.desc())
            .all()
        )

        return transactions


def credit_wallet(db: Session, user_id, amount: Decimal):

    if amount <= 0:
        raise ValueError("Amount must be greater than zero")

    wallet = get_wallet(db, user_id)

    wallet.balance += amount

    transaction = Transaction(
        from_user_id=None,
        to_user_id=user_id,
        amount=amount,
        transaction_type="topup",
        status="completed"
    )

    db.add(transaction)

    return wallet


def debit_wallet(db: Session, user_id, amount: Decimal):

    if amount <= 0:
        raise ValueError("Amount must be greater than zero")

    wallet = get_wallet(db, user_id)

    if wallet.balance < amount:
        raise ValueError("Insufficient balance")

    wallet.balance -= amount

    transaction = Transaction(
        from_user_id=user_id,
        to_user_id=None,
        amount=amount,
        transaction_type="withdrawal",
        status="completed"
    )

    db.add(transaction)

    return wallet

    
