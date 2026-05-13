from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration, loaded from environment."""

    app_name: str = "CatalystRight API"
    environment: str = "local"

    database_url: str = Field(
        default="postgresql+asyncpg://catalyst:catalyst@localhost:5432/catalyst"
    )
    redis_url: str = Field(default="redis://localhost:6379/0")

    # AI
    llm_provider: str = Field(default="mock")  # openai | anthropic | mock
    openai_api_key: str | None = None
    anthropic_api_key: str | None = None
    default_planner_model: str = "gpt-4.1"
    default_validator_model: str = "gpt-4.1-mini"
    ai_confidence_threshold: float = 0.70

    # Evidence
    evidence_bucket: str = "catalystright-evidence"
    evidence_retention_days: int = 90

    # CORS
    cors_origins: list[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
