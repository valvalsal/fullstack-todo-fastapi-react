import uuid
from typing import Annotated
from datetime import datetime, timezone

from sqlmodel import Field, text

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