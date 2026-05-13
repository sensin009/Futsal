from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Football/Futsal API"
    environment: str = "dev"

    # Use Postgres in prod, but keep dev simple.
    # Examples:
    # - postgresql+psycopg://postgres:postgres@localhost:5432/football
    # - sqlite:///./dev.db
    database_url: str = "sqlite:///./dev.db"

    jwt_secret: str = "dev-change-me"
    jwt_algorithm: str = "HS256"
    access_token_exp_minutes: int = 60 * 24

    cors_origins: str = "http://localhost:5173"


settings = Settings()

