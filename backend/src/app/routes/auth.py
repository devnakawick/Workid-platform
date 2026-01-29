from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

routes = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

@routes.post("/send-otp")
def send_otp():
    return {"message": "OTP sent"}
