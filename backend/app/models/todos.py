import uuid

from sqlmodel import SQLModel, Field

from .utils import PrimaryKeyUUID, CreationDate

class TodoBase(SQLModel):
    description: str = Field(index=True)
    is_done: bool | None = Field(default=False)

class Todo(TodoBase, table=True):
    id: PrimaryKeyUUID

    created_by_id: uuid.UUID = Field(foreign_key="user.id")
    created_at: CreationDate

class TodoCreate(SQLModel):
    description: str

class TodoPublic(TodoBase):
    id: uuid.UUID
    created_by_id: uuid.UUID

class TodoUpdate(SQLModel):
    description: str | None = None
    is_done: bool | None = None