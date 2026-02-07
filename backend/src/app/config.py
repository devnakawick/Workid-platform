from functools import lru_cache
from pydantic_settings import BaseSettings
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    DATABASE_ECHO: bool = False
    APP_NAME: str = "WorkID Platform"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    CORS_ORIGINS: list[str] = ["*"]

    class Config:
        env_file = BASE_DIR / ".env"
        extra = "ignore"
        env_file_encoding = "utf-8" 


@lru_cache
def get_settings():
    return Settings()


settings = get_settings()
