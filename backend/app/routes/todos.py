from typing import Annotated
import uuid

from fastapi import APIRouter, Path, HTTPException, status
from sqlmodel import select

from app.core.db import SessionDep
from app.models.todos import TodoPublic, TodoBase, Todo, TodoUpdate

router = APIRouter(
    prefix="/todos",
    tags=["todos"],

)

@router.get("/", response_model=list[TodoPublic])
async def read_todos(session: SessionDep):
    todos = session.exec(select(Todo)).all()
    return todos

@router.post("/")
async def create_todo(todo: TodoBase, session: SessionDep):
    db_todo = Todo.model_validate(todo)
    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)
    return db_todo

@router.get("/{todo_id}", response_model=TodoPublic)
async def read_todo(
    todo_id: Annotated[uuid.UUID, Path()],
    session: SessionDep
):
    todo = session.get(Todo, todo_id)
    
    if not todo:
        raise HTTPException(
            detail="No todo found",
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    return todo
    
@router.put("/{todo_id}", response_model=TodoPublic)
async def update_todo(
    todo_id: Annotated[uuid.UUID, Path()],
    todo: TodoUpdate,
    session: SessionDep
):
    db_todo = session.get(Todo, todo_id)
    
    if not db_todo:
        raise HTTPException(
            detail="No todo found",
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    todo_data = todo.model_dump(exclude_unset=True)
    db_todo.sqlmodel_update(todo_data)

    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)

    return db_todo

@router.delete("/{todo_id}")
async def delete_todo(
    todo_id: Annotated[uuid.UUID, Path()],
    session: SessionDep
):
    todo = session.get(Todo, todo_id)
    
    if not todo:
        raise HTTPException(
            detail="No todo found",
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    session.delete(todo)
    session.commit()
    return {"message": "OK"}

