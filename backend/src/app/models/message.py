from sqlalchemy import Column, DateTime, ForeignKey, String, Integer
from datetime import datetime

from app.database import Base


class Message(Base):
    __tablename__ = "messages"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)

    # Conversation identifier
    conversation_id = Column(String, nullable=False, index=True)

    # Sender and receiver
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Message content
    content = Column(String, nullable=False)

    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<Message from={self.sender_id} to={self.receiver_id}>"
