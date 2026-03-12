from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.ticket_service import TicketService

router = APIRouter(prefix="/api/support", tags=["Support"])


@router.post("/tickets")
def create_ticket(user_id: str, subject: str, message: str, db: Session = Depends(get_db)):
    return TicketService.create_ticket(db, user_id, subject, message)


@router.get("/tickets")
def get_tickets(user_id: str, db: Session = Depends(get_db)):
    return TicketService.get_user_tickets(db, user_id)


@router.put("/tickets/{ticket_id}")
def update_ticket(ticket_id: str, status: str, db: Session = Depends(get_db)):
    return TicketService.update_ticket_status(db, ticket_id, status)