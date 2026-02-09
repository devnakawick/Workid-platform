from sqlalchemy import Column, DateTime, Numeric, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    # Who paid and who received
    from_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    to_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    # Money
    amount = Column(Numeric(10, 2), nullable=False)

    # Type of transaction
    transaction_type = Column(String(20), nullable=False)
    # examples: "topup", "payment", "withdrawal"

    # Status
    status = Column(String(20), default="completed")
    # examples: "pending", "completed", "failed"

    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return (
            f"<Transaction {self.transaction_type} "
            f"amount={self.amount} "
            f"from={self.from_user_id} "
            f"to={self.to_user_id}>"
        )
