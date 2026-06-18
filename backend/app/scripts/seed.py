import uuid

from sqlmodel import Session, select, create_engine

from app.core.auth import get_password_hash
from app.core.config import settings
from app.models import User

engine = create_engine(str(settings.DB_URL))

def init_db() -> None:
    FIXED_USER_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")

    with Session(engine) as session:
        statement = select(User).where(User.username == "johndoe")
        existing_user = session.exec(statement).first()

        if not existing_user:
            print("Creating default user 'johndoe'...")
            default_user = User(
                id=FIXED_USER_ID,
                username="johndoe",
                email="john.doe@anonymo.us",
                full_name="John Doe",
                password_hash=get_password_hash("secret"),
                is_admin = True,
            )
            session.add(default_user)
            session.commit()
            print("Database successfully initialized!")
        else:
            print("Default user already exists. Nothing to do.")
    
if __name__ == '__main__':
    init_db()