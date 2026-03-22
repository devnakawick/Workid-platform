from sqlalchemy import Column, DateTime, Numeric, ForeignKey, Integer
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Wallet(Base):
    __tablename__ = "wallets"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)

    # Link to user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)

    # Wallet balance
    balance = Column(Numeric(10, 2), default=0.00, nullable=False)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="wallet")

    def __repr__(self):
        return f"<Wallet user_id={self.user_id} balance={self.balance}>"
