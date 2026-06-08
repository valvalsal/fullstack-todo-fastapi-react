import uuid
from typing import Annotated

from sqlmodel import Field, text

PrimaryKeyUUID = Annotated[
    uuid.UUID,
    Field(
        default= None,
        primary_key=True,
        sa_column_kwargs={"server_default": text("gen_random_uuid()")}
    )
]