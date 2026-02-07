from fastapi import APIRouter
from backend.services import task_service
from backend.schemas.task import (
    TaskCreate, 
    TaskUpdate,
    TaskOut,
)

router = APIRouter(
    prefix="/task",
    tags=["task"]
    )

# временное хранилище словарь (замена на PostgreSQL)
tasks = {}

# эндпоинт получения списка задач
@router.get("/", response_model=list[TaskOut])
def get_tasks():
    return task_service.get_tasks()

# эндпоинт получения одной задачи
@router.get("/{task_id}", response_model=TaskOut)
def get_task(task_id: int):
    return task_service.get_task(task_id)

# эндпоинт создание задачи
@router.post("/", response_model=TaskOut)
def create_task(task: TaskCreate):
    return task_service.create_task(task)

# эндпоинт обновления задачи
@router.put("/{task_id}", response_model=TaskOut)
def update_task(task_id: int, task: TaskUpdate):
    return task_service.update_task(task_id, task)

# эндпоинт удаление задачи
@router.delete("/{task_id}", response_model=TaskOut)
def delete_task(task_id: int):
    return task_service.delete_task(task_id)

# функция для статистики 
def get_tasks_count():
    return len(tasks)