import uuid
from typing import Annotated
from datetime import datetime, timezone

from sqlmodel import Field, text, DateTime

def utc_now():
    return datetime(timezone.utc)

PrimaryKeyUUID = Annotated[
    uuid.UUID,
    Field(
        default_factory= uuid.uuid4,
        primary_key=True,
        sa_column_kwargs={"server_default": text("gen_random_uuid()")}
    )
]

CreationDate = Annotated[
    datetime,
    Field(
        default_factory=utc_now,
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={"server_default": text("CURRENT_TIMESTAMP")}
    )
]