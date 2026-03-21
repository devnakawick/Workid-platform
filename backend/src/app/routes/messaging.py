from fastapi import APIRouter, WebSocket, Depends, WebSocketDisconnect, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.services.message_service import MessageService
from app.utils.dependencies import get_current_user
from app.services.websocket_manager import manager
from app.utils.security import verify_token

router = APIRouter(prefix="/api/messages", tags=["Messaging"])

@router.post("/send")
def send_message(
    sender_id: int,
    receiver_id: int,
    content: str,
    conversation_id: str = None,
    db: Session = Depends(get_db)
):
    return MessageService.send_message(
        db, sender_id, receiver_id, content, conversation_id
    )


@router.get("/conversations")
def get_conversations(user_id: int, db: Session = Depends(get_db)):
    return MessageService.get_user_conversations(db, user_id)


@router.get("/{conversation_id}")
def get_conversation(conversation_id: str, db: Session = Depends(get_db)):
    return MessageService.get_conversation(db, conversation_id)


# WebSocket chat
async def get_current_user_ws(websocket: WebSocket, db: Session = Depends(get_db)):
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008)   # Policy violation
        raise HTTPException(401, "Missing token")
    
    payload = verify_token(token)
    if not payload:
        await websocket.close(code=1008)
        raise HTTPException(401, "Invalid token")
    
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user or not user.is_active:
        await websocket.close(code=1008)
        raise HTTPException(401, "Invalid user")
    
    # Connect to websocket manager
    await manager.connect(str(user.id), websocket)
    
    return user

@router.websocket("/ws/chat")
async def websocket_chat(
    websocket: WebSocket,
    current_user: User = Depends(get_current_user_ws),
    db: Session = Depends(get_db)
):
    await websocket.send_json({"type": "connected", "user_id": current_user.id})

    try:
        while True:
            data = await websocket.receive_json()
            conversation_id = data.get("conversationId")
            text = data.get("text")

            if not conversation_id or not text:
                await websocket.send_json({"error": "Missing fields"})
                continue

            # Get participants from conversation
            participants = MessageService.get_conversation_participants(db, conversation_id)
            if not participants or len(participants) != 2:
                await websocket.send_json({"type": "error", "message": "Invalid conversation"})
                continue

            receiver_id = next(
                (p for p in participants if str(p) != str(current_user.id)),
                None
            )
            if not receiver_id:
                await websocket.send_json({"type": "error", "message": "No receiver found"})
                continue

            # Save message via service
            saved_message = MessageService.send_message(
                db,
                sender_id=current_user.id,
                receiver_id=...,  # TODO: Get receiver_id from conversation
                content=text,
                conversation_id=conversation_id
            )

            # Format message for client
            message_payload = {
                "type": "message",
                "id": str(saved_message.id) if hasattr(saved_message, 'id') else None,
                "from": str(current_user.id),
                "content": text,
                "conversationId": conversation_id,
                "timestamp": datetime.utcnow().isoformat(),
                "isSentByMe": False  # frontend can override for sender
            }

            # Send to sender
            await websocket.send_json({**message_payload, "isSendByMe": True})

            # Send to reciever in real time
            await manager.send_personal_message(str(receiver_id), message_payload)

    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_json({"error": str(e)})
        await websocket.close()
