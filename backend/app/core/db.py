from typing import Annotated

from fastapi import Depends
from sqlmodel import create_engine, Session

from .config import settings

db_url = settings.DB_URL

engine = create_engine(str(db_url))

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]