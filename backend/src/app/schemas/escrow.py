from pydantic import BaseModel
from uuid import UUID
from decimal import Decimal


class FundEscrowRequest(BaseModel):
    job_id: UUID
    worker_id: UUID
    amount: Decimal


class EscrowResponse(BaseModel):
    id: UUID
    job_id: UUID
    employer_id: UUID
    worker_id: UUID
    amount: Decimal
    status: str