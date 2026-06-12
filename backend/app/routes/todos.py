from typing import Annotated
import uuid

from fastapi import APIRouter, Path, HTTPException, status, Depends
from sqlmodel import select

from app.core.db import SessionDep
from app.core.auth import UserDep, OwnershipChecker
from app.models.todos import TodoPublic, TodoCreate, Todo, TodoUpdate

router = APIRouter(
    prefix="/todos",
    tags=["todos"],
)

@router.get("/", response_model=list[TodoPublic])
async def read_todos(session: SessionDep, user: UserDep):
    todos = session.exec(select(Todo).where(Todo.created_by_id == user.id).order_by(Todo.created_at)).all()
    return todos

@router.post("/")
async def create_todo(todo: TodoCreate, session: SessionDep, user: UserDep):
    db_todo = Todo.model_validate(todo, update={"created_by_id": user.id})
    
    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)
    
    return db_todo

@router.get("/{todo_id}", response_model=TodoPublic)
async def read_todo(
    todo_id: Annotated[uuid.UUID, Path()],
    todo: Annotated[Todo, Depends(OwnershipChecker(Todo, 'todo_id'))]
):
    return todo
    
@router.put("/{todo_id}", response_model=TodoPublic)
async def update_todo(
    todo_id: Annotated[uuid.UUID, Path()],
    todo: TodoUpdate,
    session: SessionDep,
    db_todo: Annotated[Todo, Depends(OwnershipChecker(Todo, 'todo_id'))]
):
    todo_data = todo.model_dump(exclude_unset=True)
    db_todo.sqlmodel_update(todo_data)

    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)

    return db_todo

@router.delete("/{todo_id}")
async def delete_todo(
    todo_id: Annotated[uuid.UUID, Path()],
    session: SessionDep,
    todo: Annotated[Todo, Depends(OwnershipChecker(Todo, 'todo_id'))]
):    
    session.delete(todo)
    session.commit()
    return {"message": "OK"}

