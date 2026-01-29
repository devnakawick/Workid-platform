from fastapi import FastAPI
from app.routes.auth import routes as auth_router

app = FastAPI()

app.include_router(auth_router)

@app.get("/")
def read_root():
    return {"status": "OK"}
