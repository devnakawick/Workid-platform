from sqlalchemy.orm import Session

from app.wallet.models import Wallet, Transaction


def get_or_create_wallet(db: Session, user_id: int) -> Wallet:
    """
    Get an existing wallet for a user.
    If it does not exist, create one.
    """
    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()

    if not wallet:
        wallet = Wallet(user_id=user_id, balance=0.0)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)

    return wallet


def get_wallet_balance(db: Session, user_id: int) -> float:
    """
    Return the wallet balance for a user.
    """
    wallet = get_or_create_wallet(db, user_id)
    return wallet.balance


def credit_wallet(db: Session, user_id: int, amount: float) -> Wallet:
    """
    Add money to a user's wallet.
    """
    wallet = get_or_create_wallet(db, user_id)

    wallet.balance += amount

    transaction = Transaction(
        wallet_id=wallet.id,
        amount=amount,
        type="credit"
    )

    db.add(transaction)
    db.commit()
    db.refresh(wallet)

    return wallet


def debit_wallet(db: Session, user_id: int, amount: float) -> Wallet:
    """
    Remove money from a user's wallet.
    Raises error if balance is insufficient.
    """
    wallet = get_or_create_wallet(db, user_id)

    if wallet.balance < amount:
        raise ValueError("Insufficient wallet balance")

    wallet.balance -= amount

    transaction = Transaction(
        wallet_id=wallet.id,
        amount=amount,
        type="debit"
    )

    db.add(transaction)
    db.commit()
    db.refresh(wallet)

    return wallet
def get_wallet_transactions(db: Session, user_id: int):
    """
    Return all transactions for a user's wallet.
    """
    wallet = get_or_create_wallet(db, user_id)
    return wallet.transactions
