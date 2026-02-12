from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = "dev"
    app_name: str = "between-memories-service"

    anthropic_api_key: str = ""

    model_quick: str = "claude-3-5-haiku-latest"
    model_build: str = "claude-sonnet-4-5"
    model_critical: str = "claude-opus-4-6"

    max_input_tokens: int = 12000
    max_output_tokens: int = 4000


@lru_cache
def get_settings() -> Settings:
    return Settings()
