from sqlalchemy import Column, DateTime, Numeric, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.database import Base


class Escrow(Base):
    __tablename__ = "escrows"

    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    # Linked Job
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=False)

    # Employer and Worker
    employer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    worker_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    # Amount held in escrow
    amount = Column(Numeric(10, 2), nullable=False)

    # Status: held, released, refunded
    status = Column(String(20), default="held", nullable=False)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    released_at = Column(DateTime, nullable=True)

    def __repr__(self):
        return f"<Escrow job_id={self.job_id} amount={self.amount} status={self.status}>"