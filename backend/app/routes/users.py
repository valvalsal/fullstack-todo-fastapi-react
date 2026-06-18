from fastapi import APIRouter, HTTPException, status

from sqlmodel import select

from app.models.users import UserPublic, UserCreate, User
from app.core.auth import UserDep, SessionDep, get_password_hash

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/me", response_model=UserPublic)
async def get_current_user(
    user: UserDep
):
    return user

@router.post("/create")
async def create_user(user_form: UserCreate, session: SessionDep):
    user_data = user_form.model_dump()

    user_check = session.exec(select(User).where(User.username == user_data['username'])).first()

    if user_check:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="A user already exists with that username"
        )
    
    plain_password = user_data.pop('password')
    user_data['password_hash'] = get_password_hash(plain_password)

    db_user = User.model_validate(user_data)

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user