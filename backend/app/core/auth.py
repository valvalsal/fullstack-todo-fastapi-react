from datetime import datetime, timezone, timedelta
from typing import Annotated, Type

import jwt
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, APIKeyCookie
from sqlmodel import select, Session

from app.models import User, TokenData
from app.core.db import SessionDep
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

password_hash = PasswordHash.recommended()

def verify_password(plain_password: str, hashed_password: str):
    return password_hash.verify(plain_password, hashed_password)

def get_password_hash(password: str):
    return password_hash.hash(password)

def get_user(username: str, session: Session):
    user = session.exec(select(User).where(User.username == username)).first()

    return user

def authenticate_user(username: str, password: str, session: Session):
    user = get_user(username, session)
    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    
    now = datetime.now(timezone.utc)
    
    expire = now + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))

    to_encode.update({"iat": now.timestamp(), "exp": expire.timestamp()})

    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: SessionDep
):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username = payload.get('sub')
        if username is None:
            raise credential_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credential_exception
    user = get_user(username=token_data.username, session=session)
    if user is None:
        raise credential_exception
    return user

UserDep = Annotated[User, Depends(get_current_user)]

class OwnershipChecker:
    def __init__(self, model: Type, url_param_name: str):
        self.model = model
        self.url_param_name = url_param_name

    def __call__(
            self,
            session: SessionDep,
            user: UserDep,
            request: Request
    ):
        data_id = request.path_params.get(self.url_param_name)

        if not data_id:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error: no '{self.url_param_name}' in URL"
            )

        obj = session.get(self.model, data_id)
        
        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{self.model.__name__} not found"
            )
        
        if user.id != obj.created_by_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"You don't have the rights to access this {self.model.__name__}"
            )
        
        return obj
