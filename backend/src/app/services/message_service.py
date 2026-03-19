import uuid
from sqlalchemy.orm import Session
from app.models.message import Message


class MessageService:

    @staticmethod
    def send_message(db: Session, sender_id: int, receiver_id: int, content: str, conversation_id: str = None):

        # If conversation doesn't exist, create one
        if not conversation_id:
            conversation_id = str(uuid.uuid4())

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
    def get_user_conversations(db: Session, user_id: int):

        return db.query(Message).filter(
            (Message.sender_id == user_id) |
            (Message.receiver_id == user_id)
        ).all()
    
    @staticmethod
    def get_conversation_participants(db: Session, conversation_id: str) -> list:
        # Get all unique participants in this conversation
        messages = db.query(Message).filter(
            Message.conversation_id == conversation_id
        ).all()
        
        if not messages:
            return []
        
        participants = set()
        for msg in messages:
            participants.add(msg.sender_id)
            participants.add(msg.receiver_id)
        
        return list(participants)