"""
app/core/settings.py
────────────────────
Centralised settings loaded from the .env file via pydantic-settings.
Import `settings` anywhere in the application to access config values.
"""

from pydantic import PostgresDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    DATABASE_URL: str  # e.g. postgresql://user:pass@localhost:5432/dbname

    # Optional convenience: expose as a validated PostgresDsn
    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def validate_db_url(cls, v: str) -> str:
        if not v.startswith("postgresql"):
            raise ValueError("DATABASE_URL must be a PostgreSQL connection string.")
        return v


settings = Settings()
