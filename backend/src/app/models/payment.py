from sqlalchemy import Column, String, DateTime, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    amount = Column(Numeric(10, 2), nullable=False)

    provider = Column(String(50), default="mock_gateway")

    status = Column(String(20), default="pending")
    # pending | success | failed

    provider_reference = Column(String(255), nullable=True)

    signature = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)