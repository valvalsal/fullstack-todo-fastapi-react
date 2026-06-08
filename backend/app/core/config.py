from pydantic import PostgresDsn, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )
    
    DB_USERNAME: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_NAME: str

    @computed_field
    @property
    def DB_URL(self) -> PostgresDsn:
        return PostgresDsn.build(
            scheme="postgresql+psycopg",
            username=self.DB_USERNAME,
            password=self.DB_PASSWORD,
            host=self.DB_HOST,
            path=self.DB_NAME
        )

settings = Settings()
