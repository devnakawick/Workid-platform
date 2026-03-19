from pydantic import BaseModel
from decimal import Decimal


class FundEscrowRequest(BaseModel):
    job_id: int
    worker_id: int
    amount: Decimal


class EscrowResponse(BaseModel):
    id: int
    job_id: int
    employer_id: int
    worker_id: int
    amount: Decimal
    status: str