from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import Request
from fastapi.staticfiles import StaticFiles
import logging
import os

from app.config import settings
#from src.app.database import create_tables
from app.routes import auth, dashboard
from app.routes import worker, jobs, employer
from app.database import engine, Base
from app.routes import employer_wallet
from app.routes import escrow
from app.routes import worker_wallet
from app.routes import payment
from app.routes import mock_gateway
from app.routes import support
from app.routes import admin
from app.routes import messaging
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from dotenv import load_dotenv
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="WorkID Platform Backend API",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.include_router(employer_wallet.router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "WorkID Backend",
        "version": "1.0"
    }

# Serve uploaded files as static files
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(auth.routes, prefix="/api/auth", tags=["Authentication"])
app.include_router(dashboard.routes, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(escrow.routes)
app.include_router(worker_wallet.routes)
app.include_router(payment.router)
app.include_router(mock_gateway.router)

# Include additional routers
app.include_router(worker.router)
app.include_router(jobs.router)
app.include_router(employer.router)
app.include_router(support.router)
app.include_router(admin.router)
app.include_router(messaging.router)

@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    
    # Create database tables
    try:
       # create_tables()
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Failed to create database tables: {str(e)}")

@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    logger.info(f"Shutting down {settings.APP_NAME}")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An internal server error occurred",
            "type": "internal_server_error"
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):

    return JSONResponse(
        status_code=500,
        content={
            "message": "Internal server error",
            "detail": str(exc)
        }
    )