from functools import lru_cache
from pydantic_settings import BaseSettings
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    DATABASE_ECHO: bool = False
    APP_NAME: str = "WorkID Platform"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"

    class Config:
        env_file = BASE_DIR / ".env"
        extra = "ignore" 


@lru_cache
def get_settings():
    return Settings()


settings = get_settings()
