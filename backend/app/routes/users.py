import os
from typing import Annotated
from io import BytesIO

from PIL import Image, ImageOps

from fastapi import APIRouter, HTTPException, status, Form, UploadFile, File

from sqlmodel import select

from app.models.users import UserPublic, UserCreate, User, AvatarMode
from app.core.auth import UserDep, SessionDep, get_password_hash
from app.core.config import settings

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/me", response_model=UserPublic)
async def get_current_user(
    user: UserDep
):
    return user

@router.put("/me", response_model=UserPublic)
async def update_current_user(
    user: UserDep,
    session: SessionDep,
    email: Annotated[str, Form()],
    full_name: Annotated[str, Form()],
    avatar_mode: Annotated[AvatarMode, Form()],
    avatar_file: Annotated[UploadFile | None, File()] = None
):
    user.email = email
    user.full_name = full_name
    
    if(avatar_mode in [AvatarMode.DELETE, AvatarMode.NEW]):
        if user.profile_pic != '':
            actual_profile_pic = f'{settings.UPLOAD_DIR}/{user.profile_pic}'
            
            if os.path.exists(actual_profile_pic):
                os.remove(actual_profile_pic)

            user.profile_pic = ''
        
        if(avatar_mode == AvatarMode.NEW):
            if avatar_file is not None and avatar_file.filename != '':
                file_content = await avatar_file.read()

                image_stream = BytesIO(file_content)

                with Image.open(image_stream) as img:
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGB")

                    filename = f'{user.username}-avatar.jpg'
                    filepath = os.path.join(settings.UPLOAD_DIR, filename)

                    ImageOps.fit(img, (256, 256)).save(filepath, format="JPEG", quality=85)

                    user.profile_pic = filename
    
    try:
        session.commit()
        session.refresh(user)
        return user
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    


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