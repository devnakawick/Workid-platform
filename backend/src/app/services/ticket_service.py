from sqlalchemy.orm import Session
from app.models.ticket import SupportTicket


class TicketService:

    @staticmethod
    def create_ticket(db: Session, user_id: str, subject: str, message: str):
        ticket = SupportTicket(
            user_id=user_id,
            subject=subject,
            message=message,
            status="open"
        )

        db.add(SupportTicket)
        db.commit()
        db.refresh(SupportTicket)

        return ticket


    @staticmethod
    def get_user_tickets(db: Session, user_id: str):
        return db.query(SupportTicket).filter(SupportTicket.user_id == user_id).all()


    @staticmethod
    def update_ticket_status(db: Session, ticket_id: str, status: str):
        ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()

        if ticket:
            ticket.status = status
            db.commit()
            db.refresh(SupportTicket)

        return ticket