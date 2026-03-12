import uuid
from sqlalchemy.orm import Session
from app.models.message import Message


class MessageService:

    @staticmethod
    def send_message(db: Session, sender_id: str, receiver_id: str, content: str, conversation_id: str = None):

        # If conversation doesn't exist, create one
        if not conversation_id:
            conversation_id = uuid.uuid4()

        message = Message(
            conversation_id=conversation_id,
            sender_id=sender_id,
            receiver_id=receiver_id,
            content=content
        )

        db.add(message)
        db.commit()
        db.refresh(message)

        return message


    @staticmethod
    def get_conversation(db: Session, conversation_id: str):

        return db.query(Message).filter(
            Message.conversation_id == conversation_id
        ).order_by(Message.created_at).all()


    @staticmethod
    def get_user_conversations(db: Session, user_id: str):

        return db.query(Message).filter(
            (Message.sender_id == user_id) |
            (Message.receiver_id == user_id)
        ).all()