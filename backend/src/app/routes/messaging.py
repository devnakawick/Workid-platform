from fastapi import APIRouter, WebSocket, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.message_service import MessageService

router = APIRouter(prefix="/api/messages", tags=["Messaging"])


@router.post("/send")
def send_message(
    sender_id: str,
    receiver_id: str,
    content: str,
    conversation_id: str = None,
    db: Session = Depends(get_db)
):
    return MessageService.send_message(
        db, sender_id, receiver_id, content, conversation_id
    )


@router.get("/conversations")
def get_conversations(user_id: str, db: Session = Depends(get_db)):
    return MessageService.get_user_conversations(db, user_id)


@router.get("/{conversation_id}")
def get_conversation(conversation_id: str, db: Session = Depends(get_db)):
    return MessageService.get_conversation(db, conversation_id)


# WebSocket chat
@router.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):

    await websocket.accept()

    while True:
        message = await websocket.receive_text()

        await websocket.send_text(f"Message received: {message}")