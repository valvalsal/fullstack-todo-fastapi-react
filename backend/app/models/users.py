import uuid

from sqlmodel import SQLModel, Field

from .utils import PrimaryKeyUUID

class UserBase(SQLModel):
    username: str = Field(index=True, unique=True)
    email: str | None = Field(default=None)
    full_name: str | None = Field(default=None)
    is_admin: bool | None = Field(default=False)
    profile_pic: str | None = Field(default=None)

class User(UserBase, table=True):
    id: PrimaryKeyUUID
    password_hash: str = Field()

class UserPublic(UserBase):
    id: uuid.UUID

class UserCreate(UserBase):
    password: str

class UserUpdate(SQLModel):
    username: str | None = None
    email: str | None = None
    full_name: str | None = None
    password: str | None = None