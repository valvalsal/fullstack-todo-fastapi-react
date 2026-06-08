import uuid

from sqlmodel import SQLModel, Field

from .utils import PrimaryKeyUUID

class TodoBase(SQLModel):
    description: str = Field(index=True)
    is_done: bool | None = Field(default=False)

class Todo(TodoBase, table=True):
    id: PrimaryKeyUUID

class TodoPublic(TodoBase):
    id: uuid.UUID

class TodoUpdate(TodoBase):
    description: str | None = None
    is_done: bool | None = None