from fastapi import APIRouter

from app.models.users import UserPublic
from app.core.auth import UserDep

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/me", response_model=UserPublic)
async def get_current_user(
    user: UserDep
):
    return user