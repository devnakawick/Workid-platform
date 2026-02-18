from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from decimal import Decimal

from app.models.wallet import Wallet
from app.models.transaction import Transaction
from app.models.user import User

def get_wallet(db: Session, user_id):
    """
    Retrieve a user's wallet.
    If it doesn't exist, create one automatically.
    """

    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()

    if not wallet:
        wallet = Wallet(user_id=user_id, balance=Decimal("0.00"))
        db.add(wallet)
        db.commit()
        db.refresh(wallet)

    return wallet


def credit_wallet(db: Session, user_id, amount: Decimal):
    """
    Add money to a user's wallet and create a transaction record.
    """

    if amount <= 0:
        raise ValueError("Amount must be greater than zero")

    wallet = get_wallet(db, user_id)

    try:
        wallet.balance += amount

        transaction = Transaction(
            from_user_id=None,
            to_user_id=user_id,
            amount=amount,
            transaction_type="topup",
            status="completed"
        )

        db.add(transaction)
        db.commit()
        db.refresh(wallet)

        return wallet

    except SQLAlchemyError:
        db.rollback()
        raise
    

def debit_wallet(db: Session, user_id, amount: Decimal):
    """
    Subtract money from a user's wallet and create a transaction record.
    """

    if amount <= 0:
        raise ValueError("Amount must be greater than zero")

    wallet = get_wallet(db, user_id)

    if wallet.balance < amount:
        raise ValueError("Insufficient balance")

    try:
        wallet.balance -= amount

        transaction = Transaction(
            from_user_id=user_id,
            to_user_id=None,
            amount=amount,
            transaction_type="withdrawal",
            status="completed"
        )

        db.add(transaction)
        db.commit()
        db.refresh(wallet)

        return wallet

    except SQLAlchemyError:
        db.rollback()
        raise
