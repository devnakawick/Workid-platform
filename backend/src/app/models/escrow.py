from sqlalchemy import Column, DateTime, Numeric, ForeignKey, String, Integer
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Escrow(Base):
    __tablename__ = "escrows"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Linked Job
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)

    # Employer and Worker
    employer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    worker_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Amount held in escrow
    amount = Column(Numeric(10, 2), nullable=False)

    # Status: held, released, refunded
    status = Column(String(20), default="held", nullable=False)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    released_at = Column(DateTime, nullable=True)

    # Relationships
    job = relationship("Job", back_populates="escrow")

    def __repr__(self):
        return f"<Escrow job_id={self.job_id} amount={self.amount} status={self.status}>"