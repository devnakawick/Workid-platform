from sqlalchemy import Boolean, Column, String, DateTime, Numeric, ForeignKey, Integer
from datetime import datetime

from app.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    amount = Column(Numeric(10, 2), nullable=False)

    provider = Column(String(50), default="mock_gateway")

    status = Column(String(20), default="pending")
    # pending | success | failed

    provider_reference = Column(String(255), nullable=True)

    signature = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    currency = Column(String(10), default="LKR")

    is_processed = Column(Boolean, default=False)

    payment_type = Column(String(50), default="wallet_topup")

    failure_reason = Column(String(255), nullable=True)