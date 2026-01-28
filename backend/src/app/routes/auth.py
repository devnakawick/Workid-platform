from fastapi import APIRouter

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)

@router.get("/send-otp")
def send_otp():
    return {"message": "OTP route working"}
