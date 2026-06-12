from datetime import datetime, timezone
import uuid

from sqlmodel import SQLModel, Field, DateTime

from .utils import PrimaryKeyUUID

def utc_now():
    return datetime.now(timezone.utc)

class TodoBase(SQLModel):
    description: str = Field(index=True)
    is_done: bool | None = Field(default=False)

class Todo(TodoBase, table=True):
    id: PrimaryKeyUUID

    created_by_id: uuid.UUID = Field(foreign_key="user.id")
    created_at: datetime = Field(
        default_factory=utc_now,
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={"server_default": "CURRENT_TIMESTAMP"}
    )

class TodoCreate(SQLModel):
    description: str

class TodoPublic(TodoBase):
    id: uuid.UUID
    created_by_id: uuid.UUID

class TodoUpdate(SQLModel):
    description: str | None = None
    is_done: bool | None = None