from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.database import Base


class SupportTicket(Base):
    __tablename__ = "support_tickets"

    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    # Who created the ticket
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    # Ticket content
    subject = Column(String(255), nullable=False)
    message = Column(String, nullable=False)

    # Status of ticket
    status = Column(String(20), default="open")
    # examples: "open", "in_progress", "resolved", "closed"

    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<SupportTicket id={self.id} status={self.status}>"
