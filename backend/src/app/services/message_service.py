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
    def get_user_conversations_grouped(db: Session, user_id: int):
        """Return conversation summaries grouped by conversation_id."""
        from app.models.user import User

        messages = db.query(Message).filter(
            (Message.sender_id == user_id) |
            (Message.receiver_id == user_id)
        ).order_by(Message.created_at.desc()).all()

        convos = {}
        for m in messages:
            cid = m.conversation_id
            if cid not in convos:
                other_id = m.receiver_id if m.sender_id == user_id else m.sender_id
                other_user = db.query(User).filter(User.id == other_id).first()
                other_name = None
                if other_user:
                    if other_user.worker_profile:
                        other_name = other_user.worker_profile.full_name
                    elif other_user.employer_profile:
                        other_name = other_user.employer_profile.full_name
                convos[cid] = {
                    "conversation_id": cid,
                    "other_user_id": other_id,
                    "other_user_name": other_name or f"User {other_id}",
                    "last_message": m.content,
                    "last_message_time": m.created_at.isoformat() if m.created_at else None,
                    "unread": False,
                }
        return list(convos.values())

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